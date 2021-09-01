import React, {PureComponent} from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

class Router extends PureComponent {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={Home}
            key={"/"}
          />
          <Route component={NotFound} key='*' />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Router
