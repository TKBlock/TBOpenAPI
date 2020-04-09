/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mobile_user', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    account_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    openid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    unionid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    last_login_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    }
  }, {
    tableName: 'mobile_user',
    timestamps: false
  });
};
