const companyRouter = require('express').Router();
const company = require('./company');
const permissions = require('./permissions');
const activity = require('./activity');
const verify = require('../middlewares/verify');

companyRouter.use('/', company);
companyRouter.use('/permissions', verify.verifyAccessLevel('owner'), permissions);
companyRouter.use('/activity', verify.verifyAccessLevel('owner'), activity);

module.exports = companyRouter;
