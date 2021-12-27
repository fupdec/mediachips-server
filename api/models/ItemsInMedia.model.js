module.exports = (sequelize, Sequelize) => {
  const ItemsInMedia = sequelize.define('itemsInMedia', null, {
    timestamps: false
  })


  return ItemsInMedia;
};