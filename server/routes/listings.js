const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  markAsSold,
  getMyListings,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getListings);
router.get('/my', protect, getMyListings);
router.get('/:id', getListing);
router.post('/', protect, upload.array('images', 5), createListing);
router.put('/:id', protect, upload.array('images', 5), updateListing);
router.put('/:id/sold', protect, markAsSold);
router.delete('/:id', protect, deleteListing);

module.exports = router;
