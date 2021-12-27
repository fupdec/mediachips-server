module.exports = (sequelize, Sequelize) => {
  const ValuesInItem = sequelize.define('valuesInItem', {
    value: Sequelize.TEXT
  }, {
    timestamps: false
  })

  return ValuesInItem;
};