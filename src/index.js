import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';
import { createHistory } from 'history';
import { createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import { ReduxRouter, reduxReactRouter } from 'redux-router';

import RootReducer from './reducers/Root';

// Route-Target Components
import NotFound from './components/NotFound';
import AlbumSelector from './components/AlbumSelector';
import Album from './components/Album';

const reduxRouter = reduxReactRouter({ createHistory });
const createStoreWithMiddleware = compose(reduxRouter)(createStore);
const store = createStoreWithMiddleware(RootReducer, window.initialState);

render((
	<Provider store={store}>
		<ReduxRouter>
			<Route path="/" component={AlbumSelector} />
			<Route path="/album/:albumId" component={Album} />
			<Route path="*" component={NotFound} />
		</ReduxRouter>
	</Provider>
), document.getElementById('app'));
