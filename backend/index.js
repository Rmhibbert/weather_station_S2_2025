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

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
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
  

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})