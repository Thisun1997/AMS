const util = require('util');
const mysql = require('mysql');
/**
 * Connection to the database.
 *  */
const pool = mysql.createConnection({
    host: 'localhost',
    user: 'root', // use your mysql username.
    password: '', // user your mysql password.
<<<<<<< HEAD
    database: 'backup_ams'
=======
    database: 'ams_2'
>>>>>>> c924bbb8933d6f59c273797ff801ab48d8240d33
});

pool.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    //console.log('connected as id ' + pool.threadId);
  });

module.exports = pool;
