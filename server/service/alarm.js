import childProcess from 'child_process';
import schedule from 'node-schedule';
import fs from 'fs';
import AlarmModel from '../models/alarm';

const spawn = childProcess.spawn;

export default class Alarm {

	constructor() {
		this.state = 'LOADING';
		this.setRandomMusic(() => {
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

	updateAlarm() {

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
			this.delayTimeout = setTimeout(() => {
				this.play();
			}, 1000 * 60 * minute);
			console.log(`알람이 ${minute}분 뒤로 연기되었습니다.`);
		} else {
			console.warn('Cannot delay. Cause current state is', this.state);
		}
	}

	addListener() {
		// this.omxplayer.on('exit', (code, signal) => {
		// 	console.log('[onExit]', code, signal);
		// 	this.state = 'STOPPED';
		// });

		this.omxplayer.on('close', (code) => {
			console.log('[onClose]', code);
			this.state = 'STOPPED';
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
				console.log('Play!', this.music, new Date());
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
			this.state = 'STOPPED';
			this.omxplayer.stdin.write('q');
		} else {
			if(typeof this.delayTimeout === 'object' && this.delayTimeout._idleTimeout > -1) {
				clearTimeout(this.delayTimeout);
				console.log('DelayTimeout cleared.');
			}
			console.warn('Cannot stop. Cause current state is', this.state);
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