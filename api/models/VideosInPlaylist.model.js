module.exports = (sequelize, Sequelize) => {
  const VideosInPlaylist = sequelize.define(
    'VideosInPlaylist', null, {
      name: {
        singular: 'VideosInPlaylist',
        plural: 'VideosInPlaylist',
      },
      timestamps: false
    }
  )

  return VideosInPlaylist;
};