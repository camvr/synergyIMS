const moment = require('moment');
const jwt = require('jsonwebtoken');
const db = require('../../db/connect');

/**
 * The function to verify if a client's jwt token is valid.
 * @param {JSON} req The information from the user, containing the token.
 * @param {JSON} res The response to the client if it fails.
 * @param {function} next Callback function.
 */
function verifyToken(req, res, next) {
  let bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    let bearerToken = bearerHeader.split(' ')[1];

    jwt.verify(bearerToken, process.env.TOKEN_SECRET, (err, pay) => {
      const now = moment().unix();

      if (err) {
        res.status(401).json({
          success: false,
          message: 'Invalid access token.'
        });
      } else if (now > pay.exp) {
        res.status(401).json({
          success: false,
          message: 'Access token is expired.'
        });
      } else {
        queryString = 'SELECT * FROM syn_auth.jwt_whitelist WHERE token = $1';

        db.query(queryString, [bearerToken], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Error occurred while checking token whitelist.'
            });
          } else if (result.rows.length === 0) {
            res.status(401).json({
              success: false,
              message: 'Token invalid or revoked.'
            });
          } else { // successfully verified
            req.payload = pay;
            next();
          }
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'No access token provided.'
    });
  }
}

/**
 * The function to verify a user has the privileges needed to access a task.
 * @param {string} task The task that the current user wants to access.
 * @return {function} The cached function for checking the permissions
 */
function verifyPermissions(task) {
  return verifyPermissions[task] || (verifyPermissions[task] = (req, res, next) => {
    if (req.payload.accountType === 'owner') {
      next(); // owners have all permissions
    } else if (task === 'read user' && req.payload.userId === req.params.id) {
      next(); // special case for reading own user
    } else {
      let permAction = task.split(' ')[0].toLowerCase();
      let permSection = task.split(' ')[1].toLowerCase();

      let queryString = 'SELECT perm -> $2 -> $3 AS perm FROM syn_user.permissions WHERE company_id = $1';

      db.query(queryString, [req.payload.companyId, permSection, permAction], (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            success: false,
            message: 'Error retrieving company permissions.'
          });
        } else if ([req.payload.accountType] === undefined) {
          res.status(404).json({
            success: false,
            message: 'Permissions for this action are not specified.'
          });
        } else {
          if (req.payload.accountType === 'admin' && result.rows[0].perm.admin || req.payload.accountType === 'user' && result.rows[0].perm.user) {
            next(); // proper permissions
          } else {
            res.status(401).json({
              success: false,
              message: 'User does not have access permissions.'
            });
          }
        }
      });
    }
  });
}

/**
 * Function to check task privileges against client privileges.
 * @param {string} level The access level of the user.
 * @return {function} The cached function for verifying the access level specified
 */
function verifyAccessLevel(level) {
  return verifyAccessLevel[level] || (verifyAccessLevel[level] = (req, res, next) => {
    if (req.payload.accountType === 'owner' || (level === 'admin' && req.payload.accountType === level) || level === 'user') {
      next();
    } else {
      res.status(401).json({
        success: false,
        message: 'You do not have high enough privileges.'
      });
    }
  });
}

/**
 * A function for validating the request ID parameter.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {function} next Callback function
 */
function validateID(req, res, next) {
  if (!isNaN(parseInt(req.params.id))) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid value for ID. Must be an integer!'
    });
  }
}

module.exports = {
  verifyToken,
  verifyPermissions,
  verifyAccessLevel,
  validateID
};
