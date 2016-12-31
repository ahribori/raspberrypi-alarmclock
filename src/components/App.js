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
	}
	
	render() {
		return (
			<div>
				<ButtonSet/>
				<AlarmRegisterForm/>
				<AlarmList/>
			</div>
		);
	}
}

export default App;