require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Connect to MQTT broker
const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

mqttClient.on('connect', () => {
  logger.info('Connected to MQTT broker');
  
  // Subscribe to all sensor data topics
  mqttClient.subscribe('sensors/+/data', (err) => {
    if (err) {
      logger.error('Error subscribing to topics:', err);
    } else {
      logger.info('Subscribed to sensor topics');
    }
  });
});

mqttClient.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    logger.info('Received sensor data:', { topic, data });
    // Here you would typically save to Firebase
    // For now, we'll just log it
  } catch (error) {
    logger.error('Error processing message:', error);
  }
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'IoT Sensor Dashboard API' });
});

// Get latest readings (this would typically fetch from Firebase)
app.get('/api/readings', (req, res) => {
  res.json({
    message: 'This endpoint will return sensor readings from Firebase',
    // Mock data for testing
    readings: []
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 