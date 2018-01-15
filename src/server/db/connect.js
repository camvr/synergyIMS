const {Pool} = require('pg');
const config = process.env.NODE_ENV === 'staging' ? require('./database.json').staging : require('./database.json').dev;
/**
 * The module for creating a pool of requests.
 */
const pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: 5432
});

/**
 * The function to take in database queries and output responses.
 * @param {string} text The query string.
 * @param {string} params The parameters of the query.
 * @param {function} callback The returned observable function.
 * @return {function} The asynchronous query function based.
 */
function query(text, params, callback) {
  // const start = Date.now();
  return pool.query(text, params, (err, res) => {
    // const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    callback(err, res);
  });
}

/**
 * The function to return the client.
 * @param {function} callback The returned observable function containing the response.
 */
function getClient(callback) {
  pool.connect((err, client, done) => {
    callback(err, client, done);
  });
}


module.exports = {
  query,
  getClient
};
