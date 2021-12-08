const path = require('path')
const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../userfiles/databases', 'db.sqlite'),
  dialectOptions: {
    multipleStatements: true
  },
  define: {
    freezeTableName: true
  }
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.ChildMeta = require("./models/ChildMeta.model")(sequelize, Sequelize);
db.Items = require("./models/Items.model")(sequelize, Sequelize);
db.ItemsInItems = require("./models/ItemsInItems.model")(sequelize, Sequelize);
db.ItemsInMedia = require("./models/ItemsInMedia.model")(sequelize, Sequelize);
db.Markers = require("./models/Markers.model")(sequelize, Sequelize);
db.Media = require("./models/Media.model")(sequelize, Sequelize);
db.MediaTypes = require("./models/MediaTypes.model")(sequelize, Sequelize);
db.Meta = require("./models/Meta.model")(sequelize, Sequelize);
db.MetaInMediaTypes = require("./models/MetaInMediaTypes.model")(sequelize, Sequelize);
db.MetaSettings = require("./models/MetaSettings.model")(sequelize, Sequelize);
db.MetaState = require("./models/MetaState.model")(sequelize, Sequelize);
db.Playlists = require("./models/Playlists.model")(sequelize, Sequelize);
db.Settings = require("./models/Settings.model")(sequelize, Sequelize);
db.ValuesInItems = require("./models/ValuesInItems.model")(sequelize, Sequelize);
db.ValuesInMedia = require("./models/ValuesInMedia.model")(sequelize, Sequelize);
db.VideoMetadata = require("./models/VideoMetadata.model")(sequelize, Sequelize);
db.VideosInPlaylist = require("./models/VideosInPlaylist.model")(sequelize, Sequelize);


// RELATIONS
db.MediaTypes.hasMany(db.Media, { foreignKey: 'typeId', onDelete: "cascade" })
db.Media.belongsTo(db.MediaTypes, { foreignKey: 'typeId' })

db.VideoMetadata.removeAttribute('id')
db.Media.hasOne(db.VideoMetadata, { onDelete: "cascade", foreignKey: 'mediaId' })
db.VideoMetadata.belongsTo(db.Media, { foreignKey: 'mediaId' })

db.VideosInPlaylist.removeAttribute('id')
db.Playlists.hasMany(db.VideosInPlaylist, { onDelete: "cascade", foreignKey: 'playlistId' })
db.VideosInPlaylist.belongsTo(db.Playlists, { foreignKey: 'playlistId' })
db.Media.hasMany(db.VideosInPlaylist, { onDelete: "cascade", foreignKey: 'mediaId' })
db.VideosInPlaylist.belongsTo(db.Media, { foreignKey: 'mediaId' })

db.MetaSettings.removeAttribute('id')
db.Meta.hasOne(db.MetaSettings, { foreignKey: 'metaId', onDelete: "cascade" })
db.MetaSettings.belongsTo(db.Meta, { foreignKey: 'metaId' })

db.MetaState.removeAttribute('id')
db.Meta.hasOne(db.MetaState, { foreignKey: 'metaId', onDelete: "cascade" })
db.MetaState.belongsTo(db.Meta, { foreignKey: 'metaId' })

db.MetaInMediaTypes.removeAttribute('id')
db.MediaTypes.belongsToMany(db.Meta, { through: db.MetaInMediaTypes, foreignKey: 'typeId', otherKey: 'metaId', unique: false })

db.Meta.hasOne(db.Items, { foreignKey: 'metaId', onDelete: "cascade" })
db.Items.belongsTo(db.Meta, { foreignKey: 'metaId' })

db.ItemsInMedia.removeAttribute('id')
db.Items.hasMany(db.ItemsInMedia, { foreignKey: 'itemId', onDelete: "cascade" })
db.ItemsInMedia.belongsTo(db.Items, { foreignKey: 'itemId' })
db.Media.hasMany(db.ItemsInMedia, { foreignKey: 'mediaId', onDelete: "cascade" })
db.ItemsInMedia.belongsTo(db.Media, { foreignKey: 'mediaId' })

db.ValuesInMedia.removeAttribute('id')
db.Media.belongsToMany(db.Meta, { through: db.ValuesInMedia, foreignKey: 'mediaId', otherKey: 'metaId', unique: false })

db.ItemsInItems.removeAttribute('id')
db.Items.hasMany(db.ItemsInItems, { foreignKey: 'itemId', onDelete: "cascade" })
db.ItemsInItems.belongsTo(db.Items, { foreignKey: 'itemId' })
db.Items.hasMany(db.ItemsInItems, { foreignKey: 'childItemId', onDelete: "cascade" })
db.ItemsInItems.belongsTo(db.Items, { foreignKey: 'childItemId' })

db.ValuesInItems.removeAttribute('id')
db.Items.belongsToMany(db.Meta, { through: db.ValuesInItems, foreignKey: 'itemId', otherKey: 'metaId', unique: false })

db.Items.hasMany(db.Markers, { foreignKey: 'itemId', onDelete: "cascade" })
db.Markers.belongsTo(db.Items, { foreignKey: 'itemId' })
db.Media.hasMany(db.Markers, { foreignKey: 'mediaId', onDelete: "cascade" })
db.Markers.belongsTo(db.Media, { foreignKey: 'mediaId' })

db.ChildMeta.removeAttribute('id')
db.Meta.hasMany(db.ChildMeta, { foreignKey: 'metaId', onDelete: "cascade" })
db.ChildMeta.belongsTo(db.Meta, { foreignKey: 'metaId' })
db.Meta.hasMany(db.ChildMeta, { foreignKey: 'childMetaId', onDelete: "cascade" })
db.ChildMeta.belongsTo(db.Meta, { foreignKey: 'childMetaId' })


module.exports = db;