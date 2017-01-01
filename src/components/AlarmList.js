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

	handleClickRemove(e) {
		let key = e.target.attributes[0].value;
		if (confirm(`${key}를 삭제합니다.`)) {
			axios.delete('/alarm', {
				data: {
					key
				}
			})
				.then((response) => {
					location.reload(true);
				})
				.catch((err) => {
					console.error(err);
				});
		}
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
	}

	render() {
		const timeStyle = {
			'fontSize': '22px'
		};

		const dayOfWeekStyle = {
			'marginLeft': '20px'
		};

		const dayMap = ['일', '월', '화', '수', '목', '금', '토', '일'];

		const indexToDay = (data) => {
			return data.map((index) => {
				return dayMap[index] + ' ';
			});
		};

		const mapToComponent = (data) => {
			return data.map((alarm, i) => {
				let _id = {
					'data-id': alarm._id
				};
				return (
					<ul className="collapsible" data-collapsible="accordion" key={i}>
						<li>
							<div className="collapsible-header"><i className="material-icons">schedule</i>
								<span style={timeStyle}>{alarm.hour}시 {alarm.minute}분</span>
								<span style={dayOfWeekStyle}>{indexToDay(alarm.dayOfWeek)}</span>
								<i {..._id} onClick={this.handleClickRemove} className="right material-icons">delete</i>
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