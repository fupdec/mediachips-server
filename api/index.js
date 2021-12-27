const path = require('path')
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../userfiles/databases', 'db.sqlite'),
  dialectOptions: {
    multipleStatements: true
  }
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const ChildMeta = require("./models/ChildMeta.model")(sequelize, Sequelize);
const Item = require("./models/Item.model")(sequelize, Sequelize);
const ItemsInItem = require("./models/ItemsInItem.model")(sequelize, Sequelize);
const ItemsInMedia = require("./models/ItemsInMedia.model")(sequelize, Sequelize);
const Marker = require("./models/Marker.model")(sequelize, Sequelize);
const Media = require("./models/Media.model")(sequelize, Sequelize);
const MediaType = require("./models/MediaType.model")(sequelize, Sequelize);
const Meta = require("./models/Meta.model")(sequelize, Sequelize);
const MetaInMediaType = require("./models/MetaInMediaType.model")(sequelize, Sequelize);
const MetaSetting = require("./models/MetaSetting.model")(sequelize, Sequelize);
const MetaState = require("./models/MetaState.model")(sequelize, Sequelize);
const Playlist = require("./models/Playlist.model")(sequelize, Sequelize);
const Setting = require("./models/Setting.model")(sequelize, Sequelize);
const ValuesInItem = require("./models/ValuesInItem.model")(sequelize, Sequelize);
const ValuesInMedia = require("./models/ValuesInMedia.model")(sequelize, Sequelize);
const VideoMetadata = require("./models/VideoMetadata.model")(sequelize, Sequelize);
const VideosInPlaylist = require("./models/VideosInPlaylist.model")(sequelize, Sequelize);
const WatchedFolder = require("./models/WatchedFolder.model")(sequelize, Sequelize);


// RELATIONS
MediaType.hasMany(Media, {
  foreignKey: 'typeId',
  onDelete: "cascade"
})
Media.belongsTo(MediaType, {
  foreignKey: 'typeId'
})

VideoMetadata.removeAttribute('id')
Media.hasOne(VideoMetadata, {
  onDelete: "cascade",
  foreignKey: 'mediaId'
})
VideoMetadata.belongsTo(Media, {
  foreignKey: 'mediaId'
})

VideosInPlaylist.removeAttribute('id')
Playlist.hasMany(VideosInPlaylist, {
  onDelete: "cascade",
  foreignKey: 'playlistId'
})
VideosInPlaylist.belongsTo(Playlist, {
  foreignKey: 'playlistId'
})
Media.hasMany(VideosInPlaylist, {
  onDelete: "cascade",
  foreignKey: 'mediaId'
})
VideosInPlaylist.belongsTo(Media, {
  foreignKey: 'mediaId'
})

MetaSetting.removeAttribute('id')
Meta.hasOne(MetaSetting, {
  foreignKey: 'metaId',
  onDelete: "cascade"
})
MetaSetting.belongsTo(Meta, {
  foreignKey: 'metaId'
})

MetaState.removeAttribute('id')
Meta.hasOne(MetaState, {
  foreignKey: 'metaId',
  onDelete: "cascade"
})
MetaState.belongsTo(Meta, {
  foreignKey: 'metaId'
})

MetaInMediaType.removeAttribute('id')
MediaType.belongsToMany(Meta, {
  through: MetaInMediaType,
  foreignKey: 'typeId',
  otherKey: 'metaId',
  unique: false
})

Meta.hasOne(Item, {
  foreignKey: 'metaId',
  onDelete: "cascade"
})
Item.belongsTo(Meta, {
  foreignKey: 'metaId'
})

ItemsInMedia.removeAttribute('id')
Item.hasMany(ItemsInMedia, {
  foreignKey: 'itemId',
  onDelete: "cascade"
})
ItemsInMedia.belongsTo(Item, {
  foreignKey: 'itemId'
})
Media.hasMany(ItemsInMedia, {
  foreignKey: 'mediaId',
  onDelete: "cascade"
})
ItemsInMedia.belongsTo(Media, {
  foreignKey: 'mediaId'
})

ValuesInMedia.removeAttribute('id')
Media.belongsToMany(Meta, {
  through: ValuesInMedia,
  foreignKey: 'mediaId',
  otherKey: 'metaId',
  unique: false
})

ItemsInItem.removeAttribute('id')
Item.hasMany(ItemsInItem, {
  foreignKey: 'itemId',
  onDelete: "cascade"
})
ItemsInItem.belongsTo(Item, {
  foreignKey: 'itemId'
})
Item.hasMany(ItemsInItem, {
  foreignKey: 'childItemId',
  onDelete: "cascade"
})
ItemsInItem.belongsTo(Item, {
  foreignKey: 'childItemId'
})

ValuesInItem.removeAttribute('id')
Item.belongsToMany(Meta, {
  through: ValuesInItem,
  foreignKey: 'itemId',
  otherKey: 'metaId',
  unique: false
})

Item.hasMany(Marker, {
  foreignKey: 'itemId',
  onDelete: "cascade"
})
Marker.belongsTo(Item, {
  foreignKey: 'itemId'
})
Media.hasMany(Marker, {
  foreignKey: 'mediaId',
  onDelete: "cascade"
})
Marker.belongsTo(Media, {
  foreignKey: 'mediaId'
})

ChildMeta.removeAttribute('id')
Meta.hasMany(ChildMeta, {
  foreignKey: 'metaId',
  onDelete: "cascade"
})
ChildMeta.belongsTo(Meta, {
  foreignKey: 'metaId'
})
Meta.hasMany(ChildMeta, {
  foreignKey: 'childMetaId',
  onDelete: "cascade"
})
ChildMeta.belongsTo(Meta, {
  foreignKey: 'childMetaId'
})

MediaType.hasMany(WatchedFolder, {
  foreignKey: 'typeId',
  onDelete: "cascade"
})
WatchedFolder.belongsTo(MediaType, {
  foreignKey: 'typeId'
})


db.ChildMeta = ChildMeta
db.Item = Item
db.ItemsInItem = ItemsInItem
db.ItemsInMedia = ItemsInMedia
db.Marker = Marker
db.Media = Media
db.MediaType = MediaType
db.Meta = Meta
db.MetaInMediaType = MetaInMediaType
db.MetaSetting = MetaSetting
db.MetaState = MetaState
db.Playlist = Playlist
db.Setting = Setting
db.ValuesInItem = ValuesInItem
db.ValuesInMedia = ValuesInMedia
db.VideoMetadata = VideoMetadata
db.VideosInPlaylist = VideosInPlaylist
db.WatchedFolder = WatchedFolder

module.exports = db;