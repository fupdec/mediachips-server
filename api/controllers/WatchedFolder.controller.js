const {
  MediaTypesInWatchedFolders,
  WatchedFolder
} = require("../index.js");

// Create and Save a new Folder
exports.create = async (req, res) => {
  const {
    folder,
    types
  } = req.body

  const [folderRow, isCreated] = await WatchedFolder.findOrCreate({
    where: {
      path: folder.path,
    },
    defaults: {
      name: folder.name
    },
  })

  if (!isCreated) WatchedFolder
    .update({
      name: folder.name
    }, {
      where: {
        id: folderRow.id
      }
    })

  await MediaTypesInWatchedFolders.destroy({
    where: {
      folderId: folderRow.id
    }
  })

  for (let i of types) {
    await MediaTypesInWatchedFolders.findOrCreate({
      where: {
        folderId: folderRow.id,
        typeId: i
      }
    })
  }
  res.sendStatus(201)
};

// Retrieve all Folders from the database.
exports.findAll = (req, res) => {};

// Find a single Folder with an id
exports.findOne = (req, res) => {};

// Update a Folder by the id in the request
exports.update = (req, res) => {
  WatchedFolder
    .update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete a Folder with the specified id in the request
exports.delete = (req, res) => {
  WatchedFolder
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete all Folders from the database.
exports.deleteAll = (req, res) => {};