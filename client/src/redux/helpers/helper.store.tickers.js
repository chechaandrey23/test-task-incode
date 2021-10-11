export function _toObject(arr) {
	let obj = {};
	for(let i=0, size=arr.length; i<size; i++) {
		let item = arr[i];
		obj[item.ticker] = item;
	}
	return obj;
}

export function _remove(arr, el) {
	let index = arr.indexOf(el);
	if(arr !== -1) {
		let newArr = [];
		for(let i=0, size=arr.length; i<size; i++) {
			if(i !== index) newArr.push(arr[i]);
		}
		return newArr;
	} else {
		//throw new Error('Element "'+el+'" is not defined in array!!!');
	}
}

export function _delete(arr, fn) {
	let newArr = [];
	for(let i=0, size=arr.length; i<size; i++) {
		if(!fn(arr[i])) newArr.push(arr[i]);
	}
	return newArr;
}

export function _copyAndFix(arr, cond, obj) {
	let newArr = [];
	for(let i=0, size=arr.length; i<size; i++) {
		let item = arr[i];
		if(cond.call(null, item)) {
			item = {...item, ...obj};
		}
		newArr.push(item);
	}
	return newArr;
}

export function _newOrder(arr, order, getIndexFn) {
	let newArr = [];
	for(let i=0, size=arr.length; i<size; i++) {
		let index = getIndexFn.call(null, arr[i]);
		if(index !== -1) {
			newArr[index] = arr[i];
		} else {
			// Error...
		}
	}
	return newArr;
}
