const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('job_post', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_by_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_account',
        key: 'id'
      }
    },
    job_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'job_type',
        key: 'id'
      }
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'company',
        key: 'id'
      }
    },
    is_company_name_hidden: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    job_description: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    job_location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'job_location',
        key: 'id'
      }
    },
    is_active: {
      type: DataTypes.CHAR(1),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'job_post',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "job_post_pk",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
