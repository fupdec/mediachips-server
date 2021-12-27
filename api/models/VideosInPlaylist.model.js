module.exports = (sequelize, Sequelize) => {
  const VideosInPlaylist = sequelize.define(
    'videosInPlaylist', null, {
      timestamps: false
    }
  )

  return VideosInPlaylist;
};