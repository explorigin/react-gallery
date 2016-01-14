import { Component } from 'react';

export default class ObjectURLManager extends Component {
	constructor() {
		super();

		this.objectUrls = new Map();
	}

	componentWillUnmount() {
		for (let url of this.objectUrls.values()) {
			URL.revokeObjectURL(url);
		}
		this.objectUrls.clear();
	}

	getObjectUrl(id, img) {
		let url = this.objectUrls.get(id);
		if (!url) {
			url = URL.createObjectURL(img.data);
			this.objectUrls.set(id, url);
		}
		return url;
	}
}
