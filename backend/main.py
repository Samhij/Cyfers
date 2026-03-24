import somtoday, psycopg2, os

from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

load_dotenv()

# Database setup
conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=5432,
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

cur = conn.cursor()

# Fernet setup for password encryption
key = os.getenv("ENCRYPTION_KEY")
cipher_suite = Fernet(key)

somtoday.init()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.route('/get-tokens/uname-pword', methods=["POST"])
def get_tokens_uname_pword():
    username = request.form.get("username", "")
    password = request.form.get("password", "")
    tenant_uuid = request.form.get("tenant_uuid", "")
    try:
        # Get full JSON object
        s = somtoday.auth.using_uname_pword(username, password, tenant_uuid)
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=s["expires_in"])
        
        # Check if user already exists in database
        cur.execute("SELECT id FROM students WHERE username= %s", (username,))
        existing = cur.fetchone()
        
        if existing:
            cur.execute(
                "UPDATE students SET refresh_token = %s, access_token_expiry = %s WHERE username = %s",
                (s["refresh_token"], expires_at, username)
            )
        else:
            encrypted_password = cipher_suite.encrypt(password.encode())
            cur.execute(
                "INSERT INTO students (username, password, tenant_uuid, refresh_token, access_token_expiry) VALUES (%s, %s, %s, %s, %s)",
                (username, encrypted_password, tenant_uuid, s["refresh_token"], expires_at)
            )
        
        conn.commit()
        
        # Filter out access_token and return as httpOnly cookie
        response = make_response(jsonify({"message": "success"}))
        response.set_cookie(
            "access_token",
            value=s["access_token"],
            httponly=True,
            samesite="Strict"
        )
        return response
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500

@app.route('/get-tokens/refresh-token', methods=["POST"])
def get_tokens_refresh_token():
    refresh_token = request.form.get("refresh_token", "")
    try:
        s = somtoday.auth.using_refresh_token(refresh_token)
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=s["expires_in"])

        cur.execute(
            "UPDATE students SET refresh_token = %s, access_token_expiry = %s WHERE refresh_token = %s",
            (s["refresh_token"], expires_at, refresh_token)
        )
        conn.commit()

        response = make_response(jsonify({"message": "success"}))
        response.set_cookie(
            "access_token",
            value=s["access_token"],
            httponly=True,
            samesite="Strict"
        )
        return response
    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500
