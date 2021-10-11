import React, { Component, useRef, useLayoutEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Modal from 'react-modal';
import '../modal/modal.css';

import {sagaAddTicker} from '../saga/socket.io.ticker';
import {setErrorAdded} from '../redux/tickers';

import './controll.newticker.css';

import '../button/button.css';

function ControllNewTicker(props) {
	const [modalIsOpen, setIsOpen] = useState(false);
	
	let addingTicker = useSelector(state => state.tickers.addingTicker);
	let errorAdded = useSelector(state => state.tickers.errorAdded);
	let dispatch = useDispatch();
	
	let refNewTicker = useRef(0);
	
	useLayoutEffect(() => {
		if(addingTicker.length === 0 && modalIsOpen && (!errorAdded && errorAdded !== '')) setIsOpen(false);
	}, [addingTicker]);
	
	if(!modalIsOpen) {
		dispatch(setErrorAdded(false));
	}
	
	let content = null;
	let modalContent = null;
	let msgError = null;
	
	if(addingTicker.length > 0) {
		content = <div className="wait"><span>wait</span><span>...</span></div>
		if(modalIsOpen) {
			modalContent = <div className="tickers-new-ticker-wait"><div><span>wait</span><span>...</span></div></div>
		}
	} else {
		content = <div className="button"><a href="#" className="myButton" onClick={(e) => {setIsOpen(true);}}>new ticker</a></div>
		if(modalIsOpen) {
			modalContent =  <div className="tickers-new-ticker-content">
								<div className="tickers-new-ticker-labbel"><span>Ticker name</span></div>
								<div className="tickers-new-ticker-text"><input type="text" ref={refNewTicker} /></div>
								<div className="tickers-new-ticker-submit">
									<a href="#" className="myButton" onClick={(e) => {
										dispatch(sagaAddTicker(refNewTicker.current.value));
									}}>create</a>
								</div>
							</div>
			
			if(errorAdded || errorAdded === '') {
				msgError = <div className="tickers-new-ticker-error"><div>Unable to add ticker named "{errorAdded}"!!!</div></div>
			}
		}
	}
	
	return (<div className="tickers-new-ticker">
		{content}
		<Modal  isOpen={modalIsOpen}
				appElement={document.getElementById('root')}
				//onAfterOpen={afterOpenModal}
				onRequestClose={() => {setIsOpen(false);}}
				className="tickers-controll-modal">
			<div className="head">
				<div className="title">Create Ticker</div>
				<div><a href="#" className="myButtonClose" onClick={(e) => {setIsOpen(false);}}>X</a></div>
			</div>
			<div className="body">{msgError}{modalContent}</div>
		</Modal>
	</div>);
}

export default ControllNewTicker;
