import fspath from 'node:path';
import express from 'express';

let __dirname = fspath.resolve(fspath.dirname(decodeURI(new URL(import.meta.url).pathname)));

let server = express();

let config = {
	port: process.env.PORT || 8000,
	host: process.env.HOST || 'localhost',
};

server.use('/', express.static(__dirname, {
	setHeaders: res =>
		res.set('Access-Control-Allow-Origin', 'https://docs.google.com')
}));

server.use('/dist', express.static(fspath.resolve(fspath.join(__dirname, '..', 'dist'))));


server.listen(config.port, config.host);
console.warn('Serving demo at', `http://${config.host}:${config.port}`);
