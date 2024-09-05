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
  const [data] = useState('coming soon');

  return (
    <div className="app-container">
      <Header />
      <div className="widgets">
      <Widget name={'Temperature'} data={data}/>
      <Widget name={'AirPressure'} data={data}/>
      <Widget name={'Humidity'} data={data}/>
      <Widget name={'Wind'} data={data}/>
      <Webcam />
    
      </div>
    </div>
  );
}

export default App;

