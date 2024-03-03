const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/v1/payments
// @access  Public
exports.getPayments = async (req, res, next) => {
    try {
        let query;

        // Check if the user making the request is an admin
        if (req.user.role === 'admin') {
            // If admin, fetch all payments
            query = Payment.find();
        } else {
            // If not admin, fetch payments only for that user
            query = Payment.find().populate({
                path: 'reservation',
                match: { user: req.user.id }
            });
        }

        const payments = await query;

        // Filter out payments where reservation is null (i.e., not owned by the user)
        const userPayments = payments.filter(payment => payment.reservation !== null);

        res.status(200).json({
            success: true,
            count: userPayments.length,
            data: userPayments
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


// @desc    Get single payment
// @route   GET /api/v1/payments/:id
// @access  Public
exports.getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id).populate({
            path: 'reservation',
            match: { user: req.user.id }
        });

        if (!payment || !payment.reservation) {
            return res.status(404).json({
                success: false,
                error: `No payment found for the user with the id of ${req.user.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};




//@desc Create payment for a reservation
//@route POST /api/v1/payments
//@access registered
exports.createPayment = async (req, res, next) => {
    try {
        const { amount, paymentMethod } = req.body;

        req.body.reservation = req.params.reservationId;
        reservationId = req.params.reservationId;

        // Validate if reservationId is provided
        if (!reservationId) {
            return res.status(400).json({
                success: false,
                error: 'Reservation ID is required'
            });
        }

        // Check if the reservation exists
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: `Reservation with ID ${reservationId} not found`
            });
        }

        // Check if a payment already exists for the reservation
        const existingPayment = await Payment.findOne({ reservation: reservationId });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                error: 'A payment already exists for this reservation'
            });
        }

        // Create the payment
        const payment = await Payment.create({
            reservation: reservationId,
            amount,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            data: payment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}


//@desc Update one payment
//@route PUT /api/v1/payments/:id
//@access registered
exports.updatePayment = async (req, res, next) => {
    try {
        let payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: `No payment with the id of ${req.params.id}`
            });
        }

        // Add additional checks if needed, such as ensuring the user has permission to update this payment

        payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }

}

//@desc Delete one payment
//@route DELETE /api/v1/payments/:id
//@access registered
exports.deletePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: `No payment with the id of ${req.params.id}`
            });
        }

        // Add additional checks if needed, such as ensuring the user has permission to delete this payment

        await payment.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}