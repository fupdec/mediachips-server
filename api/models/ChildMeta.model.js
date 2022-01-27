module.exports = (sequelize, Sequelize) => {
  const ChildMeta = sequelize.define('сhildMeta', {
    scraperField: Sequelize.TEXT,
    order: Sequelize.INTEGER,
  }, {
    timestamps: false
  })

  return ChildMeta;
};