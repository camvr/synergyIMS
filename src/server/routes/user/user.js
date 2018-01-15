const user = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../../db/connect');
const verify = require('../middlewares/verify');
const log = require('../helpers/logger');
const auth = require('../auth/helpers');

/**
 * @api {get} /user Get users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint returns the users and their information for the caller's company.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      'https://synergyims.me/api/user?limit=10&offset=0'
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} [limit] The number of entries to return (for pagination).
 * @apiParam {Number} [offset=0] The number of entries to offset the returned entries by (for pagination).
 *
 * @apiSuccess {json} data The list of users.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
user.get('/', verify.verifyPermissions('read user'), (req, res) => {
  let queryParams = [req.payload.companyId];
  let queryString = 'SELECT * FROM syn_user.users WHERE company_id = $1';

  if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
    queryParams = [req.payload.companyId, req.query.limit, req.query.offset];
    queryString = 'SELECT * FROM syn_user.users WHERE company_id = $1 LIMIT $2 OFFSET $3';
  }

  db.query(queryString, queryParams, (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
      console.log(err);
    } else {
      let users = result.rows;
      for (let i = 0; i < users.length; i++) {
        delete users[i]['passhash'];
      }
      if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
        db.query('SELECT count(*) AS total FROM syn_user.users WHERE company_id = $1;', [req.payload.companyId], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error occurred while connecting to the database.'
            });
          } else {
            log.logActivity(req, 'Retrieved users');
            res.status(200).json({
              success: true,
              data: {
                'users': users,
                'total': result.rows[0]['total']
              }
            });
          }
        });
      } else {
        log.logActivity(req, 'Retrieved users');
        res.status(200).json({
          success: true,
          data: {'users': result.rows}
        });
      }
    }
  });
});


/**
 * @api {patch} /user/password Update user's password
 * @apiVersion 1.0.0
 * @apiName PatchUserPassword
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint updates the caller's user account password.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"password": "oldpassword", "new_password": "supersecret"}'
 *      https://synergyims.me/api/user/password
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} password The current password for the user's account.
 * @apiParam {String} new_password The new password for the user's account.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully updated user password."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidPassword The password provided did not match the password for the user.
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 */
user.patch('/password', auth.getUser, auth.authorizeUser, (req, res) => {
  if (req.body.password === req.body.new_password) {
    res.status(401).json({
      success: false,
      message: 'New password cannot be the current password.'
    });
  } else if (!req.body.new_password) {
    res.status(400).json({
      success: false,
      message: 'Missing new_password from request body.'
    });
  } else {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.new_password, salt);

    db.query('UPDATE syn_user.users SET passhash = $1 WHERE id = $2', [hash, req.payload.userId], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Internal server error while updating user info. Perhaps missing fields?'
        });
      } else {
        log.logActivity(req, 'Changed password');
        res.status(201).json({
          success: true,
          message: 'Successfully updated user password.'
        });
      }
    });
  }
});

/**
 * @api {get} /user/:id Get user
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint returns a specific user based on the given user id.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/user/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the user.
 *
 * @apiSuccess {json} data The user's account info.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidID The provided id must be a valid number.
 */
user.get('/:id', verify.validateID, verify.verifyPermissions('read user'), (req, res) => {
  let queryString = 'SELECT * FROM syn_user.users WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
      console.log(err);
    } else {
      let users = result.rows;
      for (let i = 0; i < users.length; i++) {
        delete users[i]['passhash'];
      }
      log.logActivity(req, 'Retrieved user (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        data: users
      });
    }
  });
});

/**
 * @api {post} /user Create user
 * @apiVersion 1.0.0
 * @apiName PostUser
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint manually creates a new user for the caller's company.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"account_type": "user", "first_name": "Josh", ...}'
 *      https://synergyims.me/api/user
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} account_type The type of account to create (must be "admin" or "user").
 * @apiParam {String} first_name The user's first name.
 * @apiParam {String} last_name The user's last name.
 * @apiParam {String} email The user's email address (must be unique).
 * @apiParam {String} phone The user's phone number.
 * @apiParam {String} employee_num The user's employee number.
 * @apiParam {String} password The user's account password.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully created company user."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 */
user.post('/', verify.verifyPermissions('create user'),
  (req, res, next) => {
    req.company_id = req.payload.companyId;
    if (!req.body.account_type || (req.body.account_type !== 'admin' && req.body.account_type !== 'user')) {
      console.log(req.body.account_type);
      res.status(400).json({
        success: false,
        message: 'account_type must be either "admin" or "user".'
      });
    } else {
      next();
    }
  }, auth.registerUser, (req, res) => {
    log.logActivity(req, 'Created user');
    res.status(201).json({
      success: true,
      message: 'Successfully created company user.'
    });
});


/**
 * @api {patch} /user Update user
 * @apiVersion 1.0.0
 * @apiName PatchUser
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint updates the caller's account information.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"account_type": "user", "first_name": "Josh", ...}'
 *      https://synergyims.me/api/user
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} account_type The type of account (must be "admin" or "user", "owner" accounts cannot change this).
 * @apiParam {String} first_name The user's first name.
 * @apiParam {String} last_name The user's last name.
 * @apiParam {String} email The user's email address (must be unique).
 * @apiParam {String} phone The user's phone number.
 * @apiParam {String} employee_num The user's employee number.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully updated user info."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 */
user.patch('/', validateUserInfo, (req, res) => {
  if (req.payload.accountType === 'owner') {
    req.body.account_type = 'owner'; // don't allow this value to be changed
  }

  let queryString = 'UPDATE syn_user.users SET account_type = $1, first_name = $2, last_name = $3, phone = $4, employee_num = $5 WHERE id = $6';

  db.query(queryString, [req.body.account_type, req.body.first_name, req.body.last_name, req.body.phone, req.body.employee_num, req.payload.userId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating user info. Perhaps missing fields?'
      });
    } else {
      log.logActivity(req, 'Updated account info');
      res.status(201).json({
        success: true,
        message: 'Successfully updated user info.'
      });
    }
  });
});


/**
 * @api {patch} /user/:id Update user by ID
 * @apiVersion 1.0.0
 * @apiName PatchUserID
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint updates a user's account information.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"account_type": "user", "first_name": "Josh", ...}'
 *      https://synergyims.me/api/user/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the user's account
 * @apiParam {String} account_type The type of account (must be "admin" or "user").
 * @apiParam {String} first_name The user's first name.
 * @apiParam {String} last_name The user's last name.
 * @apiParam {String} email The user's email address (must be unique).
 * @apiParam {String} phone The user's phone number.
 * @apiParam {String} employee_num The user's employee number.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully updated user info."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 * @apiError InvalidID The provided id must be a valid number.
 */
user.patch('/:id', verify.verifyPermissions('update user'), verify.validateID, validateUserInfo, (req, res) => {
  let queryString = 'UPDATE syn_user.users SET account_type = $1, first_name = $2, last_name = $3, phone = $4, employee_num = $5, email = $6 WHERE id = $7 AND NOT account_type = \'owner\'';

  db.query(queryString, [req.body.account_type, req.body.first_name, req.body.last_name, req.body.phone, req.body.employee_num, req.body.email, req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating user info. Perhaps missing fields?'
      });
    } else {
      log.logActivity(req, 'Updated user info (id: ' + req.params.id + ')');
      res.status(201).json({
        success: true,
        message: 'Successfully updated user info.'
      });
    }
  });
});

/**
 * @api {patch} /user/:id Update user's password by ID
 * @apiVersion 1.0.0
 * @apiName PatchUserPasswordID
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint updates a user's account password.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"password": "supersecret"}'
 *      https://synergyims.me/api/user/87/password
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the user's account
 * @apiParam {String} password The new password for the user's account.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully updated user password."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 * @apiError InvalidID The provided id must be a valid number.
 */
user.patch('/:id/password', verify.verifyPermissions('update user'), verify.validateID, (req, res) => {
  if (!req.body.new_password) {
    res.status(400).json({
      success: false,
      message: 'Missing new password from request body.'
    });
  } else {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(req.body.password, salt);

    db.query('UPDATE syn_user.users SET passhash = $1 WHERE id = $2 AND NOT account_type = \'owner\'', [hash, req.params.id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Internal server error while updating user info. Perhaps missing fields?'
        });
      } else {
        log.logActivity(req, 'Changed users password (id: ' + req.params.id + ')');
        res.status(201).json({
          success: true,
          message: 'Successfully updated user password.'
        });
      }
    });
  }
});

/**
 * @api {delete} /user/:id Delete user
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission None
 *
 * @apiDescription This endpoint deletes a user.
 *
 * @apiExample Example usage:
 * curl -X DELETE
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/user/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the user to delete.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       success: true,
 *       message: "User successfully deleted."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidID The provided id must be a valid number.
 */
user.delete('/:id', verify.verifyPermissions('delete user'), verify.validateID, (req, res) => {
  if (req.payload.userId === req.params.id) {
    res.status(403).json({
      success: false,
      message: 'Cannot delete your own account.'
    });
  } else {
    db.query('DELETE FROM syn_user.users WHERE id = $1 AND company_id = $2 AND NOT account_type = \'owner\'', [req.params.id, req.payload.companyId], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Error occurred while deleting user.'
        });
      } else {
        log.logActivity(req, 'Deleted user (id: ' + req.params.id + ')');
        res.status(200).json({
          success: true,
          message: 'User successfully deleted.'
        });
      }
    });
  }
});

/**
 * A function for validating the existance and type of body parameters.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {callback} next Callback function
 */
function validateUserInfo(req, res, next) {
  if (req.body.first_name && req.body.last_name && req.body.phone != null && req.body.employee_num != null && req.body.email && req.body.account_type) {
    if (req.body.account_type !== 'admin' && req.body.account_type !== 'user') {
      req.body.account_type = 'user';
    }
    let uid = req.params.id ? req.params.id : req.payload.userId;
    db.query('SELECT email FROM syn_user.users WHERE id = $1', [uid], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Internal server error while updating user info.'
        });
      } else if (req.body.email === result.rows[0].email) {
        next();
      } else {
        db.query('SELECT * FROM syn_user.users WHERE email = $1', [req.body.email], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error while updating user info.'
            });
          } else if (result.rows.length === 0) {
            next();
          } else {
            res.status(401).json({
              success: false,
              message: 'Registered user with specified email already exists.'
            });
          }
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing required values from request body.'
    });
  }
}

module.exports = user;
