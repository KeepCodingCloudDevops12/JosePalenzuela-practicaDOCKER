from flask import Flask, jsonify
import psycopg2
from config import DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS

app = Flask(__name__)

def get_conn():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

@app.route('/')
def index():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('UPDATE contador SET visitas = visitas + 1 RETURNING visitas;')
    count = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return f'Número de visitas: {count}'

@app.route('/reset')
def reset():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('UPDATE contador SET visitas = 0;')
    conn.commit()
    cur.close()
    conn.close()
    return 'Contador reiniciado.'

# NUEVO endpoint REST para obtener el contador sin modificarlo
@app.route('/api/contador')
def api_contador():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('SELECT visitas FROM contador LIMIT 1;')
    count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return jsonify({'visitas': count})

# También puedes añadir un endpoint /api que responda con info general o redirija:
@app.route('/api')
def api_root():
    return jsonify({
        'mensaje': 'API simple de contador',
        'endpoints': ['/api/contador']
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5010)



