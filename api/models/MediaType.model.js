module.exports = (sequelize, Sequelize) => {
  const MediaType = sequelize.define(
    'mediaType', {
      name: Sequelize.TEXT,
      nameSingular: Sequelize.TEXT,
      icon: Sequelize.TEXT,
      extensions: Sequelize.TEXT,
    }
  )

  return MediaType;
};