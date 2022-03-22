module.exports = function (db) {
  // Create many items in media
  const bulkCreate = function (req, res) {
    db.ItemsInMedia.bulkCreate(req.body).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Create and Save a new ItemsInMedia
  const create = function (req, res) {
    db.ItemsInMedia.findOrCreate({
      where: req.body
    }).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Retrieve all ItemsInMedia from the database.
  const findAll = function (req, res) {
    if (!req.body) return res.sendStatus(400)

    db.ItemsInMedia.findAll({
      where: {
        mediaId: req.query.mediaId
      },
      include: [{
        model: db.Item,
        attributes: ['name', 'color', 'metaId'],
        include: [{
          model: db.Meta,
          attributes: ['name', 'icon'],
        }],
      }],
    }).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Delete a ItemsInMedia with the specified id in the request
  const deleteOne = function (req, res) {
    db.ItemsInMedia.destroy({
      where: {
        mediaId: req.params.id
      }
    }).then(() => {
      res.sendStatus(201)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  return {
    bulkCreate,
    create,
    findAll,
    deleteOne
  }
}