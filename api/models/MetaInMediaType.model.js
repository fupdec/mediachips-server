module.exports = (sequelize, Sequelize) => {
  const MetaInMediaType = sequelize.define('metaInMediaType', {
    scraper: Sequelize.TEXT,
    show: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    order: Sequelize.INTEGER,
  }, {
    timestamps: false
  })

  return MetaInMediaType;
};