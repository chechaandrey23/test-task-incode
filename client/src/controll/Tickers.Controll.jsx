import React, { Component, useRef, useEffect, useState } from 'react';

import ControllAddTicker from './Controll.AddTicker';
import ControllConfig from './Controll.Config';
import ControllNewOrder from './Controll.NewOrder';
import ControllNewTicker from './Controll.NewTicker';
import ControllStart from './Controll.Start';
import ControllStop from './Controll.Stop';

import './tickers.controll.css';

function TickersContoll(props) {
	return (<div className="tickers-controll">
		<ControllStop />
		<ControllStart />
		<ControllConfig />
		<ControllNewTicker />
		<ControllAddTicker />
		<ControllNewOrder />
	</div>)
}

export default TickersContoll;
