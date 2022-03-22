module.exports = function (db) {
  // Create and Save a new ChildMeta
  const create = function (req, res) {
    db.ChildMeta.create(req.body)
      .then(data => {
        res.status(201).send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while performing query."
        })
      })
  };

  // Retrieve all ChildMetas from the database.
  const findAll = function (req, res) {
    db.ChildMeta.findAll({
      where: {
        metaId: req.query.metaId
      },
      include: [{
        model: db.Meta,
        include: [db.MetaSetting]
      }],
    }).then(async (data) => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };

  // Update a ChildMeta by the id in the request
  const update = function (req, res) {
    db.ChildMeta.update(req.body.data, {
      where: {
        metaId: req.body.metaId,
        childMetaId: req.body.childMetaId
      }
    }).then((data) => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };

  // Delete a ChildMeta with the specified id in the request
  const deleteOne = function (req, res) {
    db.ChildMeta
      .destroy({
        where: {
          childMetaId: parseInt(req.params.id),
          metaId: parseInt(req.query.metaId)
        },
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

  return {
    create,
    findAll,
    update,
    deleteOne,
  }
}