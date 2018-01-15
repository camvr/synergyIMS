const categoryRouter = require('express').Router();
const category = require('./category');

categoryRouter.use('/', category);

module.exports = categoryRouter;
