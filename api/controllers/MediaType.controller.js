module.exports = function (db) {
  // Retrieve all MediaType from the database.
  const findAll = function (req, res) {
    db.MediaType.findAll({
        raw: true
      })
      .then(data => {
        res.status(201).send(data)
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while performing query."
        })
      })
  };

  // Find a single MediaType with an id
  const findOne = function (req, res) {
    db.MediaType.findOne({
        where: {
          id: req.params.id
        },
        raw: true
      })
      .then(data => {
        res.status(201).send(data)
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while performing query."
        })
      })
  };

  return {
    findAll,
    findOne,
  }
}