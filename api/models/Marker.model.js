module.exports = (sequelize, Sequelize) => {
  const Marker = sequelize.define(
    'marker', {
      type: Sequelize.TEXT,
      text: Sequelize.TEXT,
      time: Sequelize.INTEGER,
      end: Sequelize.INTEGER,
    }, {
      timestamps: false
    }
  )

  return Marker;
};