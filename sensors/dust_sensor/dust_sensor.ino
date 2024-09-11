#include <Wire.h>
#include <SPI.h>
#include <lmic.h>
#include <hal/hal.h>

// LoRaWAN settings
static const u1_t PROGMEM APPEUI[8] = { 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
void os_getArtEui(u1_t* buf) {
  memcpy_P(buf, APPEUI, 8);
}

static const u1_t PROGMEM DEVEUI[8] = { 0x34, 0x96, 0x06, 0xD0, 0x7E, 0xD5, 0xB3, 0x70 };
void os_getDevEui(u1_t* buf) {
  memcpy_P(buf, DEVEUI, 8);
}

static const u1_t PROGMEM APPKEY[16] = { 0xA9, 0x2C, 0xB7, 0x16, 0x17, 0x68, 0xED, 0x2C, 0x5F, 0xE1, 0xDE, 0x49, 0x0D, 0xC0, 0xAF, 0xB9 };
void os_getDevKey(u1_t* buf) {
  memcpy_P(buf, APPKEY, 16);
}

unsigned char payload[5];
static osjob_t sendjob;

// Pin mapping for Arduino Duo with Dragino LoRa Shield
const lmic_pinmap lmic_pins = {
    .nss = 10,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 9,
    .dio = {2, 6, 7},
};

const unsigned TX_INTERVAL = 30;

int measurePin = A5;
int ledPower = 12;

unsigned int samplingTime = 280;
unsigned int deltaTime = 40;
unsigned int sleepTime = 9680;

float voMeasured = 0;
float calcVoltage = 0;
float dustDensity = 0;

void setup() {
  pinMode(ledPower,OUTPUT);
  Wire.begin();
  Serial.begin(9600);
  Serial.println(F("Starting"));

  // LMIC init
  os_init();

  // Reset the MAC state. Session and pending data transfers will be discarded.
  LMIC_reset();

  // Start job 
  do_send(&sendjob);
}

void onEvent (ev_t ev) {
    Serial.print(os_getTime());
    Serial.print(": ");
    switch(ev) {
        case EV_JOINED:
            Serial.println(F("EV_JOINED"));
            LMIC_setLinkCheckMode(0);
            break;
        case EV_TXCOMPLETE:
            Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
            if (LMIC.txrxFlags & TXRX_ACK)
              Serial.println(F("Received ack"));
            if (LMIC.dataLen) {
              Serial.print(F("Received "));
              Serial.print(LMIC.dataLen);
              Serial.println(F(" bytes of payload"));
            }
            os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), do_send);
            break;
        default:
            Serial.print(F("Unknown event: "));
            Serial.println((unsigned) ev);
            break;
    }
}
void do_send(osjob_t* j) {
   Serial.println(F("Preparing to send data"));

  if (LMIC.opmode & OP_TXRXPEND) {
    Serial.println(F("OP_TXRXPEND, not sending"));
    return;
  } else {
    // Read and process dust sensor data
    digitalWrite(ledPower, LOW);
    delayMicroseconds(samplingTime);

    voMeasured = analogRead(measurePin);

    delayMicroseconds(deltaTime);
    digitalWrite(ledPower, HIGH);
    delayMicroseconds(sleepTime);

    calcVoltage = voMeasured * (5.0 / 1024);
    dustDensity = 0.17 * calcVoltage - 0.1;

    if (dustDensity < 0) {
      dustDensity = 0.00;
    }

    Serial.print("Dust Density: ");
    Serial.println(dustDensity);

    // Prepare payload
    uint16_t payloadDust = (uint16_t)(dustDensity * 10); // Scale by 10 for 1 decimal place
    payload[0] = lowByte(payloadDust); // Low byte
    payload[1] = highByte(payloadDust); // High byte

    // Send payload over LoRaWAN
    LMIC_setTxData2(1, payload, sizeof(payload), 0);
    Serial.println(F("Payload sent"));
  }
}

void loop() {
  os_runloop_once();
}