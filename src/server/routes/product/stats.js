const stats = require('express').Router();
const db = require('../../db/connect');
const verify = require('../middlewares/verify');

/**
 * @api {get} /product/stats/graph Get inventory graph data
 * @apiVersion 1.0.0
 * @apiName GetStatsGraph
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint returns graph data of the caller's company inventory.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/product/stats/graph
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} [start] The epoch time of the start of the desired dataset.
 * @apiParam {Number} [end] The epoch time of the end of the desired dataset.
 *
 * @apiSuccess {json} data The list of inventory graph data.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
stats.get('/graph', verify.verifyPermissions('read product'), (req, res) => {
  let queryString = 'SELECT created_at AS date, inventory FROM syn_data.snapshots WHERE company_id = $1';
  let queryParams = [req.payload.companyId];

  if (!isNaN(parseInt(req.query.start))) {
    queryParams.append(req.query.start);
    queryString += ` AND EXTRACT(EPOCH FROM created_at) > $${queryParams.length}`;
  }
  if (!isNaN(parseInt(req.query.end))) {
    queryParams.append(req.query.end);
    queryString += ` AND EXTRACT(EPOCH FROM created_at) < $${queryParams.length}`;
  }

  db.query(queryString, queryParams, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Error while retrieving statistics.'
      });
    } else {
      res.status(200).json({
        success: true,
        data: result.rows
      });
    }
  });
});

module.exports = stats;
