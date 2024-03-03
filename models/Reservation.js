const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    resvDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    });

    ReservationSchema.pre('deleteOne', { document: true, query: false }, async function(next){
        console.log(`Payment being removed from reservation ${this._id}`);
        await this.model('Payment').deleteMany({reservation: this._id});
        next();
    });

module.exports = mongoose.model('Reservation', ReservationSchema);
