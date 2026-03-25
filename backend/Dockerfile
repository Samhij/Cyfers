FROM python:3.12

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt flask
RUN playwright install chromium
RUN playwright install-deps chromium

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]