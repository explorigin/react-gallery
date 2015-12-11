import React from 'react';
import { connect } from 'react-redux';

import ObjectURLManager from './ObjectURLManager';
// import { addAlbum } from '../actions';

class ImageView extends ObjectURLManager {
	render() {
		let { images, imageIndex } = this.props,
			image = images[imageIndex],
			url = image.src || this.getObjectUrl(image);

		return (
			<figure {...this.props} >
				<img src={url} />
				<figcaption>{image.name}</figcaption>
			</figure>
		);
	}
}

function select(state) {
	let { albumId, imageIndex } = state.router.params,
		album = state.albumsById[albumId];

	return {
		images: album.images.map(imageId => state.imagesById[imageId]),
		albumId,
		imageIndex
	};
}

export default connect(select)(ImageView);
