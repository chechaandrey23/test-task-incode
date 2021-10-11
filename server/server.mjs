import express from 'express';
import http from 'http';
import {Server as ioServer } from 'socket.io';
import cors from 'cors';

import path from 'path';

const PORT = process.env.PORT || 4000;


const app = express();

app.use(cors());

const server = http.createServer(app);

const socketServer = new ioServer(server, {
	cors: {
		origin: "*",
	}
});

import Tickers from './tickers.mjs';

const TICKERS = [
	'AAPL', // Apple
	'GOOGL', // Alphabet
	'MSFT', // Microsoft
	'AMZN', // Amazon
	'FB', // Facebook
	'TSLA', // Tesla
];

socketServer.on('connection', (socket) => {
	const tickers = new Tickers(TICKERS);
	
	tickers.bindFetch(socket);
	tickers.unBindFetch(socket);
	tickers.bindAddTicker(socket);
	tickers.bindRemoveTicker(socket);
	tickers.bindShowTicker(socket);
	tickers.bindHideTicker(socket);
	tickers.bindNewOrder(socket);
	tickers.bindSetTimeout(socket);
});

app.get('/example.html', (req, res) => {
	res.sendFile(path.resolve() + '/example.html');
});

app.use('/', express.static(path.resolve() + "/../client/build"));

server.listen(PORT, () => {
	console.log(`Streaming service is running on http://localhost:${PORT}`);
});
