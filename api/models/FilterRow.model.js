module.exports = (sequelize, Sequelize) => {
  const FilterRow = sequelize.define(
    'filterRow', {
      by: Sequelize.TEXT,
      type: Sequelize.TEXT,
      cond: Sequelize.TEXT,
      val: Sequelize.TEXT,
      flag: Sequelize.TEXT,
      lock: Sequelize.BOOLEAN,
      appbar: Sequelize.BOOLEAN,
      union: Sequelize.TEXT,
    }
  )

  return FilterRow;
};