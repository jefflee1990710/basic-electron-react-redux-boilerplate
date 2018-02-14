import './assets/css/App.css';

import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import {createLogger} from 'redux-logger';

import authReducer from './reducers/auth';
import photolistReducer from './reducers/photolist';
import folderReducer from './reducers/folder';

import thunk from 'redux-thunk';
import {Provider} from 'react-redux';

let root = document.createElement('div');
root.id = "root";
root.style.cssText = 'width : 100%; height : 100%';
document.body.appendChild( root );

const rootReducer = combineReducers({
  auth : authReducer,
  photolist : photolistReducer,
  folder : folderReducer
});
const store = createStore(rootReducer, {}, applyMiddleware(thunk, createLogger()));
window.store = store;

render(
  <Provider store={store}>
      <App />
  </Provider>
, document.getElementById('root') );
