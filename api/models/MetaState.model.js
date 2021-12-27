module.exports = (sequelize, Sequelize) => {
  const MetaState = sequelize.define(
    'metaState', {
      query: Sequelize.TEXT,
      sortBy: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'name'
      },
      sortDirection: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'asc'
      },
      page: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      firstChar: Sequelize.TEXT,
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },
      view: Sequelize.INTEGER,
      perPage: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 20,
      },
      order: Sequelize.INTEGER,
      colors: Sequelize.INTEGER,
    }, {
      timestamps: false
    }
  )
  return MetaState;
};