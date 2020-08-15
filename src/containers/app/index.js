import React from 'react';
import { Route, Link } from 'react-router-dom'

import Stats from "components/Stats";

import Home from "containers/home";
import First from "containers/first";
import Generator from "containers/generator";

import "./App.scss";

const App = () => (
  <div className="root" >
    <Stats />
    <h2>Pixijs on react/redux tests</h2>
    <header>
      <Link to="/">Home</Link>
      <Link to="/first">First</Link>
      <Link to="/generator">Generator</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/first" component={First} />
      <Route exact path="/generator" component={Generator} />
    </main>
  </div>
)

export default App

