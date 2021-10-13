import React, { Component, useRef, useLayoutEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Modal from 'react-modal';
import '../modal/modal.css';

import {sagaShowTicker} from '../saga/socket.io.ticker';
import {setErrorShowed} from '../redux/tickers';

import './controll.addticker.css';

import '../button/button.css';

function ControllAddTicker(props) {
	const [modalIsOpen, setIsOpen] = useState(false);
	
	let showingTicker = useSelector(state => state.tickers.showingTicker);
	const tickers = useSelector((state) => state.tickers.dataArray);
	let dispatch = useDispatch();
	
	let content = null;
	let modalContent = null;
	let _show = 0;
	
	content = <div className="button"><a id={"tickers-add-ticker"} href="#" className="myButton" onClick={(e) => {setIsOpen(true);}}>add ticker</a></div>
	if(modalIsOpen) {
		modalContent =  <div id={"tickers-add-ticker-content"} className="tickers-add-ticker">
							{tickers.map((value, index) => {
								if(!value.visible) {
									_show++;
									
									if(showingTicker.includes(value.ticker)) {
										return (<div key={value.ticker} id={"tickers-add-ticker-wait-"+value.ticker} className="tickers-add-ticker-wait">
											<div><span>wait adding</span></div>
											<div className="tickers-add-ticker-name-w"><span>{value.ticker}</span></div>
											<div><span>...</span></div>
										</div>);
									} else {
										return (<div key={value.ticker} id={"tickers-add-ticker-content-"+value.ticker} className="tickers-add-ticker-item">
											<div className="tickers-add-ticker-label"><span>ticker</span></div>
											<div className="tickers-add-ticker-name"><span>{value.ticker}</span></div>
											<div className="tickers-add-ticker-button"><a id={"tickers-add-ticker-item-"+value.ticker} href="#" className="myButton" onClick={(e) => {
												dispatch(sagaShowTicker(value.ticker));
											}}>add</a></div>
										</div>);
									}
								}
							})}
							{(_show<=0?(<div className="tickers-add-ticker-notice">
								<div><span>All tickers have already been added (shown)</span></div>
							</div>):null)}
						</div>
	}
	
	return (<div className="tickers-add-ticker">
		{content}
		<Modal  isOpen={modalIsOpen}
				appElement={document.getElementById('root')}
				//onAfterOpen={afterOpenModal}
				onRequestClose={() => {setIsOpen(false);}}
				className="tickers-controll-modal">
			<div className="head">
				<div className="title">Create Ticker</div>
				<div><a id={"tickers-add-ticker-close"} href="#" className="myButtonClose" onClick={(e) => {setIsOpen(false);}}>X</a></div>
			</div>
			<div className="body">{modalContent}</div>
		</Modal>
	</div>);
}

export default ControllAddTicker;
