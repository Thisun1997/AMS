const pool = require('./pool');
//const bcrypt = require('bcryptjs');


function User() {};

User.prototype = {
    // Find the user data by id or username.
    // findguest : function(user = null, callback)
    // {
    //     let sql = `SELECT * FROM guest_passenger WHERE passenger_id = ?`;


    //     pool.query(sql, user, function(err, result) {
    //         if(err) throw err
           
    //         if(result.length) {
    //             callback(result[0]);
    //         }else {
    //             callback(null);
    //         }
    //     });
    // },

    findmember : function(user = null, callback)
    {
        if (Number.isInteger(user)){
            sql = `SELECT * FROM user_account NATURAL JOIN member_passenger LEFT OUTER JOIN passenger_category USING(category_id) WHERE passenger_id = ?`;
        }
        else{
            sql = `SELECT * FROM user_account NATURAL JOIN member_passenger LEFT OUTER JOIN passenger_category USING(category_id) WHERE email = ?`;
        }
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
    // createGuest : function(body, callback) 
    // { 
    //     var bind = [];
    //     for(prop in body){
    //         bind.push(body[prop]);
    //     }
    //     let sql = `INSERT INTO guest_passenger(full_name, email, date_of_birth, gender, citizenship) VALUES (?, ?, ?, ?, ?)`;
    //     // call the query give it the sql string and the values (bind array)
    //     pool.query(sql, bind, function(err, result) {
    //         if(err) throw err;
    //         // return the last inserted id. if there is no error
    //         callback(result.insertId);
    //     });
    // },

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
        
        this.findmember(body2['email'], function(user){
            if(user){
                callback(null)
            }
            else{
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
            }
        })
        // prepare the sql query
            
    },

    login : function(email,password, callback)
    {
        // find the user data by his username.
        this.findmember(email, function(user) {
            // if there is a user by this username.
            //console.log(user);
            if(user) {
                // now we check his password.
                if(password == user.password) {
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

    relevantDelays : function(passenger_id,callback) 
    {
        let sql = 'SELECT delay_time,x,y,dept_time,arr_time,reason,date FROM today_routes NATURAL JOIN reservation_member WHERE passenger_id = ?';
        console.log(passenger_id);
        pool.query(sql,[passenger_id],function(err, result){
            if (err) {
                throw err
            }
            if (result) {
                if(result.length){
                    callback(result);
                }
                else{
                    callback(null);
                }
            }else{
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
    },

    getEconomyAirplaneTypeSeats : function(userInput, callback)
    {
        let sql = `SELECT * FROM seat LEFT OUTER JOIN (ticket_reservation NATURAL JOIN reservation_member) USING (seat_id) WHERE plane_type_id = ? AND seat_type = "economy" AND trip_id = ?`
        pool.query(sql, userInput, function(err, result1) {
            if(err) throw err
           
            
                let sql = `SELECT * FROM seat WHERE plane_type_id = ? AND seat_type = "economy"`
                pool.query(sql, userInput, function(err, result2) {
                    if(err) throw err
                    if(result1.length) {
                        if(result2.length) {
                            for(i in result2){
                                result2[i].ticket_issued = null
                            }
                            for(i in result1){
                                for(j in result2){
                                    if(result2[j].seat_id == result1[i].seat_id){
                                        result2[j].ticket_issued = result1[i].ticket_issued
                                    }
                                }
                            }
                            console.log(result2)
                            callback(result2)
                        }else {
                            callback(null);
                        }
                    }
                    else{
                        if(result2.length) {
                            for(i in result2){
                                result2[i].ticket_issued = null
                            }
                            callback(result2)
                        }
                        else{
                            callback(null)
                        }

                    }
                });
        });
    },

    getBusinessAirplaneTypeSeats : function( userInput, callback)
    {
        let sql = `SELECT * FROM seat LEFT OUTER JOIN (ticket_reservation NATURAL JOIN reservation_member) USING (seat_id) WHERE plane_type_id = ? AND seat_type = "business" AND trip_id = ?`
        pool.query(sql, userInput, function(err, result1) {
            if(err) throw err
           
            
                let sql = `SELECT * FROM seat WHERE plane_type_id = ? AND seat_type = "business"`
                pool.query(sql, userInput, function(err, result2) {
                    if(err) throw err
                    if(result1.length) {
                        if(result2.length) {
                            for(i in result2){
                                result2[i].ticket_issued = null
                            }
                            for(i in result1){
                                for(j in result2){
                                    if(result2[j].seat_id == result1[i].seat_id){
                                        result2[j].ticket_issued = result1[i].ticket_issued
                                    }
                                }
                            }
                            console.log(result2)
                            callback(result2)
                        }else {
                            callback(null);
                        }
                    }
                    else{
                        if(result2.length) {
                            for(i in result2){
                                result2[i].ticket_issued = null
                            }
                            callback(result2)
                        }
                        else{
                            callback(null)
                        }
                    }
                });
        });
    },

    getPlatinumAirplaneTypeSeats : function(userInput, callback)
    {
        let sql = `SELECT * FROM seat LEFT OUTER JOIN (ticket_reservation NATURAL JOIN reservation_member) USING (seat_id) WHERE plane_type_id = ? AND seat_type = "platinum" AND trip_id = ?`
        pool.query(sql, userInput, function(err, result1) {
            if(err) throw err
           
            
                let sql = `SELECT * FROM seat WHERE plane_type_id = ? AND seat_type = "platinum"`
                pool.query(sql, userInput, function(err, result2) {
                    if(err) throw err
                    if(result1.length) {
                        if(result2.length) {
                            for(i in result2){
                                result2[i].ticket_issued = null
                            }
                            for(i in result1){
                                for(j in result2){
                                    if(result2[j].seat_id == result1[i].seat_id){
                                        result2[j].ticket_issued = result1[i].ticket_issued
                                    }
                                }
                            }
                            console.log(result2)
                            callback(result2)
                        }else {
                            callback(null);
                        }
                    }
                    else{
                        if(result2.length) {
                            for(i in result2){
                                result2[i].ticket_issued = null
                            }
                            callback(result2)
                        }
                        else{
                            callback(null)
                        }

                    }
                });
        });
    },
    getAnAirplaneType : function(plane_type_id = null,callback)
    {
        let sql = `SELECT * FROM plane_type WHERE plane_type_id = ?`;
        pool.query(sql, plane_type_id, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    makeReservation : function(body1, body2, body3, callback)
    {
        var bind1 = []
        var bind2 = []
        var bind3 = []
        for(prop in body1){
            bind1.push(body1[prop]);
        }
        let sql = `INSERT INTO reservation_member(passenger_id, trip_id) VALUES (?, ?)`;
        pool.beginTransaction(function(err){
            if(err) throw err;
            pool.query(sql, bind1, function(err, result) {
                if(err){
                    pool.rollback(function(){
                        throw err;
                    });
                }
                var reservation_id = result.insertId; 
                let sql = `CALL update_trip_seats(?,?,?,?,?)`
                for(prop in body2){
                    bind2.push(body2[prop]);
                }
                //console.log(bind2);
                pool.query(sql, bind2, function(err, result) {
                    if(err){
                        pool.rollback(function() {
                            throw err;
                        });
                    }
                    var b = body3["guests"]
                    for(i in b){
                        console.log(i)
                        bind3.push([reservation_id,b[i].name, b[i].age, b[i].gender, b[i].requirements, b[i].price, b[i].seat_id, b[i].pay]);
                    }
                    console.log(bind3)
                    let sql = `INSERT INTO ticket_reservation(reservation_id, full_name,age,gender,requirements,price,seat_id,ticket_issued) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                            for (i in bind3){
                                pool.query(sql, bind3[i], function(err, result) {
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
                                        console.log('Transaction Complete.');
                                    });
                                });
                            }
                            callback(reservation_id)
                });

            });
        });
    }

}

module.exports = User;