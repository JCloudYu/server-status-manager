/**
 * Project: server-status-manager
 * File: env.js
 * Author: JCloudYu
 * Create Date: Nov. 16, 2017
 */
(() => {
	"use strict";
	
	const util = require( 'util' );
	const path = require( 'path' );
	const projRoot = path.resolve(path.dirname(require.main.filename));
	
	
	
	// Register environmentally global APIs
	/**
	 * Output data to stderr
	 * @function STDERR
	 * @param {...} data The data to be printed
	 * @memberOf global
	 */
	
	/**
	 * Output data to stdout
	 * @function STDOUT
	 * @param {...} data The data to be printed
	 * @memberOf global
	 */
	[ 'STDOUT', 'STDERR' ].forEach((name)=>{
		global[name] = __OUTPUT_STREAM.bind(null, process[name.toLowerCase()]);
	});
	
	/**
	 * Output data using colored and pretty printed format
	 * @param {...} args The data to be printed
	 * @memberOf console
	 */
	console.inspect = (...args)=>{
		args.forEach((arg)=>{
			STDOUT(util.inspect(arg, {colors:true, depth:20}))
		});
	};
	
	
	
	// config load must be on the top
	require( 'colors' );
	require( 'tiinytiny' ).register();
	
	
	
	// Eat execution arguments
	const env = {};
	const argv = process.argv.slice( 2 );
	while( argv.length > 0 ) {
		switch( argv.shift() ) {
			case "--conf":
				env.conf = argv.shift();
				break;
			
			default:
				break;
		}
	}


	
	// Load environmental configurations
	const config = require( 'json-cfg' ).trunk;
	if ( !env.conf ) {
		STDOUT( `No config file is assigned! Using default configurations!`.red );
		env.conf = `${projRoot}/config.default.json`;
	}
	
	STDOUT( `${'Loading config file'.green} [${env.conf.yellow}] ${'...'.green}` );
	config.load( env.conf );



	// Register runtime information
	env.project_root = projRoot;
	config.conf.env = Object.imprintProperties(config.conf.env||{}, env, [true, true, false]);
	
	
	
	
	
	
	function __OUTPUT_STREAM(stream, content, newLine=true) {
		stream.write(`${content}${newLine ? "\n" : ''}`);
	}
})();
