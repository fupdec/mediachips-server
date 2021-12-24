module.exports = (sequelize, Sequelize) => {
  const WatchedFolders = sequelize.define(
    'WatchedFolders', {
      path: Sequelize.TEXT,
      name: Sequelize.TEXT,
      watch: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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