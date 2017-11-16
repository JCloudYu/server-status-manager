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
			require( './update-token' ),
			require( './update' )
		]
	});
	module.exports = (req, res, reqPath)=>{
		return _chain.trigger({
			request:req, response:res
		});
	};
})();
