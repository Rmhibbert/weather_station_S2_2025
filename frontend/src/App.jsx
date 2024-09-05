import { useState } from 'react';
import Header from './components/Header/Header';
import Widget from './components/widget'
import './App.css';
import Webcam from './components/Webcam/Webcam'

function App() {
  const [temperature] = useState('20°C'); 
  const [airPressure] = useState('1013 hPa');
  const [humidity] = useState('123');
  const [wind] = useState('fast');

  return (
    <div className="app-container">
      <Header />
      <div className="widgets">
      <Widget name={'Temperature'} data={temperature}/>
      <Widget name={'AirPressure'} data={airPressure}/>
      <Widget name={'Humidity'} data={humidity}/>
      <Widget name={'Wind'} data={wind}/>
      <Webcam />
    
      </div>
    </div>
  );
}

export default App;

