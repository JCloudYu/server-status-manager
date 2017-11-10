(()=>{
	"use strict";
	
	module.exports = {
		DrainData:(req)=>{
			return new Promise((fulfill, reject)=>{
				req.on('end', fulfill );
				req.on('error', reject );
				req.resume();
			});
		},
		ReadData:(req)=>{
			return new Promise((fulfill, reject)=>{
				let buff = [];
				req.on('data', (chunk)=>{ buff.push(chunk); });
				req.on('end', ()=>{ fulfill(Buffer.concat(buff)); } );
				req.on('error', reject );
			});
		}
	};
})();
