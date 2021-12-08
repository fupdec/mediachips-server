module.exports = (sequelize, Sequelize) => {
  const Items = sequelize.define(
    'Items', {
      oldId: {
        type: Sequelize.TEXT,
        unique: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      synonyms: Sequelize.TEXT,
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bookmark: Sequelize.TEXT,
      country: Sequelize.TEXT,
      color: Sequelize.TEXT,
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      viewedAt: Sequelize.DATE,
    }
  )

  return Items;
};