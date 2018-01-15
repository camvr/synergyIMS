const bcrypt = require('bcryptjs');
const db = require('../../db/connect');

/**
 * Function to register a company through http request.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {callback} next Callback function
 */
function registerCompany(req, res, next) {
  if (!req.body.company_name || !req.body.address || !req.body.company_phone) {
    res.status(400).json({
      success: false,
      message: 'Missing required values in body.'
    });
  } else {
    let queryString = 'WITH inserted AS (INSERT INTO syn_user.companies (company_name, address, phone, created_at, modified_at) VALUES ($1, $2, $3, now(), now()) returning *) SELECT inserted.id FROM inserted';
    db.query(queryString, [req.body.company_name, req.body.address, req.body.company_phone], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Error occurred while registering company. Perhaps missing fields?'
        });
      } else {
        req.company_id = result.rows[0]['id'];

        // Create permissions
        let queryString = 'INSERT INTO syn_user.permissions (company_id, modified_at, perm) VALUES ($1, now(), $2)';
        let defaultPerm = {
          'brand': {
            'create': {'admin': true, 'user': true},
            'read': {'admin': true, 'user': true},
            'update': {'admin': true, 'user': true},
            'delete': {'admin': true, 'user': true}
          },
          'category': {
            'create': {'admin': true, 'user': true},
            'read': {'admin': true, 'user': true},
            'update': {'admin': true, 'user': true},
            'delete': {'admin': true, 'user': true}
          },
          'company': {
            'read': {'admin': true, 'user': true},
            'update': {'admin': true, 'user': false}
          },
          'product': {
            'create': {'admin': true, 'user': true},
            'read': {'admin': true, 'user': true},
            'update': {'admin': true, 'user': true},
            'delete': {'admin': true, 'user': true}
          },
          'user': {
            'create': {'admin': true, 'user': false},
            'read': {'admin': true, 'user': false},
            'update': {'admin': true, 'user': false},
            'delete': {'admin': true, 'user': false}
          },
          'warehouse': {
            'create': {'admin': true, 'user': false},
            'read': {'admin': true, 'user': true},
            'update': {'admin': true, 'user': false},
            'delete': {'admin': true, 'user': false}
          }
        };
        db.query(queryString, [req.company_id, JSON.stringify(defaultPerm)], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Error occurred while creating permissions.'
            });
          } else {
            next();
          }
        });
      }
    });
  }
}

/**
 * The function to register a user to a company
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {callback} next Callback function
 */
function registerUser(req, res, next) {
  let queryString = 'SELECT * FROM syn_user.users WHERE email = $1;';

  db.query(queryString, [req.body.email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error while registering user. Perhaps missing fields?'
      });
    } else if (result.rows.length === 0) {
      if (req.body.password && req.body.first_name && req.body.last_name && req.body.email && req.body.phone && req.body.employee_num) {
        let accounType = req.body.account_type ? req.body.account_type : 'owner';
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(req.body.password, salt);

        let queryString = 'INSERT INTO syn_user.users (company_id, account_type, first_name, last_name, email, phone, employee_num, passhash) VALUES ($1, $8, $2, $3, $4, $5, $6, $7)';

        db.query(queryString, [req.company_id, req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.employee_num, hash, accounType], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error while registering user. Perhaps missing fields?'
            });
          } else {
            next();
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Missing account data in request body.'
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: 'Registered user with email already exists.'
      });
    }
  });
}

/**
 * The function for getting information on a user
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {callback} next Callback function
 */
function getUser(req, res, next) {
  let queryParams = [];
  let queryString = '';

  if (req.body.email) {
    queryParams = [req.body.email];
    queryString = 'SELECT * FROM syn_user.users WHERE email = $1';
  } else if (req.payload.userId || req.body.id) {
    queryParams = req.payload.userId ? [req.payload.userId] : [req.body.id];
    queryString = 'SELECT * FROM syn_user.users WHERE id = $1';
  }

  if (queryParams === []) {
    res.status(400).json({
      success: false,
      message: 'User identifier missing.'
    });
  } else {
    db.query(queryString, queryParams, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          message: 'Internal server error.'
        });
      } else if (result.rows.length === 0) {
        res.status(401).json({
          success: false,
          message: 'Could not find the user with specified email or id.'
        });
      } else {
        req.user = result.rows[0];
        next();
      }
    });
  }
}

/**
 * The authorization function for checking if a user's password is correct.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 * @param {callback} next Callback function
 */
function authorizeUser(req, res, next) {
  if (req.body.password) {
    const candidate = req.body.password;
    const trusted = req.user.passhash;
    const match = bcrypt.compareSync(candidate, trusted);
    if (!match) {
      res.status(401).json({
        success: false,
        message: 'Invalid password.'
      });
    } else {
      next();
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing password in body parameters.'
    });
  }
}

/**
 * The function to grab the name of the company and it's permissions.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 */
function getCompanyInfo(req, res) {
  let queryString = 'SELECT company_name, perm FROM syn_user.permissions INNER JOIN syn_user.companies ON company_id = syn_user.companies.id WHERE company_id = $1';

  db.query(queryString, [req.payload.companyId], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Error occurred while retrieving company info.'
      });
    } else {
      res.status(200).json({
        success: true,
        data: {
          'company_name': result.rows[0].company_name,
          'permissions': result.rows[0].perm,
          'payload': req.payload
        }
      });
    }
  });
}

/**
 * The function the respond to the client.
 * @param {JSON} req The http request object
 * @param {JSON} res The http response object
 */
function respond(req, res) {
  delete req.user['passhash']; // remove passhash from req.user
  res.status(200).json({
    success: true,
    token: req.token,
    expires: req.expires,
    user: req.user
  });
}

module.exports = {
  registerCompany,
  registerUser,
  getUser,
  authorizeUser,
  getCompanyInfo,
  respond
};
