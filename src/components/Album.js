import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import Thumbnail from './Thumbnail';

import { addImage } from '../actions';

class Album extends Component {
	constructor() {
		super();

		this.imageUrls = new Map();
	}

	componentWillUnmount() {
		for (let url of this.imageUrls.values()) {
			URL.revokeObjectURL(url);
		}
		this.imageUrls.clear();
	}

	fileDropped(files) {
		let { album, dispatch } = this.props;
		files.forEach((f) => {
			dispatch(addImage(
				album.id,
				f.name,
				null,
				f
			));
		});
	}

	render() {
		const { images, album } = this.props;

		let thumbnails = images.map(image => {
			let url = image.url || this.imageUrls.get(image);
			if (!url) {
				url = URL.createObjectURL(image.blob.data);
				this.imageUrls.set(image, url);
			}
			return (
				<Thumbnail
					key={image.id}
					url={url}
					caption={image.name}
				/>
			);
		});

		return (
			<Dropzone
				onDrop={this.fileDropped.bind(this)}
				className={'album-view'}
				activeClassName={'active'}
				multiple
			>
				<header>
					<h1>{album.name}</h1>
				</header>
				<main>
					{thumbnails}
				</main>
			</Dropzone>
		);
	}
}

function select(state) {
	let album = state.albumsById[state.router.params.albumId];

	return {
		album: album,
		images: album.images.map(imageId => state.imagesById[imageId])
	};
}

export default connect(select)(Album);
