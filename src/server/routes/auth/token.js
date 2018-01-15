const jwt = require('jsonwebtoken');
const db = require('../../db/connect');

/**
 * Function to generate a jwt token for the client
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {callback} next Callback function
 */
function generate(req, res, next) {
  const token = jwt.sign({
    userId: req.user.id,
    companyId: req.user.company_id,
    accountType: req.user.account_type
  }, process.env.TOKEN_SECRET, {
      expiresIn: '2h'
    });

  const expiry = jwt.decode(token, process.env.TOKEN_SECRET).exp;

  let queryString = 'INSERT INTO syn_auth.jwt_whitelist (token, expires_at) VALUES ($1, to_timestamp($2))';

  db.query(queryString, [token, expiry], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server while whitelisting access token.'
      });
    } else {
      req.token = token;
      req.expires = expiry;
      next();
    }
  });
}

/**
 * The function to revoke a token from the token whitelist
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 */
function revoke(req, res) {
  let bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    let bearerToken = bearerHeader.split(' ')[1];

    let queryString = 'DELETE FROM syn_auth.jwt_whitelist WHERE token = $1';

    db.query(queryString, [bearerToken], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Error occurred while revoking access token.'
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Successfully revoked access token.'
        });
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'No token specified.'
    });
  }
}

/**
 * The function to send back a decoded token.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 */
function respond(req, res) {
  res.status(200).json({
    success: true,
    payload: req.payload
  });
}


module.exports = {
  generate,
  revoke,
  respond
};
