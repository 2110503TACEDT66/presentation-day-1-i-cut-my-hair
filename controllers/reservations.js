const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Reservation = require('../models/Reservation');

// @desc    Get all reservations
// @route   GET /api/v1/restaurants
// @access  Public
exports.getReservations = async (req, res, next) => {
    let query;

    if (req.user.role != 'admin') {
        //non admin can only see self appointment
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'restaurant',
            select: 'name province tel'
        });
        console.log("1");
    } else {
        //admin see all
        if (req.params.restaurantId) {
            console.log(req.params.restaurantId);
            query = Reservation.find({ hospital: req.params.restaurantId }).populate({
                path: 'restaurant',
                select: 'name province tel'
            });
            console.log("2");
        } else {
            query = Reservation.find().populate({
                path: 'restaurant',
                select: 'name province tel'
            });
            console.log("3");
        }
    }


    try {
        const reservation = await query;

        res.status(200).json({
            success: true,
            count: reservation.length,
            data: reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Cannot find reservation"
        });

        console.log(err);
    }
}

//@desc get one reservation
//@route GET /api/v1/reservations/:id
//@access registered
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name province tel'
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: `No reservation with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: 'Cannot find reservation'
        });
    }
}

//@desc Post single reservation
//@route POST /api/v1/restaurants/:id
//@access registered
exports.createReservation = async (req, res, next) => {
    try {
        req.body.restaurant = req.params.restaurantId;
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        req.body.user = req.user.id;
        const existedReservation = await Reservation.find({ user: req.user.id });

        if (existedReservation.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                msg: `The user with user id ${req.user.id} has already made 3 reservations`
            });
        }

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                msg: `No restaurant with the id ${req.params.restaurantId}`
            });
        }

        const openHour = restaurant.opentime.slice(0, 2);
        const closeHour = restaurant.closetime.slice(0, 2);
        const openMin = restaurant.opentime.slice(3);
        const closeMin = restaurant.closetime.slice(3);

        // -----------------TEST-----------------
        const dateRegex = /^\d{4}-\d{2}-\d{2}/;
        const timeRegex = /T(\d{1,2}:\d{2})/;

        const datePart = req.body.resvDate.match(dateRegex)[0]; // "2024-05-18"
        const timePart = req.body.resvDate.match(timeRegex)[1]; // "2:31"

        const timeArray = timePart.split(":");
        const reservationHour = timeArray[0].padStart(2, '0'); // "2"
        const reservationMin = timeArray[1].padStart(2, '0'); // "31"
        const formattedTime = reservationHour + ":" + reservationMin;

        console.log(reservationHour + " " + reservationMin);
        // -----------------TEST-----------------
        if(openHour > closeHour){
            //openHour = 0;
            if((reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) && (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin))){
                return res.status(400).json({
                    success: false,
                    msg: 'Cannot make reservation while the restaurant is not operated'
                })
            }
        }else{
            if (reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) {
                return res.status(400).json({
                    success: false,
                    msg: 'Cannot make reservation after the restaurant is closed'
                });
            }
    
            if (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin)) {
                return res.status(400).json({
                    success: false,
                    msg: 'Cannot make reservation before the restaurant is opened'
                });
            }
        }



        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success: true,
            data: reservation
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: 'Cannot create reservation'
        });
    }
}

//@desc update one reservation
//@route
//@access
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        //make sure is update by owner
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                msg: `User ${req.user.id} is not authorized to update this reservation`
            });
        }

        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: `No reservation with the id of ${req.params.id}`
            });
        }

        //Validate time after change restaurant
        if (req.body.restaurantId) {
            const restaurant = await Restaurant.findById(req.body.restaurantId);
            const openHour = restaurant.opentime.slice(0, 2);
            const closeHour = restaurant.closetime.slice(0, 2);
            const openMin = restaurant.opentime.slice(3);
            const closeMin = restaurant.closetime.slice(3);

            // -----------------TEST-----------------
            const dateRegex = /^\d{4}-\d{2}-\d{2}/;
            const timeRegex = /T(\d{1,2}:\d{2})/;

            const datePart = req.body.resvDate.match(dateRegex)[0]; // "2024-05-18"
            const timePart = req.body.resvDate.match(timeRegex)[1]; // "2:31"

            const timeArray = timePart.split(":");
            const reservationHour = timeArray[0].padStart(2, '0'); // "2"
            const reservationMin = timeArray[1].padStart(2, '0'); // "31"
            const formattedTime = reservationHour + ":" + reservationMin;

            console.log(reservationHour + " " + reservationMin);
            if (req.body.resvDate) {
                const reservationHour = req.body.resvDate.getHours();
                const reservationMin = req.body.resvDate.getMinutes();

                if(openHour > closeHour){
                    if((reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) && (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin))){
                        return res.status(400).json({
                            success: false,
                            msg: 'Cannot make reservation while the restaurant is not operated'
                        })
                    }
                }else{
                    if (reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) {
                        return res.status(400).json({
                            success: false,
                            msg: 'Cannot make reservation after the restaurant is closed'
                    });
                }
                    if (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin)) {
                        return res.status(400).json({
                            success: false,
                            msg: 'Cannot make reservation before the restaurant is opened'
                    });
                }
                }

            }
            
            if(openHour > closeHour){
                if((reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) && (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin))){
                    return res.status(400).json({
                        success: false,
                        msg: 'Cannot make reservation while the restaurant is not operated'
                    })
                }
            }else{
                if (reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) {
                    return res.status(400).json({
                        success: false,
                        msg: 'Cannot make reservation after the restaurant is closed'
                    });
                }
    
                if (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin)) {
                    return res.status(400).json({
                        success: false,
                        msg: 'Cannot make reservation before the restaurant is opened'
                    });
                }
            }

        }

        //Validate date changes
        if (req.body.resvDate) {
            const restaurant = await Restaurant.findById(reservation.restaurant);

            const openHour = restaurant.opentime.slice(0, 2);
            const closeHour = restaurant.closetime.slice(0, 2);
            const openMin = restaurant.opentime.slice(3);
            const closeMin = restaurant.closetime.slice(3);
            // -----------------TEST-----------------
            const dateRegex = /^\d{4}-\d{2}-\d{2}/;
            const timeRegex = /T(\d{1,2}:\d{2})/;

            const datePart = req.body.resvDate.match(dateRegex)[0]; // "2024-05-18"
            const timePart = req.body.resvDate.match(timeRegex)[1]; // "2:31"

            const timeArray = timePart.split(":");
            const reservationHour = timeArray[0].padStart(2, '0'); // "2"
            const reservationMin = timeArray[1].padStart(2, '0'); // "31"

            if(openHour > closeHour){
                if((reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) && (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin))){
                    return res.status(400).json({
                        success: false,
                        msg: 'Cannot make reservation while the restaurant is not operated'
                    })
                }
            }else{
                if (reservationHour > closeHour || (reservationHour == closeHour && reservationMin > closeMin)) {
                    return res.status(400).json({
                        success: false,
                        msg: 'Cannot make reservation after the restaurant is closed'
                    });
                }
                if (reservationHour < openHour || (reservationHour == openHour && reservationMin < openMin)) {
                    return res.status(400).json({
                        success: false,
                        msg: 'Cannot make reservation before the restaurant is opened'
                    });
                }
            }

        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: 'Could not update reservation'
        });
    }
}

//@desc Delete one reservation
//@route DELETE /api/v1/reservations/:id
//@access registered
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                msg: `User ${req.user.id} is not authorized to delete this reservation`
            });
        }

        if (!reservation) {
            return res.status(404).json({
                success: false,
                msg: `No reservation with id of ${req.params.id}`
            });
        }

        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Could not delete reservation'
        });

        console.log(err);
    }
}