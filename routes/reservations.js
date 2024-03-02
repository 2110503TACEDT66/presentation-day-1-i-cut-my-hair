const express = require('express');

const {getReservations, getReservation, createReservation, updateReservation, deleteReservation} = require('../controllers/reservations');

const paymentsRouter = require('./payments');
const router = express.Router({mergeParams: true});
 
const {protect, authorize} = require('../middleware/auth');
router.use('/:reservationId/payments/', paymentsRouter);

router.route('/').get(protect, authorize('admin', 'user'), getReservations).post(protect, authorize('user','admin'), createReservation);
router.route('/:id').get(protect, authorize('admin', 'user'), getReservation).put(protect, authorize('admin'), updateReservation).delete(protect, authorize('admin'), deleteReservation);

module.exports = router;