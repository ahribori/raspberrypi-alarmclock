import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import bodyParser from 'body-parser' // PARSE HTML BODY
import mongoose from 'mongoose';
// import session from 'express-session';

const app = express();
const port = 3000;
const devServerPort = 4000;
const mongoURI = process.env.MONGO_URI || 'mongodb://192.168.0.50:27017/raspberrypi';

/* MongoDB Connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
	console.log('Connected to mongodb server');
});

mongoose.connect(mongoURI);

/* Use Session */
// app.use(session({
// 	secret: 'secret!@#$',
// 	resave: false,
// 	saveUninitialized: true
// }));

// app.use(morgan('dev'));
app.use(bodyParser.json());

/* setup routers & static directory */
import route from './routes';
app.use('/', route);

app.use('/', express.static(path.join(__dirname,'./../public')));

app.listen(port, () => {
	console.log('Express is listening on port', port);
});

/* handle error */
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

/*
	develop 환경일 때 webpack-dev-server를 켜는 코드
 */
if (process.env.NODE_ENV === 'development') {
	console.log('Server is running on development mode');
	const config = require('../webpack.dev.config');
	const compiler = webpack(config);
	const devServer = new WebpackDevServer(compiler, config.devServer);
	devServer.listen(
		devServerPort, () => {
			console.log('webpack-dev-server is listing on port', devServerPort);
		}
	)
}