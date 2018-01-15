const permissions = require('express').Router();
const db = require('../../db/connect');
const log = require('../helpers/logger');

/**
 * @api {get} /company/permissions Get permissions tree
 * @apiVersion 1.0.0
 * @apiName GetPermissions
 * @apiGroup Company
 * @apiPermission owner
 *
 * @apiDescription This endpoint returns the permissions tree of the company. This tree is mostly used as a template for editing permissions.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/company/permissions
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiSuccess {json} data The permissions tree.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
permissions.get('/', (req, res) => {
  let queryString = 'SELECT perm FROM syn_user.permissions WHERE company_id = $1';

  db.query(queryString, [req.payload.companyId], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Error occurred while retrieving permissions.'
      });
    } else {
      // log.logActivity(req, 'Retrieved permissions');
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    }
  });
});

/**
 * @api {patch} /company/permissions Update permissions tree
 * @apiVersion 1.0.0
 * @apiName UpdatePermissions
 * @apiGroup Company
 * @apiPermission owner
 *
 * @apiDescription This endpoint returns the permissions tree of the company. This tree is mostly used as a template for editing permissions.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"brand": {"create": {"admin": true, "user": true}, "update": {...}}}'
 *      https://synergyims.me/api/company/permissions
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully updated company permissions."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidPermissionsTree The permissions tree must follow the exact structure.
 */
permissions.patch('/', validateBody, (req, res) => {
  let queryString = 'UPDATE syn_user.permissions SET perm = $2, modified_at = now() WHERE company_id = $1';

  db.query(queryString, [req.payload.companyId, req.body.permissions], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Error occurred while updating permissions.'
      });
    } else {
      log.logActivity(req, 'Updated permissions');
      res.status(200).json({
        success: true,
        message: 'Successfully updated company permissions.'
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
  if (req.body.permissions && req.body.permissions.constructor === {}.constructor) {
    let perm = req.body.permissions;
    let valid = true;

    for (let cat in perm) {
      if (perm.hasOwnProperty(cat) && ['brand', 'category', 'company', 'product', 'user', 'warehouse'].indexOf(cat) > -1) {
        if ((cat === 'company' && perm[cat].hasOwnProperty('read') && perm[cat].hasOwnProperty('update')) || (perm[cat].hasOwnProperty('read') && perm[cat].hasOwnProperty('create') && perm[cat].hasOwnProperty('update') && perm[cat].hasOwnProperty('delete'))) {
          for (let action in perm[cat]) {
            if (!perm[cat][action].hasOwnProperty('admin') || typeof(perm[cat][action]['admin']) !== 'boolean' || !perm[cat][action].hasOwnProperty('user') || typeof(perm[cat][action]['user']) !== 'boolean') {
              valid = false;
            }
          }
        } else {
          valid = false;
        }
      }
    }

    if (valid) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid permissions object in request body.'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing updated permissions object in request body.'
    });
  }
}


module.exports = permissions;
