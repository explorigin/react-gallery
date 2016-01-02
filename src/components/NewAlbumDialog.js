import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-router';

import { addAlbum } from '../actions';

class NewAlbumDialog extends Component {
	onSubmit(evt) {
		evt.preventDefault();

		let { dispatch } = this.props;

		let action = addAlbum(this.refs.albumName.value, null);
		dispatch(action);
		this.refs.albumName.value = '';
		dispatch(replaceState(null, `/album/${action.payload.id}`));
	}

	render() {
		return (
			<form onSubmit={this.onSubmit.bind(this)}>
				<h1>{"Hi...I'm a new Album"}</h1>
				<input type="text" ref="albumName" autoFocus />
				<button type="submit">{"Add"}</button>
			</form>
		);
	}
}

export default connect((state) => state)(NewAlbumDialog);
