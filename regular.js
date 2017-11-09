(()=>{
	"use strict";
	
	const python = require( 'python-shell' );
	const config = require( 'json-cfg' ).trunk;
	const url	 = require( 'url' );
	
	
	const argv = process.argv.slice( 2 );
	while( argv.length > 0 ) {
		switch( argv.shift() ) {
			case "--conf":
				let opt = argv.shift();
				config.load(opt);
				break;
			
			default:
				break;
		}
	}
	
	
	const updateInfo = config.conf.update || {};
	const remoteAddr = updateInfo.remote || 'http://127.0.0.1:8080';
	const addrInfo	 = url.parse(remoteAddr);
	const http = require( (addrInfo.protocol === 'https:') ? 'https' : 'http' );
	
	___REGULAR_REPORT();
	function ___REGULAR_REPORT() {
		let shell = new python('info.py', {
			mode: 'json',
			scriptPath: './'
		});
		
		shell.on('message', (payload)=>{
			let req = http.request(
				{
					host:addrInfo.hostname,
					port:addrInfo.port,
					path:addrInfo.path,
					method: 'POST',
					headers: {
						'Authorization': `bearer ${updateInfo.token || ''}`
					}
				},
				(res)=>{
					console.log(res.statusCode);
				}
			);
			
			req.write(JSON.stringify(payload));
			req.end();
			
			setTimeout(___REGULAR_REPORT, 5 * 60 * 1000);
		});
	}
})();
