/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('certificate', {
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
    cert_name: {
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
    }
  }, {
    tableName: 'certificate',
    timestamps: false
  });
};
