# Aplicación Práctica Docker - Contador con Flask, PostgreSQL, Nginx y Observabilidad Completa

Este proyecto es una práctica completa para desplegar una aplicación de microservicios utilizando Docker y Docker Compose. La aplicación principal es un contador de visitas que se incrementa y almacena en una base de datos PostgreSQL. La solución incluye un frontend web servido por Nginx y un stack de observabilidad robusto con Prometheus (métricas), Grafana (dashboards) y Loki/Promtail (logs centralizados), además de Portainer para la gestión de contenedores.

---

## Descripción de la Aplicación

La aplicación es un contador de visitas sencillo implementado con Flask y PostgreSQL. Cada vez que un usuario accede a la página principal, el contador se incrementa y se almacena en la base de datos.

Se han añadido los siguientes componentes para una solución más robusta y completa:
* **Frontend HTML/CSS/JS:** Servido por Nginx, proporcionando una interfaz de usuario atractiva para interactuar con el contador.
* **Nginx:** Actúa como un proxy inverso y servidor de archivos estáticos, redirigiendo las peticiones al backend Flask y sirviendo el frontend.
* **Prometheus:** Para la recolección y consulta de métricas de la aplicación Flask, incluyendo el total de visitas.
* **Loki y Promtail:** Un stack de logging ligero para recolectar, agregar y almacenar los logs de todos los servicios.
* **Grafana:** Herramienta de visualización de métricas (desde Prometheus) y logs (desde Loki), permitiendo crear dashboards personalizados.
* **Portainer:** Una interfaz de usuario gráfica para gestionar tus contenedores Docker, volúmenes, redes e imágenes.

---

## Endpoints Principales

La aplicación expone los siguientes endpoints a través de Nginx (`http://localhost`):

* **`GET /`**
    * Sirve el frontend HTML/CSS/JS. Al cargar la página, el JavaScript realiza una llamada interna a la API para obtener e incrementar el contador.

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
* **(Opcional) Trivy:** Para el escaneo de vulnerabilidades de imágenes.

---

## Cómo ejecutar

Sigue estos pasos para poner la aplicación en funcionamiento en tu máquina local:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/KeepCodingCloudDevops12/JosePalenzuela-practicaDOCKER.git
    cd JosePalenzuela-practicaDOCKER
    ```

2.  **Construye las imágenes Docker y levanta los contenedores:**
    Utiliza el siguiente comando. La opción `--build` asegura que se reconstruyan las imágenes si hay cambios en los Dockerfiles o dependencias, y `-d` ejecuta los contenedores en segundo plano.

    ```bash
    docker compose up --build -d
    ```

3.  **Verifica el funcionamiento y accede a las interfaces:**

    * **Aplicación web:** Accede a la aplicación desde tu navegador:
        ```
        http://localhost
        ```
        Aquí verás el frontend de Nginx y el contador incrementándose cada vez que recargues la página o hagas click en el botón.

    * **APIs del contador:** Puedes probar las APIs JSON directamente:
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

    * **Logs Centralizados con Grafana:** Accede a la interfaz de Grafana:
        ```
        http://localhost:3000
        ```
        La primera vez, usa las credenciales por defecto `admin`/`admin` (se te pedirá cambiarlas). En la sección "Explore" (icono del telescopio), selecciona la fuente de datos "Loki" para consultar logs.

    * **Gestión de Docker con Portainer:** Accede a la interfaz de Portainer:
        ```
        http://localhost:9000
        ```
        La primera vez, se te pedirá crear una cuenta de administrador. Una vez configurado, podrás visualizar y gestionar todos tus contenedores. La configuración de Portainer (incluyendo usuarios) persiste gracias a un volumen Docker.

---

## Estructura del Proyecto

* `app.py`: Código principal de la aplicación Flask. Implementa la lógica del contador y expone las APIs.
* `config.py`: Archivo de configuración para la conexión a la base de datos, utilizando variables de entorno.
* `Dockerfile`: Define cómo construir la imagen Docker para la aplicación Flask, utilizando un *Multistage Build*.
* `docker-compose.yml`: Archivo de orquestación que define y conecta todos los servicios (Flask, PostgreSQL, Nginx, Prometheus, Portainer, Loki, Promtail, Grafana).
* `init.sql`: Script SQL para inicializar la tabla `contador` en la base de datos PostgreSQL.
* `nginx.conf`: Configuración para Nginx, actuando como proxy inverso y sirviendo el frontend.
* `frontend/`: Contiene los archivos estáticos (HTML, CSS, JavaScript) del frontend de la aplicación.
* `prometheus.yml`: Configuración para Prometheus, especificando qué objetivos debe raspar para obtener métricas.
* `requirements.txt`: Lista de dependencias de Python para la aplicación Flask.
* `promtail-config.yml`: Configuración para el agente de logs Promtail, definiendo cómo recolectar y etiquetar los logs de los contenedores Docker.
* `grafana-datasources.yml`: Archivo de configuración para auto-provisionar las fuentes de datos (Loki y Prometheus) en Grafana al inicio.

---

## Detalles Técnicos y Configurabilidad

### **Base de Datos (PostgreSQL)**

* **Imagen:** `postgres:15`
* **Credenciales:**
    * Usuario: `chema`
    * Contraseña: `admin123`
    * Base de datos: `aplicaciondb`
* **Persistencia:** Los datos de la base de datos persisten en un volumen Docker llamado `postgres_data`.
* **Inicialización:** La base de datos se inicializa automáticamente con el script `init.sql` al levantar el contenedor.

### **Aplicación Flask**

* **Imagen:** `aplicacion-flask:latest` (construida localmente, sin prefijo de proyecto).
* **Puerto interno:** 5010
* **Servidor web:** La aplicación es servida por `Gunicorn` para mayor robustez y eficiencia.
* **Variables de Entorno para la Conexión a la BBDD:** La configuración de la base de datos se gestiona completamente a través de variables de entorno, definidas en `docker-compose.yml`:
    * `DB_HOST`: Host de la base de datos (por defecto: `aplicacion-postgres`).
    * `DB_PORT`: Puerto de la base de datos (por defecto: `5432`).
    * `DB_NAME`: Nombre de la base de datos (por defecto: `aplicaciondb`).
    * `DB_USER`: Usuario de la base de datos (por defecto: `chema`).
    * `DB_PASS`: Contraseña del usuario de la base de datos (por defecto: `admin123`).

### **Nginx**

* **Imagen:** `nginx:alpine`
* **Puerto de escucha:** 80 (HTTP).
* **Servicio de archivos:** Sirve los archivos estáticos desde el directorio `frontend/`.
* **Proxy inverso:** Redirige las peticiones a `/api/`, `/metrics` y el endpoint raíz (`/`) al servicio `aplicacion-flask`.

### **Monitorización con Prometheus**

* **Imagen:** `prom/prometheus`
* **Puerto:** 9090
* **Objetivos:** Raspa las métricas del servicio `aplicacion-flask:5010`.
* **Métricas disponibles (ejemplos):**
    * `aplicacion_visitas_total`: **Métrica personalizada** que expone el valor actual del contador de visitas.

### **Gestión con Portainer**

* **Imagen:** `portainer/portainer-ce:latest`
* **Puerto:** 9000
* **Persistencia:** La configuración de Portainer (incluyendo usuarios y contraseñas) se almacena en el volumen Docker `portainer_data`, por lo que no necesitas reconfigurarlo cada vez que levantes los contenedores.

### **Logs Centralizados (Loki, Promtail, Grafana)**

* **Loki:**
    * **Imagen:** `grafana/loki:2.9.0`
    * **Puerto interno:** 3100
    * **Persistencia:** Los logs se almacenan en un volumen Docker llamado `loki_data`.
* **Promtail:**
    * **Imagen:** `grafana/promtail:2.9.0`
    * **Configuración:** Utiliza `promtail-config.yml` para definir las fuentes de logs y las etiquetas que se añaden antes de enviarlos a Loki.
    * **Acceso a logs:** Monta `/var/lib/docker/containers` y `/var/run/docker.sock` para recolectar logs de todos los contenedores Docker.
* **Grafana:**
    * **Imagen:** `grafana/grafana:10.4.2`
    * **Puerto de escucha:** 3000
    * **Persistencia:** La configuración, los dashboards y los usuarios persisten en el volumen Docker `grafana_data`.
    * **Auto-configuración:** Usa `grafana-datasources.yml` para configurar automáticamente Loki y Prometheus como fuentes de datos al inicio.

---

## Logs de la Aplicación (Básicos)

Todos los componentes de la aplicación (Flask, PostgreSQL, Nginx, etc.) están configurados para enviar sus logs a la **salida estándar (STDOUT) y salida de error (STDERR)** dentro de sus respectivos contenedores. Docker captura estas salidas.

* **Consulta rápida de Logs:** Puedes ver los logs en tiempo real o históricos para cualquier servicio usando `docker compose logs`:
    ```bash
    docker compose logs -f aplicacion-flask       # Logs de Flask en tiempo real
    docker compose logs aplicacion-postgres        # Logs históricos de PostgreSQL
    docker compose logs -f nginx                   # Logs de Nginx en tiempo real
    docker compose logs -f                         # Todos los logs de todos los servicios en tiempo real
    ```
* **Análisis Avanzado:** Para un análisis más profundo, filtrado por etiquetas, y visualización, se recomienda utilizar la interfaz de **Grafana** configurada con **Loki** (ver sección "Logs Centralizados").

---

## Seguridad: Escaneo de Vulnerabilidades con Trivy

Hemos integrado el escaneo de imágenes Docker en busca de vulnerabilidades de seguridad utilizando [Trivy](https://aquasecurity.github.io/trivy/).

### Cómo escanear:

1.  **Instala Trivy** en tu sistema siguiendo las instrucciones oficiales (ej. `brew install trivy` en macOS, o consultando la [documentación de instalación de Trivy](https://aquasecurity.github.io/trivy/latest/getting-started/installation/)).
2.  Asegúrate de que tu imagen `aplicacion-flask` esté construida localmente (ejecuta `docker compose build aplicacion-flask`).
3.  Ejecuta el escaneo:
    ```bash
    trivy image aplicacion-flask:latest # Se especifica la etiqueta para mayor claridad
    ```
    Esto escaneará la imagen base (`python:3.10-slim-bookworm`) y todas las dependencias instaladas dentro de tu aplicación en busca de vulnerabilidades conocidas.

### Interpretación de los Resultados:

Trivy mostrará una lista de vulnerabilidades encontradas, clasificadas por severidad (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`). Cada entrada incluirá información como el ID de la vulnerabilidad (CVE), la versión instalada del componente vulnerable y la versión corregida si está disponible.

Las vulnerabilidades más críticas (`CRITICAL` y `HIGH`) deben ser priorizadas para su resolución, generalmente actualizando la dependencia o imagen base a una versión que incluya la corrección.

---

## Puntos Extra Implementados

* **Monitorización con Prometheus:** Integrado para recolectar métricas de la aplicación Flask.
* **Multistage Build en Dockerfile:** Reduce significativamente el tamaño de la imagen final de la aplicación Flask.
* **Frontend más bonito con Nginx:** El proyecto incluye un frontend HTML/CSS/JS servido por Nginx para una interfaz de usuario más completa y visual.
* **Uso de variables de entorno para accesos a BBDD:** La configuración de la base de datos se gestiona completamente a través de variables de entorno para mayor flexibilidad.
* **Despliegue de Portainer:** Incluido en `docker-compose.yml` para una gestión visual de los contenedores Docker.
* **Subida de imagen a Docker Hub:** La imagen de `aplicacion-flask` se ha subido a Docker Hub ([https://hub.docker.com/repository/docker/orejasperez/aplicacion-flask/general](https://hub.docker.com/repository/docker/orejasperez/aplicacion-flask/general)). Esto se realiza para cumplir con los requisitos de la práctica, sin embargo, el `docker-compose.yml` local sigue utilizando la construcción de la imagen desde el Dockerfile (`build: .`) y no hace referencia a la imagen de Docker Hub.
* **Escaneo de vulnerabilidades de imágenes con Trivy:** Se ha integrado Trivy para la identificación de vulnerabilidades de seguridad en la imagen Docker.
* **Logs centralizados avanzados con Loki, Promtail y Grafana (LPG Stack):** Implementación de un stack completo para la recolección, almacenamiento, consulta y visualización centralizada de logs de todos los servicios.

---

## Posibles Mejoras Adicionales

* **Entornos de prueba y producción:** Crear archivos `docker-compose` específicos para entornos de desarrollo, prueba y producción, permitiendo configuraciones y versiones de servicios diferentes.
* **Alertas y Dashboards en Grafana:** Configurar alertas en Grafana basadas en métricas (Prometheus) o patrones en logs (Loki) para notificaciones proactivas. Desarrollar dashboards personalizados en Grafana para una visualización más rica del rendimiento y estado de la aplicación.
* **Integración CI/CD:** Automatizar la construcción, el escaneo de vulnerabilidades (Trivy), la subida de imágenes a Docker Hub y el despliegue mediante una tubería de integración/despliegue continuo (CI/CD).
* **HTTPS con Nginx:** Configurar Nginx para servir la aplicación a través de HTTPS, obteniendo certificados SSL/TLS (por ejemplo, con Let's Encrypt y Certbot) para asegurar el tráfico.

---

## Autor

Jose María Palenzuela Plaza ([jpalenz77](https://github.com/jpalenz77))

---

¡Gracias por probar esta práctica! Cualquier duda, sugerencia o mejora será bienvenida.