const express = require('express');
const User = require('../core/user');
const router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
// create an object from the class User in the file core/user.js
const user = new User();

// Get the index page
router.get('/', (req, res, next) => {
    if(req.session.search){
        //console.log(req.session.locations);
        res.render('index', {title:"My application",locations: req.session.locations,search: req.session.search,moment: moment});
    }
    else if(req.session.msg){
        user.getAirports(function(result2){
            res.render('index', {title:"My application",locations: result2,msg: req.session.msg})
        });
    }
    else{
        user.getAirports(function(result2){
            res.render('index', {title:"My application",locations: result2})
        });
    }
});

router.post('/search', (req, res, next) => {
    let userInput = {
        dest_airport_code: req.body.dest_airport_code,
        dept_airport_code: req.body.dept_airport_code,
        date: req.body.date
    }
    user.search(userInput, function(result1){
        if(result1){
            user.getAirports(function(result2){
                req.session.search = result1;
                req.session.locations = result2;
                //console.log(req.session)
                res.redirect('/') 
            }); 
        } 
        else{
            user.getAirports(function(result2){
                req.session.search = null;
                req.session.msg = "No results found"
                res.redirect('/')
            }); 
        } 
    });
});

// Get home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;
    if(user){
        if(user.email == "admin" & user.password == "admin"){
            res.redirect('/admin/home');
            return;
        }
        else if(user) {
            //console.log(user);
            //console.log(req.session);
            res.render('home', {opp:req.session.x, user,moment:moment});
            return;
        }
    }
    else{
        res.redirect('/');
    }
    
});

// Post login data
router.post('/login', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    if ( req.body.email == "" || req.body.password == ""){
        res.send('empty')
    }
    else{
    user.login(req.body.email, req.body.password, function(result) {
        if(result) {
            // Store the user data in a session.
            req.session.user = result;
            req.session.x = 1;
            // redirect the user to the home page.
            res.redirect('/home');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    })}

});

router.get('/registerRedirect',(req,res,next)=>{
    res.render('register-page')
});

router.get('/loginGuest',(req,res,next)=>{
    res.render('guestlogin')
});

// Post register data
router.post('/register', (req, res, next) => {
    let userInput1 = {
        full_name: req.body.full_name,
        date_of_birth: req.body.date_of_birth,
        gender:req.body.gender,
        citizenship: req.body.citizenship,
    };
    let userInput2 = {
        email: req.body.email,
        password: req.body.password
    }
    
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.createMember(userInput1, userInput2, function(lastid) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastid) {
            // Get the user data by it's id. and store it in a session.
            user.findmember(lastid, function(result) {
                req.session.user = result;
                req.session.opp = 0;
                res.redirect('/home');
            });

        
        }else {
            console.log('Error creating a new user ...');
        }
    });

});

router.post('/guestLogin', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        full_name: req.body.full_name,
        email: req.body.email,
        date_of_birth: req.body.date_of_birth,
        gender:req.body.gender,
        citizenship: req.body.citizenship,
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