const express = require('express');
const Admin = require('../core/admin');
const router = express.Router();
const shortid = require('shortid');

// create an object from the class User in the file core/user.js
const admin = new Admin();

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
        res.send('empty too')
    }
    else{
        if(req.body.email == "admin" & req.body.password == "admin") {
            // Store the user data in a session.
            result = {email:"admin",password:"admin"}
            req.session.user = result;
            req.session.opp = 1;
            // redirect the user to the home page.
            res.redirect('/admin/home');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    }

});

//airport
router.get('/addAirportPage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getAirports(function(result) {
                res.render('addAirport', {airports: result});
            });
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }
});

router.post('/addAirport', (req, res, next) => {
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

router.get("/deleteAirport/:code",(req,res,next)=>{
    let code = req.params.code;
    let user = req.session.user;
    if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.deleteAirport(code)
            res.redirect("/admin/addAirportPage")
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }
});


//airplane type
router.get('/addAirplaneTypePage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getAirplaneTypes(function(result) {
                res.render('addAirplaneType', {airplanetypes: result});
            });
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }
});

router.post('/addAirplaneType', (req, res, next) => {
    let userInput = {
        plane_type: req.body.plane_type,
        tot_economy_seats: req.body.tot_economy_seats,
        tot_business_seats: req.body.tot_business_seats,
        tot_platinum_seats:req.body.tot_platinum_seats,
    };
    admin.addAirplaneType(userInput)
    admin.addAirplaneTypeSeats(userInput)
    res.redirect("/admin/addAirplaneTypePage")

});

router.get("/deleteAirplaneType/:plane_type",(req,res,next)=>{
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.deleteAirplaneType(plane_type)
            res.redirect("/admin/addAirplaneTypePage")
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }
});

router.get("/viewAirplaneType/:plane_type",(req,res,next)=>{
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    if(user){
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
    }
    else{
        res.redirect("/")
    }
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
router.get('/addAirplanePage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
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
    }
    else{
        res.redirect("/")
    }
});

router.post('/addAirplane', (req, res, next) => {
    let userInput = {
        plane_id: req.body.plane_id,
        plane_type: req.body.plane_type
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    admin.addAirplane(userInput)
    res.redirect("/admin/addAirplanePage")

});

router.get("/deleteAirplane/:plane_id",(req,res,next)=>{
    let plane_id = req.params.plane_id;
    let user = req.session.user;
    if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.deleteAirplane(plane_id)
            res.redirect("/admin/addAirplanePage")
        }
        else{
            res.redirect("/")
        }
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
        if (user.email == "admin" & user.password == "admin"){
            admin.getPassengerCategories(function(result) {
                res.render('addPassengerCategory', {categories: result});
            });
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }
});

router.post('/addPassengerCategory', (req, res, next) => {
    let userInput = {
        category: req.body.category,
        description: req.body.description,
        discount: req.body.discount,
    };
    admin.addPassengerCategory(userInput)
    res.redirect("/admin/addPassengerCategoryPage")

});

router.post('/editPassengerCategory', (req, res, next) => {
    let userInput = {
        description: req.body.description,
        discount: req.body.discount,
        category: req.body.category,
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    admin.editPassengerCategory(userInput)
    res.redirect("/admin/addPassengerCategoryPage")

});

router.get("/editPassengerCategory/:category",(req,res,next)=>{
    let category = req.params.category;
    let user = req.session.user;
    if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.getAPassengerCategory(category, function(result) {
                res.render('editPassengerCategoryPage', {category: result});
            });
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }
});

//add route
router.get('/addRoutePage',(req,res,next)=>{
    let user = req.session.user;
    if(user){
        if (user.email == "admin" & user.password == "admin"){
            admin.addShedule(function(shedule_id){
                admin.getAirplanes(function(result1) {
                    admin.getAirports(function(result2){
                        res.render('addRoute', {airplanes: result1, airports: result2, shedule_id: shedule_id});
                    });
                }); 
            });
        }
        else{
            res.redirect("/")
        }
    }
    else{
        res.redirect("/")
    }
});

router.post('/addRoute', (req, res, next) => {
    let userInput = {
        category: req.body.category,
        description: req.body.description,
        discount: req.body.discount,
    };
    admin.addRoute(userInput)
    admin.addRouteToShedule()
    res.redirect("/admin/addRoutePage")

});

// Post register data
/*router.post('/guestLogin', (req, res, next) => {
    // prepare an object containing all user inputs.
    passenger_id = shortid.generate()
    user.findguest(passenger_id, function(result){
        while (result != null){
            passenger_id = shortid.generate()
        }
    });
    let userInput = {
        passenger_id: passenger_id,
        full_name: req.body.full_name,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        gender:req.body.gender,
        citizenship: req.body.citizenship,
        password: req.body.password
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.createGuest(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastId) {
            // Get the user data by it's id. and store it in a session.
            user.findguest(lastId, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });

        }else {
            console.log('Error creating a new user ...');
        }
    });

});*/


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