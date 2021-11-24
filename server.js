const express = require('express')
const jsonParser = express.json()
const path = require('path')
const history = require('connect-history-api-fallback')
const app = express()
const cors = require('cors')
const { Sequelize, DataTypes } = require('sequelize')

app.use(express.json({limit: '100mb'}))
app.use(cors())

const sequelize = new Sequelize({ 
  dialect: 'sqlite', 
  storage: 'db.sqlite',
  dialectOptions: {
    multipleStatements: true
  },
  define: {
    freezeTableName: true
  }
})

try {
  sequelize.authenticate()
  console.log('DB connected')
} catch (e) {
  console.log('DB connection error: ', e)
}

const Settings = sequelize.define(
  'Settings', {
    passwordProtection: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phrase: DataTypes.TEXT,
    passwordHint: DataTypes.TEXT,
    videoPreviewEnabled: DataTypes.BOOLEAN,
    videoPreviewStatic: {
      type: DataTypes.TEXT,
      defaultValue: 'thumb'
    },
    videoPreviewHover: {
      type: DataTypes.TEXT,
      defaultValue: 'video'
    },
    delayVideoPreview: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    appColorLightPrimary: {
      type: DataTypes.TEXT,
      defaultValue: '#FFB526'
    },
    appColorLightSecondary: {
      type: DataTypes.TEXT,
      defaultValue: '#098DFF'
    },
    appColorLightAccent: {
      type: DataTypes.TEXT,
      defaultValue: '#FF427F'
    },
    appColorLightHeader: {
      type: DataTypes.TEXT,
      defaultValue: '#FFE8F0'
    },
    appColorDarkPrimary: {
      type: DataTypes.TEXT,
      defaultValue: '#D37816'
    },
    appColorDarkSecondary: {
      type: DataTypes.TEXT,
      defaultValue: '#347EC5'
    },
    appColorDarkAccent: {
      type: DataTypes.TEXT,
      defaultValue: '#B8164A'
    },
    appColorDarkHeader: {
      type: DataTypes.TEXT,
      defaultValue: '#13505C'
    },
    headerGradientLight: {
      type: DataTypes.TEXT,
      defaultValue: 'linear-gradient(to right,#FFA400,#FF00C1)'
    },
    headerGradientDark: {
      type: DataTypes.TEXT,
      defaultValue: 'linear-gradient(to right,#0E227C,#910C3E)'
    },
    darkMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    headerGradient: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    colorScroll: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    textFont: {
      type: DataTypes.TEXT,
      defaultValue: 'Roboto'
    },
    headerFont: {
      type: DataTypes.TEXT,
      defaultValue: 'Roboto'
    },
    navigationSide: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    numberOfPagesLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 7
    },
    gapSize: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },
    isPlayVideoInSystemPlayer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    typingFiltersDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    watchFolders: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    selectedDisk: DataTypes.TEXT,
    zoom: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    checkForUpdatesAtStartup: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    showIconsOfMetaInEditingDialog: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    showEmptyMetaValueInCard: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    showIconsInsteadTextOnFiltersChips: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    showHeaderImageAboveProfile: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    showExperimentalFeatures: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    showSavedFilters: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    showAdultContent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    registration: DataTypes.TEXT,
    databaseVersion: DataTypes.TEXT,
  }, {
    timestamps: false
  }
)

const MediaTypes = sequelize.define(
  'MediaTypes', {
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    extensions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    timestamps: false
  }
)

const Media = sequelize.define(
  'Media', {
    path: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    filesize: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    bookmark: DataTypes.TEXT,
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    oldId: {
      type: DataTypes.TEXT,
      unique: true,
    },
    viewedAt: DataTypes.DATE,
  }, {
    name: {
      singular: 'Media',
      plural: 'Media',
    },
  }
)
MediaTypes.hasMany(Media, { foreignKey: 'typeId', onDelete: "cascade" })
Media.belongsTo(MediaTypes, { foreignKey: 'typeId' })

const VideoMetadata = sequelize.define(
  'VideoMetadata', {
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    width: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    bitrate: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    fps: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    codec: DataTypes.TEXT,
  }, {
    name: {
      singular: 'VideoMetadata',
      plural: 'VideoMetadata',
    },
    timestamps: false
  }
)
VideoMetadata.removeAttribute('id')
Media.hasOne(VideoMetadata, { onDelete: "cascade", foreignKey: 'mediaId' })
VideoMetadata.belongsTo(Media, { foreignKey: 'mediaId' })

const Playlists = sequelize.define(
  'Playlists', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    oldId: {
      type: DataTypes.TEXT,
      unique: true,
    },
    viewedAt: DataTypes.DATE,
  }, {
    name: {
      singular: 'Playlist',
      plural: 'Playlists',
    },
  }
)

const VideosInPlaylist = sequelize.define(
  'VideosInPlaylist', null, {
    name: {
      singular: 'VideosInPlaylist',
      plural: 'VideosInPlaylist',
    },
    timestamps: false
  }
)
VideosInPlaylist.removeAttribute('id')
Playlists.hasMany(VideosInPlaylist, { onDelete: "cascade", foreignKey: 'playlistId' })
VideosInPlaylist.belongsTo(Playlists, { foreignKey: 'playlistId' })
Media.hasMany(VideosInPlaylist, { onDelete: "cascade", foreignKey: 'mediaId' })
VideosInPlaylist.belongsTo(Media, { foreignKey: 'mediaId' })

const Meta = sequelize.define(
  'Meta', {
    oldId: {
      type: DataTypes.TEXT,
      unique: true,
    },
    dataType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nameSingular: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hint: DataTypes.TEXT,
  }, {
    name: {
      singular: 'Meta',
      plural: 'Meta',
    },
  }
)

const MetaSettings = sequelize.define(
  'MetaSettings', {
    synonyms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    nested: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    markers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    bookmark: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    parser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    country: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    career: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    scraper: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    chipOutlined: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    chipLabel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    color: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    imageTypes: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '["main"]',
    },
    imageAspectRatio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    timestamps: false
  }
)
MetaSettings.removeAttribute('id')
Meta.hasOne(MetaSettings, { foreignKey: 'metaId', onDelete: "cascade" })
MetaSettings.belongsTo(Meta, { foreignKey: 'metaId' })

const MetaState = sequelize.define(
  'MetaState', {
    query: DataTypes.TEXT,
    sortBy: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'name'
    },
    sortDirection: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'asc'
    },
    page: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    firstChar: DataTypes.TEXT,
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    view: DataTypes.INTEGER,
    perPage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20,
    },
    order: DataTypes.INTEGER,
    colors: DataTypes.INTEGER,
  }, {
    timestamps: false
  }
)
MetaState.removeAttribute('id')
Meta.hasOne(MetaState, { foreignKey: 'metaId', onDelete: "cascade" })
MetaState.belongsTo(Meta, { foreignKey: 'metaId' })

const MetaInMediaTypes = sequelize.define('MetaInMediaTypes', null, {timestamps: false})
MetaInMediaTypes.removeAttribute('id')
MediaTypes.belongsToMany(Meta, { through: MetaInMediaTypes, foreignKey: 'typeId', otherKey: 'metaId', unique: false })

const Items = sequelize.define(
  'Items', {
    oldId: {
      type: DataTypes.TEXT,
      unique: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    synonyms: DataTypes.TEXT,
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    bookmark: DataTypes.TEXT,
    country: DataTypes.TEXT,
    color: DataTypes.TEXT,
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    viewedAt: DataTypes.DATE,
  }
)
Meta.hasOne(Items, { foreignKey: 'metaId', onDelete: "cascade" })
Items.belongsTo(Meta, { foreignKey: 'metaId' })

const ItemsInMedia = sequelize.define('ItemsInMedia', null, { timestamps: false })
ItemsInMedia.removeAttribute('id')
Items.hasMany(ItemsInMedia, { foreignKey: 'itemId', onDelete: "cascade" })
ItemsInMedia.belongsTo(Items, { foreignKey: 'itemId' })
Media.hasMany(ItemsInMedia, { foreignKey: 'mediaId', onDelete: "cascade" })
ItemsInMedia.belongsTo(Media, { foreignKey: 'mediaId' })

const ValuesForMedia = sequelize.define('ValuesForMedia', {value:DataTypes.TEXT}, {timestamps: false})
ValuesForMedia.removeAttribute('id')
Media.belongsToMany(Meta, { through: ValuesForMedia, foreignKey: 'mediaId', otherKey: 'metaId', unique: false })

const ItemsInItems = sequelize.define('ItemsInItems', null, { timestamps: false })
ItemsInItems.removeAttribute('id')
Items.hasMany(ItemsInItems, { foreignKey: 'itemId', onDelete: "cascade" })
ItemsInItems.belongsTo(Items, { foreignKey: 'itemId' })
Items.hasMany(ItemsInItems, { foreignKey: 'childItemId', onDelete: "cascade" })
ItemsInItems.belongsTo(Items, { foreignKey: 'childItemId' })

const ValuesForItems = sequelize.define('ValuesForItems', {value: DataTypes.TEXT}, {timestamps: false})
ValuesForItems.removeAttribute('id')
Items.belongsToMany(Meta, { through: ValuesForItems, foreignKey: 'itemId', otherKey: 'metaId', unique: false })

const Markers = sequelize.define(
  'Markers', {
    type: DataTypes.TEXT,
    text: DataTypes.TEXT,
    time: DataTypes.INTEGER,
  }, {
    timestamps: false
  }
)
Items.hasMany(Markers, { foreignKey: 'itemId', onDelete: "cascade" })
Markers.belongsTo(Items, { foreignKey: 'itemId' })
Media.hasMany(Markers, { foreignKey: 'mediaId', onDelete: "cascade" })
Markers.belongsTo(Media, { foreignKey: 'mediaId' })

const ChildMeta = sequelize.define('ChildMeta', {scraperField: DataTypes.TEXT,}, {timestamps: false})
ChildMeta.removeAttribute('id')
Meta.hasMany(ChildMeta, { foreignKey: 'metaId', onDelete: "cascade" })
ChildMeta.belongsTo(Meta, { foreignKey: 'metaId' })
Meta.hasMany(ChildMeta, { foreignKey: 'childMetaId', onDelete: "cascade" })
ChildMeta.belongsTo(Meta, { foreignKey: 'childMetaId' })

sequelize.sync().then(async ()=>{
  // create media type: videos
  await MediaTypes.findOrCreate({
    where: {
      type: 'Video',
    },
    defaults: {
      extensions: '.mp4'
    }
  })
  await Settings.findOrCreate({
    where: {
      id: 1,
    },
    defaults: {
    }
  })
})


// using vue's built as static files
const src = path.join(__dirname, 'dist') 
const staticFileMiddleware = express.static(src)
app.use(staticFileMiddleware)
app.use(history({ disableDotRule: true, verbose: true }))
app.use(staticFileMiddleware)


// REST api
app.get('/api/db', async (req, res) => {
  if(!req.body) return res.sendStatus(400)
  const allVideos = await Media.findAll({
    where: {
      typeId: 1,
    },
    limit: 100,
    offset: 0,
    include: { all: true }
  })
  res.status(201).send(allVideos)
})
app.post('/api/db', async (req, res) => {
  // await Media.create({ path: 'defpath' })
  res.status(201).send({message: "Added new video"})
})

// importing videos from JSON
app.post('/api/import', jsonParser, async (req, res) => {
  if(!req.body) return res.sendStatus(400)
  Media.bulkCreate(req.body.videos).then(async () => { 
    await VideoMetadata.bulkCreate(req.body.videoMetadata)
    // for (let video of req.body.videoMetadata) {
    //   const media = await Media.findOne({ where: { oldId: video.oldId } })
    //   if (media === null) continue
    //   else await VideoMetadata.create({...{mediaId:media.id}, ...video})
    // }
  }).then(async () => { 
    await Settings.update(req.body.settings, { where: { id: 1 }})
  }).then(async () => { 
    await Meta.bulkCreate(req.body.meta)
    for (let items of req.body.items) {
      for (let i in items) {
        const metaId = await Meta.findOne({ where: { oldId: i } })
        if (metaId === null) continue
        else {
          let newItems = items[i].map(it=>({...{metaId:metaId.id}, ...it}))
          await Items.bulkCreate(newItems)
        }
      }
    }
  }).then(async () => { 
    await Playlists.bulkCreate(req.body.playlists)
  }).then(async () => { 
    for (let playlist of req.body.playlists) {
      const p = await Playlists.findOne({ where: { oldId: playlist.oldId } })
      if (p === null) continue
      for (let i of playlist.videos) {
        const media = await Media.findOne({ where: { oldId: i } })
        if (media === null) continue
        else await VideosInPlaylist.create({playlistId: p.id, mediaId: media.id})
      }
    }
  }).then(async () => { 
    for (let marker of req.body.markers) {
      const media = await Media.findOne({ where: { oldId: marker.videoId } })
      if (media === null) continue
      else marker.mediaId = media.id
      if (marker.type === 'meta') {
        const metaItem = await Items.findOne({ where: { oldId: marker.oldItemId } })
        if (media === null) continue
        else marker.itemId = metaItem.id
      }
      await Markers.create(marker)
    }
  }).then(async () => { // meta in videos
    for (let videoMeta of req.body.onlyMeta) {
      const mVideo = await Media.findOne({ where: { oldId: videoMeta.id } })
      if (mVideo === null) continue
  
      let onlyMetaFields = Object.fromEntries(Object.entries(videoMeta).filter(([key]) => !key.includes('id')))
      for (let fieldName in onlyMetaFields) {
        const m = await Meta.findOne({ where: { oldId: fieldName } })
        if (m === null) continue
        else {
          let val = onlyMetaFields[fieldName]
          if (m.dataType === 'array') {
            for (let item of val) {
              const metaItem = await Items.findOne({ where: { oldId: item } })
              if (metaItem === null) continue
              else {
                try { await ItemsInMedia.create({
                  metaId: m.id,
                  mediaId: mVideo.id,
                  itemId: metaItem.id
                })} 
                catch (e) { console.log('Query error: ', e) }
              } 
            }
          } else {
            try { await ValuesForMedia.create({
              value: val,
              metaId: m.id,
              mediaId: mVideo.id,
            })} 
            catch (e) { console.log('Query error: ', e) }
          }
        }
      }
    }
  }).then(async () => { // meta in metaItems
    for (let card of req.body.metaInItems) {
      for (let cardId in card) {
        const metaItem = await Items.findOne({ where: { oldId: cardId } })
        if (metaItem === null) continue
        for (let key in card[cardId]) {
          const metaOfItem = await Meta.findOne({ where: { oldId: key } })
          if (metaOfItem === null) continue
          let val = card[cardId][key]
          if (metaOfItem.dataType === 'array') {
            for (let itemOldId of val) {
              const childItem = await Items.findOne({ where: { oldId: itemOldId } })
              if (childItem === null) continue
              else {
                try { await ItemsInItems.create({
                  itemId: metaItem.id,
                  childItemId: childItem.id
                })} 
                catch (e) { console.log('Query error: ', e) }
              } 
            }
          } else {
            try { await ValuesForItems.create({
              value: val,
              metaId: metaOfItem.id,
              itemId: metaItem.id
            })} 
            catch (e) { console.log('Query error: ', e) }
          }
        }
      }
    }
    res.status(201).send({message: "All data has been successfully imported."})
  }).catch(e => { console.log(e) } )
})

// starting server
const port = 5555
app.listen(port, () => {
  console.info(`App started. Open in browser: http://localhost:${port}`);
})