import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
// import { createHistory } from 'history';
import createHistory from 'history/lib/createHashHistory';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistentStore } from 'persistent-redux';
import { PouchDBAdapter } from 'persistent-redux/lib/adapters';
import PouchDB from 'pouchdb';

import RootReducer from './reducers/Root';

// Route-Target Components
import NotFound from './components/NotFound';
import AlbumSelector from './components/AlbumSelector';
import Album from './components/Album';
import ImageView from './components/ImageView';
import NewAlbumDialog from './components/NewAlbumDialog';

import styles from './styles/App.css';

const rootElement = document.getElementById('app');
const db = new PouchDB('gallery');
rootElement.className = styles.main;

const options = {
	adapter: new PouchDBAdapter(db, { blobSupport: true }),
	actionFilter: ((action) => action.type.indexOf('@@router') !== 0),
};

const rMiddleware = routerMiddleware(browserHistory);

persistentStore(options).then((persistentMiddleware) => {
	const createStoreWithMiddleware = compose(
		applyMiddleware(
			createLogger(),
			thunk,
			rMiddleware,
		),
		persistentMiddleware
	)(createStore);

	const store = createStoreWithMiddleware(RootReducer);
	const history = syncHistoryWithStore(browserHistory, store);

	render((
		<Provider store={store}>
			<Router history={history}>
				<Route path="/" component={AlbumSelector}>
					<Route path="/album/new" component={NewAlbumDialog} />
				</Route>
				<Route path="/album/:albumId" component={Album}/>
				<Route path="/album/:albumId/:imageIndex" component={ImageView}/>
				<Route path="*" component={NotFound} />
			</Router>
		</Provider>
	), rootElement);
}).catch((err) => {
	alert('Could not initialize PouchDB middleware.');
	console.error(err);
});
