import express from 'express';
import Alarm from '../service/alarm';
let alarm = new Alarm();

const router = express.Router();

router.get('/alarm', (req, res) => {
	alarm.getAlarm((err, results) => {
		res.json(results);
	});
});

router.post('/alarm', (req, res) => {
	let form = req.body;
	alarm.saveAlarm(form.hour, form.minute, form.dayOfWeek);
	res.json('success');
});

router.delete('/alarm', (req, res) => {
	let body = req.body;
	alarm.deleteAlarm(body.key);
	res.json('success');
});

router.get('/play', (req, res) => {
	alarm.play();
	res.json('success!');
});

router.get('/stop', (req, res) => {
	alarm.stop();
	res.json('success!');
});

router.get('/volumeUp', (req, res) => {
	alarm.volumeUp();
	res.json('success!');
});

router.get('/volumeDown', (req, res) => {
	alarm.volumeDown();
	res.json('success!');
});

router.get('/delay', (req, res) => {
	alarm.delay(10);
	res.json('success!');
});

export default router;