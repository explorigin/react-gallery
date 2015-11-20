import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { replaceState } from 'redux-router';

import { addAlbum } from '../actions';

class NewAlbumDialog extends Component {
	onSubmit(dispatch, evt) {
		evt.preventDefault();

		let action = addAlbum(this.refs.albumName.value, null);
		dispatch(action);
		this.refs.albumName.value = '';
		dispatch(replaceState(null, '/album/' + action.id));
	}

	render() {
		let { dispatch } = this.props;
		let onSubmit = this.onSubmit.bind(this, dispatch);

		return (
			<form onSubmit={onSubmit}>
				<h1>{"Hi...I'm a new Album"}</h1>
				<input type="text" ref="albumName" autoFocus />
				<button type="submit">{"Add"}</button>
			</form>
		);
	}
}

export default connect((state) => state)(NewAlbumDialog);
