import os
from dotenv import load_dotenv
from faker import Faker
from sensors.environmental_sensor import EnvironmentalSensor
import threading

# Load environment variables
load_dotenv()

# Initialize Faker for generating realistic names
fake = Faker()

def create_sensor(location_name: str) -> EnvironmentalSensor:
    """Create a sensor with some randomized base values"""
    return EnvironmentalSensor(
        name=f"{location_name} Environmental Sensor",
        location=location_name,
        base_temperature=20 + fake.random.uniform(-2, 2),
        base_humidity=50 + fake.random.uniform(-10, 10),
        base_gas_level=400 + fake.random.uniform(-50, 50),
        mqtt_broker=os.getenv("MQTT_BROKER", "localhost"),
        mqtt_port=int(os.getenv("MQTT_PORT", "1883")),
        update_interval=int(os.getenv("UPDATE_INTERVAL", "5"))
    )

def main():
    # Create multiple sensors for different locations
    locations = [
        "Living Room",
        "Kitchen",
        "Bedroom",
        "Bathroom",
        "Garage"
    ]
    
    sensors = [create_sensor(location) for location in locations]
    threads = []
    
    print("Starting sensor simulation...")
    print(f"MQTT Broker: {os.getenv('MQTT_BROKER', 'localhost')}")
    print(f"Number of sensors: {len(sensors)}")
    
    # Start each sensor in a separate thread
    for sensor in sensors:
        thread = threading.Thread(target=sensor.run)
        thread.daemon = True
        threads.append(thread)
        thread.start()
        print(f"Started sensor: {sensor.name} ({sensor.sensor_id})")
    
    try:
        # Keep the main thread alive
        for thread in threads:
            thread.join()
    except KeyboardInterrupt:
        print("\nStopping all sensors...")
        # The sensor threads will stop automatically since they're daemon threads

if __name__ == "__main__":
    main() 