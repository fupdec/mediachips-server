module.exports = (sequelize, Sequelize) => {
  const ValuesInMedia = sequelize.define('ValuesInMedia', {
    value: Sequelize.TEXT
  }, {
    timestamps: false
  })

  return ValuesInMedia;
};