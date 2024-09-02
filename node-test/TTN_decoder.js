function Decoder(bytes, port) {
    if (bytes.length !== 4) {
      return null; // Invalid payload length
    }
  
    let decoded = {};
  
    // Combine bytes into 16-bit integers
    let tempRaw = (bytes[1] << 8) | bytes[0];
    let humidRaw = (bytes[3] << 8) | bytes[2];
  
    // Convert to signed values if necessary
    let temperature = (tempRaw & 0x8000) ? -(0x10000 - tempRaw) : tempRaw;
    let humidity = (humidRaw & 0x8000) ? -(0x10000 - humidRaw) : humidRaw;
  
    // Decode temperature and humidity
    decoded.temperature = temperature / 100.0;
    decoded.humidity = humidity / 100.0;
  
    return decoded;
  }
  