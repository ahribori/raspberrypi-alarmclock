import childProcess from 'child_process';
import schedule from 'node-schedule';
import fs from 'fs';
const spawn = childProcess.spawn;

export default class Alarm {

	constructor() {
		this.state = 'STOPPED';
		this.alarm = {};
		this.music = 'alarm.mp3';
		this.rule = `0 0 7 * * *`;
		console.log(this.rule);
		this.setAlarm(this.rule);

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
	}

	setAlarm(rule) {
		if(this.alarm.cancel) {
			this.alarm.cancel();
		}
		this.alarm = schedule.scheduleJob(rule, () => {
			console.log('현재 시각은', new Date());
			this.play();
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

	play() {
		if (this.state !== 'PLAYING') {
			console.log('Play!', new Date());
			this.state = 'PLAYING';
			this.omxplayer = spawn('omxplayer', [process.cwd() + '/musics/' + this.music, '--loop']);
			this.addListener();
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