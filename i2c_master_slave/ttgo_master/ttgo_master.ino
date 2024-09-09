#include <SPL06-007.h>
#include <Wire.h>

#include <SPI.h>
#include <lmic.h>
#include <hal/hal.h>

// LoRaWAN settings
static const u1_t PROGMEM APPEUI[8] = { 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02 };
void os_getArtEui(u1_t* buf) {
  memcpy_P(buf, APPEUI, 8);
}

static const u1_t PROGMEM DEVEUI[8] = { 0xB7, 0xA2, 0x06, 0xD0, 0x7E, 0xD5, 0xB3, 0x70 };
void os_getDevEui(u1_t* buf) {
  memcpy_P(buf, DEVEUI, 8);
}

static const u1_t PROGMEM APPKEY[16] = { 0x5D, 0xCA, 0x0D, 0x6F, 0x78, 0xE4, 0x10, 0x94, 0x8E, 0x44, 0x17, 0x79, 0x30, 0x98, 0xFE, 0x13 };
void os_getDevKey(u1_t* buf) {
  memcpy_P(buf, APPKEY, 16);
}

unsigned char payload[7];
unsigned char payloadR[5];
static osjob_t sendjob;

const unsigned TX_INTERVAL = 60;

// Pin mapping for Dragino Shield
const lmic_pinmap lmic_pins = {
  .nss = 18,
  .rxtx = LMIC_UNUSED_PIN,
  .rst = 14,
  .dio = { 26, 33, 32 }  // Pins for the Heltec ESP32 Lora board/ TTGO Lora32 with 3D metal antenna
};

void setup() {
  Wire.begin();
  Serial.begin(9600);
  Serial.println(F("Starting"));

  Wire.requestFrom(0x08, 5);  // Request 2 bytes from the slave
  Wire.readBytes(payloadR, 5);
  Serial.print("Received Data: ");
  for (int i = 0; i < 5; i++) {
    Serial.print(payloadR[i], HEX);
    Serial.print(" ");
  }
  Serial.println();

  // Decode the first two bytes as temperature
  float temperature = decodeTemperature(payloadR[0], payloadR[1]);
  
  // Decode the next two bytes as CO2
  float CO2 = decodeCO2(payloadR[2], payloadR[3]);

  Serial.print("Decoded Temperature: ");
  Serial.println(temperature);
  
  Serial.print("Decoded CO2: ");
  Serial.println(CO2);

  // LMIC init
  os_init();
  // Reset the MAC state. Session and pending data transfers will be discarded.
  LMIC_reset();

  SPL_init();
  // Start job (sending automatically starts OTAA too)
  do_send(&sendjob);
}

void onEvent(ev_t ev) {
  Serial.print(os_getTime());
  Serial.print(": ");
  switch (ev) {
    case EV_JOINED:
      //Serial.println(F("EV_JOINED"));
      LMIC_setLinkCheckMode(0);
      break;
    case EV_TXCOMPLETE:
      //Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
      if (LMIC.txrxFlags & TXRX_ACK)
        //Serial.println(F("Received ack"));
        if (LMIC.dataLen) {
          //Serial.print(F("Received "));
          //Serial.print(LMIC.dataLen);
          //Serial.println(F(" bytes of payload"));
        }
      os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), do_send);
      break;
    default:
      //Serial.print(F("Unknown event: "));
      //Serial.println((unsigned) ev);
      break;
  }
}
void do_send(osjob_t* j) {
  // Check if there is not a current TX/RX job running
  if (LMIC.opmode & OP_TXRXPEND) {
    //Serial.println(F("OP_TXRXPEND, not sending"));
  } else {
    Wire.requestFrom(0x08, 5);  // Request 2 bytes from the slave
    Wire.readBytes(payloadR, 5);
    Serial.print("Received Data: ");
    for (int i = 0; i < 5; i++) {
      Serial.print(payloadR[i], HEX);
      Serial.print(" ");
    }
    Serial.println();

    // Decode the first two bytes as temperature
  float temperatureR = decodeTemperature(payloadR[0], payloadR[1]);
  
  // Decode the next two bytes as CO2
  float CO2R = decodeCO2(payloadR[2], payloadR[3]);

    // Read sensor data
    float temperature = get_temp_c();
    float pressure = get_pressure();

    if (CO2R != 0) temperature = (temperature + temperatureR) / 2;

    Serial.print("Temp: ");
    Serial.println(temperature);
    Serial.print("Press: ");
    Serial.println(pressure);
    Serial.print("CO2: ");
    Serial.println(CO2R);

    uint16_t payloadTemp = encodeFixedPoint100(temperature);
    uint16_t payloadPressure = encodeFixedPoint1(pressure);
    uint16_t payloadCO2 = encodeFixedPoint1(CO2R);

    // Convert to bytes
    byte tempLow = lowByte(payloadTemp);
    byte tempHigh = highByte(payloadTemp);
    byte PressureLow = lowByte(payloadPressure);
    byte PressureHigh = highByte(payloadPressure);
    byte CO2Low = lowByte(payloadCO2);
    byte CO2High = highByte(payloadCO2);

    // Fill the payload
    payload[0] = tempLow;
    payload[1] = tempHigh;
    payload[2] = PressureLow;
    payload[3] = PressureHigh;
    payload[4] = CO2Low;
    payload[5] = CO2High;

    // Prepare upstream data transmission at the next possible time
    LMIC_setTxData2(1, payload, sizeof(payload) - 1, 0);
    //Serial.println(F("Packet queued"));
  }
  // Next TX is scheduled after TX_COMPLETE event.
}

void loop() {
  os_runloop_once();
}

uint16_t encodeFixedPoint100(float value) {
  // Convert float to fixed-point (scale by 100 for 2 decimal places)
  int16_t fixedPointValue = (int16_t)(value * 100);
  return (uint16_t)fixedPointValue;
}

uint16_t encodeFixedPoint1(float value) {
  // Convert float to fixed-point (scale by 1 for 0 decimal places)
  int16_t fixedPointValue = (int16_t)(value);
  return (uint16_t)fixedPointValue;
}

// Function to decode temperature from the first two bytes of payload
float decodeTemperature(uint8_t tempLow, uint8_t tempHigh) {
  // Combine the two bytes into a single 16-bit integer
  int16_t fixedPointTemp = (tempHigh << 8) | tempLow;
  // Convert back to float by dividing by 100 to account for the fixed-point scaling
  return (float)fixedPointTemp / 100.0;
}

// Function to decode CO2 from the next two bytes of payload
float decodeCO2(uint8_t CO2Low, uint8_t CO2High) {
  // Combine the two bytes into a single 16-bit integer
  int16_t fixedPointCO2 = (CO2High << 8) | CO2Low;
  // Convert back to float by dividing by 1 (no scaling applied for CO2)
  return (float)fixedPointCO2;
}