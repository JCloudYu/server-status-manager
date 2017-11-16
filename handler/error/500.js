/**
 * Project: server-status-manager
 * File: 500.js
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(() => {
	"use strict";
	
	module.exports = (req, res, serveHTML=true)=>{
		if ( serveHTML ) {
			res.writeHead( 500, { 'Content-Type': 'text/html' });
			res.write(HTML500());
		}
		else {
			res.writeHead( 500, { 'Content-Type': 'text/plain' });
			res.write('Internal Server Error!');
		}
		res.end();
	};
	
	
	
	function HTML500() {
		return '' +
`<!DOCTYPE html>
<html>
	<head>
		<link type='text/css' rel='stylesheet' href='//res.purimize.com/lib/css/oops.min.css' />
		<style>
			body {font-size:16px;}
			main { width:100vw; height:100vh; }
			.error {font-size:3em; font-weight:bolder; color:#000;}
		</style>
	</head>
	<body>
		<main class='v-center t-center'>
			<div class='error'>Oops 500!<br>Please contact system administrator!</div>
		</main>
	</body>
</html>
`;
	}
})();
