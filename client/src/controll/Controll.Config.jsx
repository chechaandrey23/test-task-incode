import React, { Component, useRef, useLayoutEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Modal from 'react-modal';
import '../modal/modal.css';

import {sagaSetTimeoutFetch} from '../saga/socket.io.fetch';
import {setErrorTimeout} from '../redux/tickers';

import './controll.config.css';

import '../button/button.css';

function ControllConfig(props) {
	const [modalIsOpen, setIsOpen] = useState(false);
	
	let settingTimeout = useSelector(state => state.tickers.settingTimeout);
	let errorTimeout = useSelector(state => state.tickers.errorTimeout);
	let dispatch = useDispatch();
	
	let refTimeout = useRef(0);
	
	useLayoutEffect(() => {
		if(!settingTimeout && modalIsOpen && !errorTimeout) setIsOpen(false);
	}, [settingTimeout]);
	
	if(!modalIsOpen) {
		dispatch(setErrorTimeout(false));
	}
	
	let content = null;
	let modalContent = null;
	let msgError = null;
	
	if(settingTimeout === true) {
		content = <div className="wait"><span>wait</span><span>...</span></div>
		if(modalIsOpen) {
			modalContent = <div id={"tickers-config-wait"} className="tickers-config-wait"><div><span>wait</span><span>...</span></div></div>
		}
	} else {
		content = <div className="button"><a id={"tickers-config-open"} href="#" className="myButton" onClick={(e) => {setIsOpen(true);}}>config</a></div>
		if(modalIsOpen) {
			modalContent =  <div id={"tickers-config-content"} className="tickers-config-content">
								<div className="tickers-config-labbel"><span>set timeout</span></div>
								<div className="tickers-config-text"><input id={"tickers-config-timeout"} type="text" ref={refTimeout} /></div>
								<div className="tickers-config-3"><span>ms.</span></div>
								<div className="tickers-config-submit">
									<a id={"tickers-config-submit"} href="#" className="myButton" onClick={(e) => {
										dispatch(sagaSetTimeoutFetch(refTimeout.current.value));
									}}>install</a>
								</div>
							</div>
			if(errorTimeout) {
				msgError = <div id={"tickers-config-error"} className="tickers-config-error"><div>Failed to set the timeout, please try again</div></div>
			}
		}
	}
	
	return (<div className="tickers-config">
		{content}
		<Modal  isOpen={modalIsOpen}
				appElement={document.getElementById('root')}
				//onAfterOpen={afterOpenModal}
				onRequestClose={() => {setIsOpen(false);}}
				className="tickers-controll-modal">
			<div className="head">
				<div className="title">Configs timeout</div>
				<div><a id={"tickers-config-close"} href="#" className="myButtonClose" onClick={(e) => {setIsOpen(false);}}>X</a></div>
			</div>
			<div className="body">{msgError}{modalContent}</div>
		</Modal>
	</div>);
}

export default ControllConfig;
