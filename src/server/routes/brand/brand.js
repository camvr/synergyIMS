const brand = require('express').Router();
const db = require('../../db/connect');
const verify = require('../middlewares/verify');
const log = require('../helpers/logger');

/**
 * @api {get} /brand Get brands
 * @apiVersion 1.0.0
 * @apiName GetBrands
 * @apiGroup Brand
 * @apiPermission None
 *
 * @apiDescription This endpoint returns the brands and their information that the user's company has stored.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      'https://synergyims.me/api/brand?limit=10&offset=0'
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} [limit] The number of entries to return (for pagination).
 * @apiParam {Number} [offset=0] The number of entries to offset the returned entries by (for pagination).
 *
 * @apiSuccess {json} data The list of brands.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
brand.get('/', verify.verifyPermissions('read brand'), (req, res) => {
  let queryParams = [req.payload.companyId];
  let queryString = 'SELECT * FROM syn_data.brands WHERE company_id = $1';

  if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
    queryParams = [req.payload.companyId, req.query.limit, req.query.offset];
    queryString = 'SELECT * FROM syn_data.brands WHERE company_id = $1 LIMIT $2 OFFSET $3';
  }

  db.query(queryString, queryParams, (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
      console.log(err);
    } else {
      if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
        let brandsList = result.rows;
        db.query('SELECT count(*) AS total FROM syn_data.brands WHERE company_id = $1;', [req.payload.companyId], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error occurred while connecting to the database.'
            });
          } else {
            // log.logActivity(req, 'Retrieved brands');
            res.status(200).json({
              success: true,
              data: {
                'brands': brandsList,
                'total': result.rows[0]['total']
              }
            });
          }
        });
      } else {
        // log.logActivity(req, 'Retrieved brands');
        res.status(200).json({
          success: true,
          data: {'brands': result.rows[0]}
        });
      }
    }
  });
});

/**
 * @api {get} /brand/:id Get brand
 * @apiVersion 1.0.0
 * @apiName GetBrand
 * @apiGroup Brand
 * @apiPermission None
 *
 * @apiDescription This endpoint returns a specific brand based on the given brand id.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/brand/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the brand.
 *
 * @apiSuccess {json} data The brand info.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidID The provided id must be a valid number.
 */
brand.get('/:id', verify.verifyPermissions('read brand'), verify.validateID, (req, res) => {
  let queryString = 'SELECT * FROM syn_data.brands WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
      console.log(err);
    } else {
      // log.logActivity(req, 'Retrieved brand (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        data: result.rows
      });
    }
  });
});

/**
 * @api {post} /brand Create brand
 * @apiVersion 1.0.0
 * @apiName PostBrand
 * @apiGroup Brand
 * @apiPermission None
 *
 * @apiDescription This endpoint creates a brand with the provided information.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"brand_name": "Apple", "description": "Expensive stuff!"}'
 *      https://synergyims.me/api/brand
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} brand_name The name of the new brand.
 * @apiParam {String} description The description of the new brand.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully inserted 1 row."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 */
brand.post('/', verify.verifyPermissions('create brand'), validateBody, (req, res) => {
  let queryString = 'INSERT INTO syn_data.brands (brand_name, company_id, created_at, modified_at, description) VALUES ($2, $1, now(), now(), $3)';

  db.query(queryString, [req.payload.companyId, req.body.brand_name, req.body.description], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Created brand');
      res.status(201).json({
        success: true,
        message: 'Successfully inserted 1 row.'
      });
    }
  });
});

/**
 * @api {patch} /brand/:id Update brand
 * @apiVersion 1.0.0
 * @apiName PatchBrand
 * @apiGroup Brand
 * @apiPermission None
 *
 * @apiDescription This endpoint updates a brand with the provided information.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"brand_name": "Apple", "description": "Expensive stuff!"}'
 *      https://synergyims.me/api/brand/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the brand.
 * @apiParam {String} brand_name The new name of the brand.
 * @apiParam {String} description The new description of the brand.
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
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 * @apiError InvalidID The provided id must be a valid number.
 */
brand.patch('/:id', verify.verifyPermissions('update brand'), verify.validateID, validateBody, (req, res) => {
  let queryString = 'UPDATE syn_data.brands SET brand_name = $3, description = $4, modified_at = now() WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id, req.body.brand_name, req.body.description], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Updated brand (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        message: 'Successfully updated 1 row.'
      });
    }
  });
});

/**
 * @api {delete} /brand/:id Delete brand
 * @apiVersion 1.0.0
 * @apiName DeleteBrand
 * @apiGroup Brand
 * @apiPermission None
 *
 * @apiDescription This endpoint deletes a brand.
 *
 * @apiExample Example usage:
 * curl -X DELETE
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/brand/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the brand.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       success: true,
 *       message: "1 row successfully deleted."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
brand.delete('/:id', verify.verifyPermissions('delete brand'), verify.validateID, (req, res) => {
  let queryString = 'DELETE FROM syn_data.brands WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Deleted brand (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        message: '1 row successfully deleted.'
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
  if (req.body.brand_name && req.body.description) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing or invalid parameters in request body.'
    });
  }
}


module.exports = brand;
