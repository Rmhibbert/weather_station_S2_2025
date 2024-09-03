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
static const PROGMEM u1_t NWKSKEY[16] = { 0x4E, 0x2E, 0x30, 0x9B, 0x7C, 0x06, 0xD2, 0x03, 0xCB, 0x50, 0x29, 0x10, 0x69, 0xDC, 0x57, 0xEA };

// LoRaWAN AppSKey, application session key
static const u1_t PROGMEM APPSKEY[16] = { 0x18, 0xBD, 0x18, 0x86, 0x36, 0x48, 0x87, 0x68, 0xA6, 0xC5, 0xE6, 0x78, 0x95, 0xEC, 0x36, 0x77 };

static const u4_t DEVADDR = 0x260DAB75 ; 

const long frequency = 915E6;  // Australia frequency

void os_getArtEui (u1_t* buf) { }
void os_getDevEui (u1_t* buf) { }
void os_getDevKey (u1_t* buf) { }

static osjob_t sendjob;

void setup() {
  Wire.begin();    // begin Wire(I2C)
  Serial.begin(9600); // begin Serial

  Serial.println("\nGoertek-SPL06-007 Demo\n");

  SPL_init(); // Setup initial SPL chip registers - default i2c address 0x76  

  // Initialize LoRa
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);  // Set the LoRa shield pins, must be set before begin

  LoRa.begin(frequency); //Intialise the LoRa module

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
