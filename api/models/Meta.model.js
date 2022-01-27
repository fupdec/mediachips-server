module.exports = (sequelize, Sequelize) => {
  const Meta = sequelize.define(
    'meta', {
      type: Sequelize.TEXT,
      name: Sequelize.TEXT,
      nameSingular: Sequelize.TEXT,
      icon: Sequelize.TEXT,
      hint: Sequelize.TEXT,
      order: Sequelize.INTEGER,
      oldId: Sequelize.TEXT,
    }, {
      name: {
        singular: 'meta',
        plural: 'meta',
      },
    }
  )

  return Meta;
};