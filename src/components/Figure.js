import React from 'react';

import styles from '../styles/Thumbnail.css';

const Figure = (props) => {
	return (
		<figure className={styles.figure} key={props.key}>
			{
				props.url
				? <img
					className={styles.image}
					src={props.url}
					width={props.width/4}
					height={props.height/4}
						/>
				: props.children
			}
			<figcaption className={styles.caption}>
				{props.caption}
			</figcaption>
		</figure>
	);
};

export default Figure;
