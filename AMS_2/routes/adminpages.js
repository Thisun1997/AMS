const express = require('express');
const Admin = require('../core/admin');
const Validate = require('../core/validate');
const router = express.Router();
const moment = require('moment');

// create an object from the class User in the file core/user.js
const admin = new Admin();
const validate = new Validate();

// Get the index page
router.get('/', checkNoAuthenticated, (req, res, next) => {
    let user = req.session.user;
    // If there is a session named user that means the use is logged in. so we redirect him to home page by using /home route below
    validate.checkAdmin(user, function (result) {
        console.log('dsvdv');
        console.log(result)
        if (result) {
            res.redirect('/admin/home');
            return;
        }
        else {
            res.redirect('/');
        }
    });
    // IF not we just send the index page.

});

// Get home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;
    validate.checkAdmin(user, function (result) {
        console.log(req.session.user)
        if (result) {
            res.render('admin');
            return;
        }
        else {
            if (user) {
                res.redirect('http://localhost:3000/home');
            } else {
                res.redirect('/')
            }

        }
    });

});

// Post login data
router.post('/login', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    if (req.body.email == "" || req.body.password == "") {
        res.render('adminLogin', { msg: 'fields cannot be empty!' })
    }
    else {
        validate.checkAdmin(req.body, function (result) {
            if (result) {
                result = { email: "admin", password: "admin" }
                req.session.user = result;
                req.session.opp = 1;
                // redirect the user to the home page.
                res.redirect('/admin/home');
            } else {
                // if the login function returns null send this error message back to the user.
                res.render('adminLogin', { msg: 'Username/Password incorrect!' });
            }
        });
        // Store the user data in a session.
    }

});

//airport
router.get('/addAirportPage', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getAirports(function (result) {
                    res.render('addAirport', { airports: result });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.get('/addDelayPage', (req, res, next) => {
    console.log('hi')
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getTodayRoutesDetails(function (result) {
                    // res.render('add_delay', { tripDetails: result });
                    admin.getAllTodayDelays(function(result1){
                        admin.getTodayRoutesDetails(function(result2){
                            res.render('add_delay',{tripDetails: result,todayDelays:result1,hasDelay:result1.length});
                        })
                        console.log(result1);
                    })
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/addAirport', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        code: req.body.code,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
    };

    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.addAirport(userInput)
            res.redirect("/admin/addAirportPage")
        } else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});
// call create function. to create a new user. if there is no error this function will return it's id.



router.get("/deleteAirport/:airport_id", (req, res, next) => {
    let airport_id = req.params.airport_id;
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.deleteAirport(airport_id)
                res.redirect("/admin/addAirportPage")
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});


//airplane type
router.get('/addAirplaneTypePage', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getAirplaneTypes(function (result) {
                    res.render('addAirplaneType', { airplanetypes: result });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/postDelayShedule', (req, res, next) => {

    let user = req.session.user;
    let shedule_id = req.body.shedule_id;
    let dept_time = req.body.dept_time;
    let reason = req.body.reason;


        console.log(shedule_id)

    validate.checkAdmin(user, function (result) {
        if (result) {

            if (result == true) {
                admin.getUpdateDelayTable(shedule_id, dept_time, reason, function (result) {
                    // res.render('addDelayPage', {airplanetypes: result, msg:"fields cannot be empty"});
                    admin.getAllTodayDelays(function(result1){
                        admin.getTodayRoutesDetails(function(result2){
                            res.render('add_delay',{tripDetails: result2,todayDelays:result1,hasDelay:result1.length});
                        })
                        console.log(result1);
                    });
                    }
                );
            }
            else {
                res.redirect('/')
            }
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });

});
router.post('/addAirplaneType', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        plane_type: req.body.plane_type,
        tot_economy_seats: req.body.tot_economy_seats,
        tot_business_seats: req.body.tot_business_seats,
        tot_platinum_seats: req.body.tot_platinum_seats,
    };
    //admin.addAirplaneType(userInput)

    validate.checkAdmin(user, function (result) {
        if (result) {
            validate.check(userInput, function (result) {
                if (result == true) {
                    admin.getAirplaneTypes(function (result) {
                        res.render('addAirplaneType', { airplanetypes: result, msg: "fields cannot be empty" });
                    });
                }
                else {
                    admin.addAirplaneTypeAndSeats(userInput)
                    res.redirect("/admin/addAirplaneTypePage")
                }
            });
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get("/deleteAirplaneType/:plane_type", (req, res, next) => {
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.deleteAirplaneType(plane_type)
                res.redirect("/admin/addAirplaneTypePage")
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.get("/viewAirplaneType/:plane_type", (req, res, next) => {
    let plane_type = req.params.plane_type;
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getEconomyAirplaneTypeSeats(plane_type, function (resulte) {
                    admin.getBusinessAirplaneTypeSeats(plane_type, function (resultb) {
                        admin.getPlatinumAirplaneTypeSeats(plane_type, function (resultp) {
                            admin.getAnAirplaneType(plane_type, function (resultt) {
                                res.render('viewAirplaneType', { economy: resulte, business: resultb, platinum: resultp, plane_type_name: resultt });
                            });
                        });
                    });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

//airplane
router.get('/addAirplanePage', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getAirplanes(function (result) {
                    admin.getAirplaneTypes(function (result2) {
                        res.render('addAirplane', { airplanes: result, airplanetypes: result2 });
                    })
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/addAirplane', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        plane_id: req.body.plane_id,
        plane_type: req.body.plane_type
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    validate.checkAdmin(user, function (result) {
        if (result) {
            validate.check(userInput, function (result) {
                if (result == true) {
                    admin.getAirplanes(function (result) {
                        admin.getAirplaneTypes(function (result2) {
                            res.render('addAirplane', { airplanes: result, airplanetypes: result2, msg: "fields cannot be empty" });
                        })
                    });
                }
                else {
                    admin.addAirplane(userInput)
                    res.redirect("/admin/addAirplanePage")
                }
            });
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get("/deleteAirplane/:plane_id", (req, res, next) => {
    let plane_id = req.params.plane_id;
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.deleteAirplane(plane_id)
                res.redirect("/admin/addAirplanePage")
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

//
router.get('/login', checkNoAuthenticated, (req, res, next) => {
    res.render('adminLogin')
});


//passenger category
router.get('/addPassengerCategoryPage', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getPassengerCategories(function (result) {
                    res.render('addPassengerCategory', { categories: result });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/addPassengerCategory', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        category_name: req.body.category_name,
        No_of_reservations: req.body.No_of_reservations,
        discount: req.body.discount,
    };
    validate.checkAdmin(user, function (result) {
        if (result) {
            validate.check(userInput, function (result) {
                if (result == true) {
                    admin.getPassengerCategories(function (result) {
                        res.render('addPassengerCategory', { categories: result, msg: "fields cannot be empty" });
                    });
                }
                else {
                    admin.addPassengerCategory(userInput)
                    res.redirect("/admin/addPassengerCategoryPage")
                }
            });
        } else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});



router.post('/editPassengerCategory', (req, res, next) => {
    let user = req.session.user;
    let userInput = {
        No_of_reservations: req.body.No_of_reservations,
        discount: req.body.discount,
        category_name: req.body.category_name,
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.editPassengerCategory(userInput)
            res.redirect("/admin/addPassengerCategoryPage")
        } else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get("/editPassengerCategory/:category_id", (req, res, next) => {
    let category_id = req.params.category_id;
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getAPassengerCategory(category_id, function (result) {
                    res.render('editPassengerCategoryPage', { category: result });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

//add route
router.get('/addRoutePage', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getAirplanes(function (result1) {
                    admin.getAirports(function (result2) {
                        admin.getRoute(function (result) {
                            res.render('addRoute', { airplanes: result1, airports: result2, routeDetails: result });
                        });
                    });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/addRoute', (req, res, next) => {
    let user = req.session.user;
    let userInput1 = {
        plane_id: req.body.plane_id,
        dept_airport_code: req.body.dept_airport_code,
        dest_airport_code: req.body.dest_airport_code,
    };
    let userInput2 = {
        dept_time: req.body.dept_time,
        arr_time: req.body.arr_time
    };
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.addRoute(userInput1, userInput2);
            res.redirect("/admin/addRoutePage")
        } else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});


//addshedule
router.get('/addShedulePage', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getRoute(function (result) {
                    res.render('addShedule', { routeDetails: result });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/addShedule', (req, res, next) => {
    let user = req.session.user;
    let date = req.body.date;
    let route_id = req.body.route_id
    if (date == "" || route_id == "") {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getRoute(function (result2) {
                    res.render('addShedule', { routeDetails: result2, msg: "fields cannot be empty" })
                });
            }
            else {
                res.redirect("/")
            }
        });
    }
    else {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.addTimeTable(date, function (result1) {
                    admin.getRoute(function (result2) {
                        admin.getRouteTime(route_id, function (result3) {
                            admin.getAroute(route_id, function (result4) {
                                admin.getNo_ofSeats(route_id, function (result5) {
                                    res.render('addShedule', { timetable: result1, routeDetails: result2, timedata: result3, route: result4, seats: result5 })
                                });
                            });
                        });
                    });
                });
            } else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
});


//add trip
router.post('/addTrip', (req, res, next) => {
    let user = req.session.user;
    let userInput2 = {
        economy_price: req.body.economy_price,
        business_price: req.body.business_price,
        platinum_price: req.body.platinum_price
    }
    let userInput1 = {
        route_id: req.body.route_id,
        dept_time: req.body.dept_time,
        arr_time: req.body.arr_time
    }
    validate.checkAdmin(user, function (result) {
        if (result) {
            validate.check(userInput1, function (result1) {
                validate.check(userInput2, function (result2) {
                    if (result1 == true || result2 == true) {
                        admin.getRoute(function (result2) {
                            res.render('addShedule', { routeDetails: result2, msg: "fields cannot be empty" })
                        });
                    }
                    else {
                        let time_table_id = req.body.time_table_id;
                        admin.addSheduleAndTrip(userInput1, userInput2, time_table_id);
                        admin.getRoute(function (result) {
                            res.render('addShedule', { routeDetails: result, msg2: "trip added successfully" });
                        });
                    }
                });
            });
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});


router.post('/viewTrips', (req, res, next) => {
    let user = req.session.user;
    var date = req.body.date
    validate.checkAdmin(user, function (result) {
        if (result) {
            if (date) {
                admin.viewTrips(date, function (result) {
                    if (result) {
                        //console.log(result);
                        res.render('viewTrip', { date: date, tripDetails: result })
                    }
                    else {
                        res.render('viewTrip', { date: date, msg: "No trips found" })
                    }
                });
            }
            else {
                admin.getRoute(function (result2) {
                    res.render('addShedule', { date: date, tripDetails: result2, msg: "fields cannot be empty" })
                });
            }
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get('/editTrip/:trip_id', (req, res, next) => {
    let user = req.session.user;
    let trip_id = req.params.trip_id;
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.viewForEditTrips(trip_id, function (result) {
                //console.log(result);
                if (result) {
                    res.render('editTrip', { tripDetails: result[0], moment: moment })
                }
                else {
                    res.render('editTrip', { msg: "No trips found" })
                }
            });
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.post('/editTrip', (req, res, next) => {
    let user = req.session.user;
    let date = req.body.date;
    let userInput1 = {
        arr_time: req.body.arr_time,
        dept_time: req.body.dept_time,
        shedule_id: req.body.shedule_id
    }
    let userInput2 = {
        economy_price: req.body.economy_price,
        business_price: req.body.business_price,
        platinum_price: req.body.platinum_price,
        trip_id: req.body.trip_id
    }
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.editTrip(userInput1, userInput2, function (result1) {
                if (result1 == true) {
                    admin.viewTrips(date, function (result) {
                        if (result) {
                            //console.log(result);
                            res.render('viewTrip', { date: date, tripDetails: result, msg2: "updated succesfully" })
                        }
                        else {
                            res.render('viewTrip', { date: date, msg: "No trips found" })
                        }
                    });
                }
            });
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});


router.get("/viewTimeTablePage", (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.viewTimeTables(function (result) {
                    if (result) {
                        //console.log(result);
                        res.render('viewTimeTable', { timetables: result, moment: moment })
                    }
                    else {
                        res.render('viewTimeTable', { msg: "No time tables found" })
                    }
                });
            }
            else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});


router.get("/viewTripDetails/:time_table_id", (req, res, next) => {
    let time_table_id = req.params.time_table_id;
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.viewTripDetails(time_table_id, function (result1) {
                    admin.viewTimeTables(function (result2) {
                        if (result1) {
                            //console.log(result);
                            //console.log(result1)
                            res.render('viewTimeTable', { sheduleDetails: result1, timetables: result2, to_view: time_table_id, moment: moment })
                        }
                        else {
                            res.render('viewTimeTable', { timetables: result2, to_view: time_table_id, moment: moment, msg: "nothing found" })
                        }
                    });
                });
            }
            else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});


router.get("/generateReport1", (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                admin.getAirports(function (result) {
                    if (result) {
                        //console.log(result);
                        res.render('report1', { airports: result})
                    }
                    else {
                        res.render('/admin')
                    }
                });
            }
            else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/generateReport1', (req, res, next) => {
    let user = req.session.user;
    let userInput = [ req.body.airport_id,req.body.date1, req.body.date2]
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.generateReport1(userInput, function (result1) {
                admin.getAirports(function (result) {
                    if (result) {
                        console.log(result1);
                        res.render('report1', {airports: result,data :result1})
                    }
                    else {
                        res.render('/admin')
                    }
                });
            });
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get("/generateReport2", (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if (result) {
                res.render('report2')
            }
            else {
                // if the login function returns null send this error message back to the user.
                res.redirect("/")
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/generateReport2', (req, res, next) => {
    let user = req.session.user;
    let userInput = [req.body.date1, req.body.date2]
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.generateReport2(userInput, function (result1) {
                        console.log(result1);
                        res.render('report2', {data :result1});
            });
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get("/generateReport3", (req, res, next) => {
    let user = req.session.user;
    if (user) {
        console.log("user")
        validate.checkAdmin(user, function (result) {
            console.log(result)
            console.log(user)
            if(result){
                console.log(result)
                admin.getTodayRoutesDetails(function (result1) {
                    if (result1) {
                        console.log(result1);
                        console.log('hi')
                        console.log(req.session.user)

                        res.render('report3', { tripDetails: result1})
                    }
                    else {
                        console.log('hi')
                        res.render('report3', { msg: "No trips for today"})
                    }
                });
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/generateReport3', (req, res, next) => {
    let user = req.session.user;
    let userInput = req.body.shedule_id
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.getTodayRoutesDetails(function (result1) {
                    admin.generateReport3(userInput, function (result2) {
                        //console.log(result1);
                        res.render('report3', {ab18 :result2[0],be18 :result2[1],tripDetails: result1});
                    });
            });   
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get("/generateReport4", (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if(result){
                admin.getAirports(function (result1) {
                    if (result1) {
                        console.log(result1);
                        console.log(user)
                        console.log(req.session.user)
                        res.render('report4', { locations: result1})
                    }
                    else {
                        res.redirect('/admin')
                    }
                });
            }
        });
    }
    else {
        res.redirect("/")
    }
});

router.post('/generateReport4', (req, res, next) => {
    let user = req.session.user;
    let userInput = [req.body.dept_airport_code,req.body.dest_airport_code]
    validate.checkAdmin(user, function (result) {
        if (result) {
            admin.getAirports(function (result1) {
                    admin.generateReport4(userInput, function (result2) {
                        //console.log(result1);
                        res.render('report4', {data :result2,locations: result1,moment:moment});
                    });
            });   
        }
        else {
            // if the login function returns null send this error message back to the user.
            res.redirect("/")
        }
    });
});

router.get('/generateReport5', (req, res, next) => {
    let user = req.session.user;
    if (user) {
        validate.checkAdmin(user, function (result) {
            if(result){
                admin.generateReport5(function (result1) {
                    if (result1) {
                        //console.log(result1);
                        res.render('report5', {data: result1})
                    }
                    else {
                        res.redirect('/')
                    }
                });
            }
        });
    }
    else {
        res.redirect("/")
    }
});

// Get loggout page
router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if (req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function () {
            res.redirect('/');
        });
    }
});


function checkNoAuthenticated(req, res, next) {
    let user = req.session.user;
    console.log(user)
    if (user) {
        if (user.email == "admin") {
            console.log('dvds1')
            return res.redirect('/admin/home')
        }
        else {
            console.log('2')
            res.redirect('/home')
        }
    }
    else {
        next()
    }

}



module.exports = router;