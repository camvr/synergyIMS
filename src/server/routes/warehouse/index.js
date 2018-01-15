const warehouseRouter = require('express').Router();
const warehouse = require('./warehouse');

warehouseRouter.use('/', warehouse);

module.exports = warehouseRouter;
