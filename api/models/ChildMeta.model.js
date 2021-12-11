module.exports = (sequelize, Sequelize) => {
  const ChildMeta = sequelize.define('ChildMeta', {
    scraperField: Sequelize.TEXT,
  }, {
    timestamps: false
  })

  return ChildMeta;
};