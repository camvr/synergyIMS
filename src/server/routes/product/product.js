const product = require('express').Router();
const db = require('../../db/connect');
const verify = require('../middlewares/verify');
const log = require('../helpers/logger');

const upload = require('multer')({dest: 'tmp/'});
const csv = require('csv-parser');
const fs = require('fs');

/**
 * @api {get} /product Get products
 * @apiVersion 1.0.0
 * @apiName GetProducts
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint returns the products and their information that the user's company has stored.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      'https://synergyims.me/api/product?limit=10&offset=0'
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} [sort_by] The column to sort the data by.
 * @apiParam {Boolean} [desc=false] Sort the data in descending order.
 * @apiParam {Number} [limit] The number of entries to return (for pagination).
 * @apiParam {Number} [offset=0] The number of entries to offset the returned entries by (for pagination).
 * @apiParam {String} [search] A search string to return products by matching product names.
 *
 * @apiSuccess {json} data The list of products.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 */
product.get('/', verify.verifyPermissions('read product'), (req, res) => {
  let queryParams = [req.payload.companyId];
  let queryString = 'SELECT products.id, item_name, products.description, quantity, price, serial_num, products.created_at, products.modified_at, category_id, category_name, brand_id, brand_name, warehouse_id, warehouse_name FROM syn_data.products LEFT OUTER JOIN syn_data.categories ON syn_data.products.category_id = syn_data.categories.id LEFT OUTER JOIN syn_data.brands ON syn_data.products.brand_id = syn_data.brands.id LEFT OUTER JOIN syn_data.warehouses ON syn_data.products.warehouse_id = syn_data.warehouses.id WHERE syn_data.products.company_id = $1';

  if (req.query.search) {
    queryParams.push(req.query.search);
    queryString += ' AND item_name LIKE $2';
  }

  if (req.query.sort_by) {
    let sortColumns = {'item_name': 'item_name', 'description': 'products.description', 'quantity': 'quantity', 'price': 'price', 'serial_num': 'serial_num', 'category_name': 'category_name', 'brand_name': 'brand_name', 'warehouse_name': 'warehouse_name'};
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
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      if (!isNaN(parseInt(req.query.limit)) && !isNaN(parseInt(req.query.offset))) {
        let productsList = result.rows;
        let queryParams = [req.payload.companyId];
        let queryString = 'SELECT count(*) AS total FROM syn_data.products WHERE company_id = $1';

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
            // log.logActivity(req, 'Retrieved products');
            res.status(200).json({
              success: true,
              data: {
                'products': productsList,
                'total': result.rows[0]['total']
              }
            });
          }
        });
      } else {
        // log.logActivity(req, 'Retrieved products');
        res.status(200).json({
          success: true,
          data: {'products': result.rows}
        });
      }
    }
  });
});

/**
 * @api {get} /product/:id Get product
 * @apiVersion 1.0.0
 * @apiName GetProduct
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint returns a specific product based on the given product id.
 *
 * @apiExample Example usage:
 * curl -X GET
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/product/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {Number} id The id of the product.
 *
 * @apiSuccess {json} data The product info.
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError InvalidID The provided id must be a valid number.
 */
product.get('/:id', verify.verifyPermissions('read product'), verify.validateID, (req, res) => {
  let queryString = 'SELECT products.id, item_name, products.description, quantity, price, serial_num, products.created_at, products.modified_at, category_id, category_name, brand_id, brand_name, warehouse_id, warehouse_name FROM syn_data.products LEFT OUTER JOIN syn_data.categories ON syn_data.products.category_id = syn_data.categories.id LEFT OUTER JOIN syn_data.brands ON syn_data.products.brand_id = syn_data.brands.id LEFT OUTER JOIN syn_data.warehouses ON syn_data.products.warehouse_id = syn_data.warehouses.id WHERE syn_data.products.company_id = $1 AND syn_data.products.id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      // log.logActivity(req, 'Retrieved product (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    }
  });
});

/**
 * @api {post} /product Create product
 * @apiVersion 1.0.0
 * @apiName PostProduct
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint creates a product with the provided information.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"brand_id": 32, "category_id": 12, "item_name": "Gala Apple", ...}'
 *      https://synergyims.me/api/product
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} item_name The name of the new product.
 * @apiParam {String} description The description of the new product.
 * @apiParam {String} serial_num The serial number of the new product.
 * @apiParam {Number} price The price of the new product.
 * @apiParam {Number} quantity The quantity of the new product.
 * @apiParam {Number} brand_id The id of the brand this product belongs to (set to 0 if none).
 * @apiParam {Number} category_id The id of the category this product belongs to (set to 0 if none).
 * @apiParam {Number} warehouse_id The id of the warehouse this product is stored at (set to 0 if none).
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
product.post('/', verify.verifyPermissions('create product'), validateBody, (req, res) => {
  let queryString = 'INSERT INTO syn_data.products (brand_id, category_id, company_id, created_at, description, item_name, modified_at, price, quantity, serial_num, warehouse_id) VALUES ($1, $2, $3, DEFAULT, $4, $5, DEFAULT, $6, $7, $8, $9)';

  db.query(queryString, [req.body.brand_id, req.body.category_id, req.payload.companyId, req.body.description, req.body.item_name, req.body.price, req.body.quantity, req.body.serial_num, req.body.warehouse_id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Created product');
      res.status(201).json({
        success: true,
        message: 'Successfully inserted 1 row.'
      });
    }
  });
});

/**
 * @api {post} /product/import Import CSV of products
 * @apiVersion 1.0.0
 * @apiName ImportProducts
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint creates products from the information of an imported CSV. The CSV headers must be exactly as follows:
 * {item_name,description,price,quantity,serial_num}.
 * Note that due to issues with Readable streams this endpoint will silently fail (i.e not import any products but report successful).
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -F "csvFile=@/path/to/test.csv"
 *      https://synergyims.me/api/product/import
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {File} csvFile The CSV file to import.
 * @apiParam {String} [delimiter] The delimiter used in the CSV file.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       success: true,
 *       message: "Successfully imported CSV."
 *     }
 *
 * @apiError InvalidAccessToken A valid bearer token must be provided in the authorization header.
 * @apiError InvalidCompanyPermissions The user must have the correct permissions in their company.
 * @apiError MissingOrInvalidData The data provided must be of the correct type.
 */
product.post('/import', verify.verifyPermissions('create product'), upload.single('csvFile'), (req, res) => {
  let sep = req.body.delimiter ? req.body.delimiter : ',';
  let upload = fs.createReadStream(req.file.path);

  upload.pipe(csv({
      separator: sep,
      strict: true
    }))
    .on('headers', (headerList) => {
      // validate headers
      if (!headerList) {
        upload.emit('error', new Error('Improper CSV header formatting.'));
      }
    })
    .on('data', (data) => {
      if (data['description'] && data['item_name'] && data['price'] && data['quantity'] && data['serial_num']) {
        upload.pause();
        let queryParams = [0, 0, req.payload.companyId, data['description'], data['item_name'], data['price'], data['quantity'], data['serial_num'], 0];

        // write to database
        db.query('INSERT INTO syn_data.products (brand_id, category_id, company_id, created_at, description, item_name, modified_at, price, quantity, serial_num, warehouse_id) VALUES ($1, $2, $3, DEFAULT, $4, $5, DEFAULT, $6, $7, $8, $9)', queryParams, (err, result) => {
          if (err) {
            console.log(err);
            upload.emit('error', new Error('Improper CSV data formatting.'));
          }

          upload.resume();
        });
      }
    })
    .on('error', (err) => {
      console.log(err);
      res.status(400).json({
        success: false,
        message: err
      });
    })
    .on('end', () => {
      fs.unlink(req.file.path, (err) => {
        res.status(201).json({
          success: true,
          message: 'Successfully imported CSV.'
        });
      });
  });
});

/**
 * @api {patch} /product Update product
 * @apiVersion 1.0.0
 * @apiName PatchProduct
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint updates a product with the provided information.
 *
 * @apiExample Example usage:
 * curl -X POST
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      -H "Content-Type: application/json"
 *      -d '{"brand_id": 32, "category_id": 12, "item_name": "Gala Apple", ...}'
 *      https://synergyims.me/api/product
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
 *
 * @apiParam {String} item_name The new name of the product.
 * @apiParam {String} description The new description of the product.
 * @apiParam {String} serial_num The new serial number of the product.
 * @apiParam {Number} price The new price of the product.
 * @apiParam {Number} quantity The new quantity of the product.
 * @apiParam {Number} brand_id The id of the brand this product belongs to (set to 0 if none).
 * @apiParam {Number} category_id The id of the category this product belongs to (set to 0 if none).
 * @apiParam {Number} warehouse_id The id of the warehouse this product is stored at (set to 0 if none).
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
product.patch('/:id', verify.verifyPermissions('update product'), verify.validateID, validateBody, (req, res) => {
  let queryString = 'UPDATE syn_data.products SET brand_id = $3, category_id = $4, description = $5, item_name = $6, modified_at = now(), price = $7, quantity = $8, serial_num = $9, warehouse_id = $10 WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id, req.body.brand_id, req.body.category_id, req.body.description, req.body.item_name, req.body.price, req.body.quantity, req.body.serial_num, req.body.warehouse_id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Updated product (id: ' + req.params.id + ')');
      res.status(200).json({
        success: true,
        message: 'Successfully updated 1 row.'
      });
    }
  });
});

/**
 * @api {delete} /product Delete product
 * @apiVersion 1.0.0
 * @apiName DeleteProduct
 * @apiGroup Product
 * @apiPermission None
 *
 * @apiDescription This endpoint deletes a product.
 *
 * @apiExample Example usage:
 * curl -X DELETE
 *      -H "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...PrjmfH2E"
 *      https://synergyims.me/api/product/87
 *
 * @apiHeader {String} authorization Access token recieved upon authorization (prefixed with "Bearer ")
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
product.delete('/:id', verify.verifyPermissions('delete product'), verify.validateID, (req, res) => {
  let queryString = 'DELETE FROM syn_data.products WHERE company_id = $1 AND id = $2';

  db.query(queryString, [req.payload.companyId, req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error occurred while connecting to the database.'
      });
    } else {
      log.logActivity(req, 'Deleted product (id: ' + req.params.id + ')');
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
  if (!isNaN(parseFloat(req.body.brand_id)) && !isNaN(parseFloat(req.body.category_id)) && req.body.description && req.body.item_name && req.body.price && !isNaN(parseFloat(req.body.quantity)) && req.body.serial_num && req.body.warehouse_id) {
    next();
  } else {
    res.status(400).json({
      success: false,
      message: 'Missing or invalid parameters in request body.'
    });
  }
}


module.exports = product;
