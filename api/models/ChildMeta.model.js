module.exports = (sequelize, Sequelize) => {
  const ChildMeta = sequelize.define('сhildMeta', {
    scraper: Sequelize.TEXT,
    show: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    order: Sequelize.INTEGER,
  }, {
    timestamps: false
  })

  return ChildMeta;
};