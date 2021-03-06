import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { changeInput, changeBox, setScores, getUser, getRoute } from "./reducers";
import thunkMiddleware from "redux-thunk";
import './index.css';
import App from './App';
import "tachyons";
import registerServiceWorker from './registerServiceWorker';

const rootReducer = combineReducers({changeInput, changeBox, setScores, getUser, getRoute});
const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, document.getElementById('root'));
registerServiceWorker();
