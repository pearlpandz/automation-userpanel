import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import Login from './components/pages/login.js';
import Register from './components/pages/register.js';
import Dashboard from './components/pages/dashboard.js';
import ProtectedRoute from './components/helpers/protectedRouter.js';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'; 
import 'font-awesome/css/font-awesome.min.css';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/register/" component={Register} />
          <ProtectedRoute exact path="/dashboard/" component={Dashboard} />
          {/* <Route exact path="/*" component={Wildcard} /> */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
