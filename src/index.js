import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from "redux";
import Provider from "react-redux";
import thunkMiddleware from "react-thunk";
import './index.css';
import App from './App';
import "tachyons";
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
