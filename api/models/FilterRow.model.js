module.exports = (sequelize, Sequelize) => {
  const FilterRow = sequelize.define(
    'filterRow', {
      by: Sequelize.TEXT,
      type: Sequelize.TEXT,
      cond: Sequelize.TEXT,
      lock: Sequelize.BOOLEAN,
      flag: Sequelize.TEXT,
      union: Sequelize.TEXT,
    }
  )

  return FilterRow;
};