#!/bin/bash

echo "Setting up IoT Sensor Dashboard..."

# Check prerequisites first
./scripts/check_prerequisites.sh

# Create necessary .env files
echo "Creating environment files..."

# Backend .env
cat > backend/.env << EOL
MQTT_BROKER_URL=mqtt://localhost:1883
PORT=3000
# Add your Firebase config path here
# FIREBASE_CONFIG_PATH=./firebase-config.json
EOL

# Frontend .env
cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:3000
# Add your Firebase config here
# REACT_APP_FIREBASE_CONFIG={"your":"config"}
EOL

# Sensor simulation .env
cp sensor-simulation/config/default_config.env sensor-simulation/.env

# Install dependencies
echo "Installing backend dependencies..."
cd backend && npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo "Installing Python dependencies..."
pip3 install -r sensor-simulation/requirements.txt

echo -e "\n✅ Setup completed!"
echo -e "\nTo start the application:"
echo "1. Start MQTT broker:     mosquitto"
echo "2. Start backend:         cd backend && npm run dev"
echo "3. Start frontend:        cd frontend && npm start"
echo "4. Start simulation:      cd sensor-simulation && python3 simulate_sensors.py" 