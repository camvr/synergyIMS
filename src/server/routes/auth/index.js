const authRouter = require('express').Router();

const tokenAuth = require('./token');
const authHelpers = require('./helpers');
const verify = require('../middlewares/verify');

/**
 * @api {post} /auth/register Register a new company and user
 * @apiVersion 1.0.0
 * @apiName PostRegister
 * @apiGroup Auth
 * @apiPermission None
 *
 * @apiDescription This endpoint registers a new user as owner along with creating a new company for that user.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "Content-Type: application/json"
 *      -d '{"company_name": "Macrosoft", "address": "1280 Main St. W", "company_phone": "999-999-9999", ...}'
 *      https://synergyims.me/api/auth/register
 *
 * @apiParam {String} company_name The name of the new company.
 * @apiParam {String} address The address of the new company.
 * @apiParam {String} company_phone The phone number of the new company.
 * @apiParam {String} first_name The first name of the new user.
 * @apiParam {String} last_name The last name of the new user.
 * @apiParam {String} email The email address of the new user.
 * @apiParam {String} phone The phone number of the new user.
 * @apiParam {String} employee_num The employee number of the new user.
 * @apiParam {String} password The password of the new user.
 *
 * @apiSuccess {String} token The bearer token for the user to authenticate with.
 * @apiSuccess {Number} expires The epoch time of when the token expires.
 * @apiSuccess {JSON} user Info about the new user.
 *
 * @apiError MissingOrInvalidData The caller must provide all the parameters and as the correct type.
 * @apiError EmailAlreadyInUse The email address provided must be unique.
 */
authRouter.post('/register', authHelpers.registerCompany, authHelpers.registerUser, authHelpers.getUser, tokenAuth.generate, authHelpers.respond);

/**
 * @api {post} /auth/login Log a user in
 * @apiVersion 1.0.0
 * @apiName PostLogin
 * @apiGroup Auth
 * @apiPermission None
 *
 * @apiDescription This endpoint logs a user into the site and generates an access token for them if successful.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "Content-Type: application/json"
 *      -d '{"email": "josh@company.com", "password": "josh123"}'
 *      https://synergyims.me/api/auth/login
 *
 * @apiParam {String} email The email address of the user.
 * @apiParam {String} password The password of the user.
 *
 * @apiSuccess {String} token The bearer token for the user to authenticate with.
 * @apiSuccess {Number} expires The epoch time of when the token expires.
 * @apiSuccess {JSON} user Info about the new user.
 *
 * @apiError InvalidPassword The password provided did not match the password for the user.
 * @apiError UserNotFound No user with the provided email was found in the database.
 * @apiError MissingOrInvalidData The caller must provide all the parameters and as the correct type.
 */
authRouter.post('/login', authHelpers.getUser, authHelpers.authorizeUser, tokenAuth.generate, authHelpers.respond);

/**
 * @api {post} /auth/logout Log a user out
 * @apiVersion 1.0.0
 * @apiName PostLogout
 * @apiGroup Auth
 * @apiPermission None
 *
 * @apiDescription This endpoint logs a user out of the system and revokes their access token from being used further.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/auth/logout
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       success: true,
 *       message: "Successfully revoked access token."
 *     }
 *
 * @apiError MissingAccessToken A valid bearer token must be provided in the authorization header.
 */
authRouter.post('/logout', tokenAuth.revoke);

/**
 * @api {post} /auth/verify Verify a user's access token
 * @apiVersion 1.0.0
 * @apiName PostVerify
 * @apiGroup Auth
 * @apiPermission None
 *
 * @apiDescription This endpoint verifies the validity of a user's access token.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/auth/verify
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiSuccess {String} company_name The name of the user's registered company.
 * @apiSuccess {JSON} permissions The permissions tree of the user's registered company.
 * @apiSuccess {JSON} payload The decoded payload section of the user's provided access token.
 *
 * @apiError MissingAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidAccessToken The token provided by the user is either expired, revoked or invalid.
 */
authRouter.post('/verify', verify.verifyToken, authHelpers.getCompanyInfo);

module.exports = authRouter;
