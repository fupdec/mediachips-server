module.exports = (sequelize, Sequelize) => {
  const MetaInMediaTypes = sequelize.define('MetaInMediaTypes', null, {
    timestamps: false
  })

  return MetaInMediaTypes;
};