const pool = require('./pool');
//const bcrypt = require('bcryptjs');


function Guest() {};

Guest.prototype = {
    // Find the user data by id or username.
    findguest : function(user = null, callback)
    {
        let sql = `SELECT * FROM guest_passenger WHERE passenger_id = ?`;


        pool.query(sql, user, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    

    // This function will insert data into the database. (create a new user)
    // body is an object 
    createGuest : function(body, callback) 
    { 
        var bind = [];
        for(prop in body){
            bind.push(body[prop]);
        }
        let sql = `INSERT INTO guest_passenger(full_name, email, date_of_birth, gender, citizenship) VALUES (?, ?, ?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },

    getAirports : function(callback)
    {
        let sql = `SELECT * FROM airport`;

        pool.query(sql, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    search : function(body, callback)
    {
        bind = []
        for(prop in body){
            bind.push(body[prop]);
        }
        console.log(bind)
        let sql = `CALL search(?,?,?,?)`;
        pool.query(sql, bind, function(err, result) {
            if(err) throw err
            //console.log(result)
            if(result[0].length) {
                    callback(result[0])
            }else {
                callback(null);
            }
        });
    }

}

module.exports = Guest;