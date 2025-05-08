const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true,
    ref: 'Sensor',
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  temperature: {
    type: Number,
    required: false
  },
  humidity: {
    type: Number,
    required: false
  },
  gasLevel: {
    type: Number,
    required: false
  },
  // Add other sensor reading fields as needed
});

// Index for efficient querying by sensor and time
ReadingSchema.index({ sensorId: 1, timestamp: -1 });

module.exports = mongoose.model('Reading', ReadingSchema); 