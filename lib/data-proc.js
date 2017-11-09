(()=>{
	"use strict";
	
	module.exports = {
		DrainData:(req)=>{
			return new Promise((fulfill, reject)=>{
				req.on('data', (chunk)=>{});
				req.on('end', fulfill );
				req.on('error', reject );
			});
		}
	};
})();
