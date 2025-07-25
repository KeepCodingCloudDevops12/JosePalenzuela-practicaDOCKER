# Stage 1: Build
FROM python:3.10-slim AS build

WORKDIR /app

COPY requirements.txt .
RUN pip install --user -r requirements.txt

COPY . .

# Stage 2: Final image
FROM python:3.10-slim

ENV PATH=/root/.local/bin:$PATH
WORKDIR /app

# Copiamos solo lo necesario del build
COPY --from=build /root/.local /root/.local
COPY . .

# Puerto expuesto para Prometheus
EXPOSE 5010

CMD ["python", "app.py"]


