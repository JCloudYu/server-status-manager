(()=>{
	"use strict";

	const layout = require('layout');
    const body = require('body');
	const list = require('list');

	function __GET_INFO() {

		return new Promise((fulfill, reject)=>{
			fulfill([]);
		});
	}

	function __WRITE_RESPONSE(res, data) {
		
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write(layout({
			js: [
				'./res/js/index.js'
			],
			css: [
				'./res/css/style.css'
			],
			body: body([
				list(data)
			])
		}));
		res.end();
	}
	
	let fetch = module.exports = (control, result=null)=>{
	
		const {request:req, response:res} = control.env;

		return __GET_INFO()
		.then((value)=>{
			__WRITE_RESPONSE(res, value);
		});
	};
})();
