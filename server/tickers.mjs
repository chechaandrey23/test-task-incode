class Tickers {
	#FETCH_INTERVAL = 5000;
	
	#currTickers = [];
	#oCurrTicker = {};
	
	constructor(tickerNames) {
		this.#currTickers = [...tickerNames];
		this.#currTickers.map((ticker) => {
			if(this.#oCurrTicker.hasOwnProperty(ticker)) {
				throw new TickersError('Having a ticker with the same name is not allowed');
			}
			this.#oCurrTicker[ticker] = {visible: true};
		});
	}
	
	_randomValue(min = 0, max = 1, precision = 0) {
		const random = Math.random() * (max - min) + min;
		return random.toFixed(precision);
	}
	
	_utcDate() {
		const now = new Date();
		return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
	}
	
	_getQuotes(socket) {
		const quotes = this._getNewQuotes(this.#currTickers);
		return quotes;
	}
	
	_getNewQuotes(tickers) {
		return tickers.map((ticker) => {
			return {
				ticker,
				exchange: 'NASDAQ',
				price: this._randomValue(100, 300, 2),
				change: this._randomValue(0, 200, 2),
				change_percent: this._randomValue(0, 1, 2),
				dividend: this._randomValue(0, 1, 2),
				yield: this._randomValue(0, 2, 2),
				last_trade_time: this._utcDate(),
				visible: this.#oCurrTicker[ticker].visible
			}
		});
	}
	
	#timer = 0;
	
	_timeout(socket) {
		this.#timer = setTimeout(() => {
			let quotes = this._getQuotes(socket);
			socket.emit('tickers', {value: quotes, baseValue: null});
			this._timeout(socket);
		}, this.#FETCH_INTERVAL);
	}
	
	#discFn;
	
	_trackTickers(socket) {
		// run the first time immediately
		let quotes = this._getQuotes();
		let baseQuotes = this._getQuotes();
		socket.emit('tickers', {value: quotes, baseValue: baseQuotes});
		
		// every N seconds
		this._timeout(socket);
		
		socket.on('disconnect', (this.#discFn = () => {
			clearTimeout(this.#timer);
		}));
	}
	
	#fn;
	#isStart = false;
	
	bindFetch(socket) {
		socket.on('start', () => {
			if(this.#isStart) return;
			this.#isStart = true;
			this._trackTickers(socket);
		});
	}
	
	unBindFetch(socket) {
		socket.on('stop', () => {
			this.#isStart = false;
			//socket.off('start', this.#fn);
			socket.off('disconnect', this.#discFn);
			clearTimeout(this.#timer);
			setTimeout(() => {socket.emit('tickers-stop', true);}, 1000);
		});
	}
	
	bindAddTicker(socket) {
		socket.on('add-ticker', (name) => {
			name += '';
			if(name === '' || this.#currTickers.includes(name)) {
				setTimeout(() => {socket.emit('add-ticker', {error: true, value: name});}, 1000);
				//throw new TickersError('ticker with name "'+name+'" already exists');
			} else {
				this.#currTickers.push(name);
				this.#oCurrTicker[name] = {visible: true};
				setTimeout(() => {socket.emit('add-ticker', {name: name, value: this._getNewQuotes([name]), baseValue: this._getNewQuotes([name])});}, 1000);
			}
		});
	}
	
	bindRemoveTicker(socket) {
		socket.on('remove-ticker', (name) => {
			name += '';
			
			let removed = false;
			
			for(let i=0; i<this.#currTickers.length; i++) {
				if(this.#currTickers[i] === name) {
					this.#currTickers.splice(i, 1);
					delete this.#oCurrTicker[name];
					removed = true;
				}
			}
			
			setTimeout(() => {socket.emit('remove-ticker', removed?name:{error: true, value: name});}, 1000);
		});
	}
	
	bindShowTicker(socket) {
		socket.on('show-ticker', (name) => {
			name += '';
			
			if(this.#currTickers.includes(name)) {
				this.#oCurrTicker[name].visible = true;
				setTimeout(() => {socket.emit('show-ticker', name);}, 1000);
			} else {
				setTimeout(() => {socket.emit('show-ticker', {error: true, value: name});}, 1000);
			}
		});
	}
	
	bindHideTicker(socket) {
		socket.on('hide-ticker', (name) => {
			name += '';
			
			if(this.#currTickers.includes(name)) {
				this.#oCurrTicker[name].visible = false;
				setTimeout(() => {socket.emit('hide-ticker', name);}, 1000);
			} else {
				setTimeout(() => {socket.emit('hide-ticker', {error: true, value: name});}, 1000);
			}
		});
	}
	
	bindNewOrder(socket) {
		socket.on('new-order-tickers', (order) => {
			try {
				this._checkOrder(order);
				this._newCurrTickers(order);
				setTimeout(() => {
				socket.emit('new-order-tickers', order);
				}, 1000);
			} catch(e) {
				if(e instanceof TickersError) {
					setTimeout(() => {
					socket.emit('new-order-tickers', {error: true, value: this.#currTickers});
					}, 1000);
					//throw e;
				} else {
					throw e;
				}
			}
		});
	}
	
	_checkOrder(order) {
		if(!Array.isArray(order)) {
			throw new TickersError('The object with the new order must be an array');
		}
		if(order.length !== this.#currTickers.length) {
			throw new TickersError('The number of elements of the new order must be equal to the number of current tickers');
		}
	}

	_newCurrTickers(order) {
		let oldTickers = this.#currTickers;
		
		order = [...order];
		this.#currTickers = [];
		//this.#oCurrTicker = {};
		
		for(let i=0; i<oldTickers.length; i++) {
			let index = order.indexOf(oldTickers[i]);
			order[index] = null;
			if(index === -1) {
				this.#currTickers = oldTickers;
				throw new TickersError('ticker "'+oldTickers[i]+'" does not exist');
			}
			if(this.#currTickers[index] !== undefined) {
				this.#currTickers = oldTickers;
				throw new TickersError('ticker with index "'+index+'" already added');
			}
			this.#currTickers[index] = oldTickers[i];
			//this.#oCurrTicker[oldTickers[i]] = {visible: true};
			//order.splice(index, 1);
			//console.log(this.#currTickers.join());
		}
	}
	
	bindSetTimeout(socket) {
		socket.on('set-timeout-tickers', (timeout) => {
			try {
				this._configTickers({timeout});
				setTimeout(() => {
					socket.emit('set-timeout-tickers', true);
					let quotes = this._getQuotes();
					socket.emit('tickers', {value: quotes, baseValue: null});
					this._timeout(socket);
				}, 1000);
			} catch(e) {
				if(e instanceof TickersError) {
					setTimeout(() => {socket.emit('set-timeout-tickers', {error: true});}, 1000);
					//throw e;
				} else {
					throw e;
				}
			}
		});
	}
	
	_configTickers(o, socket) {
		if(o) {
			o.timeout *= 1;
			if(Number.isInteger(o.timeout) && o.timeout > 0) {
				this.#FETCH_INTERVAL = o.timeout;
				clearTimeout(this.#timer);
				//this._getQuotes(socket);
				//this._timeout(socket);
			} else {
				throw new TickersError('Incorrect timeout');
			}
		}
	}
}

class TickersError extends Error {}

export default Tickers;
