(()=>{
	"use strict";
	
	// add path
	const appModulePath = require( 'app-module-path' );
	appModulePath.addPath( `${__dirname}` );
	appModulePath.addPath( `${__dirname}/fetch-mode` );
	appModulePath.addPath( `${__dirname}/fetch-mode/modules` );
	appModulePath.addPath( `${__dirname}/fetch-mode/tmpl` );

	require( 'colors' );
	require( 'tiinytiny' ).register();
	const config = require( 'json-cfg' ).trunk;
	const http	 = require( 'servers/http' );
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



	// create runtime config
	Object.imprintProperties(config.conf, {
		paths:{
			static: `${__dirname}/fetch-mode/static-resources`
		}
	}, [false,true,true]);



	db.init()
	.then(()=>{
		return http.init()
	})
	.then(()=>{
		return http.serve();
	})
	.catch((err)=>{
		console.log(err);
	});
})();
