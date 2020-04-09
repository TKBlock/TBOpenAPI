/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assosiation', {
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
    assn_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    manager: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image1: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '\'0\''
    },
    image2: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '\'0\''
    },
    image3: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '\'0\''
    },
    image4: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '\'0\''
    },
    image5: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '\'0\''
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '\'0\''
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    found_date: {
      type: DataTypes.DATEONLY,
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
    tableName: 'assosiation',
    timestamps: false
  });
};
