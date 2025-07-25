import os

DB_HOST = os.getenv('DB_HOST', 'aplicacion-postgres')
DB_PORT = int(os.getenv('DB_PORT', 5432))
DB_NAME = os.getenv('DB_NAME', 'aplicaciondb')
DB_USER = os.getenv('DB_USER', 'chema')
DB_PASS = os.getenv('DB_PASS', 'admin123')

