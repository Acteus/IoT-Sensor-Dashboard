require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { DateTime } = require('luxon');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const { validateSensorData } = require('./utils/validator');

// Import route files
const authRoutes = require('./routes/authRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const readingRoutes = require('./routes/readingRoutes');

// Import models
const Sensor = require('./models/Sensor');
const Reading = require('./models/Reading');

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? 
                       process.env.ALLOWED_ORIGINS.split(',') : 
                       ['http://localhost:3001'];

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use('/api/', apiLimiter);

// MQTT connection status
let mqttConnected = false;

// Connect to MQTT broker
function connectMQTT() {
  logger.info(`Connecting to MQTT broker at ${MQTT_BROKER_URL}`);
  const mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    reconnectPeriod: 5000, // Reconnect every 5 seconds if connection is lost
    connectTimeout: 30000 // Wait 30 seconds before timing out connection attempt
  });

  mqttClient.on('connect', () => {
    mqttConnected = true;
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

  mqttClient.on('offline', () => {
    mqttConnected = false;
    logger.warn('MQTT broker connection lost. Attempting to reconnect...');
  });

  mqttClient.on('reconnect', () => {
    logger.info('Attempting to reconnect to MQTT broker...');
  });

  mqttClient.on('error', (error) => {
    mqttConnected = false;
    logger.error('MQTT connection error:', error);
  });

  mqttClient.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      logger.debug('Received sensor data:', { topic, data });
      
      // Process and store the data
      processSensorData(topic, data);
    } catch (error) {
      logger.error('Error processing message:', { 
        error: error.message, 
        topic,
        payload: message.toString().substring(0, 100) + (message.toString().length > 100 ? '...' : '')
      });
    }
  });

  return mqttClient;
}

// Process incoming sensor data
async function processSensorData(topic, data) {
  try {
    // Validate and normalize the sensor data
    const validatedData = validateSensorData(data);
    
    if (!validatedData) {
      logger.error('Invalid sensor data received, skipping processing');
      return;
    }
    
    const sensorId = validatedData.sensor_id;
    
    // Check if we already know about this sensor
    const sensor = await Sensor.findOne({ id: sensorId });
    
    if (!sensor) {
      // Add new sensor
      await Sensor.create({
        id: sensorId,
        name: validatedData.name,
        location: validatedData.location,
        type: validatedData.type,
        lastUpdate: new Date(),
        status: 'active'
      });
    } else {
      // Update existing sensor
      sensor.lastUpdate = new Date();
      sensor.status = 'active';
      await sensor.save();
    }
    
    // Create the reading - prepare the data object
    const readingData = {
      sensorId,
      timestamp: validatedData.timestamp ? new Date(validatedData.timestamp) : new Date()
    };
    
    // Add all the sensor measurement fields
    Object.keys(validatedData).forEach(key => {
      // Skip metadata fields that go in the sensor model
      if (!['sensor_id', 'name', 'location', 'type', 'timestamp'].includes(key)) {
        readingData[key] = validatedData[key];
      }
    });
    
    // Create the reading with all fields
    await Reading.create(readingData);
    
    logger.debug(`Processed reading for sensor ${sensorId} with ${Object.keys(readingData).length - 2} measurements`);
    
  } catch (error) {
    logger.error('Error processing sensor data:', error);
  }
}

// Connect to MQTT broker
const mqttClient = connectMQTT();

// API routes
app.get('/', (req, res) => {
  res.json({ message: 'IoT Sensor Dashboard API' });
});

// Basic health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: DateTime.now().toISO(),
    mqtt: mqttConnected ? 'connected' : 'disconnected',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/readings', readingRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

// For clean shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT signal received. Closing MQTT connection and exiting...');
  if (mqttClient) {
    mqttClient.end(true, () => {
      logger.info('MQTT connection closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}); 