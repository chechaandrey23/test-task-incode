//{expName: constName}
export function createActions(obj) {
	let res = {};
	if(obj) {
		for(let i in obj) {
			res[i] = ((constName) => {
				return (data) => ({type: constName, payload: data});
			})(obj[i]);
		}
	}
	return res;
}

// constName, fn | fn
export function createSagas(arr) {
	let res = [];
	if(Array.isArray(arr)) {
		for(let i=0, size=arr.length; i<size; i++) {
			let item = arr[i];
			if(typeof item === 'function') {
				res.push(item);
			} else if(Array.isArray(item) && typeof item[1] === 'function') {
				res.push({pattern: item[0]+'', saga: item[1]});
			}
		}
	}
	return res;
}
