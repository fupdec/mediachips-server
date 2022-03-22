module.exports = function (db) {
  // Create and Save a new Value
  const create = function (req, res) {
    db.ValuesInItem.bulkCreate(req.body).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Retrieve all Values from the database.
  const findAll = function (req, res) {
    if (!req.body) return res.sendStatus(400)

    db.ValuesInItem.findAll({
      where: {
        itemId: req.query.itemId
      },
      include: [db.Meta],
    }).then((data) => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Delete a Value with the specified id in the request
  const deleteOne = function (req, res) {
    db.ValuesInItem
      .destroy({
        where: {
          itemId: req.params.id
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