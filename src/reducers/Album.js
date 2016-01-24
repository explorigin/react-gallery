import { ADD_ALBUM, ADD_IMAGE, REMOVE_IMAGE } from '../actions';

export function albumReducer(state = {}, action) {
	var newState, album;
	let { type, payload } = action;

	switch(type) {
	case ADD_ALBUM:
		return {
			...state,
			[payload.id]: {
				id: payload.id,
				name: payload.name,
				showcase: null,
				images: []
			}
		};
	case ADD_IMAGE:
		newState = {...state};
		album = newState[payload.albumId];
		album.images.push(payload.id);
		if (album.showcase === null) {
			album.showcase = album.images.length - 1;
		}
		return newState;
	case REMOVE_IMAGE:
		newState = {...state};
		album = newState[payload.albumId];
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
