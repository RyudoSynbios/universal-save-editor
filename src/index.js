import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import AppContainer from './containers/AppContainer';

import './index.css';

const App = () => (
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
