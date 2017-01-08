import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'preact-router';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistentStore } from 'persistent-redux';
import createHistory from 'history/createHashHistory';
import { PouchDBAdapter } from 'persistent-redux/lib/adapters';
import PouchDB from 'pouchdb';

import RootReducer from './reducers/Root';

// Route-Target Components
import NotFound from './components/NotFound';
import AlbumSelector from './components/AlbumSelector';
import Album from './components/Album';
import ImageViewerView from './components/ImageViewerView';
import NewAlbumDialog from './components/NewAlbumDialog';

import styles from './styles/App.css';

const history = createHistory();
const rootElement = document.getElementById('app');
const db = new PouchDB('gallery');
rootElement.className = styles.main;

persistentStore({
	adapter: new PouchDBAdapter(db, { blobSupport: true }),
}).then((persistentMiddleware) => {
	const createStoreWithMiddleware = compose(
		applyMiddleware(
			createLogger(),
			thunk,
		),
		persistentMiddleware
	)(createStore);

	const store = createStoreWithMiddleware(RootReducer);

	render((
		<Provider store={store}>
			<Router history={history}>
				<AlbumSelector path="/" />
				<NewAlbumDialog path="/album/new" />
				<Album path="/album/:albumId" />
				<ImageViewerView path="/album/:albumId/:imageIndex" />
				<NotFound default />
			</Router>
		</Provider>
	), rootElement);
}).catch((err) => {
	alert('Could not initialize PouchDB middleware.');
	console.error(err);
});
