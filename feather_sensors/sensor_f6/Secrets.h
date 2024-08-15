#ifndef SECRETS_H
#define SECRETS_H

#include <avr/pgmspace.h>

static const uint8_t PROGMEM APPEUI[8] = { 0xF6, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
static const uint8_t PROGMEM DEVEUI[8] = { 0xF5, 0x9A, 0x06, 0xD0, 0x7E, 0xD5, 0xB3, 0x70 };

// Placeholder for APPKEY
static const uint8_t PROGMEM APPKEY[16] = {FEATHER_PLACEHOLDER};

void os_getArtEui(uint8_t* buf) {
  memcpy_P(buf, APPEUI, 8);
}

void os_getDevEui(uint8_t* buf) {
  memcpy_P(buf, DEVEUI, 8);
}

void os_getDevKey(uint8_t* buf) {
  memcpy_P(buf, APPKEY, 16);
}

#endif // SECRETS_H
