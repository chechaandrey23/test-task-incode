import React, { Component, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import {sagaStartFetch, sagaStopFetch} from '../saga/socket.io.fetch';
import {sagaNewOrderTickers} from '../saga/socket.io.ticker';

import {pushFetch} from '../redux/tickers';

import Ticker from './Ticker';
import TickerFull from './Ticker.Full';
import TickerLoading from './Ticker.Loading';

import './tickers.css';

function Tickers() {
	
	const tickers = useSelector((state) => state.tickers.dataArray);
	const baseTickers = useSelector((state) => state.tickers.baseDataObject);
	
	const removingTickers = useSelector((state) => state.tickers.removingTicker);
	const hidingTickers = useSelector((state) => state.tickers.hidingTicker);
	const fullTickers = useSelector((state) => state.tickers.fullTickers);
	
	const dispatch = useDispatch();
	
	console.log(tickers);
	
	
	
	// clean stories
	useLayoutEffect(() => {
		dispatch(pushFetch({value: [], baseValue: []}));
	}, []);
	
	useLayoutEffect(() => {
		dispatch(sagaStartFetch());
		return () => {
			dispatch(sagaStopFetch());
		}
	}, []);
	
	function handleOnDragEnd(result) {//console.log(result)
		if (!result.destination) return;
		
		let names = getTickerNames(tickers);
		const [reorderedItem] = names.splice(result.source.index, 1);
		names.splice(result.destination.index, 0, reorderedItem);
		
		dispatch(sagaNewOrderTickers(names));
	}
	
	let countDrawTickers = 0;
	
	return (<DragDropContext onDragEnd={handleOnDragEnd}>
		<Droppable droppableId="tickers" direction="horizontal">
			{(provided) => {
				return <div className="tickers-visible" {...provided.droppableProps} ref={provided.innerRef}>
					{tickers.map((value, index) => {
						if(value.visible) {
							let content = null;
							
							countDrawTickers++;
							
							if(removingTickers.includes(value.ticker)) {
								content = <TickerLoading key={value.ticker} ticker={value.ticker} removing={true} />
							} else if(hidingTickers.includes(value.ticker)) {
								content = <TickerLoading key={value.ticker} ticker={value.ticker} hiding={true} />
							} else {
								if(fullTickers.includes(value.ticker)) {
									let status = getStatus(value, baseTickers[value.ticker]);
									
									content = <TickerFull  key={value.ticker} 
												ticker={value.ticker} 
												exchange={value.exchange} 
												price={value.price} 
												status_price={status.price} 
												change={value.change} 
												status_change={status.change} 
												change_percent={value.change_percent} 
												status_change_percent={status.change_percent} 
												dividend={value.dividend} 
												yield={value.yield} 
												visible={value.visible} 
												last_trade_time={value.last_trade_time} />
								} else {
									let status = getStatus(value, baseTickers[value.ticker]);
									
									content = <Ticker  key={value.ticker} 
												ticker={value.ticker} 
												exchange={value.exchange} 
												price={value.price} 
												status_price={status.price} 
												change={value.change} 
												status_change={status.change} 
												change_percent={value.change_percent} 
												status_change_percent={status.change_percent} 
												dividend={value.dividend} 
												yield={value.yield} 
												visible={value.visible} 
												last_trade_time={value.last_trade_time} />
								}
							}
							
							return <Draggable key={value.ticker} draggableId={value.ticker} index={index}>
								{(provided) => {
									return <div className="tickers-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{content}</div>
								}}
							</Draggable>;
						}
					})}
					{(countDrawTickers<=0?(<div className="tickers-wait"><div><span>Wait Tickers List</span><span>...</span></div></div>):null)}
					{provided.placeholder}
				</div>
			}}
		</Droppable>
	</DragDropContext>);
}

function getTickerNames(tickers) {
	let arr = [];
	for(let i=0, size=tickers.length; i<size; i++) {
		arr.push(tickers[i].ticker);
	}
	return arr;
}

function getStatus(current, previos) {
	if(current === null || current === undefined) current = {};
	if(previos === null || previos === undefined) previos = {};
	
	let res = {
		price: 0,
		change: 0,
		change_percent: 0
	}
	
	if(current.ticker !== previos.ticker) {
		return res;
	}
	
	if(current.price !== null && previos.price !== undefined) {
		if(current.price > previos.price) res.price = 1;
		if(current.price < previos.price) res.price = -1;
	}
	
	if(current.change !== null && previos.change !== undefined) {
		if(current.change > previos.change) res.change = 1;
		if(current.change < previos.change) res.change = -1;
	}
	
	if(current.change_percent !== null && previos.change_percent !== undefined) {
		if(current.change_percent > previos.change_percent) res.change_percent = 1;
		if(current.change_percent < previos.change_percent) res.change_percent = -1;
	}
	
	return res;
}

export default Tickers;
