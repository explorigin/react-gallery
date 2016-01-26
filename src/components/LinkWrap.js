import React from 'react';
import { Link } from 'react-router';

const LinkWrap = (props) => {
	return (
		<Link {...props}>
			{props.children}
		</Link>
	);
};

export default LinkWrap;
