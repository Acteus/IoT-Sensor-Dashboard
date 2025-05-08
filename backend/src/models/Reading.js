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
  // Standard sensor fields (optional)
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
  }
}, { 
  // This allows for dynamic fields not defined in the schema
  strict: false,
  // Store all additional fields
  timestamps: true
});

// Index for efficient querying by sensor and time
ReadingSchema.index({ sensorId: 1, timestamp: -1 });

module.exports = mongoose.model('Reading', ReadingSchema); 