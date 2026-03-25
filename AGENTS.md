# AGENTS.md - Project Context for Cyfers

## Project Overview
Cyfers is a full-stack application designed to integrate with the Somtoday school management system. It provides an interface for users (students) to authenticate and likely manage their school data.

### Tech Stack
- **Frontend:** [Next.js](https://nextjs.org/) (TypeScript, React 19, Next 16)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend:** [Flask](https://flask.palletsprojects.com/) (Python)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **API Integration:** [Somtoday API](https://pypi.org/project/somtoday/) (via the `somtoday` Python library)
- **Containerization:** [Docker Compose](https://docs.docker.com/compose/)

## Directory Structure
- `backend/`: Flask API, database setup, and Somtoday logic.
- `frontend/`: Next.js application with Tailwind CSS and Shadcn UI.
- `docker-compose.yml`: Orchestrates the frontend, backend, and PostgreSQL database.

## Building and Running

### Using Docker (Recommended)
To start the entire stack (Frontend, Backend, and Database):
```bash
docker-compose up --build
```

### Local Development (Manual)

#### Backend
1. Navigate to the `backend/` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Linux/macOS
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up the database (requires a running PostgreSQL instance):
   ```bash
   python setup_db.py
   ```
5. Run the Flask server:
   ```bash
   python main.py
   ```

#### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```

## Development Conventions

### Backend
- **Authentication:** Uses Somtoday credentials. Access tokens are stored in `httpOnly` cookies for security. Refresh tokens and encrypted passwords are saved in the PostgreSQL database.
- **Encryption:** Passwords are encrypted using Fernet (cryptography library) before being stored in the database.
- **Database:** Uses `psycopg2` for PostgreSQL interactions. The schema is managed via `setup_db.py`.

### Frontend
- **Routing:** Uses Next.js App Router.
- **Components:** Built with Tailwind CSS and Shadcn UI.
- **Environment:** Backend URL is configured via `NEXT_PUBLIC_BACKEND_URL` (default: `http://backend:5000`).

## Key Files
- `backend/main.py`: Entry point for the Flask API.
- `backend/setup_db.py`: Database schema definition and initialization.
- `backend/routes.md`: Documentation for API endpoints.
- `frontend/app/page.tsx`: Root page of the Next.js application.
- `docker-compose.yml`: Configuration for the multi-container setup.

## Environment Variables
The backend expects a `.env` file with the following:
- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL connection details.
- `ENCRYPTION_KEY`: A Fernet key for password encryption.
