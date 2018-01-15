const category = require('express').Router();
const db = require('../../db/connect');
const verify = require('../middlewares/verify');
const log = require('../helpers/logger');

/**
 * @api {get} /category Get Categories
 * @apiVersion 1.0.0
 * @apiName GetCategories
 * @apiGroup Category
 * @apiPermission None
 *
 * @apiDescription This endpoint returns the categories and their information that the user's company has stored.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      'https://synergyims.me/api/category?limit=10&offset=0'
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} [limit] The number of entries to return (for pagination).
 * @apiParam {Number} [offset=0] The number of entries to offset the returned entries by (for pagination).
 *
 * @apiSuccess {json} data The list of categories.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
category.get('/', verify.verifyPermissions('read category'), (req, res) => {
  let queryParams = [req.payload.companyId];
  let queryString = 'SELECT * FROM syn_data.categories WHERE company_id = $1';

  if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
    queryParams = [req.payload.companyId, req.query.limit, req.query.offset];
    queryString = 'SELECT * FROM syn_data.categories WHERE company_id = $1 LIMIT $2 OFFSET $3';
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
        let categoryList = result.rows;
        db.query('SELECT count(*) AS total FROM syn_data.categories WHERE company_id = $1;', [req.payload.companyId], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              success: false,
              message: 'Internal server error occurred while connecting to the database.'
            });
          } else {
            // log.logActivity(req, 'Retrieved categories');
            res.status(200).json({
              success: true,
              data: {
                'categories': categoryList,
                'total': result.rows[0]['total']
              }
            });
          }
        });
      } else {
        // log.logActivity(req, 'Retrieved categories');
        res.status(200).json({
          success: true,
          data: {'categories': result.rows[0]}
        });
      }
    }
  });
});

/**
 * @api {get} /category/:id Get category
 * @apiVersion 1.0.0
 * @apiName GetCategory
 * @apiGroup Category
 * @apiPermission None
 *
 * @apiDescription This endpoint returns a specific category based on the given category id.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/category/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the category.
 *
 * @apiSuccess {json} data The category info.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidID The provided id must be a valid number.
 */
category.get('/:id', verify.verifyPermissions('read category'), verify.validateID, (req, res) => {
  let queryString = 'SELECT * FROM syn_data.categories WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
      console.log(err);
    } else {
      // log.logActivity(req, 'Retrieved category (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        data: result.rows
      });
    }
  });
});

/**
 * @api {post} /category Create category
 * @apiVersion 1.0.0
 * @apiName PostCategory
 * @apiGroup Category
 * @apiPermission None
 *
 * @apiDescription This endpoint creates a category with the provided information.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"category_name": "Laptops", "description": "Are they supposed to have battery life?"}'
 *      https://synergyims.me/api/category
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} category_name The name of the new category.
 * @apiParam {String} description The description of the new category.
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
category.post('/', verify.verifyPermissions('create category'), validateBody, (req, res) => {
  let queryString = 'INSERT INTO syn_data.categories (category_name, company_id, created_at, modified_at, description) VALUES ($2, $1, now(), now(), $3)';

  db.query(queryString, [req.payload.companyId, req.body.category_name, req.body.description], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Created category');
      res.status(201).json({
        success: true,
        message: 'Successfully inserted 1 row.'
      });
    }
  });
});

/**
 * @api {patch} /category/:id Update category
 * @apiVersion 1.0.0
 * @apiName PatchCategory
 * @apiGroup Category
 * @apiPermission None
 *
 * @apiDescription This endpoint updates a category with the provided information.
 *
 * @apiExample Example usage:
 * curl -X PATCH
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"category_name": "Laptops", "description": "A computer that fits on your lap."}'
 *      https://synergyims.me/api/category/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the category.
 * @apiParam {String} category_name The new name of the category.
 * @apiParam {String} description The new description of the category.
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
category.patch('/:id', verify.verifyPermissions('update category'), verify.validateID, validateBody, (req, res) => {
  let queryString = 'UPDATE syn_data.categories SET category_name = $3, description = $4, modified_at = now() WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id, req.body.category_name, req.body.description], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Updated category (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        message: 'Successfully updated 1 row.'
      });
    }
  });
});

/**
 * @api {delete} /category/:id Delete category
 * @apiVersion 1.0.0
 * @apiName DeleteCategory
 * @apiGroup Category
 * @apiPermission None
 *
 * @apiDescription This endpoint deletes a category.
 *
 * @apiExample Example usage:
 * curl -X DELETE
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/category/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the category.
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
category.delete('/:id', verify.verifyPermissions('delete category'), verify.validateID, (req, res) => {
  let queryString = 'DELETE FROM syn_data.categories WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Deleted category (id: ' + req.params.id + ')');
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
  if (req.body.category_name && req.body.description) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing or invalid parameters in request body.'
    });
  }
}


module.exports = category;
