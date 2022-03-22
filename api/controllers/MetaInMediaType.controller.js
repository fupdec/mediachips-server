module.exports = function (db) {
  // Retrieve all MetaInMediaType from the database.
  const findAll = function (req, res) {
    db.MetaInMediaType.findAll({
      where: {
        typeId: req.query.typeId
      },
      include: [{
        model: db.Meta,
        include: [db.MetaSetting]
      }],
    }).then((data) => {
      res.status(201).send(data)
    }).catch(err => {
      console.log(err)
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Update a MetaInMediaType by the id in the request
  const update = function (req, res) {
    db.MetaInMediaType.update(req.body.data, {
      where: {
        metaId: req.body.metaId,
        typeId: req.body.typeId
      }
    }).then((data) => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };

  return {
    findAll,
    update,
  }
}