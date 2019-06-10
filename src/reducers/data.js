import {
	combineReducers
} from 'redux';

import {
	list
} from './userList/list';


import {
	App
} from './App/App';



const Reducers = combineReducers({
	list,
	App
});


export {
	Reducers
};