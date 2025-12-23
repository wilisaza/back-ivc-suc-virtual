import { DataTypes } from 'sequelize'

export default (sequelizeConfig) => {
  const tCuentasNiif = sequelizeConfig.define(
    'tCuentasNiif',
    {
      cuenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CUEN_ID',
        primaryKey: true,
      },
      cuenCodigo: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'CUEN_CODIGO',
      },
      cuenNombre: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'CUEN_NOMBRE',
      },
      cuenIdpadre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'CUEN_IDPADRE',
      },
      cuenTipo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'CUEN_TIPO',
      },
      cuenNivelniif: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'CUEN_NIVELNIIF',
      },
      
    },
    {
      modelName: 'tCuentasNiif',
      tableName: 'T_CUENTAS_NIIF',
      schema: 'SPJ',
      timestamps: false,
    }
  )

  return tCuentasNiif
}
