/*
 ES6 문법으로
 var React = require('react');
 와 동일한 뜻이다.
 */
import React from 'react';
import ButtonSet from './ButtonSet';
import AlarmRegisterForm from './AlarmRegisterForm';
import AlarmList from './AlarmList';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			auth: false
		}
	}

	componentDidMount() {
		const sdk = window.AHRIBORI_AUTH_SDK;

		sdk.checkToken({
			success: (user) => {
				if (user.info.admin) {
					this.setState({
						auth: true
					})
				} else {
					alert('권한이 없는 사용자 입니다');
				}
			},
			fail: () => {
				this.setState({
					auth: false
				})
			}
		});

		sdk.createLoginButton({
			container: '#ahribori_auth',
			size: 'large',
			success: (authObj) => {
				if (authObj.auth.user.admin) {
					this.setState({
						auth: true
					})
				} else {
					alert('권한이 없는 사용자 입니다');
				}
			},
			logout: () => {
				this.setState({
					auth: false
				})
			}
		})
	}

	
	render() {

		const alarmInterface = (
			<div>
				<ButtonSet/>
				<AlarmRegisterForm/>
				<AlarmList/>
			</div>
		);

		return (
			<div>
				<div className="col s12 m8 offset-m2 l6 offset-l3">
					<div className="card-panel grey lighten-5 z-depth-1">
						<div className="row valign-wrapper">
							<h4 style={{
								margin: '0 auto 0 auto',
								fontWeight: '100'
							}}>Raspberrypi Alarm</h4>
						</div>
					</div>
				</div>
				{ this.state.auth ? alarmInterface : '' }
				<div id="ahribori_auth" style={{
					margin: '50px',
					textAlign: 'center'
				}}></div>
			</div>
		);
	}
}

export default App;