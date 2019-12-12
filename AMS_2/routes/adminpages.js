const express = require('express');
const Admin = require('../core/admin');
const Validate = require('../core/validate');
const router = express.Router();
const shortid = require('shortid');

// create an object from the class User in the file core/user.js
const admin = new Admin();
const validate = new Validate();

// Get the index page
router.get('/', (req, res, next) => {
    let user = req.session.user;
    // If there is a session named user that means the use is logged in. so we redirect him to home page by using /home route below
    if(user) {
        res.redirect('/admin/home');
        return;
    }
    // IF not we just send the index page.
    res.redirect('/');
});

// Get home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.render('admin', {opp:req.session.opp, name:user.full_name});
        return;
    }
    res.redirect('/');
});

// Post login data
router.post('/login', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    if ( req.body.email == "" || req.body.password == ""){
        res.render('adminLogin',{msg:'fields cannot be empty!'})
    }
    else{
        validate.checkAdmin(req.body,function(result){
            if(result){
                result = {email:"admin",password:"admin"}
                req.session.user = result;
                req.session.opp = 1;
                // redirect the user to the home page.
                res.redirect('/admin/home');
            }else {
                // if the login function returns null send this error message back to the user.
                res.render('adminLogin',{msg:'Username/Password incorrect!'});
            }
        }); 
            // Store the user data in a session.
    }

});

//airport
router.get('/addAirportPage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getAirports(function(result) {
                    res.render('addAirport', {airports: result});
                });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        }); 
    }
    else{
        res.redirect("/")
    }
});

router.post('/addAirport', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        code: req.body.code,
        city: req.body.city,
        state: req.body.state,
        country:req.body.country,
    };
    
    validate.checkAdmin(user,function(result){
        if(result){
            validate.check(userInput,function(result){
                if (result == true){
                    admin.getAirports(function(result) {
                        res.render('addAirport', {airports: result,msg:"fields cannot be empty"});
                    });
                }
                else{
                    admin.addAirport(userInput)
                    res.redirect("/admin/addAirportPage")
                }
            });
        }else {
             // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    }); 
});
    // call create function. to create a new user. if there is no error this function will return it's id.



router.get("/deleteAirport/:airport_id",(req,res,next)=>{
    let airport_id = req.params.airport_id;
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.deleteAirport(airport_id)
                res.redirect("/admin/addAirportPage")
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        }); 
    }
    else{
        res.redirect("/")
    }
});


//airplane type
router.get('/addAirplaneTypePage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getAirplaneTypes(function(result) {
                res.render('addAirplaneType', {airplanetypes: result});
                });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else{
        res.redirect("/")
    }
});

router.post('/addAirplaneType', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        plane_type: req.body.plane_type,
        tot_economy_seats: req.body.tot_economy_seats,
        tot_business_seats: req.body.tot_business_seats,
        tot_platinum_seats:req.body.tot_platinum_seats,
    };
    //admin.addAirplaneType(userInput)
    
            validate.checkAdmin(user,function(result){
                if(result){
                    validate.check(userInput,function(result){
                        if (result == true){
                            admin.getAirplaneTypes(function(result) {
                                res.render('addAirplaneType', {airplanetypes: result, msg:"fields cannot be empty"});
                            });
                        }
                        else{
                            admin.addAirplaneTypeAndSeats(userInput)
                            res.redirect("/admin/addAirplaneTypePage")
                        }
                    });
                }
                else {
                    // if the login function returns null send this error message back to the user.
                    res.redirect("/")
                }
            });
});

router.get("/deleteAirplaneType/:plane_type",(req,res,next)=>{
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.deleteAirplaneType(plane_type)
                res.redirect("/admin/addAirplaneTypePage")
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else{
        res.redirect("/")
    }
});

router.get("/viewAirplaneType/:plane_type",(req,res,next)=>{
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getEconomyAirplaneTypeSeats(plane_type, function(resulte) {
                    admin.getBusinessAirplaneTypeSeats(plane_type, function(resultb) {
                        admin.getPlatinumAirplaneTypeSeats(plane_type, function(resultp) {
                            admin.getAnAirplaneType(plane_type,function(resultt){
                                res.render('viewAirplaneType', {economy: resulte, business: resultb, platinum: resultp, plane_type_name: resultt});
                            });
                        });
                    });
                });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else{
        res.redirect("/")
    }
});

//airplane
router.get('/addAirplanePage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getAirplanes(function(result) {
                    admin.getAirplaneTypes(function(result2){
                        res.render('addAirplane', {airplanes: result, airplanetypes: result2});
                    })   
                });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else{
        res.redirect("/")
    }
});

router.post('/addAirplane', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        plane_id: req.body.plane_id,
        plane_type: req.body.plane_type
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
            validate.checkAdmin(user,function(result){
                if(result){
                    validate.check(userInput,function(result){
                        if (result == true){
                            admin.getAirplanes(function(result) {
                                admin.getAirplaneTypes(function(result2){
                                    res.render('addAirplane', {airplanes: result, airplanetypes: result2, msg:"fields cannot be empty"});
                                })   
                            });
                        }
                        else{
                            admin.addAirplane(userInput)
                            res.redirect("/admin/addAirplanePage")
                        }
                    });
                }
                else {
                    // if the login function returns null send this error message back to the user.
                    res.redirect("/")
                }
            });    
    });

router.get("/deleteAirplane/:plane_id",(req,res,next)=>{
    let plane_id = req.params.plane_id;
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.deleteAirplane(plane_id)
                res.redirect("/admin/addAirplanePage")
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        }); 
    }
    else{
        res.redirect("/")
    }
});

//
router.get('/login',(req,res,next)=>{
    res.render('adminLogin')
});


//passenger category
router.get('/addPassengerCategoryPage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getPassengerCategories(function(result) {
                    res.render('addPassengerCategory', {categories: result});
                });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        }); 
    }
    else{
        res.redirect("/")
    }
});

router.post('/addPassengerCategory', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        category_name: req.body.category_name,
        No_of_reservations: req.body.No_of_reservations,
        discount: req.body.discount,
    };
            validate.checkAdmin(user,function(result){
                if(result){
                    validate.check(userInput,function(result){
                        if (result == true){
                            admin.getPassengerCategories(function(result) {
                                res.render('addPassengerCategory', {categories: result, msg:"fields cannot be empty"});
                            });
                        }
                        else{
                            admin.addPassengerCategory(userInput)
                            res.redirect("/admin/addPassengerCategoryPage")
                        }
                    });
                }else {
                    // if the login function returns null send this error message back to the user.
                    res.redirect("/")
                }
            });
    });



router.post('/editPassengerCategory', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        No_of_reservations: req.body.No_of_reservations,
        discount: req.body.discount,
        category_name: req.body.category_name,
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    validate.checkAdmin(user,function(result){
        if(result){
            admin.editPassengerCategory(userInput)
            res.redirect("/admin/addPassengerCategoryPage")
        }else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get("/editPassengerCategory/:category_id",(req,res,next)=>{
    let category_id = req.params.category_id;
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getAPassengerCategory(category_id, function(result) {
                    res.render('editPassengerCategoryPage', {category: result});
                });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else{
        res.redirect("/")
    }
});

//add route
router.get('/addRoutePage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getAirplanes(function(result1) {
                    admin.getAirports(function(result2){
                        admin.getRoute(function(result) {
                            res.render('addRoute', {airplanes: result1, airports: result2, routeDetails: result});
                        }); 
                    });
                }); 
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else{
        res.redirect("/")
    }
});

router.post('/addRoute', (req, res, next) => {
    let user = req.session.user;
    let userInput1 = {
        plane_id: req.body.plane_id,
        dept_airport_code: req.body.dept_airport_code,
        dest_airport_code: req.body.dest_airport_code,
    };
    let userInput2 = {
        dept_time: req.body.dept_time,
        arr_time: req.body.arr_time
    };
    validate.checkAdmin(user,function(result){
        if(result){
            admin.addRoute(userInput1,userInput2);
            res.redirect("/admin/addRoutePage") 
        }else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});


//addshedule
router.get('/addShedulePage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getRoute(function(result) {
                    res.render('addShedule', {routeDetails: result});
                });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else{
        res.redirect("/")
    }
});

router.post('/addShedule', (req, res, next) => {
    let user = req.session.user;
    let date = req.body.date;
    let route_id = req.body.route_id
    if (date == "" || route_id == ""){
        validate.checkAdmin(user,function(result){
            if(result){
                admin.getRoute(function(result2) {
                    res.render('addShedule',{routeDetails: result2,msg: "fields cannot be empty"})
                });
            }
            else{
                res.redirect("/")
            }
        });
    }
    else{
        validate.checkAdmin(user,function(result){
            if(result){
                    admin.addTimeTable(date,function(result1){
                        admin.getRoute(function(result2) {
                            admin.getRouteTime(route_id,function(result3){
                                admin.getAroute(route_id,function(result4){
                                    admin.getNo_ofSeats(route_id,function(result5){
                                        res.render('addShedule',{timetable: result1,routeDetails: result2,timedata: result3,route: result4,seats: result5})
                                    });
                                });
                            });
                        });
                    });
            }else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
});


//add trip
router.post('/addTrip',(req,res,next) => {
    let user = req.session.user;
    let userInput2 = {
        economy_price: req.body.economy_price,
        business_price: req.body.business_price,
        platinum_price: req.body.platinum_price
    }
    let userInput1 = {
        route_id: req.body.route_id,
        dept_time: req.body.dept_time,
        arr_time: req.body.arr_time
    }
                validate.checkAdmin(user,function(result){
                    if(result){
                        validate.check(userInput1,function(result1){
                            validate.check(userInput2,function(result2){
                                if (result1 == true || result2 == true){
                                    admin.getRoute(function(result2) {
                                            res.render('addShedule',{routeDetails: result2,msg: "fields cannot be empty"})
                                    });
                                }
                                else{
                                    let time_table_id = req.body.time_table_id;
                                    admin.addSheduleAndTrip(userInput1,userInput2,time_table_id);
                                    admin.getRoute(function(result) {
                                        res.render('addShedule', {routeDetails: result,msg2:"trip added successfully"});
                                    });
                                }
                            });
                        });
                    }
                    else {
                        // if the login function returns null send this error message back to the user.
                        res.redirect("/")
                    }
                });
        });


// Get loggout page
router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = router;