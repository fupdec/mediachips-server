module.exports = (sequelize, Sequelize) => {
  const Media = sequelize.define(
    'Media', {
      path: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      filesize: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      bookmark: Sequelize.TEXT,
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
        singular: 'Media',
        plural: 'Media',
      },
    }
  )

  return Media;
};