const express = require('express');

const {getPayments, getPayment, createPayment, updatePayment, deletePayment} = require('../controllers/payments');

const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');
router.route('/').get(protect, authorize('admin', 'user'), getPayments).post(protect, authorize('admin'), createPayment);
router.route('/:id').get(protect, authorize('admin', 'user'), getPayment).put(protect, authorize('admin'), updatePayment).delete(protect, authorize('admin'), deletePayment);

module.exports = router;