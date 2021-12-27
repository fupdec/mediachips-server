module.exports = (sequelize, Sequelize) => {
  const ItemsInItem = sequelize.define('itemsInItem', null, {
    timestamps: false
  })

  return ItemsInItem;
};