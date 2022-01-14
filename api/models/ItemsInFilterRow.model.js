module.exports = (sequelize, Sequelize) => {
  const ItemsInFilterRow = sequelize.define('itemsInFilterRow', null, {
    timestamps: false
  })

  return ItemsInFilterRow;
};