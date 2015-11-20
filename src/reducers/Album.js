import { ADD_ALBUM } from '../actions';

export function albumReducer(state = {}, action) {
	switch(action.type) {
	case ADD_ALBUM:
		return Object.assign({}, state,
			{
				[action.id]: {
					id: action.id,
					name: action.name,
					showcase: action.showcase,
					images: []
				}
			}
		);
	default:
		return state;
	}
}

export function albumListReducer(state = [], action) {
	switch(action.type) {
	case ADD_ALBUM:
		return [
			...state,
			action.id
		];
	default:
		return state;
	}
}
