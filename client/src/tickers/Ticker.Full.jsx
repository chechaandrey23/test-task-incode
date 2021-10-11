import React, { Component, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './ticker.max.css';

import Modal from 'react-modal';
import '../modal/modal.css';
import '../modal/ticker.modal.delete.css';
import '../button/button.css';

import {sagaDeleteTicker, sagaHideTicker} from '../saga/socket.io.ticker.js';
import {removeFullTickers} from '../redux/tickers.js';

function TickerFull(props) {
	const [modalIsOpen, setIsOpen] = useState(false);
	
	const dispatch = useDispatch();
	
	let changePrice = props.status_price;
	let changeChange = props.status_change;
	let changeChangePercent = props.status_change_percent;
	
	let tickerMaxChangePercentClass = ['ticker-max-body-column-3'];
	let tickerMaxChangeClass = ['ticker-max-body-column-3'];
	
	if(changeChangePercent === 0) tickerMaxChangePercentClass.push('ticker-max-body-column-3-neutral');
	if(changeChangePercent === 1) tickerMaxChangePercentClass.push('ticker-max-body-column-3-up');
	if(changeChangePercent === -1) tickerMaxChangePercentClass.push('ticker-max-body-column-3-down');
	
	if(changeChange === 0) tickerMaxChangeClass.push('ticker-max-body-column-3-neutral');
	if(changeChange === 1) tickerMaxChangeClass.push('ticker-max-body-column-3-up');
	if(changeChange === -1) tickerMaxChangeClass.push('ticker-max-body-column-3-down');
	
	return (<div className="ticker-max">
		<div className="ticker-max-controll">
			<div className="ticker-max-controll-img">
				<div className={(changePrice===0?'ticker-neutral':(changePrice===1?'ticker-up':'ticker-down'))}></div>
			</div>
			<div className="ticker-max-controll-min"><a href="#" className="myButton" onClick={(e) => {dispatch(removeFullTickers(props.ticker))}}>min</a></div>
			<div className="ticker-max-controll-visible"><a href="#" className="myButton" onClick={(e) => {dispatch(sagaHideTicker(props.ticker));}}>hide</a></div>
			<div className="ticker-max-controll-remove"><a href="#" className="myButton" onClick={(e) => {setIsOpen(true)}}>del</a></div>
		</div>
		<div className="ticker-max-body">
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>name</span></div>
				<div className="ticker-max-body-column-3 ticker-max-name"><span>{props.ticker}</span></div>
			</div>
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>exchange</span></div>
				<div className="ticker-max-body-column-3"><span>{props.exchange}</span></div>
			</div>
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>price</span></div>
				<div className="ticker-max-body-column-3"><span>{props.price}</span></div>
			</div>
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>change</span></div>
				<div className={tickerMaxChangeClass.join(' ')}>
					{(changeChange===0?'':(changeChange===1?<span>+</span>:<span>-</span>))}
					<span>{props.change}</span>
				</div>
			</div>
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>change_percent</span></div>
				<div className={tickerMaxChangePercentClass.join(' ')}>
					{(changeChangePercent===0?'':(changeChangePercent===1?<span>+</span>:<span>-</span>))}
					<span>{props.change_percent}</span><span>%</span>
				</div>
			</div>
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>dividend</span></div>
				<div className="ticker-max-body-column-3"><span>{props.dividend}</span></div>
			</div>
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>yield</span></div>
				<div className="ticker-max-body-column-3"><span>{props.yield}</span></div>
			</div>
			<div className="ticker-max-body-row">
				<div className="ticker-max-body-column"><span>last_trade_time</span></div>
				<div className="ticker-max-body-column-3"><span>{props.last_trade_time}</span></div>
			</div>
		</div>
		<Modal  isOpen={modalIsOpen}
				appElement={document.getElementById('root')}
				onRequestClose={() => {setIsOpen(false);}}
				className="tickers-controll-modal">
			<div className="head">
				<div className="title">Create Ticker</div>
				<div><a href="#" className="myButtonClose" onClick={(e) => {setIsOpen(false);}}>X</a></div>
			</div>
			<div className="body">
				<div className="ticker-controll-delete">
					<div className="ticker-controll-delete-quest"><span>Are you sure you want to remove ticker "{props.ticker}"?</span></div>
					<div className="ticker-controll-delete-buttons">
						<div><a href="#" className="myButton" onClick={() => {setIsOpen(false);}}>No</a></div>
						<div><a href="#" className="myButton" onClick={() => {
							dispatch(sagaDeleteTicker(props.ticker));
							setIsOpen(false);
						}}>Yes</a></div>
					</div>
				</div>
			</div>
		</Modal>
	</div>);
}

export default TickerFull;
