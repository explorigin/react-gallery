import React from 'react';
import { connect } from 'react-redux';
import { Link, route } from 'preact-router';

import styles from '../styles/ImageViewerView.css';

import ObjectURLManager from './ObjectURLManager';
import { Icon } from './Icon';
import { removeImage } from '../actions';


const ZOOM_CLASSES = [false, styles.cover, styles.full];

class ImageViewerView extends ObjectURLManager {
	constructor(props) {
		super();

		this.mouseMoveTimeout = null;

		this.setState({
			mouseActive: true,
			zoomLevel: 0,
			viewerWidth: 0,
			viewerHeight: 0,
		});
	}

	componentWillMount() {
		window.addEventListener('resize', this.onLayout, true);
	}

	componentDidMount() {
		this.onLayout();
	}

	componentDidUpdate(prevProps, { zoomLevel }) {
		const currentZoomLevel = this.state.zoomLevel;
		if (currentZoomLevel !== zoomLevel) {
			const { height, width } = this.props.image;
			const { viewerWidth, viewerHeight } = this.state;
			const node = this.getDOMNode();

			if (currentZoomLevel === 1) {
				const imageHeight = viewerWidth * height / width;
				node.scrollTop = imageHeight / 2 - viewerHeight / 2;
			} else if (currentZoomLevel === 2) {
				node.scrollTop = height / 2 - viewerHeight / 2;
				node.scrollLeft = width / 2 - viewerWidth / 2;
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onLayout);
	}

	onLayout = () => {
		const node = this.getDOMNode();
		const { width, height } = node.getBoundingClientRect();
		this.setState({
			viewerWidth: width,
			viewerHeight: height
		});
	}

	onMouseLeave = () => {
		this.setState({ mouseActive: false });
	};

	onMouseMove = () => {
		if (this.mouseMoveTimeout !== null) {
			clearTimeout(this.mouseMoveTimeout);
		}
		this.mouseMoveTimeout = setTimeout(this.onMouseLeave, 3000);
		this.setState({ mouseActive: true });
	};

	onDeleteClick = () => {
		let { onDelete, album, image } = this.props;
		route(`/album/${album.id}`, true);
		onDelete(image.id, album.id);
	}

	zoomIn = () => {
		this.setState({
			zoomLevel: Math.min(this.state.zoomLevel + 1, ZOOM_CLASSES.length - 1)
		});
	};

	zoomOut = (evt) => {
		evt.preventDefault();
		this.setState({
			zoomLevel: Math.max(this.state.zoomLevel - 1, 0)
		});
	};

	render(props, { mouseActive, viewerWidth, viewerHeight, zoomLevel }) {
		const { image, album, onDelete /* , onClose, onNext, onPrev */ } = props;
		const { width, height, blob, id } = image;

		const imageStyle = {
			backgroundImage: `url(${this.getObjectUrl(id, blob)})`,
			...(
				zoomLevel === 1
				? { height: `${viewerWidth * height / width}px` }
				: zoomLevel === 2
				? { height: `${height}px`, width: `${width}px` }
				: {}
			)
		};

		return (
			<div
				className={{
					[styles.viewer]: true,
					[styles.mouseActive]: mouseActive,
				}}
				onClick={this.zoomIn}
				onContextMenu={this.zoomOut}
				onMouseMove={this.onMouseMove}
				onMouseLeave={this.onMouseLeave}
			>
				<div className={styles.header}>
					<Link href={`/album/${album.id}`}>
						<div className={styles.button}>
							<Icon name={'arrow_left'} size={0.75} />
						</div>
					</Link>

					<div className={styles.button} onClick={this.onDeleteClick}>
						<Icon name={'trash'} size={0.75} />
					</div>
				</div>
				<div
					className={{
						[styles.image]: true,
						[ZOOM_CLASSES[zoomLevel]]: !!zoomLevel
					}}
					style={imageStyle}
				/>
				<div className={styles.prevZone}>
					<Icon name={'chevron_left'} size={0.75} />
				</div>
				<div className={styles.nextZone}>
					<Icon name={'chevron_right'} size={0.75} />
				</div>

			</div>
		);
	};
}

export default connect(
	(state, navProps) => {
		let { albumId, imageIndex } = navProps.matches,
			album = state.albumsById[albumId];

		return {
			album,
			image: state.imagesById[album.images[imageIndex]],
			imageIndex: parseInt(imageIndex, 10)
		};
	},
	(dispatch) => {
		return {
			onDelete: (albumId, imageId) => dispatch(removeImage(albumId, imageId)),
		};
	}
)(ImageViewerView);
