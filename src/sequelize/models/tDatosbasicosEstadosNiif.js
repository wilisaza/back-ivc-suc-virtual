import { DataTypes } from 'sequelize'

export default (sequelizeConfig) => {
  const tDatosbasicosEstadosNiif = sequelizeConfig.define(
    'tDatosbasicosEstadosNiif',
    {
      daenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'DAEN_ID',
        primaryKey: true,
      },
      esalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ESAL_ID',
      },
      daenAno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'DAEN_ANO',
      },
      daenNomreplegal: {
        type: DataTypes.STRING,
        field: 'DAEN_NOMREPLEGAL',
      },
      daenEstado: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'DAEN_ESTADO',
      },
      daenFechareg: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'DAEN_FECHAREG',
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
