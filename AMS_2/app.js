const express = require('express');
const session = require('express-session');
const path = require('path');
const userRouter = require('./routes/userpages');
const adminRouter = require('./routes/adminpages');
const guestRouter = require('./routes/guestpages');
const app = express();

const errorController = require('./controllers/error')

// for body parser. to collect data that sent from the client.
app.use(express.urlencoded( { extended : false}));


// Serve static files. CSS, Images, JS files ... etc
app.use(express.static(path.join(__dirname, 'public')));


// Template engine. PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// session
app.use(session({
    secret:'youtube_video',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));


// Routers
app.use('/', userRouter);
app.use('/admin',adminRouter);
app.use('/guest',guestRouter);

// Errors => page not found 404
app.use(errorController.get404);


// Handling errors (send them to the client)
app.use(errorController.get500);



module.exports = app;