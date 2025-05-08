from typing import Dict, Any
import random
import math
from .base_sensor import BaseSensor

class EnvironmentalSensor(BaseSensor):
    def __init__(
        self,
        name: str,
        location: str,
        base_temperature: float = 22.0,
        base_humidity: float = 45.0,
        base_gas_level: float = 400.0,
        **kwargs
    ):
        super().__init__(name, location, **kwargs)
        self.base_temperature = base_temperature
        self.base_humidity = base_humidity
        self.base_gas_level = base_gas_level
        self.time_counter = 0
        
    def get_reading(self) -> Dict[str, Any]:
        # Simulate daily temperature variation using a sine wave
        daily_variation = math.sin(2 * math.pi * self.time_counter / (24 * 60))  # 24 hours in minutes
        
        # Add some random noise
        temp_noise = random.uniform(-0.5, 0.5)
        humidity_noise = random.uniform(-2, 2)
        gas_noise = random.uniform(-10, 10)
        
        # Calculate sensor values
        temperature = self.base_temperature + (daily_variation * 3) + temp_noise
        humidity = self.base_humidity + (daily_variation * 5) + humidity_noise
        gas_level = self.base_gas_level + gas_noise
        
        # Ensure values stay within realistic ranges
        temperature = round(max(min(temperature, 40), -10), 2)
        humidity = round(max(min(humidity, 100), 0), 2)
        gas_level = round(max(gas_level, 0), 2)
        
        # Increment time counter
        self.time_counter += 1
        
        return {
            "temperature": temperature,
            "humidity": humidity,
            "gas_level": gas_level,
            "unit": {
                "temperature": "celsius",
                "humidity": "percent",
                "gas_level": "ppm"
            }
        } 