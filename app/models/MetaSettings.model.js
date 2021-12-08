module.exports = (sequelize, Sequelize) => {
  const MetaSettings = sequelize.define(
    'MetaSettings', {
      synonyms: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      nested: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      markers: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      bookmark: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      parser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      country: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      career: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      scraper: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rating: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      chipOutlined: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      chipLabel: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      color: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      imageTypes: {
        type: Sequelize.TEXT,
        defaultValue: 'main',
      },
      imageAspectRatio: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1,
      },
    }, {
      timestamps: false
    }
  )

  return MetaSettings;
};