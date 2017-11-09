(()=>{
	"use strict";
	
	module.exports = {
		DrainData:(req)=>{
			return new Promise((fulfill, reject)=>{
				let endCB = ()=>{
					req.removeListener('end', endCB);
					fulfill();
				},
				errorCB = (err)=>{
					req.removeListener('error', errorCB);
					reject(err);
				};
				
			
				req.on( 'end', endCB );
				req.on( 'error', errorCB );
			});
		}
	};
})();
