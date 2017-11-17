(()=>{
	"use strict";

	const mongo	 = require('lib/mongo');

	const layout = require('./tmpl/layout');
    const body	 = require('./tmpl/body');
	const list	 = require('./tmpl/list');
	
	
	
	function __GET_SERVERS_INFO() {
		return mongo.inst.collection( 'latest' ).aggregate([
			{ $match:{}},
			{ $project:{
				_id:1, identity:1, time:1,
				cpu:"$state.cpu", mem:"$state.mem", disk:"$state.disk"
			}},
			{$sort:{init:-1}}
		]).toArray();
	}

	function __WRITE_RESPONSE(res, data) {
		
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write(layout({
			js: [
				'./res/js/index.js'
			],
			css: [
				'./res/css/bootstrap.min.css',
				'./res/css/style.css'
			],
			body: body([
				list(data)
			])
		}));
		res.end();
	}
	
	module.exports = (control, chainData)=>{
		const {request:req, response:res} = control.env;
		
		return __GET_SERVERS_INFO()
		.then((value)=>{
			__WRITE_RESPONSE(res, value);
		})
		.catch((err)=>{console.log(err);});
	};
})();
