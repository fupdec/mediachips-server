module.exports = (sequelize, Sequelize) => {
  const Meta = sequelize.define(
    'Meta', {
      oldId: {
        type: Sequelize.TEXT,
        unique: true,
      },
      dataType: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      nameSingular: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      icon: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      hint: Sequelize.TEXT,
    }, {
      name: {
        singular: 'Meta',
        plural: 'Meta',
      },
    }
  )

  return Meta;
};