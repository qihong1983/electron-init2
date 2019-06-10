import React from 'react';
import ReactDOM from 'react-dom';


import {
	Router,
	Route,
	IndexRoute,
	IndexRedirect,
	hashHistory,
	useRouterHistory
} from 'react-router';


import Routes from './routes';

import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

import {
	createStore,
	applyMiddleware,
	combineReducers,
	compose
} from 'redux';

import {
	Provider
} from 'react-redux';

import {
	historyMiddleware,
	syncHistoryWithStore,
	routerReducer
} from 'react-router-redux';


import {
	list
} from './reducers/data';

import 'antd/dist/antd.css';

const thunk = require('redux-thunk').default;

// import {
// 	profileList,
// 	userList
// } from './reducers/data';



const reducer = combineReducers({
	// profileList,
	list,
	routing: routerReducer
});

// const store = createStore(reducer, applyMiddleware(thunk));
let store;
if (!(window.__REDUX_DEVTOOLS_EXTENSION__ || window.__REDUX_DEVTOOLS_EXTENSION__)) {
	store = createStore(
		reducer,
		applyMiddleware(thunk)
	);
} else {
	store = createStore(
		reducer,
		compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) //插件调试，未安装会报错
	);
}

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(<Provider store={store}>
	<Routes history={history} />
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();