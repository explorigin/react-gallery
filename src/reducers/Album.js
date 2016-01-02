import { ADD_ALBUM, ADD_IMAGE, REMOVE_IMAGE } from '../actions';

export function albumReducer(state = {}, action) {
	var newState;

	let { type, payload } = action;

	switch(type) {
	case ADD_ALBUM:
		return {
			...state,
			[payload.id]: {
				id: payload.id,
				name: payload.name,
				showcase: payload.showcase,
				images: []
			}
		};
	case ADD_IMAGE:
		newState = {...state};
		newState[payload.albumId].images.push(payload.id);
		return newState;
	case REMOVE_IMAGE:
		newState = {...state};
		let album = newState[payload.albumId];
		let index = album.images.indexOf(payload.id);
		if (index !== -1) {
			album.images.splice(index, 1);
		}
		return newState;
	default:
		return state;
	}
}

export function albumListReducer(state = [], action) {
	let { type, payload } = action;

	switch(type) {
	case ADD_ALBUM:
		return [
			...state,
			payload.id
		];
	default:
		return state;
	}
}
