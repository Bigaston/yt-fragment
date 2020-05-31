'use strict';
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
	},
	url: DataTypes.STRING,
    end_timestamp: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "waiting",
      validate: {
        isIn: [["waiting","during","finished","deleted"]]
      }
    },      
    start_time: {
      type: DataTypes.STRING,
    },
    end_time: {
      type: DataTypes.STRING,
    }
  }, {

  });
  Video.associate = function(models) {

  };
  return Video;
};