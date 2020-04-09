/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assn_dojo', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    assn_uuid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dojo_uuid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    assosiated_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'assn_dojo',
    timestamps: false
  });
};
