import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
import { createHistory } from 'history';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ReduxRouter, reduxReactRouter } from 'redux-router';
import createLogger from 'redux-logger';
import PouchDB from 'pouchdb';

import RootReducer from './reducers/Root';
import persistentStore from './middlewares/persistentStore';

// Route-Target Components
import NotFound from './components/NotFound';
import AlbumSelector from './components/AlbumSelector';
import Album from './components/Album';
import NewAlbumDialog from './components/NewAlbumDialog';

const db = new PouchDB('gallery');

persistentStore({db}).then((persistentMiddleware) => {
	const createStoreWithMiddleware = compose(
		reduxReactRouter({ createHistory }),
		applyMiddleware(createLogger()),
		persistentMiddleware
	)(createStore);

	let store = createStoreWithMiddleware(RootReducer);

	render((
		<Provider store={store}>
			<ReduxRouter>
				<Route path="/" component={AlbumSelector}>
					<Route path="/album/new" component={NewAlbumDialog} />
				</Route>
				<Route path="/album/:albumId" component={Album}/>
				<Route path="*" component={NotFound} />
			</ReduxRouter>
		</Provider>
	), document.getElementById('app'));
}).catch((err) => {
	alert('Could not initialize PouchDB middleware.');
	console.error(err);
});
