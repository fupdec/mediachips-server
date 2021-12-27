module.exports = (sequelize, Sequelize) => {
  const Meta = sequelize.define(
    'meta', {
      oldId: {
        type: Sequelize.TEXT,
        unique: true,
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      nameSingular: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hint: Sequelize.TEXT,
    }
  )

  return Meta;
};