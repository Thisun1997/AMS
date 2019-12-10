const express = require('express');
const path = require('path')
const app = express();
app.use(express.json());
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var flash = require('connect-flash');
app.use(express.urlencoded({
    extended: true
}));

//app.use('/public',express.static(path.join(__dirname,'static')))
app.set('view engine', 'ejs')

require('./routes/routes.js')(app,passport);

app.listen(3000);