import { getUniqueID } from './utils';

export const ADD_ALBUM = 'ADD_ALBUM';

export function addAlbum(name, showcase) {
	return {
		type: ADD_ALBUM,
		id: getUniqueID(),
		name,
		showcase
	};
}
