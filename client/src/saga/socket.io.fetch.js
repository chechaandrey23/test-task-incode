import { take, call, put, select } from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {socket} from '../configs/socket.io.js';

import {createSagas, createActions} from './helpers/helper.saga.js';

import {pushFetch, pushStopFetch, pushSetTimeoutFetch, startFetch, stopFetch, setTimeoutFetch} from "../redux/tickers.js";

function createFetchChannel() {
	const subscribe = emitter => {
		socket.on('tickers', emitter);
		return () => {
			socket.off('tickers', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketFetchSaga() {
	const channel = yield call(createFetchChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushFetch(response));
	}
}

function createFetchStopChannel() {
	const subscribe = emitter => {
		socket.on('tickers-stop', emitter);
		return () => {
			socket.off('tickers-stop', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketFetchStopSaga() {
	const channel = yield call(createFetchStopChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushStopFetch(response));
	}
}

//set-timeout-tickers
function createFetchConfigTimerChannel() {
	const subscribe = emitter => {
		socket.on('set-timeout-tickers', emitter);
		return () => {
			socket.off('set-timeout-tickers', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketFetchSetTimeoutSaga() {
	const channel = yield call(createFetchConfigTimerChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushSetTimeoutFetch(response));
	}
}

function* socketSubscribeFetchSaga() {
	yield call(() => {socket.emit('start');});
	yield put(startFetch());
}

function* socketUnSubscribeFetchSaga() {
	yield call(() => {socket.emit('stop');});
	yield put(stopFetch());
}

function* socketSetTimeoutFetchSaga({payload}) {
	yield call(() => {socket.emit('set-timeout-tickers', payload);});
	yield put(setTimeoutFetch());
}

const SOCKET_SUBSCRIBE_FETCH = 'SOCKET_SUBSCRIBE_FETCH';
const SOCKET_UNSUBSCRIBE_FETCH = 'SOCKET_UNSUBSCRIBE_FETCH';
const SOCKET_SETTIMEOUT_FETCH = 'SOCKET_SETTIMEOUT_FETCH';

export const fetchSagas = createSagas([
	socketFetchSaga,
	socketFetchStopSaga,
	socketFetchSetTimeoutSaga,
	[SOCKET_SUBSCRIBE_FETCH, socketSubscribeFetchSaga],
	[SOCKET_UNSUBSCRIBE_FETCH, socketUnSubscribeFetchSaga],
	[SOCKET_SETTIMEOUT_FETCH, socketSetTimeoutFetchSaga]
]);

export const {sagaStartFetch, sagaStopFetch, sagaSetTimeoutFetch} = createActions({
	sagaStartFetch: SOCKET_SUBSCRIBE_FETCH,
	sagaStopFetch: SOCKET_UNSUBSCRIBE_FETCH,
	sagaSetTimeoutFetch: SOCKET_SETTIMEOUT_FETCH
});
