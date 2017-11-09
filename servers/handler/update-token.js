(()=>{
	"use strict";
	
	const JWT	 = require( 'lib-jwt' );
	const moment = require( 'moment' );
	const conf	 = require( 'json-cfg' ).trunk.conf;
	const crypto = require( 'crypto' );
	const {DrainData} = require( 'lib/data-proc' );
	
	let updateTokenHandler = module.exports = (control, result=null)=>{
		const {request:req, response:res} = control.env;
		let [type, accToken] = (req.headers.authorization || '').split( ' ' );
		
		
		accToken = JWT.parse(accToken||'');
		if ( type !== 'bearer' || !accToken || (accToken.header.alg !== 'HS256') ) {
			control.stop = true;
			return DrainData(req)
			.then(()=>{
				res.writeHead(401, {'Content-Type':'application/json'});
				res.write(JSON.stringify({
					scope: "global",
					error: {
						code: 401,
						message: "You're providing invalid access token!",
						errors:[{
							reason: "invalid_access_token",
							message: "You're providing invalid access token!"
						}]
					}
				}));
			});
		}
		
		let payload = accToken.payload;
		if ( payload.type !== 'update-ticket' || payload.exp <= moment().unix() || !payload.identity ) {
			control.stop = true;
			return DrainData(req)
			.then(()=>{
				res.writeHead(401, {'Content-Type':'application/json'});
				res.write(JSON.stringify({
					scope: "global",
					error: {
						code: 401,
						message: "You're providing invalid access token!",
						errors:[{
							reason: "invalid_access_token",
							message: "You're providing invalid access token!"
						}]
					}
				}));
			});
		}
		
		
		let alg = accToken.header.alg, {content, signature} = accToken.raw;
		let secret = conf.secret ? JWT.Base64Url.decode(conf.secret) : crypto.randomBytes(64);
		let verified = JWT.verify(alg, content, signature, secret);
		if ( !verified ) {
			control.stop = true;
			return DrainData(req)
			.then(()=>{
				res.writeHead(401, {'Content-Type':'application/json'});
				res.write(JSON.stringify({
					scope: "global",
					error: {
						code: 401,
						message: "You're providing invalid access token!",
						errors:[{
							reason: "invalid_access_token",
							message: "You're providing invalid access token!"
						}]
					}
				}));
			});
		}
		
		
		
		control.session = accToken.payload;
	};
})();
