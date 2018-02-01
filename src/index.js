import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {createLogger} from 'redux-logger';
import {Provider} from 'react-redux';

import commonReducr from './reducers/common';

let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

const rootReducer = combineReducers({
  common : commonReducr
});

const logger = createLogger();
const middleware = [logger];

const store = createStore(rootReducer, {}, applyMiddleware(logger));

render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root') );
