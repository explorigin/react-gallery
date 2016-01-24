import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import FontAwesome from 'react-fontawesome';

import styles from '../styles/AlbumSelector.css';

import ObjectURLManager from './ObjectURLManager';
import Thumbnail from './Thumbnail';

class AlbumSelector extends ObjectURLManager {
	render() {
		const { albums, images, children } = this.props;

		let thumbnails = albums.map(album => {
			let albumUrl;
			if (album.showcase === null) {
				// FIXME - hardcoded placeholder
				albumUrl = 'http://placekitten.com/g/320/220';
			} else {
				albumUrl = images[album.images[album.showcase]].url;
			}

			return (
				<Thumbnail
					key={album.id}
					url={albumUrl}
					link={`/album/${album.id}`}
					caption={album.name}
				/>
			);
		});

		return (
			<div>
				<main className={styles.albumSelectorMain}>
					{thumbnails}
					<Thumbnail
						key={'add'}
						link={'/album/new'}
						caption={'Add New'}
					>
						<FontAwesome name={'rocket'} />
					</Thumbnail>
				</main>
				{children}
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
