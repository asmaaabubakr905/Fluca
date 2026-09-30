const express = require('express');
const Offer = require('../models/Offer');
const Trip = require('../models/Trip');
const auth = require('../middlewares/auth');
const offerController = require('../controllers/offerController');

const router = express.Router();

// الكابتن يرسل عرض سعر لرحلة خاصة
router.post('/', auth, offerController.createOffer);
// جلب كل العروض الخاصة برحلة معينة (يراها الراكب)
router.get('/trip/:tripId', auth, offerController.getOffersForTrip);
// الراكب يوافق على عرض أو الكابتن يوافق على counter offer
router.patch('/:id/accept', auth, offerController.acceptOffer);
// الراكب يرفض عرض أو الكابتن يرفض counter offer
router.patch('/:id/reject', auth, offerController.rejectOffer);
// الراكب يقترح سعر جديد (counter offer)
router.patch('/:id/counter', auth, offerController.counterOffer);

module.exports = router; 