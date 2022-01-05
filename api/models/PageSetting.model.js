module.exports = (sequelize, Sequelize) => {
  const PageSetting = sequelize.define(
    'pageSetting', {
      page: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      size: {
        type: Sequelize.INTEGER,
        defaultValue: 3,
      },
      view: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      limit: {
        type: Sequelize.INTEGER,
        defaultValue: 25,
      },
      sortBy: {
        type: Sequelize.TEXT,
        defaultValue: 'name',
      },
      sortDir: {
        type: Sequelize.TEXT,
        defaultValue: 'asc',
      },
      query: Sequelize.TEXT,
      firstChar: Sequelize.TEXT,
      colors: Sequelize.TEXT,
    }, {
      timestamps: false
    }
  )

  return PageSetting;
};