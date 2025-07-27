# Aplicación Práctica Docker - Contador con Flask, PostgreSQL, Nginx y Monitorización

Este proyecto es una práctica completa para desplegar una aplicación de microservicios utilizando Docker y Docker Compose. La aplicación principal es un contador de visitas que se incrementa y almacena en una base de datos PostgreSQL. La solución incluye un frontend web servido por Nginx, monitorización de métricas con Prometheus y una interfaz de gestión de contenedores con Portainer.

---

## Descripción de la Aplicación

La aplicación es un contador de visitas sencillo implementado con Flask y PostgreSQL. Cada vez que un usuario accede a la página principal, el contador se incrementa y se almacena en la base de datos.

Se han añadido los siguientes componentes para una solución más robusta y completa:
* **Frontend HTML/CSS/JS:** Servido por Nginx, proporcionando una interfaz de usuario atractiva para interactuar con el contador.
* **Nginx:** Actúa como un proxy inverso y servidor de archivos estáticos, redirigiendo las peticiones al backend Flask y sirviendo el frontend.
* **Prometheus:** Para la recolección y consulta de métricas de la aplicación Flask, incluyendo el total de visitas.
* **Portainer:** Una interfaz de usuario gráfica para gestionar tus contenedores Docker, volúmenes, redes e imágenes.

---

## Endpoints

La aplicación expone los siguientes endpoints a través de Nginx (`http://localhost`):

* **`GET /`**
    * Sirve el frontend HTML/CSS/JS. Al cargar la página, el JavaScript hace una llamada interna a la API para obtener e incrementar el contador.

* **`GET /api/contador`**
    * **Función:** Devuelve el valor actual del contador en formato JSON.
    * **Ejemplo de respuesta:**
        ```json
        {
          "visitas": 42
        }
        ```

* **`GET /api/increment`**
    * **Función:** Incrementa el contador en uno y devuelve el nuevo valor en formato JSON. Esta es la ruta que llama el frontend al cargar la página.
    * **Ejemplo de respuesta:**
        ```json
        {
          "visitas": 43
        }
        ```

* **`GET /reset`**
    * **Función:** Reinicia el contador a cero.

* **`GET /metrics`**
    * **Función:** Expone las métricas de Prometheus de la aplicación Flask (ej. `aplicacion_visitas_total`). Accesible directamente a través de Nginx.

---

## Requisitos

Para ejecutar este proyecto, necesitas tener instalados:

* **Docker:** Para la gestión de contenedores.
* **Docker Compose:** Para la orquestación de múltiples servicios Docker.
* **(Opcional) `jq`:** Para procesar logs en formato JSON.

---

## Cómo ejecutar

Sigue estos pasos para poner la aplicación en funcionamiento en tu máquina local:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/KeepCodingCloudDevops12/JosePalenzuela-practicaDOCKER.git](https://github.com/KeepCodingCloudDevops12/JosePalenzuela-practicaDOCKER.git)
    cd JosePalenzuela-practicaDOCKER
    ```

2.  **Construye las imágenes Docker y levanta los contenedores:**
    Utiliza el siguiente comando. La opción `--build` asegura que se reconstruyan las imágenes si hay cambios en los Dockerfiles o dependencias, y `-d` ejecuta los contenedores en segundo plano.
    ```bash
    docker compose up --build -d
    ```

3.  **Verifica el funcionamiento:**

    * **Aplicación web:** Accede a la aplicación desde tu navegador:
        ```
        http://localhost
        ```
        Aquí verás el frontend de Nginx y el contador incrementándose cada vez que recargues la página o hagas click en el botón.

    * **API del contador:** Puedes probar la API JSON directamente:
        ```
        http://localhost/api/contador
        http://localhost/api/increment
        http://localhost/reset
        ```

    * **Métricas de Prometheus:** Accede a la interfaz de Prometheus:
        ```
        http://localhost:9090
        ```
        En la barra de búsqueda, puedes probar queries como `aplicacion_visitas_total`.

    * **Portainer (Interfaz de gestión de Docker):** Accede a la interfaz de Portainer:
        ```
        http://localhost:9000
        ```
        La primera vez, se te pedirá crear una cuenta de administrador. Una vez configurado, podrás visualizar y gestionar todos tus contenedores. La configuración de Portainer (incluyendo usuarios) persiste gracias a un volumen Docker.

---

## Estructura del Proyecto

* `app.py`: Código principal de la aplicación Flask. Implementa la lógica del contador y expone las APIs.
* `config.py`: Archivo de configuración para la conexión a la base de datos, utilizando variables de entorno.
* `Dockerfile`: Define cómo construir la imagen Docker para la aplicación Flask, utilizando un *Multistage Build*.
* `docker-compose.yml`: Archivo de orquestación que define y conecta todos los servicios (Flask, PostgreSQL, Nginx, Prometheus, Portainer).
* `init.sql`: Script SQL para inicializar la tabla `contador` en la base de datos PostgreSQL.
* `nginx.conf`: Configuración para Nginx, actuando como proxy inverso y sirviendo el frontend.
* `frontend/`: Contiene los archivos estáticos (HTML, CSS, JavaScript) del frontend de la aplicación.
* `prometheus.yml`: Configuración para Prometheus, especificando qué objetivos debe raspar para obtener métricas.
* `requirements.txt`: Lista de dependencias de Python para la aplicación Flask.

---

## Detalles Técnicos y Configurabilidad

### Base de Datos (PostgreSQL)

* **Versión:** `postgres:15`
* **Credenciales:**
    * Usuario: `chema`
    * Contraseña: `admin123`
    * Base de datos: `aplicaciondb`
* **Persistencia:** Los datos de la base de datos persisten en un volumen Docker llamado `postgres_data`.
* **Inicialización:** La base de datos se inicializa automáticamente con el script `init.sql` al levantar el contenedor.

### Aplicación Flask

* **Puerto interno:** 5010
* **Servidor web:** La aplicación es servida por `Gunicorn` para mayor robustez y eficiencia.
* **Variables de Entorno para la Conexión a la BBDD:** La configuración de la base de datos se gestiona completamente a través de variables de entorno, definidas en `docker-compose.yml` para el servicio `aplicacion-flask`:
    * `DB_HOST`: Host de la base de datos (por defecto: `aplicacion-postgres`, que es el nombre del servicio en Docker Compose).
    * `DB_PORT`: Puerto de la base de datos (por defecto: `5432`).
    * `DB_NAME`: Nombre de la base de datos (por defecto: `aplicaciondb`).
    * `DB_USER`: Usuario de la base de datos (por defecto: `chema`).
    * `DB_PASS`: Contraseña del usuario de la base de datos (por defecto: `admin123`).

### Nginx

* **Puerto de escucha:** 80 (HTTP).
* **Servicio de archivos:** Sirve los archivos estáticos desde el directorio `frontend/`.
* **Proxy inverso:** Redirige las peticiones a `/api/` y `/metrics` al servicio `aplicacion-flask`.

### Monitorización con Prometheus

* **Puerto:** 9090
* **Objetivos:** Raspa las métricas del servicio `aplicacion-flask:5010`.
* **Métricas disponibles (ejemplos):**
    * `aplicacion_visitas_total`: **Métrica personalizada** que expone el valor actual del contador de visitas.

### Gestión con Portainer

* **Puerto:** 9000
* **Persistencia:** La configuración de Portainer (incluyendo usuarios y contraseñas) se almacena en el volumen Docker `portainer_data`, por lo que no necesitas reconfigurarlo cada vez que levantes los contenedores.

---

## Logs de la Aplicación

Todos los componentes de la aplicación (Flask, PostgreSQL, Nginx) están configurados para enviar sus logs a la **salida estándar (STDOUT) y salida de error (STDERR)** dentro de sus respectivos contenedores. Docker captura estas salidas.

* **Consulta de Logs:** Puedes ver los logs en tiempo real o históricos para cualquier servicio usando `docker compose logs`:
    ```bash
    docker compose logs -f aplicacion-flask     # Logs de Flask en tiempo real
    docker compose logs aplicacion-postgres      # Logs históricos de PostgreSQL
    docker compose logs -f nginx               # Logs de Nginx en tiempo real
    docker compose logs -f                     # Todos los logs de todos los servicios en tiempo real
    ```

* **Formato JSON [OPCIONAL]:**
    El motor de Docker (incluido Docker Desktop) utiliza por defecto el **controlador de logs `json-file`**. Esto significa que los logs de tus contenedores ya se almacenan internamente en tu sistema de archivos (o en la VM de Docker Desktop) en formato JSON.

    Aunque `docker compose logs` los muestra en texto plano por defecto, puedes **extraerlos y transformarlos en un formato JSON más estructurado** utilizando herramientas de línea de comandos como `jq`. Esto es útil para el procesamiento o análisis posterior:

    ```bash
    # Para obtener logs de Flask y formatearlos como un array JSON de objetos con timestamp y message
    docker compose logs aplicacion-flask --no-log-prefix | awk '{ print "{\"timestamp\":\"" strftime("%Y-%m-%dT%H:%M:%S%z"), "\", \"message\":\"", $0 "\"}" }' | jq -s . > flask_logs.json

    # Para PostgreSQL
    docker compose logs aplicacion-postgres --no-log-prefix | awk '{ print "{\"timestamp\":\"" strftime("%Y-%m-%dT%H:%M:%S%z"), "\", \"message\":\"", $0 "\"}" }' | jq -s . > postgres_logs.json
    ```
    *Nota: Asegúrate de tener `jq` instalado en tu sistema (`sudo apt-get install jq` en Linux, `brew install jq` en macOS).*

---

## Seguridad: Escaneo de Vulnerabilidades con Trivy

Hemos integrado el escaneo de imágenes Docker en busca de vulnerabilidades de seguridad utilizando [Trivy](https://aquasecurity.github.io/trivy/).

### Cómo escanear:

1.  **Instala Trivy** en tu sistema siguiendo las instrucciones oficiales (ej. `brew install trivy` en macOS, o consultando la [documentación de instalación de Trivy](https://aquasecurity.github.io/trivy/latest/getting-started/installation/)).
2.  Asegúrate de que tu imagen `aplicacion-flask` esté construida localmente (ejecuta `docker compose build aplicacion-flask`).
3.  Ejecuta el escaneo:
    ```bash
    trivy image aplicacion-flask
    ```
    Esto escaneará la imagen base (`python:3.10-slim-bookworm`) y todas las dependencias instaladas dentro de tu aplicación en busca de vulnerabilidades conocidas.

### Interpretación de los Resultados:

Trivy mostrará una lista de vulnerabilidades encontradas, clasificadas por severidad (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`). Cada entrada incluirá información como el ID de la vulnerabilidad (CVE), la versión instalada del componente vulnerable y la versión corregida si está disponible.

Las vulnerabilidades más críticas (`CRITICAL` y `HIGH`) deben ser priorizadas para su resolución, generalmente actualizando la dependencia o imagen base a una versión que incluya la corrección.

---

## Logs Centralizados con Loki, Promtail y Grafana (LPG Stack)

Hemos implementado un stack completo de observabilidad de logs utilizando Loki, Promtail y Grafana para recolectar, almacenar y visualizar los logs de todos los servicios de la aplicación.

* **Loki:** Sistema de agregación de logs.
* **Promtail:** Agente de logs que recolecta logs de los contenedores Docker, los etiqueta y los envía a Loki.
* **Grafana:** Herramienta de visualización para explorar y analizar los logs, junto con las métricas de Prometheus.

### Acceso a Grafana:

Accede a la interfaz de Grafana desde tu navegador:

`http://localhost:3000`

La primera vez, usa las credenciales por defecto `admin`/`admin` y sigue las instrucciones para cambiar la contraseña. Loki y Prometheus ya estarán configurados automáticamente como fuentes de datos.

### Consultando Logs en Grafana:

En Grafana, ve a la sección "Explore" (el icono del telescopio en la barra lateral izquierda) y selecciona "Loki" como fuente de datos. Puedes usar el "Log browser" para seleccionar etiquetas como `job`, `container_id`, `filename` o `stream`, o escribir tus propias consultas LogQL, por ejemplo:

* **Ver todos los logs:**
    ```logql
    {job="containerlogs"}
    ```
* **Logs específicos de la aplicación Flask:**
    ```logql
    {job="containerlogs", container_id=~".*aplicacion-flask.*"}
    ```
* **Logs de Nginx:**
    ```logql
    {job="containerlogs", container_id=~".*nginx.*"}
    ```
* **Logs con un cierto nivel (si tu app loggea niveles en JSON):**
    ```logql
    {job="containerlogs", level="error"}
    ```
---

## Detalles Técnicos y Configurabilidad de Grafana, Loki y Promtail

### Logging Centralizado (Loki, Promtail, Grafana)

* **Loki:**
    * **Puerto interno:** 3100
    * **Persistencia:** Los logs se almacenan en un volumen Docker llamado `loki_data`.
* **Promtail:**
    * **Configuración:** Utiliza `promtail-config.yml` para definir las fuentes de logs y las etiquetas.
    * **Acceso a logs:** Monta `/var/lib/docker/containers` y `/var/run/docker.sock` para recolectar logs de todos los contenedores Docker.
* **Grafana:**
    * **Puerto de escucha:** 3000
    * **Persistencia:** La configuración, los dashboards y los usuarios persisten en el volumen Docker `grafana_data`.
    * **Auto-configuración:** Usa `grafana-datasources.yml` para configurar automáticamente Loki y Prometheus como fuentes de datos al inicio.

---

## Puntos Extra Implementados

* **Monitorización con Prometheus:** Integrado para recolectar métricas de la aplicación Flask.
* **Multistage Build en Dockerfile:** Reduce significativamente el tamaño de la imagen final de la aplicación Flask.
* **Frontend más bonito con Nginx:** El proyecto incluye un frontend HTML/CSS/JS servido por Nginx para una interfaz de usuario más completa y visual.
* **Uso de variables de entorno para accesos a BBDD:** La configuración de la base de datos se gestiona completamente a través de variables de entorno para mayor flexibilidad.
* **Despliegue de Portainer:** Incluido en `docker-compose.yml` para una gestión visual de los contenedores Docker.
* **Subida de imagen a Docker Hub:** La imagen de `aplicacion-flask` se ha subido a Docker Hub ([https://hub.docker.com/repository/docker/orejasperez/aplicacion-flask/general](https://hub.docker.com/repository/docker/orejasperez/aplicacion-flask/general)). Esto se realiza para cumplir con los requisitos de la práctica, sin embargo, el `docker-compose.yml` local sigue utilizando la construcción de la imagen desde el Dockerfile (`build: .`) y no hace referencia a la imagen de Docker Hub.
* **Escaneo de vulnerabilidades de imágenes:** Integrar herramientas como Snyk o Trivy en el flujo de desarrollo para escanear las imágenes Docker en busca de vulnerabilidades de seguridad.
* **Logs centralizados avanzados:** Implementar un stack de logging más completo (como Loki + Promtail + Grafana o ELK) para una recolección y análisis centralizado de logs de todos los servicios.
  
---

## Posibles Mejoras

* **Entornos de prueba y producción:** Crear archivos `docker-compose` específicos para entornos de desarrollo, prueba y producción, permitiendo configuraciones y versiones de servicios diferentes.

---

## Autor

Jose María Palenzuela Plaza ([jpalenz77](https://github.com/jpalenz77))

---

¡Gracias por probar esta práctica! Cualquier duda, sugerencia o mejora será bienvenida.
