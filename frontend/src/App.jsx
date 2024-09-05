import { useState } from 'react';
import Widget from './components/widget'
import './App.css';
import Webcam from './components/Webcam/Webcam'

function App() {
  const [data] = useState('coming soon');

  return (
    <div className="app-container">
      <div className="widgets">
      <Widget name={'Temperature'} data={data}/>
      <Widget name={'Air Pressure'} data={data}/>
      <Widget name={'Humidity'} data={data}/>
      <Widget name={'Wind'} data={data}/>
      <Webcam />
    
      </div>
    </div>
  );
}

export default App;

