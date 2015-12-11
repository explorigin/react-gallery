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

	getObjectUrl(img) {
		let url = this.objectUrls.get(img);
		if (!url) {
			url = URL.createObjectURL(img.blob.data);
			this.objectUrls.set(img, url);
		}
		return url;
	}
}
