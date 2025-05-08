const Reading = require('../models/Reading');
const Sensor = require('../models/Sensor');
const logger = require('../utils/logger');

// @desc    Get readings (with optional filtering)
// @route   GET /api/readings
// @access  Private
exports.getReadings = async (req, res) => {
  try {
    const { limit = 100, sensorId, startDate, endDate, sort = '-timestamp' } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by sensor if provided
    if (sensorId) {
      query.sensorId = sensorId;
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    const readings = await Reading.find(query)
      .sort(sort)
      .limit(parseInt(limit, 10));
    
    // Get list of unique sensor IDs from the readings
    const sensorIds = [...new Set(readings.map(reading => reading.sensorId))];
    
    // Get sensor details
    const sensors = await Sensor.find({ id: { $in: sensorIds } });
    
    res.status(200).json({
      success: true,
      count: readings.length,
      data: {
        sensors,
        readings
      }
    });
  } catch (error) {
    logger.error('Error fetching readings:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get readings for a specific sensor
// @route   GET /api/readings/:sensorId
// @access  Private
exports.getSensorReadings = async (req, res) => {
  try {
    const { limit = 100, startDate, endDate, sort = '-timestamp' } = req.query;
    const { sensorId } = req.params;
    
    // Check if sensor exists
    const sensor = await Sensor.findOne({ id: sensorId });
    
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    // Build query
    const query = { sensorId };
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }
    
    const readings = await Reading.find(query)
      .sort(sort)
      .limit(parseInt(limit, 10));
    
    res.status(200).json({
      success: true,
      count: readings.length,
      data: {
        sensor,
        readings
      }
    });
  } catch (error) {
    logger.error(`Error fetching readings for sensor ${req.params.sensorId}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a reading
// @route   POST /api/readings
// @access  Private
exports.createReading = async (req, res) => {
  try {
    const { sensorId, temperature, humidity, gasLevel, timestamp } = req.body;
    
    if (!sensorId) {
      return res.status(400).json({ error: 'Please provide a sensorId' });
    }
    
    // Check if sensor exists
    const sensor = await Sensor.findOne({ id: sensorId });
    
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    // Create reading
    const reading = await Reading.create({
      sensorId,
      temperature,
      humidity,
      gasLevel,
      timestamp: timestamp || new Date()
    });
    
    // Update sensor's lastUpdate timestamp
    await Sensor.findOneAndUpdate(
      { id: sensorId },
      { 
        lastUpdate: new Date(),
        status: 'active'
      }
    );
    
    res.status(201).json({
      success: true,
      data: reading
    });
  } catch (error) {
    logger.error('Error creating reading:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete readings for a sensor
// @route   DELETE /api/readings/:sensorId
// @access  Private (Admin only)
exports.deleteReadings = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { before } = req.query;
    
    let query = { sensorId };
    
    // If before date is provided, only delete readings before that date
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }
    
    const result = await Reading.deleteMany(query);
    
    res.status(200).json({
      success: true,
      count: result.deletedCount,
      message: `${result.deletedCount} readings deleted`
    });
  } catch (error) {
    logger.error(`Error deleting readings for sensor ${req.params.sensorId}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
}; 