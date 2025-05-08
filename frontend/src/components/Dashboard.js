import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import SensorList from './SensorList';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState({
    sensors: [],
    readings: {}
  });
  const [chartData, setChartData] = useState({
    temperature: { labels: [], datasets: [] },
    humidity: { labels: [], datasets: [] },
    gasLevel: { labels: [], datasets: [] }
  });
  const [activeSensors, setActiveSensors] = useState([]);
  
  // Use ref to store mutable data that doesn't trigger re-renders
  const sensorDataRef = useRef(sensorData);

  // Mock data for initial testing
  useEffect(() => {
    // This simulates the data that would come from the backend
    const mockData = generateMockData();
    setSensorData(mockData);
    sensorDataRef.current = mockData;
    
    // Set all sensors as active by default
    setActiveSensors(mockData.sensors.map(sensor => sensor.id));
    
    updateCharts(mockData);
    setLoading(false);

    // In a real application, you would fetch data from your API
    // Example:
    // fetchSensorData();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      const newMockData = updateMockData(sensorDataRef.current);
      setSensorData(newMockData);
      sensorDataRef.current = newMockData;
      updateCharts(newMockData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  // Update charts whenever active sensors change
  useEffect(() => {
    if (!loading) {
      updateCharts(sensorData);
    }
  }, [activeSensors, loading, sensorData]);

  // Toggle sensor visibility
  const handleToggleSensor = (sensorId) => {
    setActiveSensors(prevActive => {
      if (prevActive.includes(sensorId)) {
        return prevActive.filter(id => id !== sensorId);
      } else {
        return [...prevActive, sensorId];
      }
    });
  };

  // Function to fetch data from the backend (not used in mock mode)
  const fetchSensorData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/readings');
      setSensorData(response.data);
      sensorDataRef.current = response.data;
      updateCharts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      setLoading(false);
    }
  };

  // Generate mock data for testing
  const generateMockData = () => {
    const sensors = [
      { id: 'sensor1', name: 'Living Room Sensor', location: 'Living Room', type: 'Virtual', status: 'active' },
      { id: 'sensor2', name: 'Kitchen Sensor', location: 'Kitchen', type: 'Virtual', status: 'active' },
      { id: 'sensor3', name: 'Bedroom Sensor', location: 'Bedroom', type: 'Virtual', status: 'active' },
    ];

    const readings = {};

    // Generate 10 readings for each sensor
    sensors.forEach(sensor => {
      readings[sensor.id] = [];
      
      for (let i = 0; i < 10; i++) {
        const timestamp = new Date(Date.now() - (9 - i) * 60000).toISOString();
        readings[sensor.id].push({
          timestamp,
          temperature: 20 + Math.random() * 5,
          humidity: 40 + Math.random() * 20,
          gasLevel: 400 + Math.random() * 50,
        });
      }
    });

    return { sensors, readings };
  };

  // Update mock data with new readings
  const updateMockData = (currentData) => {
    // Create a deep copy to avoid mutating state directly
    const updatedData = {
      sensors: [...currentData.sensors],
      readings: { ...currentData.readings }
    };
    
    updatedData.sensors.forEach(sensor => {
      // Ensure we're working with a copy of the readings array
      updatedData.readings[sensor.id] = [...currentData.readings[sensor.id]];
      const readings = updatedData.readings[sensor.id];
      
      // Remove oldest reading
      if (readings.length > 20) {
        readings.shift();
      }
      
      // Add new reading
      const lastReading = readings[readings.length - 1];
      const timestamp = new Date().toISOString();
      
      readings.push({
        timestamp,
        temperature: lastReading.temperature + (Math.random() - 0.5) * 2,
        humidity: lastReading.humidity + (Math.random() - 0.5) * 5,
        gasLevel: lastReading.gasLevel + (Math.random() - 0.5) * 10,
      });
    });
    
    return updatedData;
  };

  // Update chart data based on sensor readings
  const updateCharts = (data) => {
    const colors = ['#1976d2', '#dc004e', '#4caf50', '#ff9800', '#9c27b0'];
    
    const temperatureDatasets = [];
    const humidityDatasets = [];
    const gasLevelDatasets = [];
    
    // Get the last 10 timestamps from the first sensor (if exists)
    const timeLabels = data.sensors.length > 0 && data.readings[data.sensors[0].id]
      ? data.readings[data.sensors[0].id].slice(-10).map(reading => {
          const date = new Date(reading.timestamp);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        })
      : [];
    
    // Create datasets for each active sensor
    data.sensors
      .filter(sensor => activeSensors.includes(sensor.id))
      .forEach((sensor, index) => {
        const sensorReadings = data.readings[sensor.id] || [];
        const color = colors[index % colors.length];
        
        temperatureDatasets.push({
          label: sensor.name,
          data: sensorReadings.slice(-10).map(reading => reading.temperature),
          borderColor: color,
          backgroundColor: `${color}22`,
          tension: 0.4,
        });
        
        humidityDatasets.push({
          label: sensor.name,
          data: sensorReadings.slice(-10).map(reading => reading.humidity),
          borderColor: color,
          backgroundColor: `${color}22`,
          tension: 0.4,
        });
        
        gasLevelDatasets.push({
          label: sensor.name,
          data: sensorReadings.slice(-10).map(reading => reading.gasLevel),
          borderColor: color,
          backgroundColor: `${color}22`,
          tension: 0.4,
        });
      });
    
    setChartData({
      temperature: {
        labels: timeLabels,
        datasets: temperatureDatasets,
      },
      humidity: {
        labels: timeLabels,
        datasets: humidityDatasets,
      },
      gasLevel: {
        labels: timeLabels,
        datasets: gasLevelDatasets,
      },
    });
  };

  // Chart options
  const temperatureOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Temperature (°C)' },
    },
    scales: {
      y: { beginAtZero: false, min: 15, max: 30 },
    },
    animation: { duration: 500 },
  };
  
  const humidityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Humidity (%)' },
    },
    scales: {
      y: { beginAtZero: false, min: 30, max: 70 },
    },
    animation: { duration: 500 },
  };
  
  const gasLevelOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Gas Level (ppm)' },
    },
    scales: {
      y: { beginAtZero: false, min: 350, max: 500 },
    },
    animation: { duration: 500 },
  };

  // Get the latest reading for each sensor
  const getLatestReadings = () => {
    const latest = {};
    
    sensorData.sensors.forEach(sensor => {
      const readings = sensorData.readings[sensor.id] || [];
      latest[sensor.id] = readings.length > 0 ? readings[readings.length - 1] : null;
    });
    
    return latest;
  };

  const latestReadings = getLatestReadings();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        IoT Sensor Dashboard
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Sensor List */}
          <Grid item xs={12} md={3}>
            <SensorList 
              sensors={sensorData.sensors}
              activeSensors={activeSensors}
              onToggleSensor={handleToggleSensor}
            />
          </Grid>
          
          {/* Main Dashboard */}
          <Grid item xs={12} md={9}>
            {/* Sensor Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {sensorData.sensors
                .filter(sensor => activeSensors.includes(sensor.id))
                .map(sensor => {
                  const latestReading = latestReadings[sensor.id];
                  
                  return (
                    <Grid item xs={12} sm={6} key={sensor.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {sensor.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Location: {sensor.location}
                          </Typography>
                          
                          {latestReading ? (
                            <Box mt={2}>
                              <Typography variant="body1">
                                Temperature: {latestReading.temperature.toFixed(1)}°C
                              </Typography>
                              <Typography variant="body1">
                                Humidity: {latestReading.humidity.toFixed(1)}%
                              </Typography>
                              <Typography variant="body1">
                                Gas Level: {latestReading.gasLevel.toFixed(0)} ppm
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Last updated: {new Date(latestReading.timestamp).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="error">
                              No data available
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
            </Grid>
            
            {/* Charts */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '300px' }}>
                  <Line data={chartData.temperature} options={temperatureOptions} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '300px' }}>
                  <Line data={chartData.humidity} options={humidityOptions} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2, height: '300px' }}>
                  <Line data={chartData.gasLevel} options={gasLevelOptions} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 