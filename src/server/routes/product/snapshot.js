const snapshot = require('express').Router();
const db = require('../../db/connect');
const verify = require('../middlewares/verify');
const log = require('../helpers/logger');

/**
 * @api {get} /product/snapshot Get snapshots
 * @apiVersion 1.0.0
 * @apiName GetSnapshots
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint returns the inventory snapshots for the caller's company.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      'https://synergyims.me/api/product/snapshot?limit=10&offset=0'
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} [sort_by] The column to sort the data by.
 * @apiParam {Boolean} [desc=false] Sort the data in descending order.
 * @apiParam {Number} [limit] The number of logs to return (for pagination).
 * @apiParam {Number} [offset=0] The number of entries to offset the returned entries by (for pagination).
 *
 * @apiSuccess {json} data The list of snapshots.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
snapshot.get('/', verify.verifyPermissions('read product'), (req, res) => {
  let queryParams = [req.payload.companyId];
  let queryString = 'SELECT * FROM syn_data.snapshots WHERE company_id = $1';

  if (req.query.sort_by) {
    let sortColumns = {'created_at': 'created_at'};
    if (sortColumns[req.query.sort_by]) {
      queryString += ' ORDER BY ' + sortColumns[req.query.sort_by];
      if (req.query.desc === 'true') { // Descending
        queryString += ' DESC';
      }
    }
  }

  if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
    queryParams.push(req.query.limit, req.query.offset);
    queryString += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
  }

  db.query(queryString, queryParams, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
        let snapshotList = result.rows;
        let queryParams = [req.payload.companyId];
        let queryString = 'SELECT count(*) AS total FROM syn_data.snapshots WHERE company_id = $1';

        if (req.query.search) {
          queryParams.push(req.query.search);
          queryString += ' AND item_name LIKE $2';
        }

        db.query(queryString, queryParams, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error occurred while connecting to the database.'
            });
          } else {
            // log.logActivity(req, 'Retrieved snapshots');
            res.status(200).json({
              success: true,
              data: {
                'snapshots': snapshotList,
                'total': result.rows[0]['total']
              }
            });
          }
        });
      } else {
        // log.logActivity(req, 'Retrieved snapshots');
        res.status(200).json({
          success: true,
          data: {'snapshots': result.rows}
        });
      }
    }
  });
});

/**
 * @api {get} /product/snapshot/:id Get snapshot
 * @apiVersion 1.0.0
 * @apiName GetSnapshot
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint returns a specific inventory snapshot based on the given snapshot id.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/product/snapshot/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the snapshot.
 *
 * @apiSuccess {json} data The inventory snapshot.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidID The provided id must be a valid number.
 */
snapshot.get('/:id', verify.verifyPermissions('read product'), verify.validateID, (req, res) => {
  let queryString = 'SELECT * FROM syn_data.snapshots WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      // log.logActivity(req, 'Retrieved snapshot (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    }
  });
});

/**
 * @api {post} /product/snapshot Create inventory snapshot
 * @apiVersion 1.0.0
 * @apiName PostSnapshot
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint creates a snapshot of the current inventory.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/product/snapshot
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully recorded inventory snapshot"
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
snapshot.post('/', verify.verifyPermissions('create product'), (req, res) => {
  let queryString = 'SELECT * FROM syn_data.products WHERE company_id = $1';

  db.query(queryString, [req.payload.companyId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      let productsSnapshot = result.rows;
      let queryString = 'INSERT INTO syn_data.snapshots (company_id, inventory) VALUES ($1, $2)';

      db.query(queryString, [req.payload.companyId, JSON.stringify(productsSnapshot)], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'Internal server error occurred while connecting to the database.'
          });
        } else {
          log.logActivity(req, 'Created snapshot');
          res.status(201).json({
            success: true,
            message: 'Successfully recorded inventory snapshot.'
          });
        }
      });
    }
  });
});

module.exports = snapshot;
