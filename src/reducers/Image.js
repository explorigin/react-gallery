import { ADD_IMAGE, REMOVE_IMAGE } from '../actions';

export function imageReducer(state = {}, action) {
	let { type, payload } = action;

	switch(type) {
	case ADD_IMAGE:
		return {
			...state,
			[payload.id]: {
				id: payload.id,
				name: payload.name,
				url: payload.url,
				blob: payload.blob,
				width: payload.width,
				height: payload.height
			}
		};
	case REMOVE_IMAGE:
		let newState = {...state};
		delete newState[payload.id];
		return newState;
	default:
		return state;
	}
}
