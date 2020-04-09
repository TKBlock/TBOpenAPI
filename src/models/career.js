/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('career', {
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
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'career',
    timestamps: false
  });
};
