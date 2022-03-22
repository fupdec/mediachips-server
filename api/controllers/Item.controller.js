module.exports = function (db) {
  // Create and Save a new Item
  const create = function (req, res) {
    db.Item.bulkCreate(req.body).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Retrieve all Item from the database.
  const findAll = function (req, res) {
    db.sequelize.query(req.body.query, {
      raw: true
    }).then(async data => {
      const total = await db.Item.findAndCountAll({
        where: {
          metaId: req.body.metaId,
        },
        raw: true
      })

      res.status(201).send({
        items: data[0],
        total: total.count,
      })
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };

  // Find a single Item with an id
  const findOne = function (req, res) {
    db.Item.findOne({
      where: {
        id: req.params.id
      }
    }).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };

  // Retrieve all Item from the database.
  const getAll = function (req, res) {
    db.Item.findAll({
      raw: true
    }).then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
  };
  
  // Retrieve all Item from the database.
  const rawQuery = function (req, res) {
    db.sequelize.query(req.body.query)
      .then(data => {
        res.status(201).send(data)
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving media."
        })
      })
  };

  // Update a Item by the id in the request
  const update = function (req, res) {
    db.Item.update(req.body, {
      where: {
        id: req.params.id,
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
    create,
    findAll,
    findOne,
    getAll,
    rawQuery,
    update,
  }
}