const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('seeker_profile', {
    user_acount_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user_account',
        key: 'id'
      }
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    current_salary: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_annually_monthly: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'seeker_profile',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "seeker_profile_pk",
        unique: true,
        fields: [
          { name: "user_acount_id" },
        ]
      },
    ]
  });
};