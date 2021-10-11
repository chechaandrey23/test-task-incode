import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from "redux-saga";

import tickersReduser from './tickers.js';

import saga from "../saga/saga.js";

let sagaMiddleware = createSagaMiddleware();

const store = configureStore({
	reducer: {
		tickers: tickersReduser
	},
	middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware]
});

sagaMiddleware.run(saga);

export default store;
