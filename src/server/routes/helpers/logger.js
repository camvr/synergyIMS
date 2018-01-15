const db = require('../../db/connect');

/**
 *
 * @param {String} req
 * @param {String} logString
 */
function logActivity(req, logString) {
  let queryString = 'INSERT INTO syn_user.activity_log (user_id, created_at, ip_address, log_data) VALUES ($1, now(), $2, $3)';

  db.query(queryString, [req.payload.userId, req.ip, logString], (err, res) => {
    if (err) {
      console.log('Error occured while logging data:\n' + err);
    }
  });
}

module.exports = {
  logActivity
};
