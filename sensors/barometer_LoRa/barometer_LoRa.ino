#include <SPL06-007.h>
#include <Wire.h>

#include <SPI.h>
#include <lmic.h>
#include <hal/hal.h>

// LoRaWAN settings
static const u1_t PROGMEM APPEUI[8]={ /*Fill me in*/ };
void os_getArtEui (u1_t* buf) { memcpy_P(buf, APPEUI, 8);}

static const u1_t PROGMEM DEVEUI[8]={ /*Fill me in*/ };
void os_getDevEui (u1_t* buf) { memcpy_P(buf, DEVEUI, 8);}

static const u1_t PROGMEM APPKEY[16] = { /*Fill me in*/ };
void os_getDevKey (u1_t* buf) {  memcpy_P(buf, APPKEY, 16);}

char payload[64];  
static osjob_t sendjob;

const unsigned TX_INTERVAL = 60;

// Pin mapping for Dragino Shield
const lmic_pinmap lmic_pins = {
    .nss = 10,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 9,
    .dio = {2, 6, 7},
};

void setup() {
    Wire.begin();
    Serial.begin(9600);
    Serial.println(F("Starting"));

    // LMIC init
    os_init();
    // Reset the MAC state. Session and pending data transfers will be discarded.
    LMIC_reset();

    SPL_init();
    // Start job (sending automatically starts OTAA too)
    do_send(&sendjob);
}

void onEvent (ev_t ev) {
    Serial.print(os_getTime());
    Serial.print(": ");
    switch(ev) {
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
        // Read sensor data
        double temperature = get_temp_c();
        double pressure = get_pressure();
        double altitude = get_altitude(get_pressure(), 1011.3); // Sea level pressure as 1011.3 mb

        // Check if sensor readings are valid
        if (isnan(temperature) || isnan(pressure) || isnan(altitude)) {
            //Serial.println(F("Error reading sensor data"));
            snprintf(payload, sizeof(payload), "Error");
        } else {
            // Format payload 
            // Payload decoder is on GitHub
            snprintf(payload, sizeof(payload), "T:%.2f P:%.2f A:%.2f", temperature, pressure, altitude);
        }
        
        // Prepare upstream data transmission at the next possible time
        LMIC_setTxData2(1, (uint8_t*)payload, strlen(payload), 0);
        //Serial.println(F("Packet queued"));
    }
    // Next TX is scheduled after TX_COMPLETE event.
}

void loop() {
    os_runloop_once();
}