import React, {Component, PropTypes} from 'react';
import update from 'react-addons-update';
import axios from 'axios';

const propTypes = {};

const defaultProps = {};

class AlarmRegisterForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hour: [],
			minute: [],
			form: {
				hour: 0,
				minute: 0,
				dayOfWeek: [0, 1, 2, 3, 4, 5, 6]
			}
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() {
		axios.post('/alarm', this.state.form)
			.then((response) => {
				location.reload(true);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	componentWillMount() {
		let hourArray = [];
		let minuteArray = [];
		for (let j = 0; j <24; j++) {
			hourArray.push(j);
		}
		for (let i = 0; i < 60; i++) {
			minuteArray.push(i);
		}
		this.setState({
			hour: hourArray,
			minute: minuteArray
		});
	}

	componentDidMount() {
		$('select#hourDropdown').on('change', (e) => {
			this.setState(update(this.state, {
				form: {
					hour: { $set: e.target.value }
				}
			}));
			console.log(this.state);
		}).material_select();

		$('select#minuteDropdown').on('change', (e) => {
			this.setState(update(this.state, {
				form: {
					minute: { $set: e.target.value }
				}
			}));
		}).material_select();

		$('select#dayOfWeekDropdown').on('change', (e) => {
			this.setState(update(this.state, {
				form: {
					dayOfWeek: { $set: $('select#dayOfWeekDropdown').val() }
				}
			}));
		}).material_select();
	}

	render() {
		const mapToHourComponent = (hourArray, flag) => {
			return hourArray.map((hour, i) => {
				return (<option value={hour} key={i}>{hour} 시</option>)
			});
		};

		const mapToMinuteComponent = (minuteArray) => {
			return minuteArray.map((minute, i)=> {
				return (<option value={minute} key={i}>{minute} 분</option>)
			});
		};

		return (
			<div className="container">
				<div className="row">
					<div className="input-field col s3">
						<select id="hourDropdown" defaultValue="9" onClick={this.handleHourChange}>
							<option value="" disabled>Choose your option</option>
							{mapToHourComponent(this.state.hour)}
						</select>
						<label>시</label>
					</div>
					<div className="input-field col s3">
						<select id="minuteDropdown" defaultValue="0">
							<option value="" disabled>Choose your option</option>
							{mapToMinuteComponent(this.state.minute)}
						</select>
						<label>분</label>
					</div>
					<div className="input-field col s3">
						<select id="dayOfWeekDropdown" multiple defaultValue={[1,2,3,4,5,6,0]}>
							<option value="1">월</option>
							<option value="2">화</option>
							<option value="3">수</option>
							<option value="4">목</option>
							<option value="5">금</option>
							<option value="6">토</option>
							<option value="0">일</option>
						</select>
						<label>요일</label>
					</div>
					<div className="input-field col s3">
						<a onClick={this.handleSubmit} className="waves-effect waves-light btn green darken-1" ><i className="material-icons left">add_alert</i>알람 등록</a>
					</div>
				</div>
			</div>
		);
	}
}

AlarmRegisterForm.propTypes = propTypes;

AlarmRegisterForm.defaultProps = defaultProps;

export default AlarmRegisterForm;