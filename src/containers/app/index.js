import React from 'react';
import "./App.css";
import Pixijs from "containers/pixijs";
import Stats from "components/Stats";

const App = () => {
    return (
      <div className="App">
        <Stats />
        <header className="App-header">
          <h1 className="App-title">react-pixi test</h1>
        </header>
        <div className="App-intro">
          <Pixijs />
        </div>
      </div>
    );
}

export default App
