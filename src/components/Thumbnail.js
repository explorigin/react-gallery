import React, { Component } from 'react';
import { Link } from 'preact-router';

import Figure from './Figure';
import styles from '../styles/Thumbnail.css';

export default class Thumbnail extends Component {
	render() {
		let { link, key } = this.props;
		let figure = Figure(this.props);

		if (link) {
			return (
				<Link href={link} className={styles.link} key={key}>
					{figure}
				</Link>
			);
		}

		return figure;
	}
}
