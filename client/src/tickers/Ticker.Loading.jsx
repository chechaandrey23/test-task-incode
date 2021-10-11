import React, { Component, useRef, useEffect, useState } from 'react';

import './ticker.loading.css';

function TickerLoading(props) {
	let content = null;
	if(props.removing) {
		content = <div className="ticker-removing"><span>removing </span><span className="ticker-removing-name">{props.ticker}</span><span>...</span></div>
	} else if(props.hiding) {
		content = <div className="ticker-hiding"><span>hiding </span><span className="ticker-hiding-name">{props.ticker}</span><span>...</span></div>
	}
	
	return (<div className="ticker-loading">{content}</div>)
}

export default TickerLoading;
