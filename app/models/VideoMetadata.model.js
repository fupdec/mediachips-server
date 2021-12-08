module.exports = (sequelize, Sequelize) => {
  const VideoMetadata = sequelize.define(
    'VideoMetadata', {
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      width: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      height: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      bitrate: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      fps: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      codec: Sequelize.TEXT,
    }, {
      name: {
        singular: 'VideoMetadata',
        plural: 'VideoMetadata',
      },
      timestamps: false
    }
  )
  
  return VideoMetadata;
};