import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Switch,
  Typography,
  Divider,
  Paper,
  Box
} from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';

const SensorList = ({ sensors, activeSensors, onToggleSensor }) => {
  return (
    <Paper elevation={2} sx={{ height: '100%' }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Sensors
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {sensors.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No sensors available
          </Typography>
        ) : (
          <List>
            {sensors.map((sensor) => {
              const isActive = activeSensors.includes(sensor.id);
              
              return (
                <ListItem
                  key={sensor.id}
                  disablePadding
                  secondaryAction={
                    <Switch
                      edge="end"
                      checked={isActive}
                      onChange={() => onToggleSensor(sensor.id)}
                    />
                  }
                >
                  <ListItemButton onClick={() => onToggleSensor(sensor.id)}>
                    <ListItemIcon>
                      <SensorsIcon color={isActive ? 'primary' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={sensor.name}
                      secondary={sensor.location}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default SensorList; 