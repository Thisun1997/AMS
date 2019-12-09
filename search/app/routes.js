module.exports = function (app, passport) {
    app.get('/', (req, res) => {
        res.render('index.ejs');
    })

    app.get('/searchNew', (req, res) => {
        res.render('searchNew.ejs');
    })

    app.post('/searchNew', passport.authenticate('new-search', {
        successRedirect: '/searchNew',
        failureRedirect: '/index',
        failureFlash: true
    }),
    function(req,res){
        if(req.body.remember){
            req.session.cookie.maxAge= 1000*60*3;
        }else{
            req.session.cookie.expires=false;
        }
        res.redirect('/');
    })

    
    app.get('/:userquery', (req, res) => {
        var list = ['books', 'cars']
        var dbDictionary = { books: ['book1', 'book2', 'book3'], cars: ['car1', 'car2'] };
        tempList: []
        userSearched = req.params.userquery

        for (var key in dbDictionary) {
            // check if the property/key is defined in the object itself, not in parent
            if (dbDictionary.hasOwnProperty(key)) {
                if (key == userSearched) {
                    tempList = dbDictionary[key]
                    console.log(key, dbDictionary[key]);

                    res.render('search', {
                        data: {
                            userquery: req.params.userquery,
                            list: list,
                            listItem: tempList,
                            loggedIn: true,
                            username: 'savindu'
                        }
                    });
                }


            }
        }



    })

}