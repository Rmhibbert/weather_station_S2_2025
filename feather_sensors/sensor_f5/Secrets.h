#ifndef SECRETS_H
#define SECRETS_H

#include <avr/pgmspace.h>

static const u1_t PROGMEM APPEUI[8] = { 0xF5, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
static const u1_t PROGMEM DEVEUI[8] = { 0xF4, 0x9A, 0x06, 0xD0, 0x7E, 0xD5, 0xB3, 0x70 };

// Placeholder for APPKEY
static const uint8_t PROGMEM APPKEY[16] = { FEATHER_PLACEHOLDER };

// Function declarations
void os_getArtEui(uint8_t* buf);
void os_getDevEui(uint8_t* buf);
void os_getDevKey(uint8_t* buf);

#endif // SECRETS_H
