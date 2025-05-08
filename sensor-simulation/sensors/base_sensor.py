import time
import uuid
from datetime import datetime
import random
import paho.mqtt.client as mqtt
from typing import Dict, Any

class BaseSensor:
    def __init__(
        self,
        name: str,
        location: str,
        mqtt_broker: str = "localhost",
        mqtt_port: int = 1883,
        update_interval: int = 5
    ):
        self.sensor_id = str(uuid.uuid4())
        self.name = name
        self.location = location
        self.mqtt_broker = mqtt_broker
        self.mqtt_port = mqtt_port
        self.update_interval = update_interval
        self.client = mqtt.Client()
        
        # Connect to MQTT broker
        self.client.on_connect = self.on_connect
        self.client.on_publish = self.on_publish
        
    def on_connect(self, client, userdata, flags, rc):
        print(f"Connected to MQTT Broker with result code {rc}")
        
    def on_publish(self, client, userdata, mid):
        print(f"Message {mid} published successfully")
        
    def connect(self):
        try:
            self.client.connect(self.mqtt_broker, self.mqtt_port, 60)
            self.client.loop_start()
        except Exception as e:
            print(f"Failed to connect to MQTT broker: {e}")
            
    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
        
    def get_reading(self) -> Dict[str, Any]:
        """
        Override this method in child classes to implement specific sensor behavior
        """
        raise NotImplementedError
        
    def publish_reading(self):
        reading = self.get_reading()
        reading.update({
            "sensor_id": self.sensor_id,
            "timestamp": datetime.utcnow().isoformat(),
            "name": self.name,
            "location": self.location
        })
        
        topic = f"sensors/{self.sensor_id}/data"
        self.client.publish(topic, str(reading), qos=1)
        
    def run(self):
        """
        Start the sensor simulation
        """
        self.connect()
        try:
            while True:
                self.publish_reading()
                time.sleep(self.update_interval)
        except KeyboardInterrupt:
            print("Stopping sensor simulation...")
            self.disconnect() 