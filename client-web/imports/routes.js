import React, {Component} from 'react';
import {Router, Route} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// routes
import Home from './ui/Home';
import Authorize from './ui/Authorize';
import Vote from './ui/Vote';

const browserHistory = createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/authorize" component={Authorize}/>
      <Route path="/vote" component={Vote}/>
    </div>
  </Router>
);