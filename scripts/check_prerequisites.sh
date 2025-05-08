#!/bin/bash

echo "Checking prerequisites for IoT Sensor Dashboard..."

# Check Node.js
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js installed ($(node -v))"
else
    echo "❌ Node.js not found. Please install Node.js v14 or higher"
fi

# Check Python
if command -v python3 >/dev/null 2>&1; then
    echo "✅ Python installed ($(python3 --version))"
else
    echo "❌ Python 3 not found. Please install Python 3.8 or higher"
fi

# Check pip
if command -v pip3 >/dev/null 2>&1; then
    echo "✅ pip installed ($(pip3 --version))"
else
    echo "❌ pip not found. Please install pip"
fi

# Check MQTT broker (mosquitto)
if command -v mosquitto >/dev/null 2>&1; then
    echo "✅ Mosquitto installed ($(mosquitto -h | head -n 1))"
else
    echo "❌ Mosquitto not found. Please install Mosquitto MQTT broker"
    echo "  Mac: brew install mosquitto"
    echo "  Linux: sudo apt-get install mosquitto"
fi

echo -e "\nMake sure you have:"
echo "1. Firebase account and configuration"
echo "2. Environment variables set up" 