import React, { Component, useRef, useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

function ControllNewOrder(props) {
	
	let updateOrder = useSelector(state => state.tickers.updateOrderTickets);
	let dispatch = useDispatch();
	
	let content = null;
	
	if(updateOrder === true) {
		content = <div className="wait"><span>wait New Order</span><span>...</span></div>
	} else {
		content = null;
	}
	
	return (<div className="tickers-new-order">{content}</div>);
}

export default ControllNewOrder;
