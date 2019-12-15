const pool = require('./pool');
//const bcrypt = require('bcryptjs');


function User() {};

User.prototype = {
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

    findmember : function(user = null, callback)
    {
        let sql = `SELECT * FROM user_account NATURAL JOIN member_passenger WHERE email = ?`;


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

    createMember : function(body1, body2, callback) 
    {

        //var pwd = body.password;
        // Hash the password before insert it into the database.
        //body.password = bcrypt.hashSync(pwd,10);

        // this array will contain the values of the fields.
        var bind1 = [];
        var bind2 = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body1){
            bind1.push(body1[prop]);
        }
        
        // prepare the sql query
        let sql = `INSERT INTO member_passenger(full_name, date_of_birth, gender, citizenship) VALUES (?, ?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.beginTransaction(function(err){
            if(err) throw err;
            pool.query(sql, bind1, function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                var log = result.insertId; 
                let sql = `INSERT INTO user_account(passenger_id,email,password) VALUES (?,?,?)`
                // return the last inserted id. if there is no error
                bind2.push(log)
                for(prop in body2){
                    bind2.push(body2[prop]);
                }
                pool.query(sql, bind2, function(err, result) {
                    if(err){
                        pool.rollback(function() {
                            throw err;
                        });
                    }
                    pool.commit(function(err) {
                        if (err) { 
                            pool.rollback(function() {
                            throw err;
                        });
                        }
                        //console.log('Transaction Complete.');
                        callback(log)
                    });
                });
            });

        });
            
    },

    login : function(email, password, callback)
    {
        // find the user data by his username.
        this.findmember(email, function(user) {
            // if there is a user by this username.
            //console.log(user);
            if(user) {
                // now we check his password.
                if(password = user.password) {
                    // return his data.
                    callback(user);
                    return;
                }  
            }
            // if the username/password is wrong then return null.
            callback(null);
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
        let sql = `CALL search(?,?,?)`;

        pool.query(sql, bind, function(err, result) {
            if(err) throw err
           
            if(result[0].length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    }

}

module.exports = User;