const express = require('express')
const jsonParser = express.json()
const path = require('path')
const history = require('connect-history-api-fallback')
const app = express()
const cors = require('cors')
const { Sequelize, DataTypes, Op } = require('sequelize')

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
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    hidden: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    nested: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    markers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bookmark: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    parser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    country: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    career: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    scraper: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    favorite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    chipOutlined: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    chipLabel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    color: {
      type: DataTypes.INTEGER,
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

const MetaItems = sequelize.define(
  'MetaItems', {
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bookmark: DataTypes.TEXT,
    country: DataTypes.TEXT,
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    viewedAt: DataTypes.DATE,
  }
)
Meta.hasOne(MetaItems, { foreignKey: 'metaId', onDelete: "cascade" })
MetaItems.belongsTo(Meta, { foreignKey: 'metaId' })

const MetaItemsInMedia = sequelize.define('MetaItemsInMedia', null, { timestamps: false })
MetaItemsInMedia.removeAttribute('id')
MetaItems.hasMany(MetaItemsInMedia, { foreignKey: 'itemId', onDelete: "cascade" })
MetaItemsInMedia.belongsTo(MetaItems, { foreignKey: 'itemId' })
Media.hasMany(MetaItemsInMedia, { foreignKey: 'mediaId', onDelete: "cascade" })
MetaItemsInMedia.belongsTo(Media, { foreignKey: 'mediaId' })

const MetaValuesForMedia = sequelize.define('MetaValuesForMedia', {value:DataTypes.TEXT}, {timestamps: false})
MetaValuesForMedia.removeAttribute('id')
Media.belongsToMany(Meta, { through: MetaValuesForMedia, foreignKey: 'mediaId', otherKey: 'metaId', unique: false })

// TODO fix it
const MetaItemsInMetaItems = sequelize.define('MetaItemsInMetaItems', null, { timestamps: false })
MetaItemsInMetaItems.removeAttribute('id')
Meta.belongsToMany(MetaItems, { through: MetaItemsInMetaItems, foreignKey: 'metaId', unique: false })
MetaItems.belongsToMany(Meta, { through: MetaItemsInMetaItems, foreignKey: 'itemId', unique: false })
Meta.belongsToMany(MetaItems, { through: MetaItemsInMetaItems, foreignKey: 'childMetaId', unique: false })
MetaItems.belongsToMany(Meta, { through: MetaItemsInMetaItems, foreignKey: 'childItemId', unique: false })

const MetaValuesForMetaItems = sequelize.define('MetaValuesForMetaItems', {value: DataTypes.TEXT}, {timestamps: false})
MetaValuesForMetaItems.removeAttribute('id')
MetaItems.belongsToMany(Meta, { through: MetaValuesForMetaItems, foreignKey: 'itemId', otherKey: 'metaId', unique: false })

const Markers = sequelize.define(
  'Markers', {
    type: DataTypes.TEXT,
    name: DataTypes.TEXT,
    time: DataTypes.INTEGER,
  }, {
    timestamps: false
  }
)
Markers.removeAttribute('id')
MetaItems.belongsToMany(Media, { through: Markers, foreignKey: 'itemId', otherKey: 'mediaId', unique: false })


sequelize.sync().then(()=>{
  // create media type: videos
  MediaTypes.findOrCreate({
    where: {
      type: 'Video',
    },
    defaults: {
      extensions: '.mp4'
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
    include: { all: true, nested: true }
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
    await Meta.bulkCreate(req.body.meta)
    for (let items of req.body.items) {
      for (let i in items) {
        const metaId = await Meta.findOne({ where: { oldId: i } })
        if (metaId === null) continue
        else {
          let newItems = items[i].map(it=>({...{metaId:metaId.id}, ...it}))
          await MetaItems.bulkCreate(newItems)
        }
      }
    }
    // res.status(201).send(allVideos)
  }).then(async () => { 
    for (let videoMeta of req.body.onlyMeta) {
      let obj = {}
      
      const mVideo = await Media.findOne({ where: { oldId: videoMeta.id } })
      if (mVideo === null) continue
      else obj.mediaId = mVideo.id
  
      let onlyMetaFields = Object.fromEntries(Object.entries(videoMeta).filter(([key]) => !key.includes('id')))
      for (let fieldName in onlyMetaFields) {
        const m = await Meta.findOne({ where: { oldId: fieldName } })
        if (m === null) continue
        else {
          obj.metaId = m.id
          if (m.dataType === 'array') {
            for (let item of onlyMetaFields[fieldName]) {
              const metaItem = await MetaItems.findOne({ where: { oldId: item } })
              if (metaItem === null) continue
              else {
                obj.itemId = metaItem.id
                try { await MetaItemsInMedia.create(obj)} 
                catch (e) { console.log('Query error: ', e) }
              } 
            }
          } else {
            obj.value = onlyMetaFields[fieldName]
            try { await MetaValuesForMedia.create(obj)} 
            catch (e) { console.log('Query error: ', e) }
          }
        }
      }
    }
  }).catch(e => { console.log(e) } )
})

// starting server
const port = 5555
app.listen(port, () => {
  console.info(`App started. Open in browser: http://localhost:${port}`);
})