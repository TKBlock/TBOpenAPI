/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('history', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_uuid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dojo_uuid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    registered_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    finished_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'history',
    timestamps: false
  });
};
