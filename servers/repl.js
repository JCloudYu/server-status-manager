(()=>{
	"use strict";
	
	const net		 = require( 'net' );
	const repl		 = require( 'repl' );
	const config	 = require( 'json-cfg' ).trunk;
	const EvtEmitter = require( 'events' );
	
	
	
	let __evtPool	 = new EvtEmitter();
	let __replServer = net.createServer();
	const __exports  = module.exports = {
		init:()=>{
			return new Promise((fulfill, reject)=>{
				__replServer.on('connection', (socket)=>{
					const session = repl.start({
						prompt: `${socket.remoteAddress}> `,
						input: socket,
						output: socket
					}).on('exit', () => {
						socket.end();
					});
				});
				
				fulfill();
			});
		},
		cleanup:()=>{
			if ( !__replServer ) return;
			
			__replServer.close(); __replServer = null;
			__evtPool.removeAllListeners(); __evtPool = null;
		},
		serve: ()=>{
			return new Promise((fulfill, reject)=>{
				try {
					let conf = config.conf.repl || {};
					let port = conf.port || 8180;
					let host = conf.port || 'localhost';
					STDOUT( `Start accepting repl request on ${host.toString().yellow}:${port.toString().yellow} => ` );
					__replServer.listen(port, host);
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
