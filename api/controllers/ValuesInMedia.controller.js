module.exports = function (db) {
  // Create and Save a new ValuesInMedia
  const create = function (req, res) {
    db.ValuesInMedia.bulkCreate(req.body).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Retrieve all ValuesInMedia from the database.
  const findAll = function (req, res) {
    if (!req.body) return res.sendStatus(400)

    db.ValuesInMedia.findAll({
      where: {
        mediaId: req.query.mediaId
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

  // Delete a ValuesInMedia with the specified id in the request
  const deleteOne = function (req, res) {
    db.ValuesInMedia.destroy({
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
    create,
    findAll,
    deleteOne
  }
}