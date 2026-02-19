# back-ivc-suc-virtual

Backend para gestión del módulo de Inspección, Vigilancia y Control (IVC). Esta aplicación gestiona usuarios, inicio de sesión y datos relacionados con entidades sin ánimo de lucro (ESAL).

## Características Principales

*   **API RESTful**: Construida con Express.js.
*   **Base de Datos Oracle**: Conexión a base de datos Oracle utilizando `oracledb`.
*   **ORM**: Uso de Sequelize para modelado y consultas a la base de datos.
*   **Autenticación**: Inicio de sesión mediante PIN y Clave, con generación de tokens JWT.
*   **Seguridad**: Middleware CORS y logs de peticiones.

## Requisitos Previos

Asegúrese de tener instalados los siguientes componentes antes de ejecutar el proyecto:

*   **Node.js**: Entorno de ejecución para JavaScript (v18 recomendada).
*   **Oracle Instant Client**: Necesario para la conexión con la base de datos Oracle. Debe estar configurado correctamente en su sistema.

## Instalación

1.  Clonar el repositorio:
    ```bash
    git clone <url-del-repositorio>
    cd back-ivc-suc-virtual
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    ```

3.  Configurar variables de entorno:
    Crear un archivo `.env` en la raíz del proyecto basado en el siguiente esquema (asegúrese de tener los valores correctos):

    ```env
    PORT=3000
    # Ruta a la carpeta de librerías del Instant Client de Oracle
    PATH_ORACLE_INSTANT_CLIENT=/opt/oracle/instantclient_19_8 
    
    # Credenciales de Base de Datos
    ORACLE_USERNAME=su_usuario
    ORACLE_PASSWORD=su_contraseña
    ORACLE_CONNECTION_STRING=host:puerto/servicio
    
    # Seguridad
    JWT_SECRET=su_secreto_jwt
    ```

## Scripts Disponibles

En el directorio del proyecto, puede ejecutar:

### `npm run dev`
Ejecuta la aplicación en modo de desarrollo usando `nodemon`. La aplicación se reiniciará automáticamente si realiza cambios en el código.
Nota: Carga las variables de entorno desde el archivo `.env` automáticamente.

### `npm start`
Ejecuta la aplicación en modo producción.

## Estructura del Proyecto

Organización básica de los archivos y carpetas en `src/`:

*   **`config/`**: Configuraciones generales.
*   **`controllers/`**: Lógica de control de las rutas (ej. `login`).
*   **`middlewares/`**: Middlewares de Express (CORS, Logger, JWT).
*   **`models/`**: Definiciones de modelos Sequelize.
*   **`routes/`**: Definición de endpoints de la API.
*   **`sequelize/`**: Configuración de la conexión a la base de datos y utilidades relacionadas.
*   **`util/`**: Funciones de utilidad y Logger.

## Diccionario de Datos

Para más información sobre la estructura de la base de datos y los modelos definidos, consulte el archivo [DATA_DICTIONARY.md](./DATA_DICTIONARY.md).

## Licencia

Este proyecto está bajo la Licencia ISC.
