import React, { Component, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './ticker.min.css';

import Modal from 'react-modal';
import '../modal/modal.css';
import '../modal/ticker.modal.delete.css';

import {sagaDeleteTicker, sagaHideTicker} from '../saga/socket.io.ticker.js';
import {addFullTickers} from '../redux/tickers.js';

function Ticker(props) {
	const dispatch = useDispatch();
	
	let changePrice = props.status_price;
	let changeChange = props.status_change;
	let changeChangePercent = props.status_change_percent;
	
	let tickerChangePercentClass = ['ticker-change-percent'];
	let tickerChangeClass = ['ticker-change'];
	
	if(changeChangePercent === 0) tickerChangePercentClass.push('ticker-change-percent-neutral');
	if(changeChangePercent === 1) tickerChangePercentClass.push('ticker-change-percent-up');
	if(changeChangePercent === -1) tickerChangePercentClass.push('ticker-change-percent-down');
	
	if(changeChange === 0) tickerChangeClass.push('ticker-change-neutral');
	if(changeChange === 1) tickerChangeClass.push('ticker-change-up');
	if(changeChange === -1) tickerChangeClass.push('ticker-change-down');
	
	return (<div className="ticker-min" onDoubleClick={(e) => {dispatch(addFullTickers(props.ticker))}}>
		<div className="ticker-min-body">
			<div className="ticker-min-body-img">
				<div className={(changePrice===0?'ticker-neutral':(changePrice===1?'ticker-up':'ticker-down'))}></div>
			</div>
			<div className="ticker-min-body-name-price">
				<div className="ticker-name"><span>{props.ticker}</span></div>
				<div className="ticker-price"><span>{props.price}</span></div>
			</div>
			<div className="ticker-min-body-change">
				<div className={tickerChangePercentClass.join(' ')}>
					{(changeChangePercent===0?'':(changeChangePercent===1?<span>+</span>:<span>-</span>))}<span>{props.change_percent}</span><span>%</span>
				</div>
				<div className={tickerChangeClass.join(' ')}>
					{(changeChange===0?'':(changeChange===1?<span>+</span>:<span>-</span>))}<span>{props.change}</span>
				</div>
			</div>
		</div>
	</div>);
}

export default Ticker;
