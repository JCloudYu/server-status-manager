(()=>{
	"use strict";
	
	require( 'colors' );
	require( 'tiinytiny' ).register();
	const repl		 = require( 'repl' );
	const config	 = require( 'json-cfg' ).trunk;
	const jwt		 = require( 'lib-jwt' );
	const moment	 = require( 'moment' );
	const crypto	 = require( 'crypto' );
	
	const argv = process.argv.slice( 2 );
	while( argv.length > 0 ) {
		switch( argv.shift() ) {
			case "--conf":
				let opt = argv.shift();
				console.log( "Config assigned! Loading..." );
				config.load(opt);
				break;
			
			default:
				break;
		}
	}
	
	
	
	
	const ACCESS_TOKEN_GENERATOR = {
		'access-ticket': (options)=>{
			let duration = options.duration || 3600;
		
			return jwt.genToken(
				{ typ:'JWT', alg:'HS256' },
				{
					type:'access-ticket',
					exp: moment().unix() + duration
				}
			);
		},
		'update-ticket': (options)=>{
			let duration = options.duration || 31536000;
			let identity = options.identity || 'unknown';
			if ( identity === 'unknown' ) {
				throw `Missing necessary data \`identity\``;
			}
		
			return jwt.genToken(
				{ typ:'JWT', alg:'HS256' },
				{
					type: 'update-ticket',
					exp: moment().unix() + duration,
					identity: identity
				}
			);
		}
	};
	const __exposedAPI = Object.imprintProperties({}, {
		genSecret:()=>{
			return jwt.Base64Url.encode(crypto.randomBytes(128));
		},
		genToken:(type='update-ticket', options={})=>{
			let generator = ACCESS_TOKEN_GENERATOR[type];
			if ( !generator ) {
				throw `Unsupported access token type \`${type}\`!`;
			}
			
			return generator(options);
		}
	});
	
	
	
	console.log( `Starting repl mode with following configurations:` );
	console.log( `${'Secret'.green}: ${(config.conf.secret || '').yellow}` );
	const session = repl.start({
		prompt: 'state-helper> ',
		replMode: repl.REPL_MODE_STRICT
	});
	require( 'repl.history')(session, `${__dirname}/.repl-history`);
	session.context.admin = __exposedAPI;
})();
