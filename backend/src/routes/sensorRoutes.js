const express = require('express');
const { 
  getSensors, 
  getSensor, 
  createUpdateSensor, 
  deleteSensor 
} = require('../controllers/sensorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getSensors)
  .post(protect, createUpdateSensor);

router.route('/:id')
  .get(protect, getSensor)
  .delete(protect, authorize('admin'), deleteSensor);

module.exports = router; 