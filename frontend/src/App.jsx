import { useState } from 'react'
import Temperature from './components/Temperature/Temperature';
import AirPressure from './components/AirPressure/AirPressure';
import Webcam from './components/Webcam/Webcam';
import Humidity from './components/Humidity/Humidity';
import Wind from './components/Wind/Wind';
import './App.css'

function App() {
  const [temperature] = useState('20°C'); 
  const [airPressure] = useState('1013 hPa');
  const [humidity] = useState('123');
  const [wind] = useState('fast')
 

  return (
    <div className="App">
      <Temperature temperature={temperature} />
      <AirPressure airPressure={airPressure} />
      <Humidity humidity={humidity} />
      <Wind wind={wind} />
      <Webcam />
    </div>
  );
}

export default App
