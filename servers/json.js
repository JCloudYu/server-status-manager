(()=>{
	"use strict";
	
	let handler = module.exports = (control, result)=>{
		const {request:req, response:res} = control.env;
		res.writeHead( 200, { 'Content-Type' : 'application/json' } );
		res.write(JSON.stringify(result));
		res.end();
	};
})();
