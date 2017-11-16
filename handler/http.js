(()=>{
	"use strict";
	
	const config	 = require( 'json-cfg' ).trunk;
	const http		 = require( 'http' );
	const pitaya	 = require( 'pitayajs' );
	config.conf.http = config.conf.http || {host:null, port:null, paths:{}};
	
	
	
	const __FILE_REQ = [ '/favicon.ico', '/res' ];
	const __handlers = {
		GET: {
			'/': require( './fetch/handler' ),
			'/resource': require( './res/handler' )
		},
		POST: {
			'/': require( './update/handler' )
		},
		ERROR404: require( './error/404' ),
		ERROR500: require( './error/500' ),
	};
	/*
	const ___handlers = {
		GET:{
			'/': pitaya.chain({handler:[
				require( './handler/fetch-token' ),
				require( './handler/fetch' )
			]}),
			'/resource': pitaya.chain({
				handler:[ require( 'pitayajs/helper/http/file-req-handler' ) ],
				
			})
		},
		POST: {
			'/': pitaya.chain({handler:[
				require( './handler/update-token' ),
				require( './handler/update' )
			]})
		}
	};
	*/
	let __httpServer = http.createServer();
	module.exports = {
		init:()=>{
			return new Promise((fulfill)=>{
				__httpServer.on( 'request', (req, res)=>{
					let {comp:dispatch, url} = pitaya.net.HTTPPullPathComp(req.url);

					
					
					let handlerGroup = __handlers[req.method]||{}, handler;
					
					if ( __FILE_REQ.indexOf(dispatch) >= 0 ) {
						handler = handlerGroup[ '/resource' ];
						if ( dispatch === '/favicon.ico' ) {
							url = '/favicon.ico';
						}
					}
					else {
						handler = handlerGroup[dispatch];
					}
					
					
					
					Promise.resolve()
					.then(()=>{
						if ( !handler ) {
							return __handlers.ERROR404(req, res, true);
						}
						else {
							return handler(req, res, url);
						}
					})
					.then(()=>{
						if (!res.finished) {
							res.end();
						}
					})
					.catch((err)=>{
						console.inspect(err);
						__handlers.ERROR500(req, res, true);
					});
				});
				
				fulfill();
			});
		},
		cleanup:()=>{
			if ( !__httpServer ) return;
			
			__httpServer.close(); __httpServer = null;
		},
		serve:()=>{
			return new Promise((fulfill, reject)=>{
				try {
					let conf = config.conf.http || {};
					let port = conf.port || 8080;
					let host = conf.host || 'localhost';
					STDOUT( `${'Start accepting http request on'.green} [${host.toString().yellow}:${port.toString().yellow}]${'...'.green} `, false );
					__httpServer.listen(port, host);
					STDOUT( "Success".green, true );
					fulfill();
				}
				catch(err) {
					STDOUT( "Fail".red, true );
					reject(err);
				}
			});
		}
	};
})();
