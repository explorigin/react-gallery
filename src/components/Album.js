import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import FontAwesome from 'react-fontawesome';

import ObjectURLManager from './ObjectURLManager';
import Thumbnail from './Thumbnail';

import { addImage } from '../actions';

class Album extends ObjectURLManager {
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
			let url = image.url || this.getObjectUrl(image);

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
					<FontAwesome name={'upload'} />

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
