const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const db = {};

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  const ChildMeta = require("./models/ChildMeta.model")(sequelize, Sequelize);
  const FilterRow = require("./models/FilterRow.model")(sequelize, Sequelize);
  const FilterRowsInSavedFilter = require("./models/FilterRowsInSavedFilter.model")(sequelize, Sequelize);
  const Item = require("./models/Item.model")(sequelize, Sequelize);
  const ItemsInFilterRow = require("./models/ItemsInFilterRow.model")(sequelize, Sequelize);
  const ItemsInItem = require("./models/ItemsInItem.model")(sequelize, Sequelize);
  const ItemsInMedia = require("./models/ItemsInMedia.model")(sequelize, Sequelize);
  const Mark = require("./models/Mark.model")(sequelize, Sequelize);
  const Media = require("./models/Media.model")(sequelize, Sequelize);
  const MediaType = require("./models/MediaType.model")(sequelize, Sequelize);
  const MediaTypesInWatchedFolders = require("./models/MediaTypesInWatchedFolders.model")(sequelize, Sequelize);
  const Meta = require("./models/Meta.model")(sequelize, Sequelize);
  const MetaInMediaType = require("./models/MetaInMediaType.model")(sequelize, Sequelize);
  const MetaSetting = require("./models/MetaSetting.model")(sequelize, Sequelize);
  const PageSetting = require("./models/PageSetting.model")(sequelize, Sequelize);
  const SavedFilter = require("./models/SavedFilter.model")(sequelize, Sequelize);
  const Setting = require("./models/Setting.model")(sequelize, Sequelize);
  const Tab = require("./models/Tab.model")(sequelize, Sequelize);
  const ValuesInItem = require("./models/ValuesInItem.model")(sequelize, Sequelize);
  const ValuesInMedia = require("./models/ValuesInMedia.model")(sequelize, Sequelize);
  const VideoMetadata = require("./models/VideoMetadata.model")(sequelize, Sequelize);
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

  MetaSetting.removeAttribute('id')
  Meta.hasOne(MetaSetting, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  MetaSetting.belongsTo(Meta, {
    foreignKey: 'metaId'
  })

  PageSetting.removeAttribute('id')
  Meta.hasMany(PageSetting, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  PageSetting.belongsTo(Meta, {
    foreignKey: 'metaId'
  })
  MediaType.hasMany(PageSetting, {
    foreignKey: 'typeId',
    onDelete: "cascade"
  })
  PageSetting.belongsTo(MediaType, {
    foreignKey: 'typeId'
  })
  Item.hasMany(PageSetting, {
    foreignKey: 'itemId',
    onDelete: "cascade"
  })
  PageSetting.belongsTo(Item, {
    foreignKey: 'itemId'
  })

  MetaInMediaType.removeAttribute('id')
  Meta.hasMany(MetaInMediaType, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  MetaInMediaType.belongsTo(Meta, {
    foreignKey: 'metaId'
  })
  MediaType.hasMany(MetaInMediaType, {
    foreignKey: 'typeId',
    onDelete: "cascade"
  })
  MetaInMediaType.belongsTo(MediaType, {
    foreignKey: 'typeId'
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
  Meta.hasMany(ItemsInMedia, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  ItemsInMedia.belongsTo(Meta, {
    foreignKey: 'metaId'
  })

  ValuesInMedia.removeAttribute('id')
  Meta.hasMany(ValuesInMedia, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  ValuesInMedia.belongsTo(Meta, {
    foreignKey: 'metaId'
  })
  Media.hasMany(ValuesInMedia, {
    foreignKey: 'mediaId',
    onDelete: "cascade"
  })
  ValuesInMedia.belongsTo(Media, {
    foreignKey: 'mediaId'
  })

  ItemsInItem.removeAttribute('id')
  Item.hasMany(ItemsInItem, {
    foreignKey: 'parentItemId',
    onDelete: "cascade"
  })
  ItemsInItem.belongsTo(Item, {
    foreignKey: 'parentItemId'
  })
  Item.hasMany(ItemsInItem, {
    foreignKey: 'itemId',
    onDelete: "cascade"
  })
  ItemsInItem.belongsTo(Item, {
    foreignKey: 'itemId'
  })
  Meta.hasMany(ItemsInItem, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  ItemsInItem.belongsTo(Meta, {
    foreignKey: 'metaId'
  })

  ValuesInItem.removeAttribute('id')
  Meta.hasMany(ValuesInItem, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  ValuesInItem.belongsTo(Meta, {
    foreignKey: 'metaId'
  })
  Item.hasMany(ValuesInItem, {
    foreignKey: 'itemId',
    onDelete: "cascade"
  })
  ValuesInItem.belongsTo(Item, {
    foreignKey: 'itemId'
  })

  Item.hasMany(Mark, {
    foreignKey: 'itemId',
    onDelete: "cascade"
  })
  Mark.belongsTo(Item, {
    foreignKey: 'itemId'
  })
  Media.hasMany(Mark, {
    foreignKey: 'mediaId',
    onDelete: "cascade"
  })
  Mark.belongsTo(Media, {
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

  MediaTypesInWatchedFolders.removeAttribute('id')
  WatchedFolder.hasMany(MediaTypesInWatchedFolders, {
    foreignKey: 'folderId',
    onDelete: "cascade"
  })
  MediaTypesInWatchedFolders.belongsTo(WatchedFolder, {
    foreignKey: 'folderId'
  })
  MediaType.hasMany(MediaTypesInWatchedFolders, {
    foreignKey: 'typeId',
    onDelete: "cascade"
  })
  MediaTypesInWatchedFolders.belongsTo(MediaType, {
    foreignKey: 'typeId'
  })

  Meta.hasMany(FilterRow, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  FilterRow.belongsTo(Meta, {
    foreignKey: 'metaId'
  })

  Meta.hasMany(SavedFilter, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  SavedFilter.belongsTo(Meta, {
    foreignKey: 'metaId'
  })
  MediaType.hasMany(SavedFilter, {
    foreignKey: 'typeId',
    onDelete: "cascade"
  })
  SavedFilter.belongsTo(MediaType, {
    foreignKey: 'typeId'
  })
  Item.hasMany(SavedFilter, {
    foreignKey: 'itemId',
    onDelete: "cascade"
  })
  SavedFilter.belongsTo(Item, {
    foreignKey: 'itemId'
  })
  SavedFilter.hasMany(PageSetting, {
    foreignKey: 'filterId',
    onDelete: "cascade"
  })
  PageSetting.belongsTo(SavedFilter, {
    foreignKey: 'filterId'
  })

  FilterRowsInSavedFilter.removeAttribute('id')
  SavedFilter.hasMany(FilterRowsInSavedFilter, {
    foreignKey: 'filterId',
    onDelete: "cascade"
  })
  FilterRowsInSavedFilter.belongsTo(SavedFilter, {
    foreignKey: 'filterId'
  })
  FilterRow.hasMany(FilterRowsInSavedFilter, {
    foreignKey: 'rowId',
    onDelete: "cascade"
  })
  FilterRowsInSavedFilter.belongsTo(FilterRow, {
    foreignKey: 'rowId'
  })

  ItemsInFilterRow.removeAttribute('id')
  Item.hasMany(ItemsInFilterRow, {
    foreignKey: 'itemId',
    onDelete: "cascade"
  })
  ItemsInFilterRow.belongsTo(Item, {
    foreignKey: 'itemId'
  })
  Meta.hasMany(ItemsInFilterRow, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  ItemsInFilterRow.belongsTo(Meta, {
    foreignKey: 'metaId'
  })
  FilterRow.hasMany(ItemsInFilterRow, {
    foreignKey: 'rowId',
    onDelete: "cascade"
  })
  ItemsInFilterRow.belongsTo(FilterRow, {
    foreignKey: 'rowId'
  })

  Meta.hasMany(Tab, {
    foreignKey: 'metaId',
    onDelete: "cascade"
  })
  Tab.belongsTo(Meta, {
    foreignKey: 'metaId'
  })
  MediaType.hasMany(Tab, {
    foreignKey: 'typeId',
    onDelete: "cascade"
  })
  Tab.belongsTo(MediaType, {
    foreignKey: 'typeId'
  })
  Item.hasMany(Tab, {
    foreignKey: 'itemId',
    onDelete: "cascade"
  })
  Tab.belongsTo(Item, {
    foreignKey: 'itemId'
  })
  Tab.hasMany(PageSetting, {
    foreignKey: 'tabId',
    onDelete: "cascade"
  })
  PageSetting.belongsTo(Tab, {
    foreignKey: 'tabId'
  })
  Tab.hasMany(SavedFilter, {
    foreignKey: 'tabId',
    onDelete: "cascade"
  })
  SavedFilter.belongsTo(Tab, {
    foreignKey: 'tabId'
  })


  db.ChildMeta = ChildMeta
  db.FilterRow = FilterRow
  db.FilterRowsInSavedFilter = FilterRowsInSavedFilter
  db.Item = Item
  db.ItemsInFilterRow = ItemsInFilterRow
  db.ItemsInItem = ItemsInItem
  db.ItemsInMedia = ItemsInMedia
  db.Mark = Mark
  db.Media = Media
  db.MediaType = MediaType
  db.MediaTypesInWatchedFolders = MediaTypesInWatchedFolders
  db.Meta = Meta
  db.MetaInMediaType = MetaInMediaType
  db.MetaSetting = MetaSetting
  db.PageSetting = PageSetting
  db.SavedFilter = SavedFilter
  db.Setting = Setting
  db.Tab = Tab
  db.ValuesInItem = ValuesInItem
  db.ValuesInMedia = ValuesInMedia
  db.VideoMetadata = VideoMetadata
  db.WatchedFolder = WatchedFolder

  return db
}