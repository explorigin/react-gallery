import React from 'react';
import { connect } from 'react-redux';

import styles from '../styles/AlbumSelector.css';

import { Icon } from './Icon';
import ObjectURLManager from './ObjectURLManager';
import Thumbnail from './Thumbnail';

class AlbumSelector extends ObjectURLManager {
	render() {
		const { albums, images, children } = this.props;

		let thumbnails = albums.map(album => {
			try {
				let image = images[album.images[album.showcase]];
				let albumUrl = image.url || this.getObjectUrl(image.id, image.blob);
				return (
					<Thumbnail
						key={album.id}
						url={albumUrl}
						link={`/album/${album.id}`}
						caption={album.name}
					/>
				);
			} catch (e) {
				return (
					<Thumbnail
						key={album.id}
						link={`/album/${album.id}`}
						caption={album.name}
					>
						<Icon name={'image'} />
					</Thumbnail>
				);
			}
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
						<Icon name={'upload'} />
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
