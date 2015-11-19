import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';

// Reducers
import { albumListReducer, albumReducer } from './Album';
import { imageReducer } from './Image';

const RootReducer = combineReducers({
	router: routerStateReducer,
	albums: albumListReducer,
	albumsById: albumReducer,
	imagesById: imageReducer
});

export default RootReducer;
