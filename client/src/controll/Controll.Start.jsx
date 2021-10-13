import React, { Component, useRef, useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {sagaStartFetch} from '../saga/socket.io.fetch';

import '../button/button.css';

function ControllStart(props) {
	
	let statusSubscribe = useSelector(state => state.tickers.subscribeFetch);
	let stopingFetch = useSelector(state => state.tickers.startingFetch);
	let dispatch = useDispatch();
	
	let content = null;
	
	if(stopingFetch === true) {
		content = <div className="wait"><span>wait</span><span>...</span></div>
	} else {
		let buttonClasses = ['myButton'];
		if(statusSubscribe) buttonClasses.push('disabled');
		content = <div className="button"><a id={"tickers-start-button"} href="#" className={buttonClasses.join(' ')} onClick={(e) => {
			if(statusSubscribe === true) return;
			dispatch(sagaStartFetch());
		}}>start</a></div>
	}
	
	return (<div className="tickers-start">{content}</div>);
}

export default ControllStart;
