FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt flask
RUN playwright install chromium
RUN playwright install-deps chromium

CMD ["python", "-m", "flask", "--app", "main", "run", "--host", "0.0.0.0", "--port", "5000", "--debug"]