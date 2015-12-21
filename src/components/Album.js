import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import FontAwesome from 'react-fontawesome';

import ObjectURLManager from './ObjectURLManager';
import Thumbnail from './Thumbnail';

import { addImage } from '../actions';

class Album extends ObjectURLManager {
	onOpenClick() {
		this.refs.dropzone.open();
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

		let thumbnails = images.map((image, index) => {
			let url = image.url || this.getObjectUrl(image);

			return (
				<Thumbnail
					key={image.id}
					url={url}
					link={`/album/${album.id}/${index}`}
					caption={image.name}
				/>
			);
		});

		return (
			<Dropzone
				className={'album-view'}
				activeClassName={'active'}
				onDrop={this.fileDropped.bind(this)}
				ref="dropzone"
				multiple
				disableClick
			>
				<div>
					<header>
						<h1>
							{album.name}
							<button onClick={this.onOpenClick.bind(this)}>
								<FontAwesome name={'upload'} />
							</button>
						</h1>

					</header>
					<main>
						{thumbnails}
					</main>
				</div>
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
