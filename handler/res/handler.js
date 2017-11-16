/**
 * Project: server-status-manager
 * File: handler.js
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(() => {
	"use strict";
	
	const url = require( 'url' );
	const pitaya = require( 'pitayajs' );
	const config = require( 'json-cfg' ).trunk.conf;
	
	
	
	const MIME_MAP = {
		'js':	'application/javascript',
		'png':	'image/png',
		'jpg':	'image/jpeg',
		'jpeg':	'image/jpeg',
		'tiff':	'image/tiff',
		'tif':	'image/tiff',
		'css':	'text/css',
		'html':	'text/html',
		'htm':	'text/html',
		'lic':	'text/plain',
		'txt':	'text/plain',
		'json':	'application/json'
	};
	const _chain = pitaya.chain({
		handler:require('pitayajs/helper/http/file-req-handler'),
		paths:{
			nginx: config.http.paths.nginx || '/internal-rc',
			local: config.http.paths.local || './res'
		}
	});
	module.exports = (req, res, reqPath)=>{
		let {pathname:path} = url.parse(reqPath);
		let ext = path.lastIndexOf('.');
		ext = (ext > 0) ? path.substring(ext+1) : '';
		let resInfo = { path, contentType:MIME_MAP[ext] || 'application/octet-stream' };
		
		return _chain.trigger({ request:req, response:res }, resInfo);
	};
})();
