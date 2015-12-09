import { ADD_IMAGE } from '../actions';

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
				blob: payload.blob
			}
		};
	default:
		return state;
	}
}
