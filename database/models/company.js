const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('company', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    profile_description: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    business_stream_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'business_stream',
        key: 'id'
      }
    },
    establishment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    company_website_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'company',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "company_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
