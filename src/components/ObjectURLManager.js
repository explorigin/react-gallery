import { Component } from 'react';

export default class ObjectURLManager extends Component {
	componentWillUnmount() {
		for (let url of ObjectURLManager.urls.values()) {
			URL.revokeObjectURL(url);
		}
		ObjectURLManager.urls.clear();
	}

	getObjectUrl(id, img) {
		let url = ObjectURLManager.urls.get(id);
		if (!url) {
			url = URL.createObjectURL(img.data);
			ObjectURLManager.urls.set(id, url);
		}
		return url;
	}
}

ObjectURLManager.urls = new Map();
