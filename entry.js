(()=>{
	"use strict";
	
	// Register default local module search paths
	const appModulePath = require( 'app-module-path' );
	appModulePath.addPath( `${__dirname}` );
	
	// Initialize execution environment
	require( './env' );

	
	
	// Initialize runtime environments
	const http = require( 'handler/http' );
	const db   = require( 'lib/mongo' );
	
	db.init().then(http.init).then(http.serve)
	.catch((err)=>{
		console.inspect(err);
	});
})();
