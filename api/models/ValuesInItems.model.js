module.exports = (sequelize, Sequelize) => {
  const ValuesInItems = sequelize.define('ValuesInItems', {
    value: Sequelize.TEXT
  }, {
    timestamps: false
  })

  return ValuesInItems;
};