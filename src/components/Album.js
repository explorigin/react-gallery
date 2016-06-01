import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router';

import ObjectURLManager from './ObjectURLManager';
import Thumbnail from './Thumbnail';

import styles from '../styles/Album.css';

import { addImage } from '../actions';

class Album extends ObjectURLManager {
	onOpenClick = () => {
		this.refs.dropzone.open();
	};

	fileDropped = (files) => {
		let { album, dispatch } = this.props;
		files.forEach((f) => {
			dispatch(addImage(
				album.id,
				f.name,
				null,
				f
			));
		});
	};

	render() {
		const { images, album } = this.props;

		let thumbnails = images.map((image, index) => {
			let url = image.thumbnail
				? this.getObjectUrl(`${image.id}-full`, image.blob)
				: url || this.getObjectUrl(`${image.id}-full`, image.blob);

			return (
				<Thumbnail
					key={image.id}
					url={url}
					link={`/album/${album.id}/${index}`}
					caption={image.name}
					width={image.width}
					height={image.height}
				/>
			);
		});

		return (
			<div>
				<Link to={'/'}>
					<FontAwesome name={'arrow-left'} />
				</Link>
				<Dropzone
					className={styles.dropzone}
					activeClassName={styles.dropzoneActive}
					onDrop={this.fileDropped}
					ref={'dropzone'}
					multiple
					disableClick
				>
					<header>
						<h1>
							{album.name}
							<button onClick={this.onOpenClick}>
								<FontAwesome name={'upload'} />
							</button>
						</h1>

					</header>
					<main className={styles.main}>
						{thumbnails}
					</main>
				</Dropzone>
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
