(()=>{
	"use strict";
	
	const mongo	 = require( 'lib/mongo' );
	const moment = require( 'moment' );
	const MAX_PAYLOAD = 2 * 1024 * 1024;
	
	let update = module.exports = (control, result=null)=>{
		let {request:req, response:res} = control.env;
		let {session} = control;
		
		return __COLLECT_DATA(req)
		.then((data)=>{
			let json = JSON.parse(data.toString( 'utf8' ));
			let history = mongo.inst.collection( 'history' );
			let latest	= mongo.inst.collection( 'latest' );
			let now		= moment().unix();
			
			return Promise.all([
				history.insertOne({
					identity: session.identity,
					time: now,
					state: json
				}),
				latest.findOneAndUpdate(
					{identity: session.identity},
					{$set:{time:now, state:json}},
					{upsert:true}
				)
			]);
		})
		.then(()=>{
			res.writeHead(200);
			res.write(JSON.stringify({
				scope: "global"
			}));
		})
		.catch(()=>{
			res.writeHead(400, { 'Content-Type':'application/json' });
			res.write(JSON.stringify({
				scope: "global",
				error: {
					code: 400,
					message: "Invalid state data!",
					errors:[{
						reason: "invalid_input",
						message: "Invalid state data!"
					}]
				}
			}));
		});
	};
	
	function __COLLECT_DATA(req) {
		return new Promise((fulfill ,reject)=>{
			let chunks = [], size = 0;
			req.on( 'data', (chunk)=>{
				size += chunk.length;
				if ( size >= MAX_PAYLOAD ) {
					req.destroy();
					return;
				}
				
				chunks.push(chunk);
			});
			
			req.on( 'end', ()=>{
				fulfill(Buffer.concat(chunks));
			});
			
			req.on('error', reject);
		});
	}
})();
