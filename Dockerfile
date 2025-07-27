
FROM python:3.10-slim AS build

WORKDIR /app

COPY requirements.txt .
RUN pip install --user -r requirements.txt

COPY . .


FROM python:3.10-slim

ENV PATH=/root/.local/bin:$PATH
WORKDIR /app


COPY --from=build /root/.local /root/.local
COPY . .

EXPOSE 5010 


CMD ["gunicorn", "--bind", "0.0.0.0:5010", "app:app"]
