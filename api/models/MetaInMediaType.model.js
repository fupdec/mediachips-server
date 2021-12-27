module.exports = (sequelize, Sequelize) => {
  const MetaInMediaType = sequelize.define('metaInMediaType', null, {
    timestamps: false
  })

  return MetaInMediaType;
};