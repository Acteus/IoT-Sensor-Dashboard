import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <h1>IoT Sensor Dashboard</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>Dashboard coming soon!</div>} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App; 