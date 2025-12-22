import { DataTypes } from 'sequelize'

export default (sequelizeConfig) => {
  const tEstadosFinancierosNiif = sequelizeConfig.define(
    'tEstadosFinancierosNiif',
    {
      esfnId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true,
        field: 'ESFN_ID',
      },
      cuenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CUEN_ID',
      },
      esalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'ESAL_ID',
      },
      esfnTipo: {
        type: DataTypes.STRING(2),
        allowNull: true,
        field: 'ESFN_TIPO',
      },
      esfnAno: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'ESFN_ANO',
      },
      esfnValor: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
        field: 'ESFN_VALOR',
      },
      esfnFecha: {
        type: DataTypes.DATE, // Sequelize transforma DATE a la fecha con hora de Oracle
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'ESFN_FECHA',
      },
      daenId: {
        type: DataTypes.BIGINT, // NUMBER(12,0) corresponde a BIGINT
        allowNull: false,
        field: 'DAEN_ID',
      },
      usuaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'USUA_ID',
      },
      esfnDescripcion: {
        type: DataTypes.STRING(4000),
        allowNull: true,
        field: 'ESFN_DESCRIPCION',
      },
    },
    {
      modelName: 'tEstadosFinancierosNiif',
      tableName: 'T_ESTADOS_FINANCIEROS_NIIF',
      schema: 'SPJ',
      timestamps: false,
    }
  )

  return tEstadosFinancierosNiif
}
