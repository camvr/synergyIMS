/**
 * The router page.
 * Routes any requests to the server to their appropriate pages.
 */
const router = require('express').Router();

// Import routes
const authRouter = require('./auth/index');
const companyRouter = require('./company/index');
const productRouter = require('./product/index');
const categoryRouter = require('./category/index');
const brandRouter = require('./brand/index');
const userRouter = require('./user/index');
const warehouseRouter = require('./warehouse/index');

const verify = require('./middlewares/verify');

// Implement open routes into api router
router.use('/auth', authRouter);

// Implement protected routes into api router
router.use('/brand', verify.verifyToken, brandRouter);
router.use('/category', verify.verifyToken, categoryRouter);
router.use('/company', verify.verifyToken, companyRouter);
router.use('/product', verify.verifyToken, productRouter);
router.use('/user', verify.verifyToken, userRouter);
router.use('/warehouse', verify.verifyToken, warehouseRouter);

module.exports = router;
