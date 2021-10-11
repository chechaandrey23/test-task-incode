import React, { Component } from 'react';
import Tickers from './tickers/Tickers';
import TickersControll from './controll/Tickers.Controll';

function App() {
	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<div><Tickers /><TickersControll /></div>
		</div>
	);
}

export default App;
