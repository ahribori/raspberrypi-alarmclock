/*
 ES6 문법으로
 var React = require('react');
 와 동일한 뜻이다.
 */
import React from 'react';
import axios from 'axios';
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
		
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
			<div className="center">
				<div className="row"></div>
				<div className="row">
					<div className="card-panel red darken-1" onClick={this.stop}>
						<h5 className="white-text">해제</h5>
					</div>
					<div className="card-panel pink darken-1" onClick={this.delay}>
						<h5 className="white-text">연기</h5>
					</div>
					<div className="card-panel purple darken-1" onClick={this.play}>
						<h5 className="white-text">재생</h5>
					</div>
					<div className="card-panel indigo darken-1" onClick={this.volumeUp}>
						<h5 className="white-text">볼륨 +</h5>
					</div>
					<div className="card-panel light-blue darken-1" onClick={this.volumeDown}>
						<h5 className="white-text">볼륨 -</h5>
					</div>
				</div>
			</div>
		);
	}
}
/*
 ES6 문법으로
 module.export = App;
 과 동일한 뜻이다.
 */
export default App;