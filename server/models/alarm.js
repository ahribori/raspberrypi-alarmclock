import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Alarm = new Schema({
	hour: Number,
	minute: Number,
	dayOfWeek: [Number],
	delay: Number,
	availability: Boolean
});

export default mongoose.model('alarm', Alarm);