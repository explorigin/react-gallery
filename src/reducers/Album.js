import { ADD_ALBUM, ADD_IMAGE } from '../actions';

export function albumReducer(state = {}, action) {
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
		let newState = {...state};
		newState[payload.albumId].images.push(payload.id);
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
