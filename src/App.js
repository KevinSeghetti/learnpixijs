import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import BunnyExample from "./BunnyExample";
import Stats from "./Stats";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Stats />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">react-pixi-fiber Examples</h1>
        </header>
        <div className="App-intro">
          <BunnyExample />
        </div>
      </div>
    );
  }
}

export default App;
