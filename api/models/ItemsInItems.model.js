module.exports = (sequelize, Sequelize) => {
  const ItemsInItems = sequelize.define('ItemsInItems', null, {
    timestamps: false
  })

  return ItemsInItems;
};