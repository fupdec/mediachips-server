module.exports = (sequelize, Sequelize) => {
  const Settings = sequelize.define(
    'Settings', {
      option: {
        type: Sequelize.TEXT,
        unique: true
      },
      value: {
        type: Sequelize.TEXT,
      },
    }
  )

  return Settings;
};