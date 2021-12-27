module.exports = (sequelize, Sequelize) => {
  const ChildMeta = sequelize.define('сhildMeta', {
    scraperField: Sequelize.TEXT,
  }, {
    timestamps: false
  })

  return ChildMeta;
};