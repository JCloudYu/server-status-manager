(()=>{
	"use strict";

	const mongo	= require( 'lib/mongo' );
	const tmpl	= require( './tmpl/tmpl' );
	
	
	module.exports = (control, chainData)=>{
		const {request:req, response:res, proxyRoot} = control.env;
		
		return __GET_SERVERS_INFO()
		.then((value)=>{
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write(tmpl.layout({
				proxyRoot,
				content: tmpl.page.dashboard(),
				init: ''+
`<script>
(()=>{
	"use strict";
	
	window.INPUT_DATA = ${JSON.stringify(value)};
	
	pipe([
		'${proxyRoot}/res/js/dashboard.js',
		()=>{ pump.fire( 'system-ready' ); }
	]);
})();
</script>`
			}));
		})
		.catch((err)=>{
			console.log(err);
		});
	};
	
	
	
	function __GET_SERVERS_INFO() {
		return mongo.inst.collection( 'latest' ).aggregate([
			{ $match:{}},
			{ $project:{
				_id:1, identity:1, time:1,
				cpu:"$state.cpu", mem:"$state.mem", disk:"$state.disk"
			}},
			{$sort:{init:-1}}
		]).toArray();
	}
})();
