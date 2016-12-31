import express from 'express';
import Alarm from '../service/alarm';
let alarm = new Alarm();

const router = express.Router();

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