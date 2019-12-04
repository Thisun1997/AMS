const express = require('express');
const User = require('../core/user');
const router = express.Router();
const shortid = require('shortid');

// create an object from the class User in the file core/user.js
const user = new User();

// Get the index page
router.get('/', (req, res, next) => {
    let user = req.session.user;
    // If there is a session named user that means the use is logged in. so we redirect him to home page by using /home route below
    if(user) {
        res.redirect('/home');
        return;
    }
    // IF not we just send the index page.
    res.render('index', {title:"My application"});
})

// Get home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;
    if(user.email == "admin" & user.password == "admin"){
        res.redirect('/admin/home');
        return;
    }
    else if(user) {
        res.render('home', {opp:req.session.opp, name:user.full_name});
        return;
    }
    res.redirect('/');
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
            req.session.opp = 1;
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
    passenger_id = shortid.generate()
    user.findmember(passenger_id, function(result){
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
    user.createMember(userInput, function(lastemail) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastemail) {
            // Get the user data by it's id. and store it in a session.
            user.findmember(lastemail, function(result) {
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