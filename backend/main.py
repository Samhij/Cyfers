import os
import logging
from datetime import datetime, timedelta, timezone
from contextlib import contextmanager

import somtoday
import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

load_dotenv()

# Environment Validation
REQUIRED_ENV_VARS = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD", "ENCRYPTION_KEY"]
missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missing_vars)}")

try:
    cipher_suite = Fernet(os.getenv("ENCRYPTION_KEY").encode())
except Exception as e:
    raise RuntimeError(f"Invalid ENCRYPTION_KEY: {e}")

# Database Connection Pool
try:
    db_pool = pool.ThreadedConnectionPool(
        minconn=1,
        maxconn=20,
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT", 5432),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )
    logging.info("Database connection pool initialized.")
except Exception as e:
    logging.error(f"Failed to initialize database pool: {e}")
    raise

@contextmanager
def get_db_cursor():
    conn = db_pool.getconn()
    try:
        yield conn.cursor()
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        db_pool.putconn(conn)

somtoday.init()

app = Flask(__name__)
# In production, 'origins' should be restricted to the actual frontend domain
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.errorhandler(Exception)
def handle_exception(e):
    logging.error(f"Unhandled error: {e}", exc_info=True)
    return jsonify({"message": "An internal server error occurred."}), 500

def get_request_data():
    """Helper to get data from either JSON or Form-data."""
    if request.is_json:
        return request.get_json()
    return request.form

@app.route("/schools", methods=["GET"])
def get_schools():
    try:
        return jsonify(somtoday.organisations_list)
    except Exception as e:
        logging.error(f"Error fetching schools: {e}")
        return jsonify({"message": "Could not fetch schools."}), 500


@app.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "logged out"}))
    response.set_cookie(
        "access_token",
        value="",
        expires=0,
        httponly=True,
        samesite="Strict",
        secure=False  # Set to True in production with HTTPS
    )
    return response


@app.route('/auth/get-tokens/uname-pword', methods=["POST"])
def get_tokens_uname_pword():
    data = get_request_data()
    username = data.get("username")
    password = data.get("password")
    tenant_uuid = data.get("tenant_uuid")

    if not all([username, password, tenant_uuid]):
        return jsonify({"message": "Missing username, password, or tenant_uuid"}), 400

    try:
        s = somtoday.auth.using_uname_pword(username, password, tenant_uuid)
        expires_in = s.get("expires_in", 3600)
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
        
        with get_db_cursor() as cur:
            cur.execute("SELECT id FROM students WHERE username = %s", (username,))
            existing = cur.fetchone()
            
            if existing:
                cur.execute(
                    "UPDATE students SET refresh_token = %s, access_token_expiry = %s WHERE username = %s",
                    (s["refresh_token"], expires_at, username)
                )
            else:
                encrypted_password = cipher_suite.encrypt(password.encode()).decode()
                cur.execute(
                    "INSERT INTO students (username, password, tenant_uuid, refresh_token, access_token_expiry) VALUES (%s, %s, %s, %s, %s)",
                    (username, encrypted_password, tenant_uuid, s["refresh_token"], expires_at)
                )
        
        response = make_response(jsonify({"message": "success"}))
        response.set_cookie(
            "access_token",
            value=s["access_token"],
            httponly=True,
            samesite="Strict",
            max_age=expires_in,
            secure=False  # Set to True in production
        )
        return response
    except Exception as e:
        logging.error(f"Login error for user {username}: {e}")
        return jsonify({"message": "Authentication failed."}), 401


@app.route("/auth/get-tokens/refresh-token", methods=["POST"])
def get_tokens_refresh_token():
    data = get_request_data()
    username = data.get("username")
    refresh_token = data.get("refresh_token")

    if not all([username, refresh_token]):
        return jsonify({"message": "Missing username or refresh_token"}), 400

    try:
        s = somtoday.auth.using_refresh_token(refresh_token)
        expires_in = s.get("expires_in", 3600)
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)

        with get_db_cursor() as cur:
            cur.execute("SELECT id FROM students WHERE username = %s", (username,))
            if not cur.fetchone():
                return jsonify({"message": "Account not found."}), 404
            
            cur.execute(
                "UPDATE students SET refresh_token = %s, access_token_expiry = %s WHERE username = %s",
                (s["refresh_token"], expires_at, username)
            )

        response = make_response(jsonify({"message": "success"}))
        response.set_cookie(
            "access_token",
            value=s["access_token"],
            httponly=True,
            samesite="Strict",
            max_age=expires_in
        )
        return response
    except Exception as e:
        logging.error(f"Refresh error for user {username}: {e}")
        return jsonify({"message": "Token refresh failed."}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
