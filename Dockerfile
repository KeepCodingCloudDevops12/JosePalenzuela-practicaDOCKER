# Stage 1: Build
FROM python:3.10-slim AS build

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --user -r requirements.txt

COPY . .

# Stage 2: Final image
FROM python:3.10-slim

WORKDIR /app

COPY --from=build /root/.local /root/.local
COPY . .

ENV PATH=/root/.local/bin:$PATH

CMD ["python", "app.py"]


