import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import addAlbum from '../actions';

class NewAlbumDialog extends Component {
	render() {
		let { dispatch } = this.props;

		function onSubmit() {
			let action = addAlbum(this.refs.albumName.value, 0);
			dispatch(action);
			this.refs.albumName.value = '';
			window.location = '/album/' + action.id;
		}

		return (
			<form onSubmit={onSubmit}>
				<h1>{"Hi...I'm a new Album"}</h1>
				<input type="text" ref="albumName" autofocus />
				<button type="submit">{"Add"}</button>
			</form>
		);
	}
}

export default connect((state) => state)(NewAlbumDialog);
