const express = require('express');
const { 
  getReadings, 
  getSensorReadings, 
  createReading, 
  deleteReadings 
} = require('../controllers/readingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getReadings)
  .post(protect, createReading);

router.route('/:sensorId')
  .get(protect, getSensorReadings)
  .delete(protect, authorize('admin'), deleteReadings);

module.exports = router; 