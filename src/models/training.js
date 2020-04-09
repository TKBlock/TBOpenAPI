/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('training', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_uuid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '\'0\''
    },
    dojo_uuid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '\'0\''
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
    tableName: 'training',
    timestamps: false
  });
};
