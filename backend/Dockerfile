FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Замените на свою команду запуска
CMD ["gunicorn", "antrakt.wsgi:application", "--bind", "0.0.0.0:8000"] 