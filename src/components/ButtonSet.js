import React, {Component, PropTypes} from 'react';
import axios from 'axios';

const propTypes = {};

const defaultProps = {};

class ButtonSet extends React.Component {

	constructor(props) {
		super(props);

		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
		this.volumeUp = this.volumeUp.bind(this);
		this.volumeDown = this.volumeDown.bind(this);
	}

	play() {
		axios.get('/play')
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	stop() {
		axios.get('/stop')
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	delay() {
		axios.get('/delay')
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	volumeUp() {
		axios.get('/volumeUp')
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	volumeDown() {
		axios.get('/volumeDown')
			.then((response) => {
				console.log(response);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	render() {
		return (
			<div className="center row">
				<div className="card-panel red darken-1" onClick={this.stop}>
					<h5 className="white-text">해제</h5>
				</div>
				<div className="card-panel pink darken-1" onClick={this.delay}>
					<h5 className="white-text">연기</h5>
				</div>
				<div className="card-panel purple darken-1" onClick={this.play}>
					<h5 className="white-text">재생</h5>
				</div>
			</div>
		);
	}
}

ButtonSet.propTypes = propTypes;

ButtonSet.defaultProps = defaultProps;

export default ButtonSet;