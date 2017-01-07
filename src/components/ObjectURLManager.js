import { Component } from 'react';

export default class ObjectURLManager extends Component {
	static urls = new Map();

	static cleanup(id) {
		let url = ObjectURLManager.urls.get(id);

		if (url) {
			URL.revokeObjectURL(url);
			ObjectURLManager.urls.delete(id);
		}
	}

	constructor() {
		super();

		this.localIds = new Set();
		this.oldIds = null;
	}

	componentWillUpdate() {
		this.oldIds = this.localIds;
		this.localIds = new Set();
	}

	componentDidUpdate() {
		const toRemove = Array.from(this.oldIds).filter(id => !this.localIds.has(id));

		toRemove.forEach(ObjectURLManager.cleanup);
		this.oldIds = null;
	}

	componentWillUnmount() {
		Array.from(this.localIds).forEach(ObjectURLManager.cleanup);
		this.localIds.clear();
	}

	getObjectUrl(id, img) {
		let url = ObjectURLManager.urls.get(id);
		if (!url) {
			url = URL.createObjectURL(img.data);
			ObjectURLManager.urls.set(id, url);
			this.localIds.add(id);
		}

		return url;
	}
}
