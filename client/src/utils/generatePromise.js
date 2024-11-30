export function generatePromise(callback = null) {
	let resolve, reject, promise;
	promise = new Promise((res, rej) => ([resolve, reject] = [res, rej]));
	if (callback) promise.then(callback);
	return { promise, resolve, reject };
}
