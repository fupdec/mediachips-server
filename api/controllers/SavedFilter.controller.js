const {
  SavedFilter,
  FilterRow,
  FilterRowsInSavedFilter,
  ItemsInFilterRow
} = require("../index.js");

// Create and Save a new SavedFilter
exports.create = (req, res) => {
  SavedFilter.create(req.body)
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Retrieve all SavedFilters from the database.
exports.findAll = (req, res) => {};

// Find a single SavedFilter with an id
exports.findOne = (req, res) => {
  SavedFilter
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

// Find a single SavedFilter with an id
exports.findOneForPage = (req, res) => {
  SavedFilter
    .findOne({
      where: {
        name: req.query.name ? req.query.name : null,
        metaId: req.query.metaId ? +req.query.metaId : null,
        typeId: req.query.typeId ? +req.query.typeId : null,
      }
    })
    .then(async data => {
      let filters = await FilterRowsInSavedFilter
        .findAll({
          where: {
            filterId: data.id,
          },
          include: [FilterRow],
        })

      for (let i of filters) {
        if (i.filterRow.type == 'array') {
          let vals = await ItemsInFilterRow
            .findAll({
              where: {
                rowId: i.filterRow.id,
              },
            })
          if (vals) i.filterRow.val = vals.map(i => i.itemId)
        }
      }

      res.status(201).send({
        filters,
        savedFilter: data
      })
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Update a SavedFilter by the id in the request
exports.update = (req, res) => {
  SavedFilter
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

// Delete a SavedFilter with the specified id in the request
exports.delete = (req, res) => {
  SavedFilter
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

// Delete all SavedFilters from the database.
exports.deleteAll = (req, res) => {};