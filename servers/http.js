(()=>{
	"use strict";
	
	const MIME_MAP = {
		'js':	'application/javascript',
		'png':	'image/png',
		'jpg':	'image/jpeg',
		'jpeg':	'image/jpeg',
		'tiff':	'image/tiff',
		'tif':	'image/tiff',
		'css':	'text/css',
		'html':	'text/html',
		'htm':	'text/html',
		'lic':	'text/plain',
		'txt':	'text/plain',
		'json':	'application/json'
	};
	const config	 = require( 'json-cfg' ).trunk;
	const http		 = require( 'http' );
	const url		 = require( 'url' );
	const pitaya	 = require( 'pitayajs' );
	config.conf.http = config.conf.http || {host:null, port:null, paths:{}};
	
	const __handlers = {
		'': {
			'update': pitaya.chain({handler:[
				require( './handler/update-token' ),
				require( './handler/update' )
			]}),
			'fetch': pitaya.chain({handler:[
				require( './handler/fetch-token' ),
				require( './handler/fetch' )
			]})
		},
		'resource': pitaya.chain({
			handler:[ require( 'pitayajs/helper/http/file-req-handler' ) ],
			paths:{
				nginx: config.conf.http.paths.nginx || '/internal-rc',
				local: config.conf.http.paths.local || './res'
			}
		})
	};

	let __httpServer = http.createServer();
	module.exports = {
		init:()=>{
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
							
							
							let ext = remainder.lastIndexOf('.');
							ext = (ext > 0) ? remainder.substring(ext+1) : '';
							remainder = { path:remainder, contentType:MIME_MAP[ext] || 'application/octet-stream' };
							break;
					}

					let dispatcher = __handlers[dispatch];
					if (dispatch === '') {
						dispatcher = (req.method === "POST") ? dispatcher.update : dispatcher.fetch;
					}


					let env = Object.imprintProperties({},{remainder:remainder, request:req, response:res});
					dispatcher
					.trigger(env, remainder)
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
