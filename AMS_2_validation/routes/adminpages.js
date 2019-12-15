const express = require('express');
const Admin = require('../core/admin');
const router = express.Router();
const shortid = require('shortid');

// create an object from the class User in the file core/user.js
const admin = new Admin();

// Get the index page
router.get('/',checkNoAuthenticated, (req, res, next) => {
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
router.get('/home', isLoggedIn,(req, res, next) => {
    let user = req.session.user;

    // if(user) {
        res.render('admin', {opp:req.session.opp, name:user.full_name});
    //     return;
    // }
    // res.redirect('/');
});

// Post login data
router.post('/login', checkNoAuthenticated,(req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    if ( req.body.email == "" || req.body.password == ""){
        res.send('empty too')
    }
    else{
        if(req.body.email == "admin" & req.body.password == "admin") {
            // Store the user data in a session.
            result = {email:"admin",password:"admin"}
            req.session.user = result;
            req.session.opp = 1;
            // redirect the user to the home page.
            console.log('login post ok')
            res.redirect('/admin/home');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    }

});

//airport
router.get('/addAirportPage',isLoggedIn,(req,res,next)=>{
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getAirports(function(result) {
                res.render('addAirport', {airports: result});
            });
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

router.post('/addAirport', isLoggedIn,(req, res, next) => {
    let userInput = {
        code: req.body.code,
        city: req.body.city,
        state: req.body.state,
        country:req.body.country,
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    admin.addAirport(userInput)
    res.redirect("/admin/addAirportPage")

});

router.get("/deleteAirport/:airport_id",isLoggedIn,(req,res,next)=>{
    let airport_id = req.params.airport_id;
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.deleteAirport(airport_id)
            res.redirect("/admin/addAirportPage")
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});


//airplane type
router.get('/addAirplaneTypePage',isLoggedIn,(req,res,next)=>{
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getAirplaneTypes(function(result) {
                res.render('addAirplaneType', {airplanetypes: result});
            });
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

router.post('/addAirplaneType',isLoggedIn, (req, res, next) => {
    let userInput = {
        plane_type: req.body.plane_type,
        tot_economy_seats: req.body.tot_economy_seats,
        tot_business_seats: req.body.tot_business_seats,
        tot_platinum_seats:req.body.tot_platinum_seats,
    };
    //admin.addAirplaneType(userInput)
    admin.addAirplaneTypeAndSeats(userInput)
    res.redirect("/admin/addAirplaneTypePage")

});

router.get("/deleteAirplaneType/:plane_type",isLoggedIn,(req,res,next)=>{
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.deleteAirplaneType(plane_type)
            res.redirect("/admin/addAirplaneTypePage")
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

router.get("/viewAirplaneType/:plane_type",isLoggedIn,(req,res,next)=>{
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getEconomyAirplaneTypeSeats(plane_type, function(resulte) {
                admin.getBusinessAirplaneTypeSeats(plane_type, function(resultb) {
                    admin.getPlatinumAirplaneTypeSeats(plane_type, function(resultp) {
                        res.render('viewAirplaneType', {economy: resulte, business: resultb, platinum: resultp});
                    });
                });
            });
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

/*router.post('/viewAirplaneType', (req, res, next) => {
    let userInput = {
        tot_economy_seats: req.body.tot_economy_seats,
        tot_business_seats: req.body.tot_business_seats,
        tot_platinum_seats:req.body.tot_platinum_seats,
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    admin.editAirplaneType(userInput)
    res.redirect("/admin/addAirplaneTypePage")

});*/


//airplane
router.get('/addAirplanePage',isLoggedIn,(req,res,next)=>{
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getAirplanes(function(result) {
                admin.getAirplaneTypes(function(result2){
                    res.render('addAirplane', {airplanes: result, airplanetypes: result2});
                })   
            });
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

router.post('/addAirplane', isLoggedIn,(req, res, next) => {
    let userInput = {
        plane_id: req.body.plane_id,
        plane_type: req.body.plane_type
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    admin.addAirplane(userInput)
    res.redirect("/admin/addAirplanePage")
});

router.get("/deleteAirplane/:plane_id",isLoggedIn,(req,res,next)=>{
    let plane_id = req.params.plane_id;
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.deleteAirplane(plane_id)
            res.redirect("/admin/addAirplanePage")
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

//
router.get('/login',checkNoAuthenticated,(req,res,next)=>{
    res.render('adminLogin')
});


//passenger category
router.get('/addPassengerCategoryPage',isLoggedIn,(req,res,next)=>{
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getPassengerCategories(function(result) {
                res.render('addPassengerCategory', {categories: result});
            });
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

router.post('/addPassengerCategory', (req, res, next) => {
    let userInput = {
        category_name: req.body.category_name,
        No_of_reservations: req.body.No_of_reservations,
        discount: req.body.discount,
    };
    admin.addPassengerCategory(userInput)
    res.redirect("/admin/addPassengerCategoryPage")

});

router.post('/editPassengerCategory', (req, res, next) => {
    let userInput = {
        No_of_reservations: req.body.No_of_reservations,
        discount: req.body.discount,
        category_name: req.body.category_name,
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    admin.editPassengerCategory(userInput)
    res.redirect("/admin/addPassengerCategoryPage")

});

router.get("/editPassengerCategory/:category_id",isLoggedIn,(req,res,next)=>{
    let category_id = req.params.category_id;
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getAPassengerCategory(category_id, function(result) {
                res.render('editPassengerCategoryPage', {category: result});
            });
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

//add route
router.get('/addRoutePage',isLoggedIn,(req,res,next)=>{
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
                admin.getAirplanes(function(result1) {
                    admin.getAirports(function(result2){
                        admin.getRoute(function(result) {
                            res.render('addRoute', {airplanes: result1, airports: result2, routeDetails: result});
                        }); 
                    });
                }); 
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

router.post('/addRoute', (req, res, next) => {
    let userInput1 = {
        plane_id: req.body.plane_id,
        dept_airport_code: req.body.dept_airport_code,
        dest_airport_code: req.body.dest_airport_code,
    };
    let userInput2 = {
        dept_time: req.body.dept_time,
        arr_time: req.body.arr_time
    };
    admin.addRoute(userInput1,userInput2);
    res.redirect("/admin/addRoutePage")
});


//addshedule
router.get('/addShedulePage',isLoggedIn,(req,res,next)=>{
    let user = req.session.user;
    // if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getRoute(function(result) {
                res.render('addShedule', {routeDetails: result});
            });
        }
        else{
            res.redirect("/")
        }
    // }
    // else{
    //     res.redirect("/")
    // }
});

router.post('/addShedule', (req, res, next) => {
    let date = req.body.date;
    let route_id = req.body.route_id
    if (date == "" || route_id == ""){
        admin.getRoute(function(result2) {
            admin.getRouteTime(route_id,function(result3){
                res.render('addShedule',{routeDetails: result2,timedata: result3,msg: "empty"})
            });
        });
    }
    else{
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
    }
});


//add trip
router.post('/addTrip',(req,res,next) => {
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
    let time_table_id = req.body.time_table_id;
    admin.addSheduleAndTrip(userInput1,userInput2,time_table_id);
    res.redirect('/admin/addShedule');
});



// Get loggout page
router.get('/loggout',isLoggedIn, (req, res, next) => {
    // Check if the session is exist
    // if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
        res.redirect('/');
        });
    // }
});


// function checkNoAuthenticatedPassport(req,res,next){
//     if(req.isAuthenticated()){
//         console.log('is no authenticated')
//         return res.redirect('/')
//     }
//     next()
// }

function checkNoAuthenticated(req,res,next){
    if(req.session.user){
        console.log('is no authenticated')
        return res.redirect('/admin/home')
    }
    next()
}

function isLoggedIn(req,res,next){
    if(req.session.user){
        return next()
    }
    res.redirect('/')
}

module.exports = router;