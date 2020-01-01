const util = require('util');
const mysql = require('mysql');
/**
 * Connection to the database.
 *  */
const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root', // use your mysql username.
    password: '', // user your mysql password.
    database: 'backup_ams'
});

pool.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    //console.log('connected as id ' + pool.threadId);
  });

module.exports = pool;
