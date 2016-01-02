import { getUniqueID } from './utils';

export const ADD_ALBUM = 'ADD_ALBUM';
export const ADD_IMAGE = 'ADD_IMAGE';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';

export function addAlbum(name, showcase) {
	return {
		type: ADD_ALBUM,
		payload: {
			id: getUniqueID(),
			images: [],
			name,
			showcase
		}
	};
}

export function removeImage(id, albumId) {
	return {
		type: REMOVE_IMAGE,
		payload: {
			id,
			albumId
		}
	};
}

export function addImage(albumId, name, url, blob) {
	let action = {
		type: ADD_IMAGE,
		payload: {
			albumId,
			id: getUniqueID(),
			name,
			url,
			blob
		}
	};

	if (blob) {
		action._attachments = ['payload.blob'];
	}
	return action;
}
