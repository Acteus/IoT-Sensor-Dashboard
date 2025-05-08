# IoT Sensor Dashboard 🌡️

A real-time IoT dashboard that visualizes environmental sensor data using modern web technologies. This project demonstrates full-stack development skills by combining IoT devices, cloud services, and a responsive web interface.

![Dashboard Preview](docs/dashboard-preview.png)

## Features

- **Real-time Visualization**: Interactive charts for temperature, humidity, and gas levels
- **Sensor Management**: Enable/disable specific sensors from the dashboard
- **Mock Data Generation**: Built-in simulation for testing without physical sensors
- **MQTT Communication**: Real-time data transmission between sensors and backend
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Separation of concerns between data collection, processing, and visualization

## System Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌─────────────┐
│  IoT Device │     │ MQTT Broker/ │     │   Node.js     │     │  Firebase   │
│  (ESP32 or  │ ──► │  HTTP API    │ ──► │   Backend     │ ──► │  Database   │
│   Python)   │     │ (Mosquitto)  │     │   (Express)   │     │ (Optional)  │
└─────────────┘     └──────────────┘     └───────────────┘     └─────────────┘
                                                                      │
                                                                      │
                                                                      ▼
                                                              ┌─────────────┐
                                                              │    React    │
                                                              │  Dashboard  │
                                                              └─────────────┘
```

## Current Implementation Status

| Component | Status | Description |
|-----------|--------|-------------|
| React Frontend | ✅ | Complete with charts, sensor toggles, and real-time updates |
| Node.js Backend | ✅ | Express server with MQTT connectivity |
| Python Sensor Simulation | ✅ | Virtual sensors generating realistic environmental data |
| MQTT Broker | ✅ | Data transport layer using Mosquitto |
| Firebase Integration | 🔄 | Basic structure defined, ready for implementation |
| Authentication | ⏳ | Planned for future development |

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+ (for sensor simulation)
- MQTT Broker (e.g., Mosquitto)
- (Optional) Firebase account
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

4. Set up Python virtual environment for sensor simulation:
   ```bash
   cd ../sensor-simulation
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   ```bash
   # Backend (.env)
   MQTT_BROKER_URL=mqtt://localhost:1883
   PORT=3000

   # Frontend (.env)
   PORT=3001
   REACT_APP_API_URL=http://localhost:3000
   ```

### Running the Application

You'll need four terminal windows to run the complete system:

**Terminal 1 - MQTT Broker**:
```bash
mosquitto
```

**Terminal 2 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend**:
```bash
cd frontend
npm start
```

**Terminal 4 - Sensor Simulation**:
```bash
cd sensor-simulation
source venv/bin/activate  # On Windows: venv\Scripts\activate
python simulate_sensors.py
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## Project Structure

```
IoT-Sensor-Dashboard/
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── index.js        # Main Express server
│   │   └── ...
├── frontend/               # React dashboard
│   ├── src/
│   │   ├── components/     # React components 
│   │   │   ├── Dashboard.js       # Main dashboard
│   │   │   └── SensorList.js      # Sensor management
│   │   ├── App.js         # Main app component
│   │   └── ...
├── sensor-simulation/      # Python sensor simulation
│   ├── sensors/            # Sensor implementations
│   │   ├── base_sensor.py         # Base sensor class
│   │   └── environmental_sensor.py # Temperature/humidity sensor
│   ├── simulate_sensors.py # Main simulation script
│   └── ...
├── scripts/                # Utility scripts
└── README.md
```

## Dashboard Features

The dashboard provides:

- **Real-time Charts**: Visualizes temperature, humidity, and gas levels over time
- **Sensor Cards**: Shows the latest readings from each active sensor
- **Sensor Control**: Toggle each sensor on/off to control what data is displayed
- **Responsive Layout**: Adapts to different screen sizes
- **Auto-Updating**: All data updates every 5 seconds automatically

## Implementation Details

### Frontend (React)
- Built with React and Material UI
- Uses Chart.js for responsive, interactive charts
- Real-time data updates using polling and state management
- Responsive design for all screen sizes

### Backend (Node.js)
- Express server for RESTful API endpoints
- MQTT client for subscribing to sensor topics
- JSON parsing and validation
- Structured logging with Winston

### Sensor Simulation (Python)
- Object-oriented design with sensor classes
- MQTT publishing for real-time data transmission
- Realistic data generation with random variations
- Multi-threaded to simulate multiple sensors simultaneously

## Future Enhancements

- [ ] Add user authentication via Firebase Auth
- [ ] Implement historical data storage and retrieval
- [ ] Add alert thresholds for sensor values
- [ ] Create mobile app version
- [ ] Add sensor battery level monitoring
- [ ] Support custom dashboard layouts
- [ ] Implement data export functionality
- [ ] Add geolocation for multiple sensor sites

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Firebase](https://firebase.google.com/) for real-time database
- [MQTT.js](https://github.com/mqttjs/MQTT.js) for MQTT implementation
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Material UI](https://mui.com/) for UI components