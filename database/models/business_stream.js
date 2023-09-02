const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('business_stream', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    business_stream_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'business_stream',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "business_stream_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
