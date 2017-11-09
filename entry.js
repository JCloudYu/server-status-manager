(()=>{
	"use strict";
	
	require( 'app-module-path' ).addPath( `${__dirname}` );
	require( 'colors' );
	require( 'tiinytiny' ).register();
	const config = require( 'json-cfg' ).trunk;
	const http	 = require( 'servers/http' );
	const repl	 = require( 'servers/repl' );
	const db	 = require( 'lib/mongo' );
	
	
	
	const argv = process.argv.slice( 2 );
	while( argv.length > 0 ) {
		switch( argv.shift() ) {
			case "--conf":
				let opt = argv.shift();
				console.log( "Config assigned! Loading...".white );
				config.load(opt);
				break;
			
			default:
				break;
		}
	}
	
	global.STDOUT = (content, newLine=false)=>{
		process.stdout.write(`${content}${newLine ? "\n" : ''}`);
	};
	
	Promise.wait([ db.init() ])
	.then(()=>{return Promise.wait([
		http.init(), repl.init()
	])})
	.then(()=>{return Promise.wait([
		http.serve(), repl.serve()
	])})
	.then(()=>{
		repl.on( 'close', ()=>{
			db.inst.close();
			http.cleanup();
			repl.cleanup();
		});
	})
	.catch((err)=>{
		console.log(err);
	});
})();
