const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    timePayment: {
        type: Date,
        default: Date.now
    },
    reservation: {
        type: mongoose.Schema.ObjectId,
        ref: 'Reservation',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add amount']
    },
    paymentMethods: {
        type: String,
        enum: ['credit', 'debit', 'banking', 'cash'],
        default: 'banking',
        required: [true, 'Please add payment methods']
    }

});

module.exports = mongoose.model('Payment', PaymentSchema);