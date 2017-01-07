import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'preact-router';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
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
			<Router>
				<Route path="/" component={AlbumSelector} />
				<Route path="/album/new" component={NewAlbumDialog} />
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
