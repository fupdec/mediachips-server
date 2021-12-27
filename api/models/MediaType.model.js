module.exports = (sequelize, Sequelize) => {
  const MediaType = sequelize.define(
    'mediaType', {
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      icon: Sequelize.TEXT,
      extensions: Sequelize.TEXT,
    }, {
      timestamps: false
    }
  )

  return MediaType;
};