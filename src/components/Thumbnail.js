import { Component } from 'react';

import LinkWrap from './LinkWrap';
import Figure from './Figure';
import styles from '../styles/Thumbnail.css';

export default class Thumbnail extends Component {
	render() {
		let { link, key } = this.props;
		let figure = Figure(this.props);

		if (link) {
			return LinkWrap(
				{
					to: link,
					className: styles.link,
					key: key,
					children: figure
				}
			);
		}

		return figure;
	}
}
