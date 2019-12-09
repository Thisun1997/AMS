module.exports= function(app,passport){
    const Joi = require('joi')

    app.get('/',checkNoAuthenticated,function(req,res){
        res.render('index.ejs')
    });

    app.get('/login',checkNoAuthenticated,function(req,res){
        res.render('login.ejs', {message:req.flash('loginMesssage')});
    })

    app.post('/login',checkNoAuthenticated, passport.authenticate('local-login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req,res){
        if(req.body.remember){
            req.session.cookie.maxAge= 1000*60*3;
        }else{
            req.session.cookie.expires=false;
        }
        res.redirect('/');
    });

    app.get('/signup',checkNoAuthenticated,function(req,res){
        res.render('signup.ejs', {message:req.flash('signupMesssage')});
    })

    app.post('/signup',checkNoAuthenticated, passport.authenticate('local-signup',{
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
//     app.post('/signup',function(req,res)
//     {
// console.log(req.body)
//     });

    app.get('/profile',isLoggedIn,function(req,res){
        res.render('profile.ejs',{
            user:req.user
        });
    });

    app.get('/logout',function(req,res){
        req.logout();
        res.redirect('/');
    })
};

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();

    res.redirect('/')
}

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNoAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/profile')
    }
    next()
}
