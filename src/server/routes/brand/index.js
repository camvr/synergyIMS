const brandRouter = require('express').Router();
const brand = require('./brand');

brandRouter.use('/', brand);

module.exports = brandRouter;
