const logger = require('./logger');

/**
 * Validate sensor data against a flexible schema
 * This allows for custom fields while ensuring required fields exist
 * 
 * @param {Object} data - The sensor data object
 * @returns {Object} - Validated data object or null if invalid
 */
exports.validateSensorData = (data) => {
  try {
    // Required fields
    if (!data.sensor_id) {
      logger.warn('Sensor data missing required field: sensor_id');
      return null;
    }

    // Create a validated object with required fields
    const validatedData = {
      sensor_id: data.sensor_id,
      name: data.name || `Sensor ${data.sensor_id}`,
      location: data.location || 'Unknown',
      type: data.type || 'Generic',
      timestamp: data.timestamp || new Date().toISOString()
    };

    // Standard sensor fields (optional but commonly used)
    if (data.temperature !== undefined) validatedData.temperature = Number(data.temperature);
    if (data.humidity !== undefined) validatedData.humidity = Number(data.humidity);
    if (data.gasLevel !== undefined) validatedData.gasLevel = Number(data.gasLevel);

    // Copy any additional custom fields - this allows for extensibility
    Object.keys(data).forEach(key => {
      if (!validatedData.hasOwnProperty(key) && key !== 'sensor_id') {
        // Attempt to convert numeric strings to numbers
        const value = !isNaN(data[key]) ? Number(data[key]) : data[key];
        validatedData[key] = value;
      }
    });

    return validatedData;
  } catch (error) {
    logger.error('Error validating sensor data:', error);
    return null;
  }
};

/**
 * Validate user registration data
 * 
 * @param {Object} data - User registration data
 * @returns {Object} - Object with isValid flag and errors
 */
exports.validateUserRegistration = (data) => {
  const errors = {};

  // Validate username
  if (!data.username || data.username.trim() === '') {
    errors.username = 'Username is required';
  } else if (data.username.length > 50) {
    errors.username = 'Username cannot be more than 50 characters';
  }

  // Validate email
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please provide a valid email address';
    }
  }

  // Validate password
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Extract and validate pagination parameters from request query
 * 
 * @param {Object} query - Express request query object
 * @returns {Object} - Validated pagination parameters
 */
exports.getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}; 