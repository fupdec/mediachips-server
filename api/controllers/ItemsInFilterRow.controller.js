module.exports = function (db) {
  // Retrieve all ItemsInFilterRow from the database.
  const findAll = function (req, res) {
    db.ItemsInFilterRow.findAll({
      where: {
        rowId: req.query.rowId
      },
      include: [db.Item],
      raw: true
    }).then((data) => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
  };
  
  return {
    findAll,
  }
}