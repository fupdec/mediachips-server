module.exports = function (db) {
  // Create and Save a new ItemsInItem
  const create = function (req, res) {
    db.ItemsInItem.bulkCreate(req.body).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Retrieve all ItemsInItems from the database.
  const findAll = function (req, res) {
    db.ItemsInItem.findAll({
      where: {
        parentItemId: req.query.itemId
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

  // Delete a ItemsInItem with the specified id in the request
  const deleteOne = function (req, res) {
    db.ItemsInItem
      .destroy({
        where: {
          parentItemId: req.params.id
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

  return {
    create,
    findAll,
    deleteOne
  }
}