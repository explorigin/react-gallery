import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import FontAwesome from 'react-fontawesome';

import Thumbnail from './Thumbnail';
import NewAlbumDialog from './components/NewAlbumDialog';

class AlbumSelector extends Component {
	render() {
		const { albums, images, children } = this.props;


		let thumbnails = albums.map(album => {
			return (
				<Thumbnail
					key={album.id}
					url={images[album.images[album.showcase]].url}
					link={'/album/' + album.id}
					caption={album.name}
				/>
			);
		});

		return (
			<div className="album-selector">
				<main>
					{thumbnails}
				</main>
			</div>
		);
	}
}

function select(state) {
	return {
		albums: state.albums.map((id) => state.albumsById[id]),
		images: state.imagesById
	};
}

export default connect(select)(AlbumSelector);
