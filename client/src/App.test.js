import { render } from '@testing-library/react';
import React, { Component } from 'react';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store.js'
import {socket} from './configs/socket.io.js';

function delay(timeout) {
	return new Promise((res, rej) => {
		setTimeout(res, timeout);
	});
}

beforeAll(async () => {
	let p = () => new Promise((res, rej) => {
		let fn = (a) => {
			socket.off('set-timeout-tickers', fn);
			res(a);
		}
		socket.on('set-timeout-tickers', fn);
		socket.emit('set-timeout-tickers', {timeout: 5000, without: true});
	});
	
	let res = await p();
	
	if(res && res.error) {
		throw new Error('Failed to set the desired timeout(5000)');
	}
});

let container = null;
beforeEach(async () => {
	await delay(500);
	container = document.createElement("div");
	container.setAttribute('id', 'root');
	//document.body.innerHTML = '';
	document.body.appendChild(container);
});

afterEach(async() => {
	unmountComponentAtNode(container);
	container.remove();
	container = null;
	//document.body.innerHTML = '';
	await delay(500);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

test('render with out connect(pre connect)', async () => {
	//let fn = () => {socket.off('tickers', fn)}
	//socket.on('tickers', fn);
	
	act(() => {
		render(<Provider store={store}><App /></Provider>, container);
	});
	
	expect(document.querySelector('#tickers-wait').textContent).toBe("Wait Tickers List...");
});

test('render with first iteration tickers', async () => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBeTruthy();
	expect(Array.isArray(res.baseValue)).toBeTruthy();
	
	//await delay(350);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	for(let i=0, size=res.value.length; i<size; i++) {
		let value = res.value[i];
		let baseValue = res.baseValue[i];
		
		console.log(value.ticker);
		
		expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
		
		let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
		expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
		
		let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
		expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	}
});

test('render with first and second iteration tickers', async () => {
	let p = () => new Promise((res, rej) => {
		let a = [];
		let fn = (o) => {
			a.push(o);
			if(a.length === 2) {
				socket.off('tickers', fn);
				res(a);
			}
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let [resFirst, resSecond] = await p();
	resFirst.value = resFirst.value.filter(ticker => ticker.visible===true);
	resFirst.baseValue = resFirst.baseValue.filter(ticker => ticker.visible===true);
	resSecond.value = resSecond.value.filter(ticker => ticker.visible===true);
	//res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(resFirst).toHaveProperty('value');
	expect(resFirst).toHaveProperty('baseValue');
	expect(Array.isArray(resFirst.value)).toBeTruthy();
	expect(Array.isArray(resFirst.baseValue)).toBeTruthy();
	expect(resSecond).toHaveProperty('value');
	expect(resSecond).toHaveProperty('baseValue');
	expect(Array.isArray(resSecond.value)).toBeTruthy();
	expect(resSecond.baseValue).toBeFalsy();
	
	//await delay(350);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	for(let i=0, size=resSecond.value.length; i<size; i++) {
		let value = resSecond.value[i];
		let baseValue = resFirst.baseValue[i];
		
		console.log(value.ticker);
		
		expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
		
		let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
		expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
		
		let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
		expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	}
}, 10000);

test('render min and max with double click', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	//await delay(300);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	for(let i=0, size=res.value.length; i<size; i++) {
		let value = res.value[i];
		let baseValue = res.baseValue[i];
		
		console.log(value.ticker);
		
		expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
		
		let ticker = document.querySelector('#ticker-min-'+value.ticker);
		
		act(() => {
			ticker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
		});
		
		//await delay(100);
		
		expect(document.querySelector(`#ticker-max-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-max-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-max-exchange-${value.ticker}`).textContent).toBe(value.exchange);
		expect(document.querySelector(`#ticker-max-price-${value.ticker}`).textContent).toBe(value.price);
		
		let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
		expect(document.querySelector(`#ticker-max-change-${value.ticker}`).textContent).toBe(sign+value.change);
		
		let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
		expect(document.querySelector(`#ticker-max-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
		
		expect(document.querySelector(`#ticker-max-dividend-${value.ticker}`).textContent).toBe(value.dividend);
		expect(document.querySelector(`#ticker-max-yield-${value.ticker}`).textContent).toBe(value.yield);
		expect(document.querySelector(`#ticker-max-last_trade_time-${value.ticker}`).textContent).toBe(value.last_trade_time);
	}
});

test('render: min-ticker -> max-ticker -> min-ticker', async () => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	for(let i=0, size=res.value.length; i<size; i++) {
		let value = res.value[i];
		let baseValue = res.baseValue[i];
		
		console.log(value.ticker);
		
		let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
		let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
		
		//await delay(100);
		
		expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
		expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
		expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
		
		let ticker = document.querySelector('#ticker-min-'+value.ticker);
		
		act(() => {
			ticker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
		});
		
		//await delay(100);
		
		expect(document.querySelector(`#ticker-max-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-max-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-max-exchange-${value.ticker}`).textContent).toBe(value.exchange);
		expect(document.querySelector(`#ticker-max-price-${value.ticker}`).textContent).toBe(value.price);
		expect(document.querySelector(`#ticker-max-change-${value.ticker}`).textContent).toBe(sign+value.change);
		expect(document.querySelector(`#ticker-max-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
		
		expect(document.querySelector(`#ticker-max-dividend-${value.ticker}`).textContent).toBe(value.dividend);
		expect(document.querySelector(`#ticker-max-yield-${value.ticker}`).textContent).toBe(value.yield);
		expect(document.querySelector(`#ticker-max-last_trade_time-${value.ticker}`).textContent).toBe(value.last_trade_time);
		
		let tickerClose = document.querySelector('#ticker-max-controll-min-'+value.ticker);
		
		act(() => {
			tickerClose.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
		
		expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
		expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
		expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	}
});

test('drag & drop', async() => {
	throw new Error('Test Not Found');
});

test('create ticker', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	let open, close;
	
	// open
	open = document.querySelector('#tickers-new-ticker-open');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-new-ticker-content')).toBeTruthy();
	
	// close
	close = document.querySelector('#tickers-new-ticker-close');
	
	act(() => {
		close.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-new-ticker-content')).toBeFalsy();
	
	// open
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	// new ticker
	document.querySelector('#tickers-new-ticker-newname').value = 'XXXX';
	let submit = document.querySelector('#tickers-new-ticker-submit');
	
	let newP = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('add-ticker', fn);
			res(o);
		}
		socket.on('add-ticker', fn);
		
		act(() => {
			submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	res = await newP();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(document.querySelector('#ticker-min-XXXX')).toBeTruthy();
	
	// check
	let value = res.value[0];
	let baseValue = res.baseValue[0];
	
	let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
	let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
	
	expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
	
	expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
	expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
	expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
	expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	
	let ticker = document.querySelector('#ticker-min-'+value.ticker);
	
	act(() => {
		ticker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-max-${value.ticker}`)).toBeTruthy();
	
	expect(document.querySelector(`#ticker-max-name-${value.ticker}`).textContent).toBe(value.ticker);
	expect(document.querySelector(`#ticker-max-exchange-${value.ticker}`).textContent).toBe(value.exchange);
	expect(document.querySelector(`#ticker-max-price-${value.ticker}`).textContent).toBe(value.price);
	expect(document.querySelector(`#ticker-max-change-${value.ticker}`).textContent).toBe(sign+value.change);
	expect(document.querySelector(`#ticker-max-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	
	expect(document.querySelector(`#ticker-max-dividend-${value.ticker}`).textContent).toBe(value.dividend);
	expect(document.querySelector(`#ticker-max-yield-${value.ticker}`).textContent).toBe(value.yield);
	expect(document.querySelector(`#ticker-max-last_trade_time-${value.ticker}`).textContent).toBe(value.last_trade_time);
	
	let tickerClose = document.querySelector('#ticker-max-controll-min-'+value.ticker);
	
	act(() => {
		tickerClose.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
	expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
	expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
	expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
});

test('create ticker with error', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	let open, close;
	
	// open
	open = document.querySelector('#tickers-new-ticker-open');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-new-ticker-content')).toBeTruthy();
	
	// close
	close = document.querySelector('#tickers-new-ticker-close');
	
	act(() => {
		close.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-new-ticker-content')).toBeFalsy();
	
	// open
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	// new ticker
	document.querySelector('#tickers-new-ticker-newname').value = '';
	let submit = document.querySelector('#tickers-new-ticker-submit');
	
	let newP = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('add-ticker', fn);
			res(o);
		}
		socket.on('add-ticker', fn);
		
		act(() => {
			submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	res = await newP();
	
	expect(document.querySelector('#ticker-min-')).toBeFalsy();
	
	expect(document.querySelector('#tickers-new-ticker-error')).toBeTruthy();
});

test('delete ticker', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	let firstValue = res.value[0];
	let firstBaseValue = res.baseValue[0];
	
	let firstTicker = document.querySelector('#ticker-min-'+firstValue.ticker);
	act(() => {
		firstTicker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-max-${firstValue.ticker}`)).toBeTruthy();
	
	// test modal window
	let firstTicketRemove = document.querySelector('#ticker-max-controll-remove-'+firstValue.ticker);
	act(() => {
		firstTicketRemove.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-controll-delete-"+firstValue.ticker)).toBeTruthy();
	
	let closeModal = document.querySelector("#ticker-controll-delete-modal-close-"+firstValue.ticker);
	expect(closeModal).toBeTruthy();
	
	act(() => {
		closeModal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-controll-delete-"+firstValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-controll-delete-modal-close-"+firstValue.ticker)).toBeFalsy();
	
	// delete
	act(() => {
		firstTicketRemove.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	let deleteTicker = document.querySelector('#ticker-controll-delete-'+firstValue.ticker);
	act(() => {
		deleteTicker.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-loading-"+firstValue.ticker)).toBeTruthy();
	expect(document.querySelector('#ticker-max-'+firstValue.ticker)).toBeFalsy();
	
	let newP = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('remove-ticker', fn);
			res(o);
		}
		socket.on('remove-ticker', fn);
	});
	
	await newP();
	
	expect(document.querySelector('#ticker-min-'+firstValue.ticker)).toBeFalsy();
	expect(document.querySelector('#ticker-max-'+firstValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-loading-"+firstValue.ticker)).toBeFalsy();
});

test('delete(create ticker & delete ticker) ticker', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	// create
	let open = document.querySelector('#tickers-new-ticker-open');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-new-ticker-content')).toBeTruthy();
	
	// new ticker
	document.querySelector('#tickers-new-ticker-newname').value = 'YYYY';
	let submit = document.querySelector('#tickers-new-ticker-submit');
	
	let newP = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('add-ticker', fn);
			res(o);
		}
		socket.on('add-ticker', fn);
		
		act(() => {
			submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	let resCreate = await newP();
	
	expect(document.querySelector('#ticker-min-YYYY')).toBeTruthy();
	
	// delete
	let lastValue = resCreate.value[0];
	let lastBaseValue = resCreate.baseValue[0];
	
	let firstTicker = document.querySelector('#ticker-min-'+lastValue.ticker);
	act(() => {
		firstTicker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-max-${lastValue.ticker}`)).toBeTruthy();
	
	// test modal window
	let firstTicketRemove = document.querySelector('#ticker-max-controll-remove-'+lastValue.ticker);
	act(() => {
		firstTicketRemove.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-controll-delete-"+lastValue.ticker)).toBeTruthy();
	
	let closeModal = document.querySelector("#ticker-controll-delete-modal-close-"+lastValue.ticker);
	expect(closeModal).toBeTruthy();
	
	act(() => {
		closeModal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-controll-delete-"+lastValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-controll-delete-modal-close-"+lastValue.ticker)).toBeFalsy();
	
	// delete
	act(() => {
		firstTicketRemove.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	let deleteTicker = document.querySelector('#ticker-controll-delete-'+lastValue.ticker);
	act(() => {
		deleteTicker.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-loading-"+lastValue.ticker)).toBeTruthy();
	expect(document.querySelector('#ticker-max-'+lastValue.ticker)).toBeFalsy();
	
	let newPD = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('remove-ticker', fn);
			res(o);
		}
		socket.on('remove-ticker', fn);
	});
	
	await newPD();
	
	expect(document.querySelector('#ticker-min-'+lastValue.ticker)).toBeFalsy();
	expect(document.querySelector('#ticker-max-'+lastValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-loading-"+lastValue.ticker)).toBeFalsy();
});

test('hide ticker', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	// hide
	let firstValue = res.value[0];
	let firstBaseValue = res.baseValue[0];
	
	let firstTicker = document.querySelector('#ticker-min-'+firstValue.ticker);
	act(() => {
		firstTicker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-max-${firstValue.ticker}`)).toBeTruthy();
	
	let hide = document.querySelector("#ticker-max-controll-hide-"+firstValue.ticker);
	act(() => {
		hide.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-loading-"+firstValue.ticker)).toBeTruthy();
	expect(document.querySelector('#ticker-max-'+firstValue.ticker)).toBeFalsy();
	
	let newPH = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('hide-ticker', fn);
			res(o);
		}
		socket.on('hide-ticker', fn);
	});
	
	await newPH();
	
	expect(document.querySelector('#ticker-min-'+firstValue.ticker)).toBeFalsy();
	expect(document.querySelector('#ticker-max-'+firstValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-loading-"+firstValue.ticker)).toBeFalsy();
});

test('hide(create & hide) ticker', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	// create
	let open = document.querySelector('#tickers-new-ticker-open');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-new-ticker-content')).toBeTruthy();
	
	// new ticker
	document.querySelector('#tickers-new-ticker-newname').value = 'WWWW';
	let submit = document.querySelector('#tickers-new-ticker-submit');
	
	let newP = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('add-ticker', fn);
			res(o);
		}
		socket.on('add-ticker', fn);
		
		act(() => {
			submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	let resCreate = await newP();
	
	expect(document.querySelector('#ticker-min-WWWW')).toBeTruthy();
	
	// hide
	let lastValue = resCreate.value[0];
	let lastBaseValue = resCreate.baseValue[0];
	
	let firstTicker = document.querySelector('#ticker-min-'+lastValue.ticker);
	act(() => {
		firstTicker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-max-${lastValue.ticker}`)).toBeTruthy();
	
	let hide = document.querySelector("#ticker-max-controll-hide-"+lastValue.ticker);
	act(() => {
		hide.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-loading-"+lastValue.ticker)).toBeTruthy();
	expect(document.querySelector('#ticker-max-'+lastValue.ticker)).toBeFalsy();
	
	let newPH = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('hide-ticker', fn);
			res(o);
		}
		socket.on('hide-ticker', fn);
	});
	
	await newPH();
	
	expect(document.querySelector('#ticker-min-'+lastValue.ticker)).toBeFalsy();
	expect(document.querySelector('#ticker-max-'+lastValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-loading-"+lastValue.ticker)).toBeFalsy();
});

test('hide(first ticker & last ticker) & show tickers', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 1).toBeTruthy();
	
	// hide
	let firstValue = res.value[0];
	let firstBaseValue = res.baseValue[0];
	
	let firstTicker = document.querySelector('#ticker-min-'+firstValue.ticker);
	act(() => {
		firstTicker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-max-${firstValue.ticker}`)).toBeTruthy();
	
	let hide = document.querySelector("#ticker-max-controll-hide-"+firstValue.ticker);
	act(() => {
		hide.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-loading-"+firstValue.ticker)).toBeTruthy();
	expect(document.querySelector('#ticker-max-'+firstValue.ticker)).toBeFalsy();
	
	let newPH = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('hide-ticker', fn);
			res(o);
		}
		socket.on('hide-ticker', fn);
	});
	
	await newPH();
	
	expect(document.querySelector('#ticker-min-'+firstValue.ticker)).toBeFalsy();
	expect(document.querySelector('#ticker-max-'+firstValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-loading-"+firstValue.ticker)).toBeFalsy();
	
	// hide last
	let lastValue = res.value[res.value.length-1];
	let lastBaseValue = res.baseValue[res.baseValue.length-1];
	
	let lastTicker = document.querySelector('#ticker-min-'+lastValue.ticker);
	act(() => {
		lastTicker.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
	});
	
	expect(document.querySelector(`#ticker-max-${lastValue.ticker}`)).toBeTruthy();
	
	let hideLast = document.querySelector("#ticker-max-controll-hide-"+lastValue.ticker);
	act(() => {
		hideLast.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector("#ticker-loading-"+lastValue.ticker)).toBeTruthy();
	expect(document.querySelector('#ticker-max-'+lastValue.ticker)).toBeFalsy();
	
	let newPHLast = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('hide-ticker', fn);
			res(o);
		}
		socket.on('hide-ticker', fn);
	});
	
	await newPHLast();
	
	expect(document.querySelector('#ticker-min-'+lastValue.ticker)).toBeFalsy();
	expect(document.querySelector('#ticker-max-'+lastValue.ticker)).toBeFalsy();
	expect(document.querySelector("#ticker-loading-"+lastValue.ticker)).toBeFalsy();
	
	// show all
	let open = document.querySelector('#tickers-add-ticker');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	let close = document.querySelector('#tickers-add-ticker-close');
	expect(close).toBeTruthy();
	expect(document.querySelector('#tickers-add-ticker-content')).toBeTruthy();
	
	act(() => {
		close.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-add-ticker-close')).toBeFalsy();
	expect(document.querySelector('#tickers-add-ticker-content')).toBeFalsy();
	
	// open window
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	expect(document.querySelector('#tickers-add-ticker-content')).toBeTruthy();
	
	// show first
	let showFirst = document.querySelector("#tickers-add-ticker-item-"+firstValue.ticker);
	act(() => {
		showFirst.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	expect(document.querySelector("#tickers-add-ticker-wait-"+firstValue.ticker)).toBeTruthy();
	expect(document.querySelector("#tickers-add-ticker-content-"+firstValue.ticker)).toBeFalsy();
	
	let newPS = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('show-ticker', fn);
			res(o);
		}
		socket.on('show-ticker', fn);
	});
	
	await newPS();
	
	expect(document.querySelector('#tickers-add-ticker-content')).toBeTruthy();
	expect(document.querySelector('#ticker-min-'+firstValue.ticker)).toBeTruthy();
	
	// show last
	let showLast = document.querySelector("#tickers-add-ticker-item-"+lastValue.ticker);
	act(() => {
		showLast.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	expect(document.querySelector("#tickers-add-ticker-wait-"+lastValue.ticker)).toBeTruthy();
	expect(document.querySelector("#tickers-add-ticker-content-"+lastValue.ticker)).toBeFalsy();
	
	let newPSLast = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('show-ticker', fn);
			res(o);
		}
		socket.on('show-ticker', fn);
	});
	
	await newPSLast();
	
	expect(document.querySelector('#tickers-add-ticker-content')).toBeTruthy();
	expect(document.querySelector('#ticker-min-'+lastValue.ticker)).toBeTruthy();
	
}, 10000);


test('set new timeout update tickers', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 1).toBeTruthy();
	
	// new timeout
	let open = document.querySelector('#tickers-config-open');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	let close = document.querySelector('#tickers-config-close');
	expect(close).toBeTruthy();
	expect(document.querySelector('#tickers-config-content')).toBeTruthy();
	
	// new config
	document.querySelector('#tickers-config-timeout').value = '1500';
	let submit = document.querySelector('#tickers-config-submit');
	
	let newT = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('set-timeout-tickers', fn);
			res(o);
		}
		socket.on('set-timeout-tickers', fn);
		
		act(() => {
			submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	let resT = await newT();
	
	expect(resT).toBeTruthy();
	expect(document.querySelector('#tickers-config-open')).toBeTruthy();
	
	let pm = () => new Promise((res, rej) => {
		let a = [];
		let t = [];
		let fn = (o) => {
			a.push(o);
			t.push(Date.now());
			if(a.length === 2) {
				socket.off('tickers', fn);
				res([a, t]);
			}
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let [[resFirst, resSecond],[startTime, endTime]] = await pm();
	resFirst.value = resFirst.value.filter(ticker => ticker.visible===true);
	resSecond.value = resSecond.value.filter(ticker => ticker.visible===true);
	
	expect(resFirst).toHaveProperty('value');
	expect(resFirst).toHaveProperty('baseValue');
	expect(Array.isArray(resFirst.value)).toBeTruthy();
	expect(resFirst.baseValue).toBeFalsy();
	expect(resSecond).toHaveProperty('value');
	expect(resSecond).toHaveProperty('baseValue');
	expect(Array.isArray(resSecond.value)).toBeTruthy();
	expect(resSecond.baseValue).toBeFalsy();
	
	let diffTime = endTime - startTime;
	console.log('First diff time: '+diffTime);
	expect(diffTime >= 1500-500 && diffTime <= 1500+500).toBeTruthy();
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	for(let i=0, size=resSecond.value.length; i<size; i++) {
		let value = resSecond.value[i];
		let baseValue = res.baseValue[i];
		
		console.log(value.ticker);
		
		expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
		
		let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
		expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
		
		let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
		expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	}
	
	// old timeout
	open = document.querySelector('#tickers-config-open');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-config-close')).toBeTruthy();
	expect(document.querySelector('#tickers-config-content')).toBeTruthy();
	
	// old config
	document.querySelector('#tickers-config-timeout').value = '5000';
	let submit1 = document.querySelector('#tickers-config-submit');
	
	let newT1 = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('set-timeout-tickers', fn);
			res(o);
		}
		socket.on('set-timeout-tickers', fn);
		
		act(() => {
			submit1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	resT = await newT1();
	
	expect(resT).toBeTruthy();
	expect(document.querySelector('#tickers-config-open')).toBeTruthy();
	
	let pm1 = () => new Promise((res, rej) => {
		let a = [];
		let t = [];
		let fn = (o) => {
			a.push(o);
			t.push(Date.now());
			if(a.length === 2) {
				socket.off('tickers', fn);
				res([a, t]);
			}
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let [[resFirst1, resSecond1],[startTime1, endTime1]] = await pm1();
	resFirst1.value = resFirst1.value.filter(ticker => ticker.visible===true);
	resSecond1.value = resSecond1.value.filter(ticker => ticker.visible===true);
	
	expect(resFirst1).toHaveProperty('value');
	expect(resFirst1).toHaveProperty('baseValue');
	expect(Array.isArray(resFirst1.value)).toBeTruthy();
	expect(resFirst1.baseValue).toBeFalsy();
	expect(resSecond1).toHaveProperty('value');
	expect(resSecond1).toHaveProperty('baseValue');
	expect(Array.isArray(resSecond1.value)).toBeTruthy();
	expect(resSecond1.baseValue).toBeFalsy();
	
	diffTime = endTime1 - startTime1;
	console.log('Second diff time: '+diffTime);
	expect(diffTime >= 5000-500 && diffTime <= 5000+500).toBeTruthy();
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	for(let i=0, size=resSecond1.value.length; i<size; i++) {
		let value = resSecond1.value[i];
		let baseValue = res.baseValue[i];
		
		console.log(value.ticker);
		
		expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
		
		let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
		expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
		
		let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
		expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	}
	
}, 15000);

test('set new timeout(with error)', async() => {
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	let open, close;
	
	// open
	open = document.querySelector('#tickers-config-open');
	
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-config-content')).toBeTruthy();
	
	// close
	close = document.querySelector('#tickers-config-close');
	
	act(() => {
		close.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	expect(document.querySelector('#tickers-config-content')).toBeFalsy();
	
	// open
	act(() => {
		open.dispatchEvent(new MouseEvent("click", { bubbles: true }));
	});
	
	// new ticker
	document.querySelector('#tickers-config-timeout').value = 'QQQ';
	let submit = document.querySelector('#tickers-config-submit');
	
	let newP = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('set-timeout-tickers', fn);
			res(o);
		}
		socket.on('set-timeout-tickers', fn);
		
		act(() => {
			submit.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	res = await newP();
	
	expect(document.querySelector('#tickers-config-error')).toBeTruthy();
});


test('stop & start tickers update', async() => {
	let pt = (timeout) => new Promise((res, rej) => {
		let fn = () => {
			socket.off('set-timeout-tickers', fn);
			res(true);
		}
		socket.on('set-timeout-tickers', fn);
		socket.emit('set-timeout-tickers', {timeout: timeout, without: true});
	});
	
	let rest = await pt(2000);
	
	expect(rest && !rest.error).toBeTruthy();
	
	let p = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			render(<Provider store={store}><App /></Provider>, container);
		});
	});
	
	let res = await p();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBe(true);
	expect(Array.isArray(res.baseValue)).toBe(true);
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	let stop = document.querySelector('#tickers-stop-button');
	
	let pstop = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers-stop', fn);
			res(o);
		}
		socket.on('tickers-stop', fn);
		
		act(() => {
			stop.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	await pstop();
	
	let pcheck = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(false);
		}
		setTimeout(() => {
			socket.off('tickers', fn);
			res(true);
		}, 5000);
		socket.on('tickers', fn);
	});
	
	let resCheck = await pcheck();
	
	expect(resCheck).toBeTruthy();
	
	let start = document.querySelector('#tickers-start-button');
	
	let pstart = () => new Promise((res, rej) => {
		let fn = (o) => {
			socket.off('tickers', fn);
			res(o);
		}
		socket.on('tickers', fn);
		
		act(() => {
			start.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		});
	});
	
	res = await pstart();
	res.value = res.value.filter(ticker => ticker.visible===true);
	res.baseValue = res.baseValue.filter(ticker => ticker.visible===true);
	
	expect(res).toHaveProperty('value');
	expect(res).toHaveProperty('baseValue');
	expect(Array.isArray(res.value)).toBeTruthy();
	expect(Array.isArray(res.baseValue)).toBeTruthy();
	
	expect(document.querySelectorAll('[id^="ticker-min-"]').length > 0).toBeTruthy();
	
	for(let i=0, size=res.value.length; i<size; i++) {
		let value = res.value[i];
		let baseValue = res.baseValue[i];
		
		console.log(value.ticker);
		
		expect(document.querySelector(`#ticker-min-${value.ticker}`)).toBeTruthy();
		
		expect(document.querySelector(`#ticker-min-name-${value.ticker}`).textContent).toBe(value.ticker);
		expect(document.querySelector(`#ticker-min-price-${value.ticker}`).textContent).toBe(value.price);
		
		let sign = (value.change>baseValue.change)?'+':((value.change<baseValue.change)?'-':'');
		expect(document.querySelector(`#ticker-min-change-${value.ticker}`).textContent).toBe(sign+value.change);
		
		let sign_percent = (value.change_percent>baseValue.change_percent)?'+':((value.change_percent<baseValue.change_percent)?'-':'');
		expect(document.querySelector(`#ticker-min-change_percent-${value.ticker}`).textContent).toBe(sign_percent+value.change_percent+'%');
	}
	
	// end timeout
	rest = await pt(5000);
	
	expect(rest && !rest.error).toBeTruthy();
	
}, 18000);







