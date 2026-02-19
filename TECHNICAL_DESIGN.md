# Documento de Diseño Técnico - back-ivc-suc-virtual

## 1. Arquitectura del Sistema

El sistema sigue una arquitectura de tres capas: Cliente, Servidor de Aplicaciones (Backend API), y Servidor de Base de Datos.

```mermaid
graph TD
    Client[Cliente (Frontend/Postman)] -->|HTTP Requests| API[Backend API (Node.js/Express)]
    API -->|SQL Queries via Sequelize| DB[(Oracle Database)]
    DB -->|Result Sets| API
    API -->|JSON Responses| Client

    subgraph "Backend Components"
    API
    Auth[Módulo de Autenticación]
    Controllers[Controladores]
    Models[Modelos Sequelize]
    end
```

## 2. Diagrama de Entidad-Relación (ERD)

Representación de las principales tablas relacionadas con la gestión de estados financieros NIIF.

```mermaid
erDiagram
    T_CUENTAS_NIIF ||--o{ T_ESTADOS_FINANCIEROS_NIIF : "tiene"
    T_DATOSBASICOS_ESTADOS_NIIF ||--o{ T_ESTADOS_FINANCIEROS_NIIF : "contiene"
    
    T_CUENTAS_NIIF {
        integer CUEN_ID PK
        string CUEN_CODIGO
        string CUEN_NOMBRE
        integer CUEN_IDPADRE
    }
    
    T_DATOSBASICOS_ESTADOS_NIIF {
        bigint DAEN_ID PK, UK
        integer ESAL_ID
        integer DAEN_ANO
        string DAEN_ESTADO
    }

    T_ESTADOS_FINANCIEROS_NIIF {
        bigint ESFN_ID PK
        integer CUEN_ID FK
        bigint DAEN_ID FK
        decimal ESFN_VALOR
        integer ESFN_ANO
    }
```

## 3. Diagrama de Secuencia - Autenticación (Login)

Flujo de proceso para el endpoint `POST /login/pin`.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant R as Router (/login/pin)
    participant C as Controller (login-pin.js)
    participant DB as Oracle Database

    U->>R: POST /login/pin {pin, clave}
    R->>C: Invoca controlador
    C->>C: Valida campos requeridos (pin, clave)
    
    alt Campos Faltantes
        C-->>U: 400 Bad Request
    else Campos Válidos
        C->>DB: Conectar (getOracleSequelizeConnection)
        C->>DB: Consulta SQL (SELECT T_ESAL WHERE PIN = ? AND CLAVE = ?)
        DB-->>C: Retorna Resultado Usuario
        
        alt Usuario No Encontrado
            C-->>U: 400 No User found
        else Usuario Inactivo
            C-->>U: 400 User is not active
        else Usuario Válido
            C->>C: Generar JWT (generateAppToken)
            C-->>U: 200 OK {success: true, token, ...}
        end
        
        C->>DB: Cerrar Conexión
    end
```

## 4. Descripción de Componentes

### 4.1 Controladores (`src/controllers`)
Manejan la lógica de negocio para cada ruta.
- **Login Pin**: Valida credenciales contra la tabla `T_ESAL` utilizando consultas directas o modelos, y emite un token JWT si la autenticación es exitosa.

### 4.2 Middlewares (`src/middlewares`)
Funciones que se ejecutan antes del controlador final.
- **CORS**: Habilita el acceso desde diferentes orígenes.
- **Request Logger**: Registra información básica de cada petición entrante.
- **JWT Sign**: Utilidad para firmar tokens JWT seguros.

### 4.3 Sequelize y Base de Datos (`src/sequelize`)
- **`getOracleSequelizeConnection`**: Gestiona la conexión a la base de datos Oracle, incluyendo la inicialización del cliente de Oracle y la configuración del pool de conexiones.
- **Modelos**: Abstracción de las tablas de la base de datos para facilitar las operaciones CRUD.

### 4.4 Utilidades (`src/util`)
Funciones de ayuda transversal.
- **Logger**: Sistema de registro de eventos (Pino).
- **Encrypt**: Funciones criptográficas para manejo de claves.
