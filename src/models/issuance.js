/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('issuance', {
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
    user_uuid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    issue_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    request_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    issue_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'issuance',
    timestamps: false
  });
};
