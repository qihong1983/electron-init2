import React from 'react';
import {
	Router,
	Route
} from 'react-router';

import App from './App';
import Contact from './pages/Contact/Contact';
import NotFound from './pages/NotFound/NotFound';
import H1 from './pages/H1/H1';
import Image from './pages/Image/Image';
import Website from './pages/Website/Website';
import Settings from './pages/Settings/Settings';

const Routes = (props) => (
	<Router {...props}>
		<Route path="/" component={App} />
		<Route path="contact" component={Contact} >
			<Route path="h1" component={H1} />

		</Route>
		<Route path="image" component={Image} />
		<Route path="website" component={Website} />
		<Route path="settings" component={Settings} />
		<Route path="*" component={NotFound} />
	</Router>
);

export default Routes;