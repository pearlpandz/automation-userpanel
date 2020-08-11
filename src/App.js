import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './components/pages/login.js';
import Register from './components/pages/register.js';
import AddRoomsAndDevices from './components/pages/addRoomsAndDevices.js';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router> 
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/add" component={AddRoomsAndDevices} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
