# Plan de Pruebas - back-ivc-suc-virtual

Este documento describe los casos de prueba para validar la funcionalidad de la API REST del proyecto.

## 1. Módulo de Autenticación (`/login`)

### Caso 1.1: Inicio de Sesión Exitoso
- **Endpoint**: `POST /login/pin`
- **Descripción**: Verificar que un usuario con credenciales válidas y activo pueda obtener un token.
- **Pre-condiciones**: Existe un usuario en `T_ESAL` con `ESAL_ACTIVA='S'`.
- **Datos de Entrada**:
  ```json
  {
      "pin": "12345",
      "clave": "clave_correcta"
  }
  ```
- **Resultado Esperado**:
  - Código HTTP: `200 OK`
  - Body: `{ "success": true, "data": "eyJhbG...", "nombre": "Nombre ESAL" }`

### Caso 1.2: Credenciales Inválidas
- **Endpoint**: `POST /login/pin`
- **Descripción**: Verificar rechazo de PIN o clave incorrectos.
- **Datos de Entrada**:
  ```json
  {
      "pin": "12345",
      "clave": "clave_erronea"
  }
  ```
- **Resultado Esperado**:
  - Código HTTP: `400 Bad Request`
  - Body: `{ "error": "No User found" }` (o mensaje similar según lógica de BD)

### Caso 1.3: Usuario Inactivo
- **Endpoint**: `POST /login/pin`
- **Descripción**: Verificar que un usuario inactivo no pueda ingresar.
- **Pre-condiciones**: Existe un usuario con `ESAL_ACTIVA='N'`.
- **Resultado Esperado**:
  - Código HTTP: `400 Bad Request`
  - Body: `{ "error": "User is not active" }`

---

## 2. Gestión ESAL (`/esal`)

> **Nota**: Todos los endpoints de esta sección requieren un header `Authorization: Bearer <token>` válido.

### Caso 2.1: Consultar Datos de Estados
- **Endpoint**: `GET /esal/datosEstados/:esalId`
- **Descripción**: Obtener la información básica de los estados financieros de una ESAL.
- **Datos de Entrada**: `esalId` válido en la URL.
- **Resultado Esperado**:
  - Código HTTP: `200 OK`
  - Body: Objeto JSON con los datos de `T_DATOSBASICOS_ESTADOS_NIIF`.

### Caso 2.2: Carga de Archivo de Estados NIIF
- **Endpoint**: `POST /esal/datosEstados/uploadEstadosNiif`
- **Descripción**: Cargar un archivo (Excel/CSV) con la información financiera.
- **Datos de Entrada**: 
  - `file`: Archivo adjunto (form-data).
- **Resultado Esperado**:
  - Código HTTP: `200 OK`
  - Mensaje de éxito o resumen de la carga.

### Caso 2.3: Guardar Información
- **Endpoint**: `POST /esal/datosEstados/guardarInfo`
- **Descripción**: Guardar manualmente información financiera o actualizar datos básicos.
- **Datos de Entrada**: JSON con estructura definida por el modelo.
- **Resultado Esperado**:
  - Código HTTP: `200 OK`
  - Confirmación de guardado.

### Caso 2.4: Validar Información
- **Endpoint**: `POST /esal/datosEstados/validarInfo`
- **Descripción**: Ejecutar validaciones de negocio sobre la información cargada.
- **Resultado Esperado**:
  - Código HTTP: `200 OK`
  - Lista de errores de validación (vacía si todo es correcto).

### Caso 2.5: Token Inválido o Expirado
- **Endpoint**: Cualquiera de `/esal/*`
- **Descripción**: Intentar acceder sin token o con token manipulado.
- **Resultado Esperado**:
  - Código HTTP: `401 Unauthorized` o `403 Forbidden`.
