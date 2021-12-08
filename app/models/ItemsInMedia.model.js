module.exports = (sequelize, Sequelize) => {
  const ItemsInMedia = sequelize.define('ItemsInMedia', null, {
    timestamps: false
  })


  return ItemsInMedia;
};