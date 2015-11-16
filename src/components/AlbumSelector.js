import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Thumbnail from './Thumbnail';

class AlbumSelector extends Component {
	render() {
		const { albums } = this.props;

		let thumbnails = albums.map(album => {
			return (
				<Thumbnail
					key={album.id}
					url={album.thumbnail}
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
		albums: state.albums.map((id) => state.albumsById[id])
	};
}

export default connect(select)(AlbumSelector);
