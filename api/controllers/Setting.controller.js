module.exports = function (db) {
  // Find a single option with a name in the request
  const findAll = function (req, res) {
    db.Setting.findAll({
      raw: true
    }).then(async (data) => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };

  // Find a single option with a name in the request
  const findOne = function (req, res) {
    db.Setting.findOne({
      where: {
        option: req.params.option
      },
      raw: true
    }).then(async (data) => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };

  // Update a single option with a name and value in the request
  const update = function (req, res) {
    if (!req.body) return res.sendStatus(400)

    db.Setting.update({
      value: req.body.value
    }, {
      where: {
        option: req.params.option
      },
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
    findOne,
    update,
  }
}