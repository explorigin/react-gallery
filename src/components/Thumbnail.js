import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router';

export default class Thumbnail extends Component {
	render() {
		let { key, url, caption, link, children} = this.props;

		let linkWrap = (children) => {
			return (
				<Link to={link} key={key} className="thumbnail">
					{children}
				</Link>
			);
		};

		let figure = (key) => {
			return (
				<figure key={key} >
					{url ? <img src={url} /> : children}
					<figcaption>{caption}</figcaption>
				</figure>
			);
		};

		return link ? linkWrap(figure(key)) : figure(key);
	}
}
