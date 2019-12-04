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

    getAnAirport : function(code = null,callback)
    {
        let sql = `SELECT * FROM airport WHERE code = ?`;


        pool.query(sql, code, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result[0]);
            }else {
                callback(null);
            }
        });
    },

    deleteAirport : function(code,_callback){
        let sql = 'DELETE FROM airport WHERE code = ?';
        pool.query(sql, code, function(err, _result) {
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
    addAirplaneTypeSeats : function(body) 
    {
        var bind = [];
        // loop in the attributes of the object and push the values into the bind array.
        for(prop in body){
            bind.push(body[prop]);
        }
        var letters = ["A","B","C","D"];
        for(j in letters){
            for(i=1; i<(parseInt(bind[1])/4)+1; i++){
                var eco = [];
                let seat_id = bind[0]+"-E-"+letters[j]+i.toString();
                eco.push(seat_id);
                eco.push(bind[0]);
                eco.push("economy")
                let sql = `INSERT INTO seat(seat_id,plane_type, seat_type) VALUES (?, ?, ?)`;
            // call the query give it the sql string and the values (bind array)
                pool.query(sql, eco, function(err, _result) {
                    if(err) throw err;
                });
            }      
        }

        for(j in letters){
            for(i=1; i<(parseInt(bind[2])/4)+1; i++){
                var bus = [];
                let seat_id = bind[0]+"-B-"+letters[j]+i.toString();
                bus.push(seat_id);
                bus.push(bind[0]);
                bus.push("business")
                let sql = `INSERT INTO seat(seat_id,plane_type, seat_type) VALUES (?, ?, ?)`;
            // call the query give it the sql string and the values (bind array)
                pool.query(sql, bus, function(err, _result) {
                    if(err) throw err;
                });
            }      
        }

        for(j in letters){
            for(i=1; i<(parseInt(bind[3])/4)+1; i++){
                var eco = [];
                let seat_id = bind[0]+"-P-"+letters[j]+i.toString();
                eco.push(seat_id);
                eco.push(bind[0]);
                eco.push("platinum")
                let sql = `INSERT INTO seat(seat_id,plane_type, seat_type) VALUES (?, ?, ?)`;
            // call the query give it the sql string and the values (bind array)
                pool.query(sql, eco, function(err, _result) {
                    if(err) throw err;
                });
            }      
        }
    },

    getEconomyAirplaneTypeSeats : function(plane_type = null, callback)
    {
        let sql = `SELECT seat_id FROM seat WHERE plane_type = ? AND seat_type = "economy"`;
        pool.query(sql, plane_type,  function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    getBusinessAirplaneTypeSeats : function( plane_type = null, callback)
    {
        let sql = `SELECT seat_id FROM seat WHERE plane_type = ? AND seat_type = "business"`
        pool.query(sql, plane_type, function(err, result) {
            if(err) throw err
           
            if(result.length) {
                callback(result);
            }else {
                callback(null);
            }
        });
    },

    getPlatinumAirplaneTypeSeats : function(plane_type = null, callback)
    {
        let sql = `SELECT seat_id FROM seat WHERE plane_type = ? AND seat_type = "platinum"`
        pool.query(sql, plane_type, function(err, result) {
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
        let sql = `INSERT INTO plane(plane_id,plane_type) VALUES (?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, _result) {
            if(err) throw err;
        });
    },

    getAirplanes : function(callback)
    {
        let sql = `SELECT * FROM plane`;


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
        let sql = `INSERT INTO passenger_category(category,description,discount) VALUES (?, ?, ?)`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, _result) {
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

    getAPassengerCategory: function(category = null,callback)
    {
        let sql = `SELECT * FROM passenger_category WHERE category = ?`;


        pool.query(sql, category, function(err, result) {
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
        let sql = `UPDATE passenger_category
        SET description = ?, discount = ?
        WHERE category = ?;`;
        // call the query give it the sql string and the values (bind array)
        pool.query(sql, bind, function(err, _result) {
            if(err) throw err;
            
        });
    },

    //shedule
    addShedule : function(callback)
    {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let today = year + "-" + month + "-" + date ;
        var bind = []
        bind.push(today);
        let sql = `SELECT * FROM shedule_list WHERE date = ?`

        pool.query(sql, bind, function(err,result) {
            if(err) throw err;
            if(result.length) {
                callback(result[0]);
            }else {
                let shedule_id = 'S-'+date+month+year;
                bind.push(shedule_id);
                let sql = `INSERT INTO shedule_list(date,shedule_id) VALUES (?, ?) `;
                pool.query(sql, bind, function(err, _result) {
                    if(err) throw err;
                    callback(bind)
                });
            }
        });
    }
}

module.exports = Admin;

