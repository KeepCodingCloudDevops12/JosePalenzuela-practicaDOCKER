# Aplicación Práctica Docker - Contador con Flask y PostgreSQL

Este proyecto es una práctica para aprender a desplegar una aplicación con microservicios usando Docker y Docker Compose. La aplicación es un contador sencillo que incrementa visitas en una base de datos PostgreSQL y expone una API REST para consultarlo.

---

## Descripción

Aplicación web sencilla con Flask que conecta a una base de datos PostgreSQL.  
Cada vez que se visita la página principal (`/`), el contador incrementa y muestra el número de visitas.

Además, ofrece endpoints API para consultar el contador sin modificarlo.

---

## Endpoints

- `GET /`  
  Incrementa el contador y devuelve el número actual de visitas en texto plano.

- `GET /reset`  
  Reinicia el contador a cero.

- `GET /api/contador`  
  Devuelve el contador actual en formato JSON sin modificarlo.  
  Ejemplo de respuesta:  
  ```json
  {
    "visitas": 42
  }
  ```

- `GET /api`  
  Muestra una pequeña descripción con los endpoints disponibles.

---

## Requisitos

- Docker  
- Docker Compose

---

## Cómo ejecutar

Clona el repositorio:

```bash
git clone https://github.com/jpalenz77/aplicacion-practicadocker.git
cd aplicacion-practicadocker
```

Construye las imágenes Docker:

```bash
docker compose build
```

Levanta los contenedores:

```bash
docker compose up
```

Accede a la app desde tu navegador en:

```
http://localhost:5010/
```

Prueba la API JSON en:

```
http://localhost:5010/api/contador
```

Para reiniciar el contador:

```
http://localhost:5010/reset
```

---

## Estructura del proyecto

- `app.py` - Código principal de la aplicación Flask  
- `config.py` - Variables de configuración (BD, usuario, contraseña, puerto)  
- `Dockerfile` - Dockerfile para construir la imagen del microservicio Flask  
- `docker-compose.yml` - Orquesta la app Flask y PostgreSQL  
- `init_db.sql` - Script SQL para crear la tabla inicial y el contador  
- `.env` - Variables de entorno para configuración (opcional)  

---

## Detalles técnicos

- PostgreSQL con usuario `chema`, contraseña `admin123`, base de datos `aplicaciondb`.  
- Tabla `contador` con una columna `count` para contar las visitas.  
- El puerto expuesto es el **5010** para la app Flask.  
- La aplicación usa variables de entorno para configurarse y facilitar cambios.  
- Logs se imprimen en consola (STDOUT), útil para `docker logs`.  

---

## Notas

- La base de datos se inicializa automáticamente con el script `init_db.sql`.  
- El Dockerfile usa multistage para optimizar la imagen.  
- El volumen de PostgreSQL persiste los datos en `./postgres_data`.  
- Se puede ampliar fácilmente con más endpoints o funcionalidades.  

---

## Autor

José María Palenzuela Plaza ([jpalenz77](https://github.com/jpalenz77))

---

¡Gracias por probar esta práctica! Cualquier duda o mejora será bienvenida.
