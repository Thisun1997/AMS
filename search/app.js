const express = require('express');
const path = require('path')
const app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// var flash = require('connect-flash');

//app.use('/public',express.static(path.join(__dirname,'static')))
app.set('view engine', 'ejs')

// app.get('/:userquery',(req,res)=>{
//     res.render('index',{data: {userquery: req.params.userquery,
//             searchResults: [req.params.userquery+'1',req.params.userquery+'2',req.params.userquery+'3'], 
//             loggedIn: true,
//             username: 'savindu' }})
// })

app.get('/',(req,res)=>{
    res.render('index.ejs');
})

app.get('/searchNew',(req,res)=>{
    res.render('searchnew.ejs');
})

app.post('/searchNew',passport.authenticate('new-search',{
    successRedirect: '/searchnew',
    failureRedirect: '/index',
    failureFlash: true 
}))

var list = ['books', 'cars']
var dbDictionary = { books: ['book1', 'book2', 'book3'], cars: ['car1', 'car2'] };


app.get('/:userquery', (req, res) => {
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

app.listen(3000);