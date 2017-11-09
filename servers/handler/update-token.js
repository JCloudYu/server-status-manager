(()=>{
	"use strict";
	
	const JWT	 = require( 'lib-jwt' );
	const moment = require( 'moment' );
	const conf	 = require( 'json-cfg' ).trunk.conf;
	const crypto = require( 'crypto' );
	
	let updateTokenHandler = module.exports = (control, result=null)=>{
		const {request:req, response:res} = control.env;
		let [type, accToken] = (req.headers.authorization || '').split( ' ' );
		
		
		accToken = JWT.parse(accToken||'');
		if ( type !== 'bearer' || !accToken || (accToken.header.alg !== 'HS256') ) {
			res.writeHead(401);
			control.stop = true;
			return;
		}
		
		let payload = accToken.payload;
		if ( payload.type !== 'update-ticket' || payload.exp <= moment().unix() || !payload.identity ) {
			res.writeHead(401);
			control.stop = true;
			return;
		}
		
		
		let alg = accToken.header.alg, {content, signature} = accToken.raw;
		let secret = conf.secret ? JWT.Base64Url.decode(conf.secret) : crypto.randomBytes(64);
		let verified = JWT.verify(alg, content, signature, secret);
		if ( !verified ) {
			res.writeHead(401);
			control.stop = true;
			return;
		}
		
		
		
		control.session = accToken.payload;
	};
})();
