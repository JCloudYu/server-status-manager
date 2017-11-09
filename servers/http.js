(()=>{
	"use strict";
	
	const config	 = require( 'json-cfg' ).trunk;
	const http		 = require( 'http' );
	const pitaya	 = require( 'pitayajs' );
	const EvtEmitter = require( 'events' );
	config.conf.http = config.conf.http || {};
	
	
	
	const __handlers = {
		update:pitaya.chain({handler:[
			require( './handler/update-token' ),
			require( './handler/update' )
		]}),
		fetch:pitaya.chain({handler:[
			require( './handler/update-token' ),
			require( './handler/fetch' )
		]})
	};
	let __evtPool	 = new EvtEmitter();
	let __httpServer = http.createServer();
	const __exports	 = module.exports = {
		init:()=>{
			if (!config.conf.http.enabled) {
				return;
			}
		
			return new Promise((fulfill, reject)=>{
				// Start http server processing logic
				__httpServer.on( 'request', (req, res)=>{
					(( req.method === "POST" ) ? __handlers.update : __handlers.fetch)
					.trigger(Object.imprintProperties({},{request:req, response:res}))
					.then(()=>{
						if (!res.finished) {
							res.end();
						}
					})
					.catch(()=>{
						if (!res.finished) {
							res.writeHead( 500, { 'Content-Type': 'text/plain' });
							res.write( "Unexpected error has occurred!" );
							res.end();
						}
					});
				});
				
				fulfill();
			});
		},
		cleanup:()=>{
			if ( !__httpServer ) return;
			
			__httpServer.close(); __httpServer = null;
			__evtPool.removeAllListeners(); __evtPool = null;
		},
		serve:()=>{
			if (!config.conf.http.enabled) {
				return;
			}
			
			return new Promise((fulfill, reject)=>{
				try {
					let conf = config.conf.http || {};
					let port = conf.port || 8080;
					let host = conf.port || 'localhost';
					STDOUT( `Start accepting http request on ${host.toString().yellow}:${port.toString().yellow} => ` );
					__httpServer.listen(port, host);
					STDOUT( "Success".green, true );
					fulfill();
				}
				catch(err) {
					STDOUT( "Fail".red, true );
					reject(err);
				}
			});
		},
		on:(...args)=>{
			__evtPool.on(...args);
			return __exports;
		}
	};
})();
