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

unsigned char payload[5];
unsigned char payloadR[5];
static osjob_t sendjob;

const unsigned TX_INTERVAL = 200;

// State variable to track which payload to send
int payloadState = 0;  // 0 = temperature/pressure, 1 = temperature/CO2

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

  Wire.requestFrom(0x08, 9);  // Request 2 bytes from the slave
  Wire.readBytes(payloadR, 9);
  Serial.print("Received Data: ");
  for (int i = 0; i < 9; i++) {
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
      LMIC_setLinkCheckMode(0);
      break;

    case EV_TXCOMPLETE:
      if (LMIC.txrxFlags & TXRX_ACK)
        Serial.println(F("Received ack"));

      // Transmission is complete, now switch to the other payload
      if (payloadState == 0) {
        payloadState = 1;  // Switch to temperature/CO2
      } else if (payloadState == 1) {
        payloadState = 2;  // Switch to temperature/pressure
      } else if (payloadState == 2) {
        payloadState = 0;
      }

      // Schedule the next transmission
      os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), do_send);
      break;

    default:
      break;
  }
}

void do_send(osjob_t* j) {
  // Check if there is not a current TX/RX job running
  if (LMIC.opmode & OP_TXRXPEND) {
    Serial.println(F("OP_TXRXPEND, not sending"));
  } else {
    // Read sensor data (same as in your current code)
    Wire.requestFrom(0x08, 9);
    Wire.readBytes(payloadR, 9);
    Serial.print("Received Data: ");
    for (int i = 0; i < 9; i++) {
      Serial.print(payloadR[i], HEX);
      Serial.print(" ");
    }
    Serial.println();

    // Decide which payload to send based on the payloadState
    if (payloadState == 0) {
      // Encode and send temperature and pressure
      float temperaturePres = get_temp_c();
      float pressure = get_pressure();

      uint16_t payloadTempPress = encodeFixedPoint100(temperaturePres);
      uint16_t payloadPressure = encodeFixedPoint1(pressure);

      payload[0] = lowByte(payloadTempPress);
      payload[1] = highByte(payloadTempPress);
      payload[2] = lowByte(payloadPressure);
      payload[3] = highByte(payloadPressure);

      LMIC_setTxData2(1, payload, 4, 0);  // Send on port 1
      Serial.println(F("Sending temperature/pressure"));

    } else if (payloadState == 1) {
      // Encode and send temperature and CO2
      float temperatureR = decodeTemperature(payloadR[0], payloadR[1]);
      float CO2R = decodeCO2(payloadR[2], payloadR[3]);

      uint16_t payloadTempCO2 = encodeFixedPoint100(temperatureR);
      uint16_t payloadCO2 = encodeFixedPoint1(CO2R);

      payload[0] = lowByte(payloadTempCO2);
      payload[1] = highByte(payloadTempCO2);
      payload[2] = lowByte(payloadCO2);
      payload[3] = highByte(payloadCO2);

      LMIC_setTxData2(2, payload, 4, 0);  // Send on port 3
      Serial.println(F("Sending temperature/CO2"));
    } else if (payloadState == 2) {
      // Encode and send wind and rain
      float Wind = decodeTemperature(payloadR[4], payloadR[5]);
      float Rain = decodeCO2(payloadR[6], payloadR[7]);

      uint16_t payloadWind = encodeFixedPoint100(Wind);
      uint16_t payloadRain = encodeFixedPoint1(Rain);

      payload[0] = lowByte(payloadWind);
      payload[1] = highByte(payloadWind);
      payload[2] = lowByte(payloadRain);
      payload[3] = highByte(payloadRain);

      LMIC_setTxData2(3, payload, 4, 0);  // Send on port 2
      Serial.println(F("Sending temperature/CO2"));
    }
  }
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