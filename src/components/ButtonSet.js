import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';
import axios from 'axios';

const propTypes = {};

const defaultProps = {};

class ButtonSet extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			state: '',
			music: '',
			remainTime: undefined
		};
		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
		this.delay = this.delay.bind(this);
		this.volumeUp = this.volumeUp.bind(this);
		this.volumeDown = this.volumeDown.bind(this);
		this.getRemainTime = this.getRemainTime.bind(this);
	}

	play() {
		axios.get('/play')
			.then((response) => {
				this.setState(update(this.state, {
					state: { $set: response.data.state },
					music: { $set: response.data.music }
				}));
				console.log(this.state);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	stop() {
		axios.get('/stop')
			.then((response) => {
				this.setState(update(this.state, {
					state: { $set: response.data.state },
					music: { $set: '' }
				}));
				console.log(this.state);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	delay() {
		axios.get('/delay')
			.then((response) => {
				this.setState(update(this.state, {
					state: { $set: response.data.state },
					music: { $set: '' }
				}));
				console.log(this.state);
				if (response.data.state === 'WAITING') {
					this.getRemainTime();
				}
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

	getRemainTime() {
		setTimeout(() => {
			axios.get('/getRemainTime')
				.then((response) => {
					this.setState({
						remainTime: response.data.remainTime
					});
					if (response.data.state === 'WAITING') {
						this.getRemainTime();
					}
				})
				.catch((err) => {
					console.error(err);
				});
		}, 3000);
	}

	render() {
		return (
			<div className="center row">
				<div className="card-panel red darken-1" onClick={this.stop}>
					<h5 className="white-text">해제</h5>
				</div>
				<div className="card-panel pink darken-1" onClick={this.delay}>
					<h5 className="white-text">연기 {this.state.state === 'WAITING' && this.state.remainTime !== undefined ? `(${this.state.remainTime}초 남음)` : ''}</h5>
				</div>
				<div className="card-panel purple darken-1" onClick={this.play}>
					<h5 className="white-text">{this.state.state === 'PLAYING' ? `${this.state.music} 재생중♬` : '재생'}</h5>
				</div>
			</div>
		);
	}
}

ButtonSet.propTypes = propTypes;

ButtonSet.defaultProps = defaultProps;

export default ButtonSet;