const {
  FilterRow,
  FilterRowsInSavedFilter,
  ItemsInFilterRow
} = require("../index.js");

// Create and Save a new FilterRow
exports.create = async (req, res) => {
  let filterObj = req.body.filter
  let val = filterObj.val
  if (filterObj.type == 'array') filterObj.val = null

  const [filterRow, isCreated] = await FilterRow.findOrCreate({
    where: {
      id: req.body.rowId,
    },
    defaults: filterObj,
  })

  if (isCreated) {
    await FilterRowsInSavedFilter.create({
      filterId: req.body.filterId,
      rowId: filterRow.id
    })
  } else {
    await FilterRow.update(filterObj, {
      where: {
        id: req.body.rowId,
      },
    })
  }

  if (filterObj.type == 'array') {
    // deleting previously stored values
    await ItemsInFilterRow.destroy({
      where: {
        rowId: filterRow.id
      }
    })
    if (!filterObj.cond.includes('null'))
      for (let i of val) {
        await ItemsInFilterRow.findOrCreate({
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

// Retrieve all FilterRows from the database.
exports.findAll = (req, res) => {};

// Find a single FilterRow with an id
exports.findOne = (req, res) => {
  FilterRow
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
exports.update = (req, res) => {
  FilterRow
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
exports.delete = (req, res) => {
  FilterRow
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

// Delete all FilterRows from the database.
exports.deleteAll = (req, res) => {};