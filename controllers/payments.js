const Reservation = require('../models/Reservation');
const Payment = require('../models/Payment');

// @desc    Get all payments
// @route   GET /api/v1/payments
// @access  Public
exports.getPayments = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        // Non-admin users can only see their own payments
        query = Payment.find({ user: req.user.id });
    } else {
        // Admin can see all payments
        query = Payment.find();
    }

    try {
        const payments = await query;

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
}

// @desc    Get one payment
// @route   GET /api/v1/payments/:id
// @access  registered
exports.getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: `No payment with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
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