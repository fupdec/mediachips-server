module.exports = function (db) {
  console.log(db.Media)
  // Retrieve all Media from the database.
  const findAll = function (req, res) {
    db.sequelize.query(req.body.query, {
      raw: true
    }).then(async data => {
      const total = await db.Media.findAndCountAll({
        where: {
          typeId: req.body.typeId,
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

  // Find a single Media with an id
  const countInItem = function (req, res) {
    db.Media.count({
      where: {
        typeId: req.query.typeId,
      },
      include: [{
        model: db.ItemsInMedia,
        where: {
          itemId: req.query.itemId
        },
        required: true
      }]
    }).then(number => {
      res.status(201).send({
        count: number
      })
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };

  // Update a Media by the id in the request
  const update = function (req, res) {
    db.Media.update(req.body, {
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
    findAll,
    countInItem,
    update,
  }
}