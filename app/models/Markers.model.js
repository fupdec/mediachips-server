module.exports = (sequelize, Sequelize) => {
  const Markers = sequelize.define(
    'Markers', {
      type: Sequelize.TEXT,
      text: Sequelize.TEXT,
      time: Sequelize.INTEGER,
    }, {
      timestamps: false
    }
  )

  return Markers;
};