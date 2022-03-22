module.exports = function (db) {
  // Create and Save a new FilterRow
  const create = async function (req, res) {
    let filterObj = req.body.filter
    let val = filterObj.val
    if (filterObj.type == 'array') filterObj.val = null

    const [filterRow, isCreated] = await db.FilterRow.findOrCreate({
      where: {
        id: req.body.rowId,
      },
      defaults: filterObj,
    })

    if (isCreated) {
      await db.FilterRowsInSavedFilter.create({
        filterId: req.body.filterId,
        rowId: filterRow.id
      })
    } else {
      await db.FilterRow.update(filterObj, {
        where: {
          id: req.body.rowId,
        },
      })
    }

    if (filterObj.type == 'array') {
      // deleting previously stored values
      await db.ItemsInFilterRow.destroy({
        where: {
          rowId: filterRow.id
        }
      })
      if (!filterObj.cond.includes('null'))
        for (let i of val) {
          await db.ItemsInFilterRow.findOrCreate({
            where: {
              itemId: i,
              rowId: filterRow.id,
              metaId: filterRow.metaId
            }
          })
        }
    }
    res.sendStatus(201)
  };

  // Find a single FilterRow with an id
  const findOne = function (req, res) {
    db.FilterRow
      .findOne({
        where: {
          id: req.params.id
        }
      })
      .then(data => {
        res.status(201).send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while performing query."
        })
      })
  };

  // Update a FilterRow by the id in the request
  const update = function (req, res) {
    db.FilterRow
      .update(req.body, {
        where: {
          id: req.params.id
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

  // Delete a FilterRow with the specified id in the request
  const deleteOne = function (req, res) {
    db.FilterRow
      .destroy({
        where: {
          id: req.params.id
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
    findOne,
    update,
    deleteOne
  }
}