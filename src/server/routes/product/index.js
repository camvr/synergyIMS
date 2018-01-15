const productRouter = require('express').Router();
const product = require('./product');
const snapshot = require('./snapshot');
const stats = require('./stats');

productRouter.use('/snapshot', snapshot);
productRouter.use('/stats', stats);
productRouter.use('/', product);

module.exports = productRouter;
