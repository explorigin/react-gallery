import React from 'react';
import { connect } from 'react-redux';
import { pushState, replaceState } from 'redux-router';

import FontAwesome from 'react-fontawesome';

import ObjectURLManager from './ObjectURLManager';
import { removeImage } from '../actions';

class ImageView extends ObjectURLManager {
	isLastImage() {
		let { album, imageIndex } = this.props;
		return album.images.length - 1 <= imageIndex;
	}

	isFirstImage() {
		let { imageIndex } = this.props;
		return imageIndex === 0;
	}

	nextImage() {
		let { dispatch, album, imageIndex } = this.props;
		if (!this.isLastImage()) {
			dispatch(pushState(null, `/album/${album.id}/${imageIndex+1}`));
		}
	}

	prevImage() {
		let { dispatch, album, imageIndex } = this.props;
		if (!this.isFirstImage()) {
			dispatch(pushState(null, `/album/${album.id}/${imageIndex-1}`));
		}
	}

	removeImage() {
		let { dispatch, album, image } = this.props;
		dispatch(replaceState(null, `/album/${album.id}`));
		dispatch(removeImage(image.id, album.id));
	}

	render() {
		let { image } = this.props,
			url = image.src || this.getObjectUrl(image);

		return (
			<figure {...this.props} >
				<img src={url} />
				<figcaption>
					<button onClick={this.prevImage.bind(this)} disabled={this.isFirstImage()}><FontAwesome name={'angle-double-left'} /></button>
					{image.name}
					<button onClick={this.nextImage.bind(this)} disabled={this.isLastImage()}><FontAwesome name={'angle-double-right'} /></button>
					<button onClick={this.removeImage.bind(this)}><FontAwesome name={'remove'} /></button>
				</figcaption>
			</figure>
		);
	}
}

function select(state) {
	let { albumId, imageIndex } = state.router.params,
		album = state.albumsById[albumId];

	return {
		album,
		image: state.imagesById[album.images[imageIndex]],
		imageIndex: parseInt(imageIndex, 10)
	};
}

export default connect(select)(ImageView);
