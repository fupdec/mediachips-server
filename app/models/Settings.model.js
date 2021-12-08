module.exports = (sequelize, Sequelize) => {
  const Settings = sequelize.define(
    'Settings', {
      passwordProtection: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      phrase: Sequelize.TEXT,
      passwordHint: Sequelize.TEXT,
      videoPreviewEnabled: Sequelize.BOOLEAN,
      videoPreviewStatic: {
        type: Sequelize.TEXT,
        defaultValue: 'thumb'
      },
      videoPreviewHover: {
        type: Sequelize.TEXT,
        defaultValue: 'video'
      },
      delayVideoPreview: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      appColorLightPrimary: {
        type: Sequelize.TEXT,
        defaultValue: '#FFB526'
      },
      appColorLightSecondary: {
        type: Sequelize.TEXT,
        defaultValue: '#098DFF'
      },
      appColorLightAccent: {
        type: Sequelize.TEXT,
        defaultValue: '#FF427F'
      },
      appColorLightHeader: {
        type: Sequelize.TEXT,
        defaultValue: '#FFE8F0'
      },
      appColorDarkPrimary: {
        type: Sequelize.TEXT,
        defaultValue: '#D37816'
      },
      appColorDarkSecondary: {
        type: Sequelize.TEXT,
        defaultValue: '#347EC5'
      },
      appColorDarkAccent: {
        type: Sequelize.TEXT,
        defaultValue: '#B8164A'
      },
      appColorDarkHeader: {
        type: Sequelize.TEXT,
        defaultValue: '#13505C'
      },
      headerGradientLight: {
        type: Sequelize.TEXT,
        defaultValue: 'linear-gradient(to right,#FFA400,#FF00C1)'
      },
      headerGradientDark: {
        type: Sequelize.TEXT,
        defaultValue: 'linear-gradient(to right,#0E227C,#910C3E)'
      },
      darkMode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      headerGradient: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      colorScroll: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      textFont: {
        type: Sequelize.TEXT,
        defaultValue: 'Roboto'
      },
      headerFont: {
        type: Sequelize.TEXT,
        defaultValue: 'Roboto'
      },
      navigationSide: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      numberOfPagesLimit: {
        type: Sequelize.INTEGER,
        defaultValue: 7
      },
      gapSize: {
        type: Sequelize.INTEGER,
        defaultValue: 2
      },
      isPlayVideoInSystemPlayer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      typingFiltersDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      watchFolders: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      selectedDisk: Sequelize.TEXT,
      zoom: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      checkForUpdatesAtStartup: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      showIconsOfMetaInEditingDialog: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      showEmptyMetaValueInCard: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      showIconsInsteadTextOnFiltersChips: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      showHeaderImageAboveProfile: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      showExperimentalFeatures: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      showSavedFilters: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      showAdultContent: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      registration: Sequelize.TEXT,
      databaseVersion: Sequelize.TEXT,
    }, {
      timestamps: false
    }
  )

  return Settings;
};