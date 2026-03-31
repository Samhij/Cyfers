# Cyfers Backend API Routes

All endpoints expect either `application/json` or `application/x-www-form-urlencoded`.

## General
### `GET /schools`
Fetches a list of all schools (organisations) from Somtoday.
- **Response**: `200 OK` with a list of school objects `[{ "naam": "...", "uuid": "..." }]`.

## Authentication
### `POST /auth/get-tokens/uname-pword`
Authenticates a user using their Somtoday credentials and saves/updates their record in the database.
- **Parameters**: `username`, `password`, `tenant_uuid`.
- **Response**: `200 OK` on success, sets an `httpOnly` cookie `access_token`.

### `POST /auth/get-tokens/refresh-token`
Refreshes the access token using a stored Somtoday refresh token.
- **Parameters**: `username`, `refresh_token`.
- **Response**: `200 OK` on success, sets a new `httpOnly` cookie `access_token`.

### `POST /logout`
Clears the `access_token` and `username` cookies.
- **Response**: `200 OK`.

## Student
### `GET /student-data`
Fetches the student data for the currently logged in user.
- **Headers**: Expects `access_token` cookie.
- **Response**: `200 OK` with student info object.

## Schedule
### `GET /schedule/today`
Fetches the formatted schedule for today.
- **Headers**: Expects `access_token` cookie.
- **Response**: `200 OK` with an array of lesson objects for today.
  ```json
  [
    {
      "lesuur": 1,
      "start": "2026-03-26T08:30:00",
      "einde": "2026-03-26T09:20:00",
      "locatie": "A101",
      "omschrijving": "...",
      "vaknaam": "Wiskunde",
      "bijlagen": [],
      "type": "uitval | null"
    }
  ]
  ```

### `GET /schedule/week`
Fetches the formatted schedule for a given week (or the current week if no week is specified).
- **Headers**: Expects `access_token` cookie.
- **Query Parameters**: `week` (optional) — ISO week number (e.g. `13`).
- **Response**: `200 OK` with an object mapping day names to arrays of lesson objects.
  ```json
  {
    "Monday": [ { "lesuur": 1, "start": "...", "einde": "...", "locatie": "...", "omschrijving": "...", "vaknaam": "...", "bijlagen": [], "type": "uitval | null" } ],
    "Tuesday": [ ... ]
  }
  ```

## Grades
### `GET /grades`
Fetches the formatted grade list for the logged-in student.
- **Headers**: Expects `access_token` cookie.
- **Response**: `200 OK` with an array of grade objects.
  ```json
  [
    {
      "date": "2026-03-26T12:30:00",
      "subject": "Wiskunde",
      "grade": 7.8,
      "period": "Periode 3"
    }
  ]
  ```

### `GET /grades/subjects`
Fetches grades grouped by subject with a computed average per subject.
- **Headers**: Expects `access_token` cookie.
- **Response**: `200 OK` with an object keyed by subject name.
  ```json
  {
    "Wiskunde": {
      "grades": [7.8, 8.1],
      "average": 7.95
    }
  }
  ```

### `GET /grades/moment`
Fetches the next grade publication moment for the logged-in student.
- **Headers**: Expects `access_token` cookie.
- **Response**: `200 OK` with the Somtoday `value` payload for the next result publication moment.
