import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Thumbnail from './Thumbnail';

class Album extends Component {
	render() {
		const { images, album } = this.props;

		let thumbnails = images.map(image => {
			return <Thumbnail key={image.id} url={image.url} caption={image.name} />;
		});

		return (
			<div className="album-view">
				<header>
					<h1>{album.name}</h1>
				</header>
				<main>
					{thumbnails}
				</main>
			</div>
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
