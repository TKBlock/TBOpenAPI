/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fitness', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_idx: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    height: {
      type: "DOUBLE",
      allowNull: true
    },
    weight: {
      type: "DOUBLE",
      allowNull: true
    },
    blood_pressure: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    BMI: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'fitness',
    timestamps: false
  });
};
