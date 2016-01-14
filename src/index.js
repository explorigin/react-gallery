import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
// import { createHistory } from 'history';
import createHistory from 'history/lib/createHashHistory';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ReduxRouter, reduxReactRouter } from 'redux-router';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistentStore } from 'persistent-redux';
import PouchDB from 'pouchdb';

import RootReducer from './reducers/Root';

// Route-Target Components
import NotFound from './components/NotFound';
import AlbumSelector from './components/AlbumSelector';
import Album from './components/Album';
import ImageView from './components/ImageView';
import NewAlbumDialog from './components/NewAlbumDialog';

const options = {
	db: new PouchDB('gallery'),
	actionFilter: ((action) => action.type.indexOf('@@reduxReactRouter') !== 0),
	blobSupport: true
};

persistentStore(options).then((persistentMiddleware) => {
	const createStoreWithMiddleware = compose(
		reduxReactRouter({ createHistory }),
		applyMiddleware(createLogger(), thunk),
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
				<Route path="/album/:albumId/:imageIndex" component={ImageView}/>
				<Route path="*" component={NotFound} />
			</ReduxRouter>
		</Provider>
	), document.getElementById('app'));
}).catch((err) => {
	alert('Could not initialize PouchDB middleware.');
	console.error(err);
});
