module.exports = (sequelize, Sequelize) => {
  const Tab = sequelize.define(
    'tab', {
      name: Sequelize.TEXT,
      icon: Sequelize.TEXT,
      url: Sequelize.TEXT,
    }
  )

  return Tab;
};