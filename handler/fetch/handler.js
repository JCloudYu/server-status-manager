/**
 * Project: server-status-manager
 * File: handler.js
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(() => {
	"use strict";
	
	const pitaya = require( 'pitayajs' );
	
	const _chain = pitaya.chain({
		handler:[
			require( './fetch-token' ),
			require( './fetch' )
		]
	});
	module.exports = (req, res, reqPath)=>{
		let forwardedURI  = req.headers[ 'x-forwarded-uri' ] || req.url;
		let proxyRoot = forwardedURI.substring(0, forwardedURI.length - req.url.length);
	
		return _chain.trigger({ request:req, response:res, proxyRoot });
	};
})();
