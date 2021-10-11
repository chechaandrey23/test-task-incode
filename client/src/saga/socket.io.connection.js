import { take, call, put, select } from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {socket} from '../configs/socket.io.js';

import {createSagas, createActions} from './helpers/helper.saga.js';

import {pushConnect, pushDisConnect} from "../redux/tickers.js";

// connect
function createConnectionChannel() {
	const subscribe = emitter => {
		socket.on('connect', emitter);
		return () => {
			socket.off('connect', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketConnectSaga() {
	const channel = yield call(createConnectionChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushConnect(response));
	}
}

// disconnect
function createDisConnectionChannel() {
	const subscribe = emitter => {
		socket.on('disconnect', emitter);
		return () => {
			socket.off('disconnect', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketDisConnectSaga() {
	const channel = yield call(createDisConnectionChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushDisConnect(response));
	}
}

const SOCKET_CONNECT = 'SOCKET_CONNECT';
const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT';

export const fetchSagas = createSagas([
	socketConnectSaga,
	socketDisConnectSaga
]);

export const {sagaConnect, sagaDisConnect} = createActions({
	sagaConnect: SOCKET_CONNECT,
	sagaDisConnect: SOCKET_DISCONNECT
});
