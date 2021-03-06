(()=>{
	"use strict";

	
	module.exports = (variables={})=>{
		let {proxyRoot='', content='', init=''} = variables;
	
		let header = [
			`<meta charset="UTF-8">`,
			`<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
			
			`<script src='//res.purimize.com/lib/js/jquery/jquery.min.js'></script>`,
			`<script src='//res.purimize.com/lib/js/jquery/jquery.tmpl.min.js'></script>`,
			`<script src='//res.purimize.com/lib/js/moment/moment.min.js'></script>`,
			`<script src='//res.purimize.com/lib/js/pump.min.js'></script>`,
			`<script src='//res.purimize.com/lib/js/pipe.min.js'></script>`,
			
			`<link type='text/css' rel='stylesheet' href='//res.purimize.com/lib/css/oops.glyphicons-material.min.css' />`,
			`<link type='text/css' rel='stylesheet' href='//res.purimize.com/lib/css/oops.min.css' />`,
			`<link type='text/css' rel='stylesheet' href='${proxyRoot}/res/css/style.css' />`
		].join( '' );
		
		return `<!DOCTYPE html><html lang="en"><head>${header}</head><body><div class='bg'></div>${content}${init}</body></html>`;
	};
})();
