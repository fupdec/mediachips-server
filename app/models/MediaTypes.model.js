module.exports = (sequelize, Sequelize) => {
  const MediaTypes = sequelize.define(
    'MediaTypes', {
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

  return MediaTypes;
};