module.exports = (sequelize, Sequelize) => {
  const WatchedFolders = sequelize.define(
    'WatchedFolders', {
      path: Sequelize.TEXT,
      name: Sequelize.TEXT,
      watch: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
    }, {
      name: {
        singular: 'WatchedFolder',
        plural: 'WatchedFolders',
      }
    }
  )

  return WatchedFolders;
};