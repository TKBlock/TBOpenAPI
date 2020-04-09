/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('enrollment', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    course_IDX: {
      type: DataTypes.INTEGER(11),
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
    state: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    fixed_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    registered_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    removed_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'enrollment',
    timestamps: false
  });
};
