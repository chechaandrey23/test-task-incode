import { createSlice } from '@reduxjs/toolkit'

import {_toObject, _remove, _delete, _copyAndFix, _newOrder} from './helpers/helper.store.tickers.js';

export const changeTickers = createSlice({
	name: 'tickers',
	initialState: {
		subscribeFetch: false,
		stopingFetch: false,
		startingFetch: false,
		settingTimeout: false,
		errorTimeout: false,
		error: null,
		addingTicker: [],
		errorAdded: false,
		removingTicker: [],
		showingTicker: [],
		errorShowed: false,
		hidingTicker: [],
		errorHided: false,
		updateOrderTickets: false,
		fullTickers: [],
		
		dataArray: [],
		baseDataObject: {}
	},
	reducers: {
		setErrorAdded(state, action) {
			state.errorAdded = action.payload;
		},
		setErrorTimeout(state, action) {
			state.errorTimeout = action.payload;
		},
		setErrorShowed(state, action) {
			state.errorShowed = action.payload;
		},
		setErrorHided(state, action) {
			state.errorHided = action.payload;
		},
		
		addFullTickers(state, action) {
			state.fullTickers = [...state.fullTickers, action.payload];
		},
		removeFullTickers(state, action) {
			state.fullTickers = _remove(state.fullTickers, action.payload);
		},
		
		pushFetch(state, action) {
			state.subscribeFetch = true;
			state.startingFetch = false;
			state.dataArray = action.payload.value;
			if(action.payload.baseValue) state.baseDataObject = _toObject(action.payload.baseValue);
		},
		pushStopFetch(state, action) {
			if(action.payload && action.payload.error) {
				state.error = 'pushStopFetch Error ('+Date.now()+')';
				console.error(state.error);
			} else {
				state.stopingFetch = false;
				state.subscribeFetch = false;
			}
			
		},
		pushSetTimeoutFetch(state, action) {
			if(action.payload && action.payload.error) {
				state.settingTimeout = false;
				state.errorTimeout = true;
				state.error = 'pushSetTimeoutFetch Error ('+Date.now()+')';
				console.error(state.error);
			} else {
				state.settingTimeout = false;
			}
		},
		startFetch(state, action) {
			state.startingFetch = true;
		},
		stopFetch(state, action) {
			state.stopingFetch = true;
		},
		setTimeoutFetch(state, action) {
			state.settingTimeout = true;
		},
		
		pushAddTicker(state, action) {
			if(action.payload && action.payload.error) {
				state.addingTicker = _remove(state.addingTicker, action.payload.value);
				state.errorAdded = action.payload.value;
				state.error = 'pushAddTicker Error ('+Date.now()+')';
				console.error(state.error);
			} else {
				state.addingTicker = _remove(state.addingTicker, action.payload.name);
				state.dataArray = [...state.dataArray, ...action.payload.value];
				let baseValue = action.payload.baseValue[0];
				state.baseDataObject = {...{[baseValue.ticker]: baseValue}, ...state.baseDataObject};
			}
		},
		addTicker(state, action) {
			state.addingTicker = [action.payload, ...state.addingTicker];
			state.errorAdded = false;
		},
		pushDeleteTicker(state, action) {
			if(action.payload && action.payload.error) {
				state.removingTicker = _remove(state.removingTicker, action.payload.value);
				state.error = 'pushDeleteTicker Error ('+Date.now()+')';
				console.error(state.error);
			} else {
				state.removingTicker = _remove(state.removingTicker, action.payload);
				state.dataArray = _delete(state.dataArray, (item) => {return item.ticker === action.payload});
				delete state.baseDataObject[action.payload];
				state.baseDataObject = {...state.baseDataObject};
			}
		},
		deleteTicker(state, action) {
			state.removingTicker = [action.payload, ...state.removingTicker];
		},
		
		pushShowTicker(state, action) {
			if(action.payload && action.payload.error) {
				state.showingTicker = _remove(state.showingTicker, action.payload.value);
				state.errorShow = action.payload.value;
				state.error = 'pushShowTicker Error ('+Date.now()+')';
				console.error(state.error);
			} else {
				state.showingTicker = _remove(state.showingTicker, action.payload);
				state.dataArray = _copyAndFix(state.dataArray, (item) => {return item.ticker === action.payload}, {visible: true});
				// fix!!!
				state.fullTickers = _remove(state.fullTickers, action.payload);
			}
		},
		showTicker(state, action) {
			state.showingTicker = [action.payload, ...state.showingTicker];
			state.errorShowed = false;
		},
		pushHideTicker(state, action) {
			if(action.payload && action.payload.error) {
				state.hidingTicker = _remove(state.hidingTicker, action.payload.value);
				state.errorHided = action.payload.value;
				state.error = 'pushShowTicker Error ('+Date.now()+')';
				console.error(state.error);
			} else {
				state.hidingTicker = _remove(state.hidingTicker, action.payload);
				state.dataArray = _copyAndFix(state.dataArray, (item) => {return item.ticker === action.payload}, {visible: false});
			}
		},
		hideTicker(state, action) {
			state.hidingTicker = [action.payload, ...state.hidingTicker];
			state.errorHided = false;
		},
		///////////////////////////
		pushNewOrderTickers(state, action) {
			if(action.payload && action.payload.error) {
				state.dataArray = _newOrder(state.dataArray, action.payload.value, (item) => {return action.payload.value.indexOf(item.ticker)});
				state.updateOrderTickets = false;
				state.error = 'pushShowTicker Error ('+Date.now()+')';
				console.error(state.error);
			} else {
				state.dataArray = _newOrder(state.dataArray, action.payload, (item) => {return action.payload.indexOf(item.ticker)});
				state.updateOrderTickets = false;
			}
		},
		newOrderTickers(state, action) {
			state.dataArray = _newOrder(state.dataArray, action.payload, (item) => {return action.payload.indexOf(item.ticker)});
			state.updateOrderTickets = true;
		}
	}
});

export const {
	setErrorAdded, setErrorTimeout, setErrorShowed, setErrorHided, addFullTickers, removeFullTickers,
	pushFetch, pushStopFetch, pushSetTimeoutFetch, startFetch, stopFetch, setTimeoutFetch,
	pushAddTicker, addTicker, pushDeleteTicker, deleteTicker, pushShowTicker, showTicker, pushHideTicker, hideTicker,
	pushNewOrderTickers, newOrderTickers
} = changeTickers.actions;

export default changeTickers.reducer;
