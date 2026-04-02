import os
import logging
from datetime import datetime, timedelta, timezone
from contextlib import contextmanager

import somtoday
from psycopg2 import pool
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

load_dotenv()

# Environment Validation
REQUIRED_ENV_VARS = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"]
missing_vars = [var for var in REQUIRED_ENV_VARS if not os.getenv(var)]
if missing_vars:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missing_vars)}")

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


def normalize_schedule_lesson(lesson):
    normalized = dict(lesson)
    normalized["lesuur"] = (
        normalized.get("lesuur")
        if normalized.get("lesuur") is not None
        else normalized.get("lesuurr")
    )
    return normalized


def normalize_schedule_payload(payload):
    if isinstance(payload, dict):
        return {
            day: [normalize_schedule_lesson(lesson) for lesson in lessons]
            for day, lessons in payload.items()
        }

    if isinstance(payload, list):
        return [normalize_schedule_lesson(lesson) for lesson in payload]

    return payload

app = Flask(__name__)
# In production, 'origins' should be restricted to the actual frontend domain
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

@app.errorhandler(Exception)
def handle_exception(e):
    logging.error(f"Unhandled error: {e}", exc_info=True)
    return jsonify({"message": "An internal server error occurred."}), 500


@app.route("/health", methods=["GET"])
def health_check():
    try:
        with get_db_cursor() as cur:
            cur.execute("SELECT 1")
            cur.fetchone()
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        logging.error(f"Health check failed: {e}")
        return jsonify({"status": "unhealthy"}), 503

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
    response.set_cookie(
        "username",
        value="",
        expires=0,
        httponly=False,
        samesite="Strict",
        secure=False
    )
    response.set_cookie(
        "last_username",
        value="",
        expires=0,
        httponly=False,
        samesite="Strict",
        secure=False
    )
    response.set_cookie(
        "tenant_uuid",
        value="",
        expires=0,
        httponly=False,
        samesite="Strict",
        secure=False
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
                cur.execute(
                    "INSERT INTO students (username, tenant_uuid, refresh_token, access_token_expiry) VALUES (%s, %s, %s, %s)",
                    (username.upper(), tenant_uuid, s["refresh_token"], expires_at)
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
        response.set_cookie(
            "username",
            value=username,
            httponly=False, # Allow frontend to read if needed, or keep True if just for session
            samesite="Strict",
            max_age=expires_in,
            secure=False
        )
        response.set_cookie(
            "last_username",
            value=username,
            httponly=False,
            samesite="Strict",
            max_age=60 * 60 * 24 * 30,
            secure=False
        )
        response.set_cookie(
            "tenant_uuid",
            value=tenant_uuid,
            httponly=False,
            samesite="Strict",
            max_age=60 * 60 * 24 * 30,
            secure=False
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
            cur.execute("SELECT id, tenant_uuid FROM students WHERE username = %s", (username,))
            row = cur.fetchone()
            if not row:
                return jsonify({"message": "Account not found."}), 404

            tenant_uuid = row[1]
            
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
        response.set_cookie(
            "username",
            value=username,
            httponly=False,
            samesite="Strict",
            max_age=expires_in
        )
        response.set_cookie(
            "last_username",
            value=username,
            httponly=False,
            samesite="Strict",
            max_age=60 * 60 * 24 * 30
        )
        response.set_cookie(
            "tenant_uuid",
            value=tenant_uuid,
            httponly=False,
            samesite="Strict",
            max_age=60 * 60 * 24 * 30
        )
        return response
    except Exception as e:
        logging.error(f"Refresh error for user {username}: {e}")
        return jsonify({"message": "Token refresh failed."}), 401


@app.route("/student-data", methods=["GET"])
def get_student_data():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"message": "Unauthorized"}), 401
    
    try:
        student_info = somtoday.get_student_info("access_token", access_token)
        return jsonify(student_info)
    except Exception as e:
        logging.error(f"Error fetching student data: {e}")
        return jsonify({"message": "Could not fetch student data."}), 500


@app.route("/schedule/today", methods=["GET"])
def get_schedule_today():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        schedule = somtoday.get_schedule_formatted("access_token", access_token)
        today_name = datetime.now().strftime("%A")
        today_schedule = normalize_schedule_payload(schedule.get(today_name, []))
        return jsonify(today_schedule)
    except Exception as e:
        logging.error(f"Error fetching today's schedule: {e}")
        return jsonify({"message": "Could not fetch schedule."}), 500


@app.route("/schedule/week", methods=["GET"])
def get_schedule_week_route():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"message": "Unauthorized"}), 401

    week = request.args.get("week")

    try:
        if week is not None:
            schedule = somtoday.get_schedule_formatted("access_token", access_token, week=week)
        else:
            schedule = somtoday.get_schedule_formatted("access_token", access_token)
        return jsonify(normalize_schedule_payload(schedule))
    except Exception as e:
        logging.error(f"Error fetching week schedule: {e}")
        return jsonify({"message": "Could not fetch schedule."}), 500


@app.route("/grades", methods=["GET"])
def get_grades_route():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        grades = somtoday.get_grades_formatted("access_token", access_token)
        return jsonify(grades)
    except Exception as e:
        logging.error(f"Error fetching grades: {e}")
        return jsonify({"message": "Could not fetch grades."}), 500


@app.route("/grades/subjects", methods=["GET"])
def get_grades_subjects_route():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        grades = somtoday.get_grades_subjects("access_token", access_token)
        return jsonify(grades)
    except Exception as e:
        logging.error(f"Error fetching grades by subject: {e}")
        return jsonify({"message": "Could not fetch grades by subject."}), 500


@app.route("/grades/moment", methods=["GET"])
def get_grades_moment_route():
    access_token = request.cookies.get("access_token")
    if not access_token:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        grades_moment = somtoday.get_grades_moment("access_token", access_token)
        return jsonify({"value": grades_moment})
    except Exception as e:
        logging.error(f"Error fetching grades moment: {e}")
        return jsonify({"message": "Could not fetch grades moment."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
