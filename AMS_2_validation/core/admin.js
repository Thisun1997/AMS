const pool = require('./pool');

function Admin() {};

Admin.prototype = {

    addAirport : function(body) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO airport(code,city, state, country) VALUES (?, ?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, _result) {
            if(err) throw err;
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

    getAnAirport : function(airport_id = null,callback)
    {
        let sql = `SELECT * FROM airport WHERE airport_id = ?`;


        pool.query(sql, airport_id, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    deleteAirport : function(airport_id, callback){
        let sql = 'DELETE FROM airport WHERE airport_id = ?';
        pool.query(sql, airport_id, function(err, _result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
        });
    },

    //Airplane Type

    addAirplaneType : function(body) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO plane_type(plane_type,tot_economy_seats, tot_business_seats, tot_platinum_seats) VALUES (?, ?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, _result) {
            if(err) throw err;
        });
    },

    getAirplaneTypes : function(callback)
    {
        let sql = `SELECT * FROM plane_type`;


        pool.query(sql, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    getAnAirplaneType : function(plane_type = null,callback)
    {
        let sql = `SELECT * FROM plane_type WHERE plane_type = ?`;


        pool.query(sql, plane_type, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    deleteAirplaneType : function(plane_type,_callback){
        let sql = 'DELETE FROM plane_type WHERE plane_type = ?';
        pool.query(sql, plane_type, function(err, _result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
        });
    },

    editAirplaneType : function(body) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `UPDATE plane_type
        SET tot_economy_seats = ?, tot_business_seats= ?
        WHERE tot_platinum_seats = ?;`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, _result) {
            if(err) throw err;
        });
    },
    //airplane type seats
    addAirplaneTypeAndSeats : function(body,callback) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        let sql = `INSERT INTO plane_type(plane_type,tot_economy_seats, tot_business_seats, tot_platinum_seats) VALUES (?, ?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.beginTransaction(function(err){
            if(err) throw err;
            pool.query(sql, bind, function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                var log = result.insertId; 
                //console.log(log);
                let sql = `SELECT * FROM plane_type WHERE plane_type_id = ?`;
                pool.query(sql, log, function(err, result) {
                    if(err){
                        pool.rollback(function() {
                            throw err;
                        });
                    }
                    var result = result[0]
                    var plane_type = result.plane_type;
                    var tot_economy_seats = result.tot_economy_seats;
                    var tot_business_seats = result.tot_business_seats;
                    var tot_platinum_seats = result.tot_platinum_seats;
                    console.log(result);
                    var letters = ["A","B","C","D"];
                    for(j in letters){
                        for(i=1; i<(parseInt(tot_economy_seats)/4)+1; i++){
                            console.log(tot_business_seats);
                            var eco = [];
                            let seat_id = plane_type+"-E-"+letters[j]+i.toString();
                            eco.push(seat_id);
                            eco.push(log);
                            eco.push("economy")
                            let sql = `INSERT INTO seat(seat_id,plane_type_id, seat_type) VALUES (?, ?, ?)`;
                        // call the query give it the sql string and the values (bind array)
                            pool.query(sql, eco, function(err, result) {
                                if(err) throw err;
                            });
                        }      
                    }

                    for(j in letters){
                        for(i=1; i<(parseInt(tot_business_seats)/4)+1; i++){
                            var bus = [];
                            let seat_id = plane_type+"-B-"+letters[j]+i.toString();
                            bus.push(seat_id);
                            bus.push(log);
                            bus.push("business")
                            let sql = `INSERT INTO seat(seat_id,plane_type_id, seat_type) VALUES (?, ?, ?)`;
                        // call the query give it the sql string and the values (bind array)
                            pool.query(sql, bus, function(err, _result) {
                                if(err) throw err;
                            });
                        }      
                    }

                    for(j in letters){
                        for(i=1; i<(parseInt(tot_platinum_seats)/4)+1; i++){
                            var eco = [];
                            let seat_id = plane_type+"-P-"+letters[j]+i.toString();
                            eco.push(seat_id);
                            eco.push(log);
                            eco.push("platinum")
                            let sql = `INSERT INTO seat(seat_id,plane_type_id, seat_type) VALUES (?, ?, ?)`;
                        // call the query give it the sql string and the values (bind array)
                            pool.query(sql, eco, function(err, _result) {
                                if(err) throw err;
                            });
                        }      
                    }
                    pool.commit(function(err) {
                        if (err) { 
                            pool.rollback(function() {
                            throw err;
                        });
                        }
                        //console.log('Transaction Complete.');
                        //callback(log)
                    });
                });
            });
        });
        
    },

    getEconomyAirplaneTypeSeats : function(plane_type_id = null, callback)
    {
        let sql = `SELECT seat_id FROM seat WHERE plane_type_id = ? AND seat_type = "economy"`;
        pool.query(sql, plane_type_id,  function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    getBusinessAirplaneTypeSeats : function( plane_type_id = null, callback)
    {
        let sql = `SELECT seat_id FROM seat WHERE plane_type_id = ? AND seat_type = "business"`
        pool.query(sql, plane_type_id, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    getPlatinumAirplaneTypeSeats : function(plane_type_id = null, callback)
    {
        let sql = `SELECT seat_id FROM seat WHERE plane_type_id = ? AND seat_type = "platinum"`
        pool.query(sql, plane_type_id, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    //airplane
    addAirplane : function(body) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `SELECT plane_type_id FROM plane_type WHERE plane_type = ?`
        // call the query give it the sql string and the values (bind array)
        pool.beginTransaction(function(err){
            if(err) throw err;
            console.log(bind)
            pool.query(sql, bind[1], function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                var id = result[0].plane_type_id;
                console.log(id);
                let sql = `INSERT INTO plane(company_plane_code,plane_type_id) VALUES (?, ?)`;
                let bind2 = [bind[0],id];
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
                        //callback(log)
                    });
                
                });

            });
        });
    },

    getAirplanes : function(callback)
    {
        let sql = `SELECT * FROM plane NATURAL JOIN plane_type`;


        pool.query(sql, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    deleteAirplane : function(plane_id,_callback){
        let sql = 'DELETE FROM plane WHERE plane_id = ?';
        pool.query(sql, plane_id, function(err, _result) {
            if(err) throw err;
            // return the last inserted id. if there is no error
        });
    },

    //category
    addPassengerCategory : function(body) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        let sql = `INSERT INTO passenger_category(category_name,No_of_reservations,discount) VALUES (?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
        });
    },

    getPassengerCategories : function(callback){
    
        let sql = `SELECT * FROM passenger_category`;


        pool.query(sql, function(err, result) {
            if(err) throw err
        
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    getAPassengerCategory: function(category_id = null,callback)
    {
        let sql = `SELECT * FROM passenger_category WHERE category_id = ?`;


        pool.query(sql, category_id, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    editPassengerCategory : function(body) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        // prepare the sql query
        console.log(bind)
        let sql = `UPDATE passenger_category SET No_of_reservations = ?, discount = ? WHERE category_name = ?`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, result) {
            if(err) throw err;
            
        });
    },

    //date
    getDate : function(callback)
    {
        let date_ob = new Date();
        date_ob.setMonth(date_ob.getMonth()+3)
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let day1 = year + "-" + month + "-" + date ;

        
        date_ob.setDate(date_ob.getDate()+6)
        let date2 = ("0" + date_ob.getDate()).slice(-2);
        let month2 = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year2 = date_ob.getFullYear();
        let day2 = year2 + "-" + month2 + "-" + date2 ;

        let dates = [day1,day2]
        callback(dates)
    },

    getSheduleDates : function(callback)
    {
        let sql = `SELECT date FROM shedule_list`
        pool.query(sql, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback([result[0],result[result.length-1]]);
            }else {
                callback(null);
            }
        });

    },

    //time table
    addTimeTable : function(date,callback)
    {
        var bind = []
        bind.push(date);
        let sql = `SELECT * FROM time_table WHERE date = ?`

        pool.query(sql, bind, function(err,result) {
            if(err) throw err;
            if(result.length) {
                callback([bind[0],result[0].time_table_id]);
            }else {
                let shedule_id = 'S-'+date;
                bind.push(shedule_id);
                let sql = `INSERT INTO time_table(date) VALUES (?) `;
                pool.query(sql, bind, function(err, _result) {
                    if(err) throw err;
                    callback([bind[0],result.insertId]);
                });
            }
        });
    },

    //routes
    addRoute : function(body1,body2,shedule_id)
    {
        var bind1 = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body1){
            bind1.push(body1[prop]);
        }
        pool.beginTransaction(function(err){
            if(err) throw err;
            let sql = `SELECT route_id FROM route WHERE plane_id = ? AND dept_airport_id = ? AND dest_airport_id = ?`;
            pool.query(sql, bind1, function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                console.log(result);
                if (result.length){
                    
                }
                else{
                    let sql = `INSERT INTO route(plane_id,dept_airport_id,dest_airport_id) VALUES (?, ?, ?) `;
                    pool.query(sql, bind1, function(err, result) {
                        if(err){
                            pool.rollback(function() {
                                throw err;
                            });
                        }
                        var id = result.insertId;
                        console.log(id)
                        let sql = `INSERT INTO  regular_route_time(route_id,dept_time,arr_time) VALUES (?, ?, ?)`;
                        let bind2 = [id];
                        // loop in the attributes of the object and push the values into the bind array.
                        if (body2.dept_time == '' || body2.arr_time == ''){
                            pool.commit(function(err) {
                                if (err) { 
                                    pool.rollback(function() {
                                    throw err;
                                });
                                }
                            });
                        }
                        else{
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
                                    //callback(log)
                                });
                            });
                            
                        }
                        
                    });
                }
                
            });
        });
    },

    getRoute : function(callback)
    {
        // let sql = `SELECT company_plane_code, dept.code AS dept_airport, dest.code AS dest_airport 
        // FROM airport AS dept, airport AS dest,plane NATURAL JOIN route WHERE dest.airport_id = route.dest_airport_id AND dept.airport_id = route.dept_airport_id;`;
        let sql = `CALL routeDetails()`
        pool.query(sql, function(err, result) {
            if(err) throw err
        
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    getAroute : function(route_id,callback)
    {
        let sql = `CALL SelectRoute(?)`

        pool.query(sql, route_id,function(err, result) {
            if(err) throw err
        
            if(result.length) {
                callback(result[0][0]);
            }else {
                callback(null);
            }
        });
    },

    getRouteTime : function (route_id,callback)
    {
        let sql = `SELECT dept_time,arr_time FROM regular_route_time WHERE route_id = ?`;
        pool.query(sql, route_id,function(err, result) {
            if(err) throw err
        
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    getNo_ofSeats : function(route_id,callback)
    {
        let sql = `CALL TotalSeats(?)`

        pool.query(sql, route_id,function(err, result) {
            if(err) throw err
        
            if(result.length) {
                callback(result[0][0]);
            }else {
                callback(null);
            }
        });
    },

    //add shedule

    addSheduleAndTrip : function(body1, body2, time_table_id)
    {
        var bind1 = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body1){
            bind1.push(body1[prop]);
        }
        pool.beginTransaction(function(err){
            if(err) throw err;
            let sql = `INSERT INTO shedule(route_id,dept_time,arr_time) VALUES (?, ?, ?)`;
            console.log(bind1);
            pool.query(sql, bind1,function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                var id  = result.insertId;
                var bind2 = [time_table_id,id];
                let sql = `CALL AddSheduleAndTrip(?, ?, ?, ?, ?)`;
                for(prop in body2){
                    bind2.push(body2[prop]);
                }
                pool.query(sql, bind2,function(err, result) {
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
                        //callback(log)
                    });
                });
            });
        });
        
    },


}

module.exports = Admin;

