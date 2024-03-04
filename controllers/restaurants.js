const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Reservation = require('../models/Reservation');
const jwt = require('jsonwebtoken');
const {sendNotification_GetAllRestaurants , sendNotification_GetOneRestaurant , sendNotification_CreateRestaurant ,sendNotification_UpdateRestaurant , sendNotification_DeleteRestaurant} = require('../bot/notificationRestaurant');

// @desc Get all restaurant
// @route   GET /api/v1/restaurant
// @access  Public
exports.getRestaurants = async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    // ex {"fields" : {"gt" : "$A"}}
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    if(req.user.role === 'admin'){
        query = Restaurant.find(JSON.parse(queryStr)).populate({
            path: 'reservation',
            populate: {path: 'Payment', select: 'amount paymentMethods'}
        });
    
    }else{
        query = Restaurant.find(JSON.parse(queryStr)).populate({
            path: 'reservation',
            match: {user: req.user.id},
            populate: {path: 'Payment', select: 'amount paymentMethods'}
        })
    }

    if (req.query.select) {
        // { select: 'name,province,postalcode', sort: 'name' }
        const fields = req.query.select.split(',').join(' ');
        // name province postalcode
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');

        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt')
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = Restaurant.countDocuments;

        query = query.skip(startIndex).limit(limit);

        const restaurant = await query;
        const pagination = {};

        if (endIndex < total) {
            pagination.new = {
                page: page + 1,
                limit
            }
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        console.log(decoded)

        req.user = await User.findById(decoded.id);
        // console.log(req.user);

        sendNotification_GetAllRestaurants(req.user.email,req.user.role);

        res.status(200).json({
            success: true,
            count: restaurant.length,
            data: restaurant
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Oh somthing went wrong! to getRestaurants.'
        });

        console.log(err.stack);
    }
};

//@desc Get single restaurant
// @route   GET /api/v1/restaurant/:id
// @access  Private
exports.getRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(400).json({
                success: false,
                message: `No restaurant with the id of ${req.params.id}`
            });
        }
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        console.log(decoded)
        
        req.user = await User.findById(decoded.id);
        // console.log(req.user.id);
        sendNotification_GetOneRestaurant(req.user.email,req.user.role,restaurant.name,restaurant.address)
        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Oh somthing went wrong! to getRestaurant.'
        });
    }
};


//@desc Post single restaurant
//@route POST /api/v1/restaurant
//@access registered
exports.createRestaurant = async (req, res, next) => {
    const { name, province, district } = req.body;
    console.log(name + `,${district}` + `,${province}` + ',Thailand')
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${name + `,${district}` + `,${province}` + ',Thailand'}`;

    try {
        const response = await fetch(nominatimUrl);
        const data = await response.json();

        if (data.length > 0) {
            // Construct map link using the first result
            console.log(data);
            const { lat, lon } = data[0];
            const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;

            console.log({ mapLink });

            // Add map link to the restaurant data
            req.body.map = mapLink;

            // Create the restaurant
            const restaurant = await Restaurant.create(req.body);

            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            console.log(decoded)
    
            req.user = await User.findById(decoded.id);
            // console.log(req.user.id);

            sendNotification_CreateRestaurant(req.user.email,req.user.role,restaurant.name,restaurant.address)
            res.status(201).json({
                success: true,
                data: restaurant
            });
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (err) {
        console.error(err.stack);
        res.status(400).json({
            success: false,
            message: 'Something went wrong while creating the restaurant.'
        });
    }
};

//@desc Update single restaurant
//@route PUT /api/v1/restaurant/:id
//@access registered
exports.updateRestaurant = async (req, res, next) => {
    try {
        let oldNameRestaurant = await Restaurant.findById(req.params.id);
        oldNameRestaurant = oldNameRestaurant.name;

        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!restaurant) {
            return res.status(400).json({
                success: false,
                message: `No restaurant with the id of ${req.params.id}`
            });
        }

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        console.log(decoded)
        
        req.user = await User.findById(decoded.id);
        // console.log(req.user.id);
    
        sendNotification_UpdateRestaurant(req.user.email,req.user.role , restaurant.id);

        res.status(200).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Oh somthing went wrong! to updateRestaurant.'
        });
    }
};


//@desc Delete single restaurant
//@route DELETE /api/v1/restaurant/:id
//@access registered
exports.deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(400).json({
                success: false,
                message: `No restaurant with the id of ${req.params.id}`
            });
        }
        const restaurantName = restaurant.name;

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        console.log(decoded)
        
        req.user = await User.findById(decoded.id);
        // console.log(req.user.id);
    
        sendNotification_DeleteRestaurant(req.user.email,req.user.role , restaurant.id);
        
        await restaurant.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            msg : 'Restaurant deleted: ' + restaurantName + ' in ' + restaurant.district + ' ' + restaurant.province + ' Thailand'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Oh somthing went wrong! to deleteRestaurant.'
        });
    }
};