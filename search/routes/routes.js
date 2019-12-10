module.exports = function (app, passport) {
    app.get('/', (req, res) => {
        res.render('index.ejs');
    })

    app.get('/searchNew', (req, res) => {
        res.render('searchNew.ejs');
    })

    // app.post('/searchNew',(req,res)=>{
    //     console.log(req.body)
    //     res.render('searchNew');
   // })

    
    app.post('/searchNew', (req, res) => {
        var list = ['books', 'cars']
        var dbDictionary = { books: ['book1', 'book2', 'book3'], cars: ['car1', 'car2'] };
        var tempList =  []
        var userSearched = req.body.search

        for (var key in dbDictionary) {
            // check if the property/key is defined in the object itself, not in parent
            if (dbDictionary.hasOwnProperty(key)) {
                if (key == userSearched) {
                    tempList = dbDictionary[key]
                    console.log(key, dbDictionary[key]);

                    res.render('search', {
                        data: {
                            userquery: req.body.search,
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