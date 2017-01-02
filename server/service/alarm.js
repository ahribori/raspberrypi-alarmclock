import childProcess from 'child_process';
import schedule from 'node-schedule';
import fs from 'fs';
import AlarmModel from '../models/alarm';

const spawn = childProcess.spawn;

export default class Alarm {

	constructor() {
		this.state = 'LOADING';
		this.setRandomMusic(() => {
			console.log(`[${this.state}] => [STOPPED]`);
			this.state = 'STOPPED';
			this.setAlarm();
		});
		/*
		 *     *     *    *     *     *
		 ┬    ┬    ┬    ┬    ┬    ┬
		 │    │    │    │    │    |
		 │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
		 │    │    │    │    └───── month (1 - 12)
		 │    │    │    └────────── day of month (1 - 31)
		 │    │    └─────────────── hour (0 - 23)
		 │    └──────────────────── minute (0 - 59)
		 └───────────────────────── second (0 - 59, OPTIONAL)
		 */
	}

	setAlarm() {
		const DAY = ['일', '월', '화', '수', '목', '금', '토', '일'];
		this.scheduleList = [];
		this.scheduleList.map((registeredSchedule) => {
			registeredSchedule.cancel();
		});
		this.getAlarm((err, alarmList) => {
			alarmList.map((alarm, key) => {
				let rule = '0 ';
				rule += alarm.minute + ' ';
				rule += alarm.hour + ' * * ';
				rule += alarm.dayOfWeek.sort();

				let createJob = schedule.scheduleJob(rule, () => {
					console.log('현재 시각은', new Date());
					this.play();
				});
				this.scheduleList.push(createJob);
				const parsedDay = [];
				alarm.dayOfWeek.map((day) => {
					parsedDay.push(DAY[day]);
				});
				console.log(`[${rule}]`);
				console.log(`${parsedDay}요일 ${alarm.hour}시 ${alarm.minute}분 알람이 설정되었습니다.`);
			});
		});
	}

	saveAlarm(hour=7, minute=0, dayOfWeek= [1, 2, 3, 4, 5, 6, 7], delay= 10, availability=true) {
		new AlarmModel({
			hour,
			minute,
			dayOfWeek,
			delay,
			availability
		}).save((err, results) => {
			if (err) {
				console.error(err);
			} else {
				this.setAlarm();
				console.log(results);
			}
		});
	}

	deleteAlarm(key) {
		AlarmModel.remove({
			_id: key
		}, (err, result) => {
			if (err) {
				if (typeof callback === 'function') {
					callback(err);
				}
				throw new Error(err);
			} else {
				this.setAlarm();
				if (typeof callback === 'function') {
					callback(null, result);
				}
			}
		});
	}

	getAlarm(callback) {
		AlarmModel.find({
			availability: true
		}, (err, results) => {
			if (err) {
				if (typeof callback === 'function') {
					callback(err);
				}
				throw new Error(err);
			} else {
				if (typeof callback === 'function') {
					callback(null, results);
				}
			}
		});
	}

	delay(minute) {
		if (this.state === 'PLAYING') {
			if (minute < 1) {
				console.warn('argument [minute] should larger then 1.', this.state);
				return;
			}
			this.stop();
			console.log(`[${this.state}] => [WAITING]`);
			this.state = 'WAITING';
			this.delayTime = minute;
			this.delayStartedTime = Date.now();
			this.delayTimeout = setTimeout(() => {
				this.play();
			}, 1000 * 60 * minute);
			console.log(`알람이 ${minute}분 뒤로 연기되었습니다.`);
		} else {
			console.warn('Cannot delay. Cause current state is', this.state);
		}
		return {
			state: this.state
		}
	}

	getRemainTime() {
		if (this.state === 'WAITING') {
			let remainMillisecond = (1000 * 60 * this.delayTime) - (Date.now() - this.delayStartedTime);
			let remainSecond = Math.round(remainMillisecond / 1000);
			let remainTime = `${Math.floor(remainSecond / 60)}분 ${remainSecond % 60}`;
			return {
				state: this.state,
				remainTime: remainTime
			};
		} else {
			console.warn('Cannot get remain time. Cause current state is', this.state);
		}
	}

	addListener() {
		// this.omxplayer.on('exit', (code, signal) => {
		// 	console.log('[onExit]', code, signal);
		// 	this.state = 'STOPPED';
		// });

		this.omxplayer.on('close', (code) => {
			console.log('[onClose]', code);
			if (this.state !== 'WAITING') {
				console.log(`[${this.state}] => [STOPPED]`);
				this.state = 'STOPPED';
			}
		});

		// this.omxplayer.on('disconnect', (code, signal) => {
		// 	console.log('[onDisconnect]', code, signal);
		// 	this.state = 'STOPPED';
		// });
		console.log('Event listener added.');
	}

	setRandomMusic(callback) {
		fs.readdir(process.cwd() + '/musics', (err, files) => {
			if (err) {
				throw new Error(err);
			}
			const numberOfFiles = files.length;
			const randomIndex = Math.floor(Math.random() * numberOfFiles);
			if (numberOfFiles > 0) {
				this.music = files[randomIndex];
			} else {
				throw new Error('musics folder is empty.');
			}
		});
		if (typeof callback === 'function') {
			callback();
		}
	}

	play() {
		if (this.state !== ('PLAYING' || 'LOADING')) {
			this.setRandomMusic(() => {
				this.clearDelayTimeout();
				console.log('Play!', this.music, new Date());
				console.log(`[${this.state}] => [PLAYING]`);
				this.state = 'PLAYING';
				this.omxplayer = spawn('omxplayer', [process.cwd() + '/musics/' + this.music, '--loop']);
				this.addListener();
			});
		} else {
			console.warn('Cannot play. Cause current state is', this.state);
		}
	}

	stop() {
		if (this.state !== 'STOPPED') {
			console.log('Stop!', new Date());
			this.clearDelayTimeout();
			console.log(`[${this.state}] => [STOPPED]`);
			this.state = 'STOPPED';
			if (this.state !== 'WAITING') {
				this.omxplayer.stdin.write('q');
			}
		} else {
			console.warn('Cannot stop. Cause current state is', this.state);
		}

	}

	clearDelayTimeout() {
		if(this.state === 'WAITING' && typeof this.delayTimeout === 'object' && this.delayTimeout._idleTimeout > -1) {
			clearTimeout(this.delayTimeout);
			console.log('DelayTimeout cleared.');
		}
	}

	volumeUp() {
		if (this.state === 'PLAYING') {
			console.log('Volume up!', new Date());
			this.omxplayer.stdin.write('+');
		} else {
			console.warn('Cannot volume up. Cause current state is', this.state);
		}
	}

	volumeDown() {
		if (this.state === 'PLAYING') {
			this.omxplayer.stdin.write('-');
		} else {
			console.warn('Cannot volume down. Cause current state is', this.state);
		}
	}

}