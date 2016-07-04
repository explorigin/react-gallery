import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Reducers
import { albumListReducer, albumReducer } from './Album';
import { imageReducer } from './Image';

const RootReducer = combineReducers({
	routing: routerReducer,
	albums: albumListReducer,
	albumsById: albumReducer,
	imagesById: imageReducer
});

export default RootReducer;
