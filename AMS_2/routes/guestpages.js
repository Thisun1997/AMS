const express = require('express');
const Guest = require('../core/guest');
const router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
// create an object from the class User in the file core/user.js
const user = new Guest();

// Get the index page
router.get('/', (req, res, next) => {
    if(req.session.user){
        if(req.session.search){
            console.log(req.session);
            res.render('guest_home', {title:"My application",locations: req.session.locations,search: req.session.search,moment: moment,user:req.session.user,opp:req.session.x,guests: req.session.guests});
        }
        else if(req.session.msg){
            user.getAirports(function(result2){
                res.render('guest_home', {title:"My application",locations: result2,msg: req.session.msg,user:req.session.user,opp:req.session.x,moment:moment})
            });
        }
        else{
            user.getAirports(function(result2){
                res.render('guest_home', {title:"My application",locations: result2,user:req.session.user,opp:req.session.x,moment: moment})
            });
        }
    }
    else{
        if(req.session.search){
            console.log(req.session);
            res.render('index', {title:"My application",locations: req.session.locations,search: req.session.search,moment: moment,guests: req.session.guests});
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
    }
});

router.post('/search', (req, res, next) => {
    let userInput = {
        dest_airport_code: req.body.dest_airport_code,
        dept_airport_code: req.body.dept_airport_code,
        date: req.body.date,
        seats: req.body.seats
    }
    var guests = [req.body.adults,req.body.children,req.body.infants]
    user.search(userInput,function(result1){
        if(result1){
            user.getAirports(function(result2){
                console.log(result1)
                req.session.search = result1;
                req.session.locations = result2;
                req.session.guests = guests;
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
    let user1 = req.session.user;
    if(user1){
        if(user1.email == "admin" & user1.password == "admin"){
            res.redirect('/admin/home');
            return;
        }
        else if(user1) {
            res.redirect('/')
            return;
        }
    }
    else{
        res.redirect('/');
    }
    
});


router.get('/loginGuest',(req,res,next)=>{
    //if(req.session.search){
        console.log(req.session);
        res.render('guestlogin', {title:"My application",locations: req.session.locations,search: req.session.search,moment: moment});
  
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
                console.log(req.session)
                res.redirect('/home');
            });

        }else {
            console.log('Error creating a new user ...');
        }
    });

});



router.get("/bookTrip/:trip_id",(req,res,next)=>{
    if(req.session.user){
                var trip_id =parseInt(req.params.trip_id)
                var search = req.session.search ;
                req.session.guests_booked = null;
                req.session.guests_details = [];
                for( s in req.session.search ){
                    //console.log(search[s], trip_id)
                    if (search[s].trip_id == trip_id){
                        req.session.trip = search[s];
                    }
                }
                console.log(req.session.trip);
                guests_booked = []
                for(i in req.session.guests){
                    console.log(i);
                    req.session.guests[i] = parseInt(req.session.guests[i]);
                    guests_booked.push(req.session.guests[i])
                }
                req.session.guests_booked = guests_booked;
                var seat_list = []
                var seat_type_count = [0,0,0]
                var total = parseFloat("0.00")
                req.session.seat_type_count = seat_type_count
                req.session.seat_list = seat_list
                req.session.total = total;
                res.render('add_guest', {guests: req.session.guests,guests_booked: req.session.guests_booked,trip: req.session.trip,type: "a",moment:moment});
            }
    else{
        res.redirect("/")
    }
});

router.get("/bookTrip", (req,res,next) =>{
//console.log(req.session.trip) 
if(req.session.user){

    var plane_type = req.session.trip.plane_type_id;

    user.getEconomyAirplaneTypeSeats(plane_type, function(resulte) {
            user.getBusinessAirplaneTypeSeats(plane_type, function(resultb) {
                user.getPlatinumAirplaneTypeSeats(plane_type, function(resultp) {
                    user.getAnAirplaneType(plane_type,function(resultt){
                        //console.log(resultb);
                        // var seat_list = []
                        // req.session.seat_list = seat_list
                        res.render('bookSeat', {economy: resulte, business: resultb, platinum: resultp, plane_type_name: resultt,trip: req.session.trip,guest_details: req.session.guests_details,moment: moment,seat_list: req.session.seat_list,total: req.session.total});
                    });
                });
            });
        });
}
else{
    res.redirect("/")
}
});

router.post('/addGuest', (req,res,next)=>{
if(req.session.user){
    let guests_details = req.session.guests_details
    let adults = parseInt(req.session.guests_booked[0])
    let children = parseInt(req.session.guests_booked[1])
    let infants = parseInt(req.session.guests_booked[2])
    if (adults > 0){
        let userInput = {
            guest: "a" + (req.session.guests[0]-req.session.guests_booked[0]).toString(),
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            requirements: req.body.requirements,
            price: null,
            seat_id: null,
            pay: 0
        }
        guests_details.push(userInput);
        adults -= 1
        req.session.guests_details = guests_details
        req.session.guests_booked[0] = adults
        console.log(req.session.guests,req.session.guests_booked,req.session.guests_details)
        res.render('add_guest', {guests: req.session.guests,guests_booked: req.session.guests_booked,trip: req.session.trip,guests_details: req.session.guests_details,type: "a",moment: moment});
    }
    else if(children > 0){
        let userInput = {
            guest: "c"+(req.session.guests[1]-req.session.guests_booked[1]).toString(),
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            requirements: req.body.requirements,
            price: null,
            seat_id: null,
            pay: 0
        }
        guests_details.push(userInput);
        children -= 1
        req.session.guests_details = guests_details
        req.session.guests_booked[1] = children
        console.log(req.session.guests,req.session.guests_booked,req.session.guests_details)
        res.render('add_guest', {guests: req.session.guests,guests_booked: req.session.guests_booked,trip: req.session.trip,guests_details: req.session.guests_details,type:"c",moment: moment});
    }
    else if(infants > 0){
        let userInput = {
            guest: "i"+(req.session.guests[2]-req.session.guests_booked[2]).toString(),
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            requirements: req.body.requirements,
            guardian: req.body.guardian,
            price: null,
            seat_id: null,
            pay: 0
        }
        guests_details.push(userInput);
        infants -= 1
        req.session.guests_details = guests_details
        req.session.guests_booked[2] = infants
        //console.log(req.session.guests,req.session.guests_booked,req.session.guests_details)
        res.render('add_guest', {guests: req.session.guests,guests_booked: req.session.guests_booked,trip: req.session.trip,guests_details: req.session.guests_details,type:"i",moment: moment});
    }
}
else{
     res.redirect("/")
}
});

router.post('/reserveSeat', (req,res,next)=>{
    if(req.session.user){
        var guest = req.body.guest
        if(guest != null){
            var price = parseFloat(req.body.price)
            var seat_id = req.body.seat_id
            var seat_type = req.body.seat_type
            var pay = req.body.pay
            var total = req.session.total
            var seat_list = req.session.seat_list
            var seat_type_count = req.session.seat_type_count
            seat_list.push(seat_id)
            if (pay == "on"){
                pay = 1
                total = total+price
                if(seat_type == "economy"){
                    seat_type_count[0] += 1
                }
                else if(seat_type == "business"){
                    seat_type_count[1] += 1
                }
                if(seat_type == "platinum"){
                    seat_type_count[2] += 1
                }
            }
            else{
                pay = 0
                price = 0
            }
            console.log(req.session.total)
            var guests = req.session.guests_details
            for(i in guests){
                if (guests[i].guest == guest){
                    if(guests[i].guest[0] == "c"){
                        guests[i].price = price;
                        guests[i].seat_id = seat_id;
                        guests[i].pay = pay;
                    }
                    else if(guests[i].guest[0] == "a"){
                        guests[i].price = price;
                        guests[i].seat_id = seat_id;
                        guests[i].pay = pay;
                    // console.log(guest[i].price)
                    }
                    else{
                        guests[i].price = (price)/4;
                        guests[i].seat_id = seat_id;
                        guests[i].pay = pay;
                        if(pay){
                            total += (parseInt(price))/4
                        }
                        
                        x = guests[i].guardian;
                        for(j in guests){
                            if(guests[j].name == x){
                                guests[j].price = price;
                                guests[j].seat_id = seat_id;
                                guests[j].pay = pay;
                            }
                        }
                    }
                }
                
            }
            req.session.total = total
            req.session.seat_type_count = seat_type_count
            res.redirect("/bookTrip")
            console.log(guests)
            console.log(req.session.seat_list)
            console.log(seat_type_count)
            console.log(req.session.total)
        }
        else{
            res.redirect("/bookTrip")
        }
    }
    else{
        res.redirect("/")
    }
    
});

router.post('/reservation',(req,res,next)=>{
if(req.session.user){
    let userInput1 = {
        passenger_id: req.session.user.passenger_id,
        trip_id: req.session.trip.trip_id
    }
    let userInput2 = {
        economy: req.session.seat_type_count[0],
        business: req.session.seat_type_count[1],
        platinum: req.session.seat_type_count[2],
        trip_id: req.session.trip.trip_id,
    }
    let userInput3 = {
        guests: req.session.guests_details
    }
    console.log(userInput1,userInput2,userInput3)
    user.makeReservation(userInput1,userInput2,userInput3,function(result){
        res.get('/');
    });
}
else{
    res.redirect("/")
}

})



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