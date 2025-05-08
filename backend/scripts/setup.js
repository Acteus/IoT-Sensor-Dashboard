/**
 * IoT Dashboard Setup Script
 * 
 * This script helps initialize the IoT Dashboard system by:
 * 1. Creating a first admin user
 * 2. Validating database connection
 * 3. Testing MQTT connection
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
const mqtt = require('mqtt');

// Import the User model
const connectDB = require('../src/config/database');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Global variables
let mqttClient;

/**
 * Main setup function
 */
async function setupSystem() {
  console.log('\n=== IoT Sensor Dashboard Setup ===\n');
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Test MQTT connection
    console.log('\nTesting MQTT connection...');
    await testMqttConnection();
    
    // Create admin user
    console.log('\nSetting up admin user...');
    await createAdminUser();
    
    console.log('\n✅ Setup completed successfully!');
    console.log('\nYou can now start the system:');
    console.log('1. Backend: npm start');
    console.log('2. Frontend: cd ../frontend && npm start');
    console.log('3. Sensor simulation: cd ../sensor-simulation && python simulate_sensors.py');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('Please fix the issues and try again.');
  } finally {
    // Clean up
    if (mqttClient && mqttClient.connected) {
      mqttClient.end();
    }
    mongoose.connection.close();
    rl.close();
  }
}

/**
 * Test connection to MQTT broker
 */
function testMqttConnection() {
  return new Promise((resolve, reject) => {
    const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
    console.log(`Connecting to MQTT broker at ${brokerUrl}...`);
    
    mqttClient = mqtt.connect(brokerUrl, {
      connectTimeout: 5000
    });
    
    // Setup event handlers
    mqttClient.on('connect', () => {
      console.log('✅ MQTT broker connected successfully');
      resolve();
    });
    
    mqttClient.on('error', (err) => {
      console.error('❌ MQTT connection error:', err.message);
      console.log('Please make sure your MQTT broker is running and the connection URL is correct.');
      reject(new Error('MQTT connection failed'));
    });
    
    // Set timeout
    setTimeout(() => {
      if (!mqttClient.connected) {
        reject(new Error('MQTT connection timeout'));
      }
    }, 5000);
  });
}

/**
 * Create the first admin user
 */
async function createAdminUser() {
  // Load the User model dynamically to avoid issues with mongoose connection
  const User = require('../src/models/User');
  
  // Check if any user exists
  const userCount = await User.countDocuments();
  
  if (userCount > 0) {
    console.log('Users already exist in the database. Skipping admin creation.');
    return Promise.resolve();
  }
  
  return new Promise((resolve) => {
    rl.question('Enter admin username: ', (username) => {
      rl.question('Enter admin email: ', (email) => {
        rl.question('Enter admin password (min 6 characters): ', async (password) => {
          try {
            // Create the admin user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const adminUser = await User.create({
              username,
              email,
              password: hashedPassword,
              role: 'admin'
            });
            
            console.log(`✅ Admin user created successfully: ${adminUser.email}`);
            resolve();
          } catch (error) {
            console.error('❌ Error creating admin user:', error.message);
            resolve(); // Resolve anyway to continue setup
          }
        });
      });
    });
  });
}

// Run the setup
setupSystem(); 