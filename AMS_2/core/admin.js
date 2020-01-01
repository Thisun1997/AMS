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
                    //console.log(result);
                    var letters = ["A","B","C","D"];
                    for(j in letters){
                        for(i=1; i<(parseInt(tot_economy_seats)/4)+1; i++){
                            //console.log(tot_business_seats);
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

    getUpdateDelayTable : function(shedule_id,dept_time,reason,callback){
        let sql1 = 'insert into delay(delay_time,reason) values(?,?)';
        let sql2 = 'UPDATE shedule SET delay_id = ? WHERE shedule_id = ?';

        let bind1 = [dept_time,reason];
        

        pool.query(sql1, bind1, function(err, result) {
            if(err) throw err;
            var id = result.insertId;
            let bind2 = [id,shedule_id]
            
            pool.query(sql2,bind2, function(err,result){
                if(err) throw err;
                callback(result);
            })
        });
    },

    getAllTodayDelays : function(callback){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let sql = 'select * from today_routes natural join delay where date=?';

        pool.query(sql, [date], function(err, result) {
            if (err) {
                throw err
            }
            console.log(result);
            callback(result);
        })
    },

    getTodayRoutesDetails : function(callback){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
       // console.log(date);
        let sql = 'SELECT * FROM today_routes WHERE date = ?';
        //==========================================================================================
        //hard corded the time
        pool.query(sql, [date], function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
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
            //console.log(bind)
            pool.query(sql, bind[1], function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                var id = result[0].plane_type_id;
                //console.log(id);
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
        //console.log(bind)
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
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let day1 = year + "-" + month + "-" + date ;
        callback(day1)
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
                let sql = `INSERT INTO time_table(date) VALUES (?) `;
                pool.query(sql, bind, function(err, result) {
                    if(err) throw err;
                   // console.log(result.insertId)
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
            //console.log(bind1);
            pool.query(sql, bind1,function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                var id  = result.insertId;
                //console.log(id);
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

    viewTrips : function(date,callback)
    {
        sql = `CALL SheduleDate(?)`
        pool.query(sql, date,function(err, result) {
            if(err) throw err
            if(result[0]){
                //console.log(result[0]);
                if(result[0].length) {
                    callback(result[0]);
                }else {
                    callback(null);
                }
            }
            else {
                callback(null);
            }
        });
    },

    viewForEditTrips : function(trip_id,callback)
    {
        sql = `CALL SheduleDetails(?)`
        pool.query(sql, trip_id,function(err, result) {
            if(err) throw err
            if(result[0]){
                //console.log(result[0]);
                if(result[0].length) {
                    callback(result[0]);
                }else {
                    callback(null);
                }
            }
            else {
                callback(null);
            }
        });
    },

    editTrip : function(body1,body2,callback)
    {
        var bind1 = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body1){
            bind1.push(body1[prop]);
        }
        pool.beginTransaction(function(err){
            if(err) throw err;
            let sql = `UPDATE shedule SET arr_time = ?, dept_time = ? WHERE shedule_id = ?`;
            pool.query(sql, bind1,function(err, result) {
                if(err){
                    pool.rollback(function() {
                        throw err;
                    });
                }
                var bind2 = [];
                let sql = `UPDATE trip SET economy_price = ?, business_price = ?, platinum_price = ? WHERE trip_id = ?`;
                for(prop in body2){
                    bind2.push(body2[prop]);
                }
                //console.log(bind2)
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
                        callback(true)
                    });
                });
            });
        });
    },

    viewTimeTables : function(callback)
    {
        sql = `SELECT time_table_id,date,COUNT(DISTINCT shedule_id) as tot_shedules FROM time_table LEFT OUTER JOIN time_table_shedule USING(time_table_id) GROUP BY (time_table_id)`
        pool.query(sql, function(err, result) {
            //console.log(result);
            if(err) throw err
            if(result){
                if(result.length) {
                    callback(result);
                }else {
                    callback(null);
                }
            }
            else {
                callback(null);
            }
        });
    },

    viewTripDetails : function(time_table_id,callback)
    {
        sql = `CALL TripDetails(?)`
        pool.query(sql, time_table_id,function(err, result) {
            if(err) throw err
            if(result[0]){
                //console.log(result[0]);
                if(result[0].length) {
                    callback(result[0]);
                }else {
                    callback(null);
                }
            }
            else {
                callback(null);
            }
        });
    },
}

module.exports = Admin;

