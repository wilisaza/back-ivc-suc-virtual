import { DataTypes } from 'sequelize'

export default (sequelizeConfig) => {
  const tDatosbasicosEstadosNiif = sequelizeConfig.define(
    'tDatosbasicosEstadosNiif',
    {
      daenId: {
        type: DataTypes.BIGINT, // NUMBER(12,0)
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        field: 'DAEN_ID',
      },
      esalId: {
        type: DataTypes.INTEGER, // NUMBER(6,0)
        allowNull: false,
        field: 'ESAL_ID',
      },
      daenAno: {
        type: DataTypes.INTEGER, // NUMBER(4,0)
        allowNull: false,
        field: 'DAEN_ANO',
      },
      daenNomreplegal: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'DAEN_NOMREPLEGAL',
      },
      usuaId: {
        type: DataTypes.INTEGER, // NUMBER(6,0)
        allowNull: true,
        field: 'USUA_ID',
      },
      daenEstado: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: 'DAEN_ESTADO',
      },
      daenFechareg: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW, // sysdate
        field: 'DAEN_FECHAREG',
      },
      daenFechaterm: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'DAEN_FECHATERM',
      },
      daenPrincipal: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: 'DAEN_PRINCIPAL',
      },
      daenObservacion: {
        type: DataTypes.STRING(4000),
        allowNull: true,
        field: 'DAEN_OBSERVACION',
      },
      daenConcepto: {
        type: DataTypes.STRING(4000),
        allowNull: true,
        field: 'DAEN_CONCEPTO',
      },
      daenDiagFile: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'DAEN_DIAG_FILE',
      },
      daenMarcFile: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'DAEN_MARC_FILE',
      },
      daenPoliFile: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'DAEN_POLI_FILE',
      },
    },
    {
      modelName: 'tDatosbasicosEstadosNiif',
      tableName: 'T_DATOSBASICOS_ESTADOS_NIIF',
      schema: 'SPJ',
      timestamps: false,
    }
  )

  return tDatosbasicosEstadosNiif
}
