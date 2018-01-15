const company = require('express').Router();
const db = require('../../db/connect');
const verify = require('../middlewares/verify');
const log = require('../helpers/logger');

/**
 * @api {get} /company Get company info
 * @apiVersion 1.0.0
 * @apiName GetCompany
 * @apiGroup Company
 * @apiPermission None
 *
 * @apiDescription This endpoint returns information about the caller's company.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/company
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiSuccess {json} data The company info.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
company.get('/', verify.verifyPermissions('read company'), (req, res) => {
  let queryString = 'SELECT * FROM syn_user.companies WHERE id = $1';

  db.query(queryString, [req.payload.companyId], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
      console.log(err);
    } else {
      // log.logActivity(req, 'Retrieved company info');
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    }
  });
});

/**
 * @api {patch} /company Update company info
 * @apiVersion 1.0.0
 * @apiName UpdateCompany
 * @apiGroup Company
 * @apiPermission None
 *
 * @apiDescription This endpoint updates information about the caller's company.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"address": "1280 Main St. W", "company_name": "Macrosoft", "phone": "999-999-9999"}'
 *      https://synergyims.me/api/company
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} address The new address of the company.
 * @apiParam {String} company_name The new name of the company.
 * @apiParam {String} phone The new phone number of the company.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       success: true,
 *       message: "Successfully updated 1 row."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError MissingOrInvalidData The caller must provide all the parameters and as the correct type.
 */
company.patch('/', verify.verifyPermissions('update company'), validateBody, (req, res) => {
  let queryString = 'UPDATE syn_user.companies SET address = $2, company_name = $3, modified_at = now(), phone = $4 WHERE id = $1';

  db.query(queryString, [req.payload.companyId, req.body.address, req.body.company_name, req.body.phone], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Updated company info');
      res.status(200).json({
        success: true,
        message: 'Successfully updated 1 row.'
      });
    }
  });
});

/**
 * @api {delete} /company Delete company and its info
 * @apiVersion 1.0.0
 * @apiName DeleteCompany
 * @apiGroup Company
 * @apiPermission Owner
 *
 * @apiDescription This endpoint deletes the caller's company and its related information.
 *
 * @apiExample Example usage:
 * curl -X DELETE
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/company
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       success: true,
 *       message: "Successfully deleted company and its data."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
company.delete('/', verify.verifyAccessLevel('owner'), (req, res) => {
  let queryString = 'DELETE FROM syn_user.companies WHERE id = $1;';

  db.query(queryString, [req.payload.companyId], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Successfully deleted company and its data.'
      });
      }
  });
});


/**
 * A function for validating the existance and type of body parameters.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {callback} next Callback function
 */
function validateBody(req, res, next) {
  if (req.body.address && req.body.company_name && req.body.phone) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing or invalid parameters in request body.'
    });
  }
}


module.exports = company;
