# Diccionario de Datos - Modelos Sequelize

Este documento detalla la estructura de la base de datos definida en los modelos de Sequelize del proyecto.

---

## 1. tCuentasNiif

**Referencia de archivo:** `src/sequelize/models/tCuentasNiif.js`
**Tabla BD:** `T_CUENTAS_NIIF`
**Esquema:** `SPJ`

| Campo             | Tipo Sequelize | Nulo    | PK  | AutoInc | Campo BD         | Descripción/Notas                  |
| :---------------- | :------------- | :------ | :-- | :------ | :--------------- | :--------------------------------- |
| **cuenId**        | `INTEGER`      | `false` | ✅  | ❌      | `CUEN_ID`        | Identificador único de la cuenta.  |
| **cuenCodigo**    | `STRING`       | `false` | ❌  | ❌      | `CUEN_CODIGO`    | Código contable de la cuenta.      |
| **cuenNombre**    | `STRING`       | `false` | ❌  | ❌      | `CUEN_NOMBRE`    | Nombre descriptivo de la cuenta.   |
| **cuenIdpadre**   | `INTEGER`      | `false` | ❌  | ❌      | `CUEN_IDPADRE`   | ID de la cuenta padre (jerarquía). |
| **cuenTipo**      | `STRING`       | `true`  | ❌  | ❌      | `CUEN_TIPO`      | Tipo de cuenta.                    |
| **cuenNivelniif** | `INTEGER`      | `true`  | ❌  | ❌      | `CUEN_NIVELNIIF` | Nivel jerárquico NIIF.             |

---

## 2. tDatosbasicosEstadosNiif

**Referencia de archivo:** `src/sequelize/models/tDatosbasicosEstadosNiif.js`
**Tabla BD:** `T_DATOSBASICOS_ESTADOS_NIIF`
**Esquema:** `SPJ`

| Campo               | Tipo Sequelize | Nulo    | PK  | AutoInc | Campo BD           | Descripción/Notas                      |
| :------------------ | :------------- | :------ | :-- | :------ | :----------------- | :------------------------------------- |
| **daenId**          | `BIGINT`       | `true`  | ✅  | ✅      | `DAEN_ID`          | Identificador único (Generado por DB). |
| **esalId**          | `INTEGER`      | `false` | ❌  | ❌      | `ESAL_ID`          | ID de la entidad (ESAL) asociada.      |
| **daenAno**         | `INTEGER`      | `false` | ❌  | ❌      | `DAEN_ANO`         | Año de vigencia de los datos.          |
| **daenNomreplegal** | `STRING(100)`  | `true`  | ❌  | ❌      | `DAEN_NOMREPLEGAL` | Nombre del representante legal.        |
| **usuaId**          | `INTEGER`      | `true`  | ❌  | ❌      | `USUA_ID`          | ID usuario auditor/creador.            |
| **daenEstado**      | `STRING(1)`    | `true`  | ❌  | ❌      | `DAEN_ESTADO`      | Estado del registro.                   |
| **daenFechareg**    | `DATE`         | `true`  | ❌  | ❌      | `DAEN_FECHAREG`    | Fecha de registro (Default: NOW).      |
| **daenFechaterm**   | `DATE`         | `true`  | ❌  | ❌      | `DAEN_FECHATERM`   | Fecha de terminación.                  |
| **daenPrincipal**   | `STRING(1)`    | `true`  | ❌  | ❌      | `DAEN_PRINCIPAL`   | Indicador de registro principal.       |
| **daenObservacion** | `STRING(4000)` | `true`  | ❌  | ❌      | `DAEN_OBSERVACION` | Observaciones generales.               |
| **daenConcepto**    | `STRING(4000)` | `true`  | ❌  | ❌      | `DAEN_CONCEPTO`    | Concepto técnico.                      |
| **daenDiagFile**    | `STRING(100)`  | `true`  | ❌  | ❌      | `DAEN_DIAG_FILE`   | Nombre archivo diagnóstico.            |
| **daenMarcFile**    | `STRING(100)`  | `true`  | ❌  | ❌      | `DAEN_MARC_FILE`   | Nombre archivo marco normativo.        |
| **daenPoliFile**    | `STRING(100)`  | `true`  | ❌  | ❌      | `DAEN_POLI_FILE`   | Nombre archivo políticas.              |

---

## 3. tEstadosFinancierosNiif

**Referencia de archivo:** `src/sequelize/models/tEstadosFinancierosNiif.js`
**Tabla BD:** `T_ESTADOS_FINANCIEROS_NIIF`
**Esquema:** `SPJ`

| Campo               | Tipo Sequelize   | Nulo    | PK  | AutoInc | Campo BD           | Descripción/Notas                      |
| :------------------ | :--------------- | :------ | :-- | :------ | :----------------- | :------------------------------------- |
| **esfnId**          | `BIGINT`         | `true`  | ✅  | ✅      | `ESFN_ID`          | Identificador único (Generado por DB). |
| **cuenId**          | `INTEGER`        | `false` | ❌  | ❌      | `CUEN_ID`          | FK a `T_CUENTAS_NIIF`.                 |
| **esalId**          | `INTEGER`        | `true`  | ❌  | ❌      | `ESAL_ID`          | ID de la entidad (ESAL).               |
| **esfnTipo**        | `STRING(2)`      | `true`  | ❌  | ❌      | `ESFN_TIPO`        | Tipo de estado financiero.             |
| **esfnAno**         | `INTEGER`        | `true`  | ❌  | ❌      | `ESFN_ANO`         | Año de vigencia.                       |
| **esfnValor**       | `DECIMAL(20, 2)` | `true`  | ❌  | ❌      | `ESFN_VALOR`       | Valor monetario.                       |
| **esfnFecha**       | `DATE`           | `true`  | ❌  | ❌      | `ESFN_FECHA`       | Fecha del registro (Default: NOW).     |
| **daenId**          | `BIGINT`         | `false` | ❌  | ❌      | `DAEN_ID`          | FK a `T_DATOSBASICOS_ESTADOS_NIIF`.    |
| **usuaId**          | `INTEGER`        | `true`  | ❌  | ❌      | `USUA_ID`          | ID usuario auditor/creador.            |
| **esfnDescripcion** | `STRING(4000)`   | `true`  | ❌  | ❌      | `ESFN_DESCRIPCION` | Descripción del registro.              |

---

_Generado automáticamente basado en la definición de modelos del proyecto._
