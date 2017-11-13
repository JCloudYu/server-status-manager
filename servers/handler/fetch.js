(()=>{
	"use strict";

	const http	 = require('http');
	const fs	 = require('fs');
	const mongo	 = require('lib/mongo');

	const layout = require('layout');
    const body	 = require('body');
	const list	 = require('list');

	const __basePath = global.__basePath || `${__dirname}/../..`;

	function __GET_SERVERS_INFO() {

		return new Promise((fulfill, reject)=>{

			let findQuery = {};
			mongo.inst
			.collection('latest')
			.find(findQuery)		
			.sort({init: -1})
			.skip(0)
			.limit(0)
			.toArray()
			.then((value)=>{
				fulfill(value);
			})
			.catch(reject);
		});
	}

	function __PURGE_INFO(infos) {

		let listData = [];
		infos.forEach(info => {
			listData.push({
				'identity': info.identity,
				'time': info.time,
				'cpu': info.state.cpu,
				'mem': info.state.mem,
				'disk': info.state.disk
			});
		});

		return Promise.resolve(listData);
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

		return __GET_SERVERS_INFO()
		.then(__PURGE_INFO)
		.then((value)=>{
			__WRITE_RESPONSE(res, value);
		})
		.catch((err)=>{console.log(err);});
	};
})();
