/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dojo', {
    IDX: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    web_user_uuid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '\'0\''
    },
    dojo_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    manager: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
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
      allowNull: true
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'dojo',
    timestamps: false
  });
};
