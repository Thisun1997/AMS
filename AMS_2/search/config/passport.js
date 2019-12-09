var LocalStrategy = require('passport-local').Strategy;

module.exports =function(passport){
    console.log('hi')

    // passport.serializeUser(function(user,done){
    //     done(null,user.id);
    // });

    passport.use(
        'new-search',
        new LocalStrategy({
            seachField:'search',
            passReqToCallback:true
        },
        
        function(req,search,done){
            return done(null,search,req.flash('searched','done'))
        })
    )
}