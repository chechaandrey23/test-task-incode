import { take, call, put, select } from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';

import {socket} from '../configs/socket.io.js';

import {createSagas, createActions} from './helpers/helper.saga.js';

import {pushAddTicker, addTicker, pushDeleteTicker, deleteTicker, pushShowTicker, showTicker, pushHideTicker, hideTicker,
		pushNewOrderTickers, newOrderTickers} from "../redux/tickers.js";

// cretae
function createAddTickerChannel() {
	const subscribe = emitter => {
		socket.on('add-ticker', emitter);
		return () => {
			socket.off('add-ticker', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketPushAddTickerSaga() {
	const channel = yield call(createAddTickerChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushAddTicker(response));
	}
}

function* socketAddTickerSaga({payload}) {
	yield call(() => {socket.emit('add-ticker', payload);});
	yield put(addTicker(payload));
}

// delete
function createDeleteTickerChannel() {
	const subscribe = emitter => {
		socket.on('remove-ticker', emitter);
		return () => {
			socket.off('remove-ticker', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketPushDeleteTickerSaga() {
	const channel = yield call(createDeleteTickerChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushDeleteTicker(response));
	}
}

function* socketDeleteTickerSaga({payload}) {
	yield call(() => {socket.emit('remove-ticker', payload);});
	yield put(deleteTicker(payload));
}

// show
function createShowTickerChannel() {
	const subscribe = emitter => {
		socket.on('show-ticker', emitter);
		return () => {
			socket.off('show-ticker', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketPushShowTickerSaga() {
	const channel = yield call(createShowTickerChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushShowTicker(response));
	}
}

function* socketShowTickerSaga({payload}) {
	yield call(() => {socket.emit('show-ticker', payload);});
	yield put(showTicker(payload));
}

// hide
function createHideTickerChannel() {
	const subscribe = emitter => {
		socket.on('hide-ticker', emitter);
		return () => {
			socket.off('hide-ticker', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketPushHideTickerSaga() {
	const channel = yield call(createHideTickerChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushHideTicker(response));
	}
}

function* socketHideTickerSaga({payload}) {
	yield call(() => {socket.emit('hide-ticker', payload);});
	yield put(hideTicker(payload));
}

// newOrder
function createNewOrderTickersChannel() {
	const subscribe = emitter => {
		socket.on('new-order-tickers', emitter);
		return () => {
			socket.off('new-order-tickers', emitter);
		}
	};
	return eventChannel(subscribe);
}

function* socketPushNewOrderTickersSaga() {
	const channel = yield call(createNewOrderTickersChannel);
	
	while (true) {
		const response = yield take(channel);
		
		yield put(pushNewOrderTickers(response));
	}
}

function* socketNewOrderTickersSaga({payload}) {
	yield call(() => {socket.emit('new-order-tickers', payload);});
	yield put(newOrderTickers(payload));
}

//////////////////////////////////////////////////////////////////////////////
const SOCKET_ADD_TICKER = 'SOCKET_ADD_TICKER';
const SOCKET_DELETE_TICKER = 'SOCKET_DELETE_TICKER';
const SOCKET_SHOW_TICKER = 'SOCKET_SHOW_TICKER';
const SOCKET_HIDE_TICKER = 'SOCKET_HIDE_TICKER';
const SOCKET_NEW_ORDER_TICKER = 'SOCKET_NEW_ORDER_TICKER';

export const tickerSagas = createSagas([
	socketPushAddTickerSaga,
	socketPushDeleteTickerSaga,
	socketPushShowTickerSaga,
	socketPushHideTickerSaga,
	socketPushNewOrderTickersSaga,
	[SOCKET_ADD_TICKER, socketAddTickerSaga],
	[SOCKET_DELETE_TICKER, socketDeleteTickerSaga],
	[SOCKET_SHOW_TICKER, socketShowTickerSaga],
	[SOCKET_HIDE_TICKER, socketHideTickerSaga],
	[SOCKET_NEW_ORDER_TICKER, socketNewOrderTickersSaga]
]);

export const {sagaAddTicker, sagaDeleteTicker, sagaShowTicker, sagaHideTicker, sagaNewOrderTickers} = createActions({
	sagaAddTicker: SOCKET_ADD_TICKER,
	sagaDeleteTicker: SOCKET_DELETE_TICKER,
	sagaShowTicker: SOCKET_SHOW_TICKER,
	sagaHideTicker: SOCKET_HIDE_TICKER,
	sagaNewOrderTickers: SOCKET_NEW_ORDER_TICKER
});
