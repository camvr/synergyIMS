const warehouse = require('express').Router();
const db = require('../../db/connect');
const verify = require('../middlewares/verify');
const log = require('../helpers/logger');

/**
 * @api {get} /warehouse Get warehouses
 * @apiVersion 1.0.0
 * @apiName GetWarehouses
 * @apiGroup Warehouse
 * @apiPermission None
 *
 * @apiDescription This endpoint returns the warehouses and their information that the user's company has stored.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      'https://synergyims.me/api/warehouse?limit=10&offset=0'
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} [limit] The number of entries to return (for pagination).
 * @apiParam {Number} [offset=0] The number of entries to offset the returned entries by (for pagination).
 *
 * @apiSuccess {json} data The list of warehouses.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
warehouse.get('/', verify.verifyPermissions('read warehouse'), (req, res) => {
  let queryParams = [req.payload.companyId];
  let queryString = 'SELECT * FROM syn_data.warehouses WHERE company_id = $1';

  if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
    queryParams = [req.payload.companyId, req.query.limit, req.query.offset];
    queryString = 'SELECT * FROM syn_data.warehouses WHERE company_id = $1 LIMIT $2 OFFSET $3';
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
        let warehouseList = result.rows;
        db.query('SELECT count(*) AS total FROM syn_data.warehouses WHERE company_id = $1;', [req.payload.companyId], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error occurred while connecting to the database.'
            });
          } else {
            // log.logActivity(req, 'Retrieved warehouses');
            res.status(200).json({
              success: true,
              data: {
                'warehouses': warehouseList,
                'total': result.rows[0]['total']
              }
            });
          }
        });
      } else {
        // log.logActivity(req, 'Retrieved warehouses');
        res.status(200).json({
          success: true,
          data: {'warehouses': result.rows[0]}
        });
      }
    }
  });
});

/**
 * @api {get} /warehouse/:id Get warehouse
 * @apiVersion 1.0.0
 * @apiName GetWarehouse
 * @apiGroup Warehouse
 * @apiPermission None
 *
 * @apiDescription This endpoint returns a specific warehouse based on the given warehouse id.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/warehouse/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the warehouse.
 *
 * @apiSuccess {json} data The warehouse info.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidID The provided id must be a valid number.
 */
warehouse.get('/:id', verify.verifyPermissions('read warehouse'), verify.validateID, (req, res) => {
  let queryString = 'SELECT * FROM syn_data.warehouses WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
      console.log(err);
    } else {
      // log.logActivity(req, 'Retrieved warehouse (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        data: result.rows
      });
    }
  });
});

/**
 * @api {post} /warehouse Create warehouse
 * @apiVersion 1.0.0
 * @apiName PostWarehouse
 * @apiGroup Warehouse
 * @apiPermission None
 *
 * @apiDescription This endpoint creates a warehouse with the provided information.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"warehouse_name": "Main Storehouse", "description": "Main warehouse for storage.", ...}'
 *      https://synergyims.me/api/warehouse
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} warehouse_name The name of the new warehouse.
 * @apiParam {String} description The description of the new warehouse.
 * @apiParam {String} phone The phone number of the new warehouse.
 * @apiParam {String} address The address of the new warehouses.
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
warehouse.post('/', verify.verifyPermissions('create warehouse'), validateBody, (req, res) => {
  let queryString = 'INSERT INTO syn_data.warehouses (warehouse_name, company_id, created_at, modified_at, description, phone, address) VALUES ($2, $1, now(), now(), $3, $4, $5)';

  db.query(queryString, [req.payload.companyId, req.body.warehouse_name, req.body.description, req.body.phone, req.body.address], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Created warehouse');
      res.status(201).json({
        success: true,
        message: 'Successfully inserted 1 row.'
      });
    }
  });
});

/**
 * @api {patch} /warehouse/:id Update warehouse
 * @apiVersion 1.0.0
 * @apiName PatchWarehouse
 * @apiGroup Warehouse
 * @apiPermission None
 *
 * @apiDescription This endpoint updates a warehouse with the provided information.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"warehouse_name": "Cold Room", "description": "Food chills here.", ...}'
 *      https://synergyims.me/api/warehouse/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the warehouse.
 * @apiParam {String} warehouse_name The new name of the warehouse.
 * @apiParam {String} description The new description of the warehouse.
 * @apiParam {String} phone The new phone number of the warehouse.
 * @apiParam {String} address The new address of the warehouses.
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
warehouse.patch('/:id', verify.verifyPermissions('update warehouse'), verify.validateID, validateBody, (req, res) => {
  let queryString = 'UPDATE syn_data.warehouses SET warehouse_name = $3, description = $4, phone = $5, address = $6, modified_at = now() WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id, req.body.warehouse_name, req.body.description, req.body.phone, req.body.address], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Updated warehouse (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        message: 'Successfully updated 1 row.'
      });
    }
  });
});

/**
 * @api {delete} /warehouse/:id Delete warehouse
 * @apiVersion 1.0.0
 * @apiName DeleteWarehouse
 * @apiGroup Warehouse
 * @apiPermission None
 *
 * @apiDescription This endpoint deletes a warehouse.
 *
 * @apiExample Example usage:
 * curl -X DELETE
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/warehouse/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the warehouse.
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
 * @apiError InvalidID The provided id must be a valid number.
 */
warehouse.delete('/:id', verify.verifyPermissions('delete warehouse'), verify.validateID, (req, res) => {
  let queryString = 'DELETE FROM syn_data.warehouses WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Deleted warehouse (id: ' + req.params.id + ')');
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
  if (req.body.warehouse_name && req.body.description && req.body.phone && req.body.address) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing or invalid parameters in request body.'
    });
  }
}


module.exports = warehouse;
