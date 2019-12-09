var LocalStrategy = require('passport-local').Strategy;
const Joi = require('joi');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection({host: "localhost",
user: "root",
password: ""});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

connection.query('USE ' + 'nodejs_login');

module.exports = function(passport){
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        connection.query("SELECT * FROM users WHERE id=?",[id],
        function(err,rows){
            done(err,rows[0]);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameFeild: 'username',
            passwordField: 'password',
            passReqToCallback:true
        }, 
        function(req,username,password,done){
            
            connection.query("SELECT * FROM users WHERE username = ?",
            [username],function(err,rows){
                
                console.log('hi log')
                if(err){
                    console.log('hi')
                    return done(err);}
                if(rows.length){
                    console.log('hi1')
                    
                    return done(null,false,req.flash('signupMessage','That is already taken'));
                }
                else{
                    
                    console.log('new')
                    // const schema= Joi.object().keys({
                
                    //     username: Joi.string().required(),
                    //     password: Joi.string().min(6).max(15).required()
                    // });

                    const schema = Joi.object().keys({
                        username: Joi.string().alphanum().min(5).max(16).required(),
                        password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required()
                    }).with('username', 'password');
                    console.log('abc')
                    Joi.validate(req.body,schema,(err,result)=>{
                        console.log('abc1')
                        if(err){
                            console.log(err.details)
                           // result.send('an error has occured')
                           return done(null,false,req.flash('signupMesssage',err.details));
                        }
                        else{
                            console.log('no validate error. database updated')
                            var newUserMysql ={
                                username: username,
                                password: bcrypt.hashSync(password,null,null)
                            };

                            var insertQuery = "INSERT INTO users (username,password) values (?,?)";
                            connection.query(insertQuery,[newUserMysql.username,newUserMysql.password],
                                function(err,rows){
                                    newUserMysql.id=rows.insertId;
                                    console.log('hi2')
                                    return done(null,newUserMysql);
                                });

                        }
                    })


                    //=================

                    
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req,username,password,done){
            

            console.log('login hi')
            connection.query("SELECT * FROM users WHERE username = ?",[username],
            function(err,rows){
                console.log('login hi0')
                if(err){
                    console.log('login hi1')
                    return done(err);
                }
                if(!rows.length){
                    console.log('login hi2')
                    return done(null,false,req.flash())
                }
                console.log('login hi3')


                if(!bcrypt.compareSync(password,rows[0].password)){
                    console.log('login hi4')
                    return done(null,false,flash('loginMessage','Wrong Password'));
                }
                console.log('login hi5')
            return done(null,rows[0]);
            });
        }
        )
    )
};