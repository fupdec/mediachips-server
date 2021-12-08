module.exports = (sequelize, Sequelize) => {
  const Playlists = sequelize.define(
    'Playlists', {
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      oldId: {
        type: Sequelize.TEXT,
        unique: true,
      },
      viewedAt: Sequelize.DATE,
    }, {
      name: {
        singular: 'Playlist',
        plural: 'Playlists',
      },
    }
  )

  return Playlists;
};