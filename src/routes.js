import React from 'react';
import {
	Router,
	Route
} from 'react-router';

import App from './App';
import Website from './pages/Website/Website';

const Routes = (props) => (
	<Router {...props}>
		<Route path="/" component={App} />
		<Route path="website" component={Website} />
	</Router>
);

export default Routes;