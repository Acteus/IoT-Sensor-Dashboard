const Sensor = require('../models/Sensor');
const Reading = require('../models/Reading');
const logger = require('../utils/logger');

// @desc    Get all sensors
// @route   GET /api/sensors
// @access  Private
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: sensors.length,
      data: sensors
    });
  } catch (error) {
    logger.error('Error fetching sensors:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single sensor
// @route   GET /api/sensors/:id
// @access  Private
exports.getSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findOne({ id: req.params.id });
    
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.status(200).json({
      success: true,
      data: sensor
    });
  } catch (error) {
    logger.error(`Error fetching sensor ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create or update sensor
// @route   POST /api/sensors
// @access  Private
exports.createUpdateSensor = async (req, res) => {
  try {
    const { id, name, location, type, status } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: 'Please provide id and name' });
    }
    
    // Check if sensor exists
    let sensor = await Sensor.findOne({ id });
    
    if (sensor) {
      // Update sensor
      sensor = await Sensor.findOneAndUpdate(
        { id },
        { 
          name,
          location,
          type,
          status,
          lastUpdate: Date.now()
        },
        { new: true, runValidators: true }
      );
      
      return res.status(200).json({
        success: true,
        data: sensor,
        message: 'Sensor updated'
      });
    }
    
    // Create new sensor
    sensor = await Sensor.create({
      id,
      name,
      location,
      type,
      status
    });
    
    res.status(201).json({
      success: true,
      data: sensor,
      message: 'Sensor created'
    });
  } catch (error) {
    logger.error('Error creating/updating sensor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete sensor
// @route   DELETE /api/sensors/:id
// @access  Private (Admin only)
exports.deleteSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findOne({ id: req.params.id });
    
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    // Delete all readings for this sensor
    await Reading.deleteMany({ sensorId: req.params.id });
    
    // Delete the sensor
    await sensor.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'Sensor and related readings removed'
    });
  } catch (error) {
    logger.error(`Error deleting sensor ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
}; 