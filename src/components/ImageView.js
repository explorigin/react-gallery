import React from 'react';
import { connect } from 'react-redux';
import { Link, route } from 'preact-router';

import FontAwesome from 'react-fontawesome';

import ObjectURLManager from './ObjectURLManager';
import { removeImage } from '../actions';

class ImageView extends ObjectURLManager {
	isLastImage = () => {
		let { album, imageIndex } = this.props;
		return album.images.length - 1 <= imageIndex;
	};

	isFirstImage = () => {
		let { imageIndex } = this.props;
		return imageIndex === 0;
	};

	nextImage = () => {
		let { album, imageIndex } = this.props;
		if (!this.isLastImage()) {
			route(`/album/${album.id}/${imageIndex+1}`);
		}
	};

	prevImage = () => {
		let { album, imageIndex } = this.props;
		if (!this.isFirstImage()) {
			route(`/album/${album.id}/${imageIndex-1}`);
		}
	};

	removeImage = () => {
		let { dispatch, album, image } = this.props;
		route(`/album/${album.id}`, true);
		dispatch(removeImage(image.id, album.id));
	};

	render() {
		let { image, album } = this.props,
			url = image.url || this.getObjectUrl(image.id, image.blob);

		return (
			<div>
				<Link href={`/album/${album.id}`}>
					<FontAwesome name={'arrow-left'} />
				</Link>
				<figure>
					<img src={url}/>
					<figcaption>
						<button onClick={this.prevImage} disabled={this.isFirstImage()}><FontAwesome name={'angle-double-left'} /></button>
						{image.name}
						<button onClick={this.nextImage} disabled={this.isLastImage()}><FontAwesome name={'angle-double-right'} /></button>
						<button onClick={this.removeImage}><FontAwesome name={'remove'} /></button>
					</figcaption>
				</figure>
			</div>
		);
	}
}

function select(state, navProps) {
	let { albumId, imageIndex } = navProps.matches,
		album = state.albumsById[albumId];

	return {
		album,
		image: state.imagesById[album.images[imageIndex]],
		imageIndex: parseInt(imageIndex, 10)
	};
}

export default connect(select)(ImageView);
