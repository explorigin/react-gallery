import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
import { createHistory } from 'history';
import { createStore, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { ReduxRouter, reduxReactRouter, routerStateReducer } from 'redux-router';

import GalleryReducer from './reducer';
import NotFound from './components/NotFound';
import AlbumSelector from './components/AlbumSelector';
import Album from './components/Album';

const reducer = combineReducers({
	router: routerStateReducer,
	albums: GalleryReducer,
	albumsById: GalleryReducer
});

const initialState = {
	albumsById: {
		1: {
			id: 1,
			name: 'Summer 2015',
			thumbnail: 'http://placekitten.com/g/320/240',
			images: [
				{
					id: 1,
					name: 'a',
					url: 'http://placekitten.com/g/320/200'
				},
				{
					id: 2,
					name: 'b',
					url: 'http://placekitten.com/g/320/200'
				}
			]
		},
		2: {
			id: 2,
			name: 'Child Antics',
			thumbnail: 'http://placekitten.com/g/320/240',
			images: [
				{
					id: 1,
					name: 'a',
					url: 'http://placekitten.com/g/320/200'
				},
				{
					id: 2,
					name: 'b',
					url: 'http://placekitten.com/g/320/200'
				}
			]
		}
	},
	albums: [1, 2]
};

const store = compose(
	reduxReactRouter({ createHistory })
)(createStore)(reducer, initialState);

render((
	<Provider store={store}>
		<ReduxRouter>
			<Route path="/" component={AlbumSelector} />
			<Route path="/album/:albumId" component={Album} />
			<Route path="*" component={NotFound} />
		</ReduxRouter>
	</Provider>
), document.getElementById('app'));
