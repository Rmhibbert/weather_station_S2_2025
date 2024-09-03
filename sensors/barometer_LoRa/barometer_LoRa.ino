#include <SPL06-007.h>
#include <Wire.h>
#include <SPI.h>
#include <LoRa.h>

#define LORA_SCK 5    
#define LORA_MISO 19 
#define LORA_MOSI 27  
#define LORA_SS 18  
#define LORA_RST 14 
#define LORA_DIO0 26

// LoRaWAN settings
const char *appEui = "0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00";       // Replace with your App EUI
const char *appKey = "0xA9, 0x2C, 0xB7, 0x16, 0x17, 0x68, 0xED, 0x2C, 0x5F, 0xE1, 0xDE, 0x49, 0x0D, 0xC0, 0xAF, 0xB9";       // Replace with your App Key
const long frequency = 915E6;  // Australia frequency

void setup() {
  Wire.begin();    // begin Wire(I2C)
  Serial.begin(9600); // begin Serial

  Serial.println("\nGoertek-SPL06-007 Demo\n");

  SPL_init(); // Setup initial SPL chip registers - default i2c address 0x76  

  // Initialize LoRa
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);  // Set the LoRa shield pins
  if (!LoRa.begin(frequency)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }

  Serial.println("LoRa Initializing OK!");
}

void loop() {
  // ---- Sensor Data ----------------
  String sensorData = "";

  sensorData += "ID: ";
  sensorData += String(get_spl_id()) + "; ";

  sensorData += "Temperature: ";
  sensorData += String(get_temp_c(), 1) + "C; ";

  sensorData += "Pressure: ";
  sensorData += String(get_pressure(), 2) + " mb; ";

  sensorData += "Altitude: ";
  sensorData += String(get_altitude(get_pressure(), 1011.3), 1) + " m; ";

  // Send data
  sendToTTN(sensorData);

  delay(2000); // Delay between readings
}

void sendToTTN(String data) {
  LoRa.beginPacket();
  LoRa.print(data);
  LoRa.endPacket();
  
  Serial.println("Data sent: " + data);
}
