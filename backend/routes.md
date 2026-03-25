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
