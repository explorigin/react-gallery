// import { ADD_ALBUM } from '../actions';

export function imageReducer(state = {}, action) {
	switch(action.type) {
	// case ADD_ALBUM:
	// 	return Object.assign({}, state,
	// 		{
	// 			[action.id]: {
	// 				id: action.id,
	// 				name: action.name,
	// 				showcase: action.showcase
	// 			}
	// 		}
	// 	);
	default:
		return state;
	}
}

export function imageListReducer(state = [], action) {
	switch(action.type) {
	// case ADD_ALBUM:
	// 	return [
	// 		...state,
	// 		action.id
	// 	];
	default:
		return state;
	}
}
