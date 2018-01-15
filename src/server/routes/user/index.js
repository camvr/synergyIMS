const userRouter = require('express').Router();
const user = require('./user');

userRouter.use('/', user);

module.exports = userRouter;
