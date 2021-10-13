import React, { Component, useRef, useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {sagaStopFetch} from '../saga/socket.io.fetch';

import '../button/button.css';

function ControllStop(props) {
	
	let statusSubscribe = useSelector(state => state.tickers.subscribeFetch);
	let stopingFetch = useSelector(state => state.tickers.stopingFetch);
	let dispatch = useDispatch();
	
	let content = null;
	
	if(stopingFetch === true) {
		content = <div className="wait"><span>wait</span><span>...</span></div>
	} else {
		let buttonClasses = ['myButton'];
		if(!statusSubscribe) buttonClasses.push('disabled');
		content = <div className="button"><a id={"tickers-stop-button"} href="#" className={buttonClasses.join(' ')} onClick={(e) => {
			if(statusSubscribe === false) return;
			dispatch(sagaStopFetch());
		}}>stop</a></div>
	}
	
	return (<div className="tickers-stop">{content}</div>);
}

export default ControllStop;
