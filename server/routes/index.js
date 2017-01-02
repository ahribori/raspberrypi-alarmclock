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
	alarm.play((data) => {
		res.json(data);
	})
});

router.get('/stop', (req, res) => {
	alarm.stop((data) => {
		res.json(data);
	});
});

router.get('/delay', (req, res) => {
	res.json(alarm.delay(10));
});

router.get('/getRemainTime', (req, res) => {
	res.json(alarm.getRemainTime());
});

router.get('/getState', (req, res) => {
	res.json(alarm.getState());
});

router.get('/volumeUp', (req, res) => {
	alarm.volumeUp();
	res.json('success!');
});

router.get('/volumeDown', (req, res) => {
	alarm.volumeDown();
	res.json('success!');
});


export default router;