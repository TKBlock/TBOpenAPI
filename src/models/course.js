/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('course', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    dojo_uuid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '\'0\''
    },
    course_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    manager: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image5: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp')
    }
  }, {
    tableName: 'course',
    timestamps: false
  });
};
