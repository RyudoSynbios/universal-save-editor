import React from 'react';
import { Route, Switch } from 'react-router-dom';

import EditorContainer from './EditorContainer';
import HomeContainer from './HomeContainer';

const AppContainer = () => (
  <Switch>
    <Route path="/" exact component={HomeContainer} />
    <Route path="/editor/:gameId" exact component={EditorContainer} />
  </Switch>
);

export default AppContainer;
