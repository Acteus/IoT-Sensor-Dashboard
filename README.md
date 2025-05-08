# IoT Sensor Dashboard

A real-time IoT dashboard that visualizes environmental sensor data using modern web technologies. This project demonstrates full-stack development skills by combining IoT devices, cloud services, and a responsive web interface.

## Features

- Real-time environmental data visualization (temperature, humidity, gas levels)
- Support for both physical IoT devices (ESP32) and simulated sensors
- MQTT and HTTP protocols for data transmission
- Secure data storage using Firebase
- Interactive React dashboard with real-time updates
- Responsive design for desktop and mobile viewing

## System Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  IoT Device │     │ MQTT Broker/ │     │   Node.js     │     │  Firebase   │
│  (ESP32 or  │ ──► │  HTTP API    │ ──► │   Backend     │ ──► │  Database   │
│   Python)   │     │ (Mosquitto)  │     │   (Express)   │     │             │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
                                                                      │
                                                                      │
                                                                      ▼
                                                              ┌─────────────┐
                                                              │    React    │
                                                              │  Dashboard  │
                                                              └─────────────┘
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+ (for sensor simulation)
- MQTT Broker (e.g., Mosquitto)
- Firebase account
- (Optional) ESP32 device for physical sensors

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/IoT-Sensor-Dashboard.git
   cd IoT-Sensor-Dashboard
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   ```bash
   # Backend (.env)
   MQTT_BROKER_URL=mqtt://localhost:1883
   FIREBASE_CONFIG_PATH=./firebase-config.json
   PORT=3000

   # Frontend (.env)
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_FIREBASE_CONFIG={your-firebase-config}
   ```

5. Start the services:
   ```bash
   # Terminal 1: Start MQTT Broker
   mosquitto -c /path/to/mosquitto.conf

   # Terminal 2: Start Backend
   cd backend
   npm run dev

   # Terminal 3: Start Frontend
   cd frontend
   npm start

   # Terminal 4 (Optional): Start Sensor Simulation
   cd sensor-simulation
   python simulate_sensors.py
   ```

## Project Structure

```
IoT-Sensor-Dashboard/
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   └── tests/             # Backend tests
├── frontend/               # React dashboard
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Helper functions
│   └── tests/            # Frontend tests
├── sensor-simulation/      # Python sensor simulation
│   ├── sensors/          # Sensor implementations
│   └── config/           # Simulation settings
└── hardware/              # ESP32 Arduino code
    └── sensor_node/      # IoT device firmware
```

## Firebase Schema

```javascript
{
  "sensors": {
    "sensor_id": {
      "name": "Living Room Sensor",
      "location": "Living Room",
      "type": "ESP32",
      "lastUpdate": timestamp,
      "status": "active"
    }
  },
  "readings": {
    "sensor_id": {
      "timestamp": {
        "temperature": 23.5,
        "humidity": 45.2,
        "gasLevel": 432,
        "timestamp": timestamp
      }
    }
  }
}
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style
This project uses ESLint and Prettier for code formatting. Run linting with:
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] User authentication via Firebase Auth
- [ ] Email/SMS alerts for sensor thresholds
- [ ] Data visualization with historical trends
- [ ] Mobile app version
- [ ] Sensor battery level monitoring
- [ ] Custom dashboard layouts
- [ ] Data export functionality
- [ ] Multiple sensor groups/locations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for real-time database
- [MQTT.js](https://github.com/mqttjs/MQTT.js) for MQTT implementation
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework
- [Chart.js](https://www.chartjs.org/) for data visualization