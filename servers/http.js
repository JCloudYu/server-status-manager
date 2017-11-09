(()=>{
	"use strict";
	
	const config	 = require( 'json-cfg' ).trunk;
	const http		 = require( 'http' );
	const url		 = require( 'url' );
	const pitaya	 = require( 'pitayajs' );
	const EvtEmitter = require( 'events' );
	config.conf.http = config.conf.http || {};
	
	const __handlers = {
		'': {
			'update': pitaya.chain({handler:[
				require( './handler/update-token' ),
				require( './handler/update' )
			]}),
			'fetch': pitaya.chain({handler:[
				require( './handler/update-token' ),
				require( './handler/fetch' )
			]})
		},
		'resource': pitaya.chain({handler:[
			require( './handler/resource' )
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
					let {pathname, search} = url.parse(req.url);

					// Normalize paths
					let separator = pathname.indexOf( '/', 1 );
					let dispatch  = pathname.substring.apply(pathname, (separator < 0) ? [1] : [1, separator]).toLowerCase();
					let remainder = (separator < 0) ? '' : pathname.substring(separator);

					switch(dispatch) {
						case "favicon.ico":
							remainder = '/favicon.ico';
						case "res":
							dispatch = 'resource';
							
							// Prevent relative paths (potential security issue)
							remainder = remainder.replace( /(\/\.\.|\/\.)+/, '' );
							
							remainder = `${config.conf.paths.static}${remainder}`;
							break;
					}

					let dispatcher = __handlers[dispatch];
					if (dispatch === '') {
						dispatcher = (req.method === "POST") ? dispatcher.update : dispatcher.fetch;
					}

					dispatcher
					.trigger(Object.imprintProperties({},{remainder:remainder, request:req, response:res}))
					.then(()=>{
						if (!res.finished) {
							res.end();
						}
					})
					.catch(()=>{
						if (!res.finished) {
							res.writeHead( 500, { 'Content-Type': 'application/json' });
							res.write(JSON.stringify({
								scope: "global",
								error: {
									code: 500,
									message: "Unexpected error has occurred!",
									errors:[{
										reason: "unexpected_error",
										message: "Unexpected error has occurred!"
									}]
								}
							}));
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
