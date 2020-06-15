import React from 'react';
import Bulbs from './Components/Bulbs';
import Nodes from './Components/Nodes';
import './App.css';


function App() {
  return (
    <div className="App">
      <h2>Bulbs</h2>
      <Bulbs />

      <h2>Nodes</h2>
      <Nodes />
    </div>
  );
}

export default App;
