const activity = require('express').Router();
const db = require('../../db/connect');

/**
 * @api {get} /company/activity Get company activity logs
 * @apiVersion 1.0.0
 * @apiName GetActivity
 * @apiGroup Company
 * @apiPermission Owner
 *
 * @apiDescription This endpoint returns the activity logs of the caller's company.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      'https://synergyims.me/api/company?limit=10&offset=0'
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} [sort_by] The column to sort the data by.
 * @apiParam {Boolean} [desc=false] Sort the data in descending order.
 * @apiParam {Number} [limit] The number of logs to return (for pagination).
 * @apiParam {Number} [offset=0] The number of entries to offset the returned entries by (for pagination).
 *
 * @apiSuccess {json} data The company activity logs.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
activity.get('/', (req, res) => {
  let queryParams = [req.payload.companyId];
  let queryString = 'SELECT * FROM syn_user.activity_log WHERE user_id IN (SELECT id FROM syn_user.users WHERE company_id = $1)';

  /* Disabled for the time being
  if (req.query.search) {
    queryParams.push(req.query.search);
    queryString += ' AND item_name LIKE $2';
  }
  */

  if (req.query.sort_by) {
    let sortColumns = {'user_id': 'user_id', 'created_at': 'created_at', 'ip_address': 'ip_address', 'log_data': 'log_data'};
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

  db.query(queryString, queryParams, (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Error occurred while retrieving permissions.'
      });
    } else {
      if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
        let logs = result.rows;
        let queryString = 'SELECT count(*) AS total FROM syn_user.activity_log WHERE user_id IN (SELECT id FROM syn_user.users WHERE company_id = $1)';
        db.query(queryString, [req.payload.companyId], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error occurred while connecting to the database.'
            });
          } else {
            res.status(200).json({
              success: true,
              data: {
                'logs': logs,
                'total': result.rows[0]['total']
              }
            });
          }
        });
      } else {
        res.status(200).json({
          success: true,
          data: {'logs': result.rows}
        });
      }
    }
  });
});

module.exports = activity;
