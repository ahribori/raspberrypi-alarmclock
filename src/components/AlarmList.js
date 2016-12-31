import React, {Component, PropTypes} from 'react';
import axios from 'axios';

const propTypes = {};

const defaultProps = {};

class AlarmList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			list: []
		};
	}

	componentDidMount() {
		axios.get('/alarm')
			.then((response) => {
				this.setState({
					list: response.data
				});
			})
			.catch((err) => {
				console.error(err);
			});
		console.log('mㅎ')
	}

	render() {
		const timeStyle = {
			'fontSize': '22px'
		};

		const dayOfWeekStyle = {
			'marginLeft': '20px'
		};

		const buttonZoneStyle = {
			'padding': '10px'
		};

		const buttonStyle = {
			'marginLeft': '5px'
		};

		const dayMap = ['일', '월', '화', '수', '목', '금', '토', '일'];

		const indexToDay = (data) => {
			return data.map((index) => {
				return dayMap[index] + ' ';
			});
		};

		const mapToComponent = (data) => {
			return data.map((alarm, i) => {
				return (
					<ul className="collapsible popout" data-collapsible="accordion" key={i}>
						<li>
							<div className="collapsible-header"><i className="material-icons">schedule</i>
								<span style={timeStyle}>{alarm.hour}시 {alarm.minute}분</span>
								<span style={dayOfWeekStyle}>{indexToDay(alarm.dayOfWeek)}</span>
							</div>
							<div className="collapsible-body" style={buttonZoneStyle}>
								<a className="waves-effect waves-light btn orange darken-1" style={buttonStyle}><i className="material-icons left">settings</i>수정</a>
								<a className="waves-effect waves-light btn red darken-1" style={buttonStyle}><i className="material-icons left">delete</i>삭제</a>
							</div>
						</li>
					</ul>
				)
			});
		};

		return (
			<div className="container">
				{mapToComponent(this.state.list)}
			</div>
		);
	}
}

AlarmList.propTypes = propTypes;

AlarmList.defaultProps = defaultProps;

export default AlarmList;