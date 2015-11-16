import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Thumbnail from './Thumbnail';

class Album extends Component {
	render() {
		const { album } = this.props;

		let thumbnails = album.images.map(image => {
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
	return {
		album: state.albumsById[state.router.params.albumId]
	};
}

export default connect(select)(Album);
