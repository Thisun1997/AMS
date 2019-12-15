const pool = require('./pool');
//const bcrypt = require('bcryptjs');

//validation
const Joi = require('joi');
//var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');

function User() { };

User.prototype = {
    // Find the user data by id or username.
    findguest: function (user = null, callback) {
        let sql = `SELECT * FROM guest_passenger WHERE passenger_id = ?`;


        pool.query(sql, user, function (err, result) {
            if (err) throw err

            if (result.length) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },

    findmember: function (user = null, callback) {
        let sql = `SELECT * FROM member_passenger WHERE passenger_id = ?`;


        pool.query(sql, user, function (err, result) {
            if (err) throw err

            if (result.length) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },

    // This function will insert data into the database. (create a new user)
    // body is an object 
    createGuest: function (body, callback) {
        var bind = [];
        for (prop in body) {
            bind.push(body[prop]);
        }
        let sql = `INSERT INTO guest_passenger(full_name, email, date_of_birth, gender, citizenship) VALUES (?, ?, ?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function (err, result) {
            if (err) throw err;
            // return the last inserted id. if there is no error
            callback(result.insertId);
        });
    },

    createMember: function (body1, body2, callback) {

        //var pwd = body.password;
        // Hash the password before insert it into the database.
        //body.password = bcrypt.hashSync(pwd,10);

        //====================
        

        const schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required()
        }).with('email', 'password');

        Joi.validate(body2, schema, (err, result) => {
            console.log(body2)

            if (err) {
                console.log(err.details)

                // result.send('an error has occured')
                pool.rollback(function () {
                    throw err;
                });
            }
            else {
                


                //========================


                // this array will contain the values of the fields.
                var bind1 = [];
                var bind2 = [];

                // loop in the attributes of the object and push the values into the bind array.
                for (prop in body1) {
                    bind1.push(body1[prop]);
                }

                // prepare the sql query
                let sql = `INSERT INTO member_passenger(full_name, date_of_birth, gender, citizenship) VALUES (?, ?, ?, ?)`;
                // call the query give it the sql string and the values (bind array)

                pool.beginTransaction(function (err) {
                    if (err) throw err;
                    pool.query(sql, bind1, function (err, result) {
                        if (err) {
                            pool.rollback(function () {
                                throw err;
                            });
                        }


                        var log = result.insertId;
                        let sql = `INSERT INTO user_account(passenger_id,email,password) VALUES (?,?,?)`

                        // return the last inserted id. if there is no error
                        

                        var email = body2.email;
                        var password = bcrypt.hashSync(body2.password, 8);

                        bind2.push(log)
                        bind2.push(email)
                        bind2.push(password)
                        // for (prop in body2) {
                        //     bind2.push(body2[prop]);
                        // }
                        console.log(bind2)


                        pool.query(sql, bind2, function (err, result) {
                            if (err) {
                                pool.rollback(function () {
                                    throw err;
                                });
                            }
                            console.log('no validate error. database updated')
                            pool.commit(function (err) {
                                if (err) {
                                    pool.rollback(function () {
                                        throw err;
                                    });
                                }
                                console.log('Transaction Complete.');
                                callback(log)
                            });
                        });
                    });

                });

                //=========





            }
        })



    },

    login: function (email, password, callback) {
        // find the user data by his username.

        console.log(password)
        this.findmember(email, function (user) {
            // if there is a user by this username.
            if (user) {
                console.log(user.password)
//====================================================================================
                // if(!bcrypt.compareSync(password,rows[0].password)){
                //     console.log('login hi4')
                //     return done(null,false,flash('loginMessage','Wrong Password'));
                // }


                // now we check his password with hashed

                if (bcrypt.compareSync(password, user.password)) {
                    console.log(password)
                    console.log(user.password)
                    // return his data.
                    callback(user);
                    return;
                }


                // // now we check his password.
                // if (password = user.password) {
                //     // return his data.
                //     callback(user);
                //     return;
                // }
            }
            // if the username/password is wrong then return null.
            callback(null);
        });
    }

}

module.exports = User;