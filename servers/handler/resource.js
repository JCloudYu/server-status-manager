(()=>{
	"use strict";
	
	const fs = require( 'fs' );
	
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
	
	let resource = module.exports = (control, result)=>{
		const {request:req, response:res} = control.env;
	
		let filePath = control.env.remainder;
		try {
			let fStat = fs.statSync(filePath);
			if ( !fStat.isFile() ) {
				throw "No a file!";
			}
			
			let ext = filePath.lastIndexOf('.');
			ext = (ext > 0) ? filePath.substring(ext+1) : '';
			res.writeHead( 200, {
				'Content-Type': MIME_MAP[ext] || 'application/octet-stream',
				'Content-Length': fStat.size
			});
			
			let stream = fs.createReadStream(filePath);
			return new Promise((fulfill)=>{
				stream.pipe(res);
				stream.on( 'end', fulfill );
			});
		
		}
		catch(e) {
			control.next = require( 'servers/json' );
			
			return {
				scope: "global",
				error: {
					code: 404,
					message: "File doesn't exist!",
					errors:[{
						reason: "resource_not_found",
						message: "File doesn't exist!"
					}]
				}
			};
		}
	};
})();
