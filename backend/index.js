const express = require('express')
const bodyParser = require('body-parser')
const pool = require('./db')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get("/", async (req, res) => {
  try {
    res.json({data: "test"})
  } catch (error) {
    
  }
})

app.get('/data', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM sensor_data'); // Replace 'yourTable' with your table name
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
  app.post('/receive-data', async (req, res) => {
    try {
      const device_id = req.body.end_device_ids.device_id;
      const humidity = req.body.uplink_message.decoded_payload.humidity;
      const temperature = req.body.uplink_message.decoded_payload.temperature;

      if (!device_id || typeof temperature !== 'number' || typeof humidity !== 'number') {
        return res.status(400).send('Invalid data');
      }
  
      await pool.query(
        'INSERT INTO sensor_data (device_id, temperature, humidity) VALUES ($1, $2, $3)',
        [device_id, temperature, humidity]
      );
  
      res.status(200).send('Data received');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})