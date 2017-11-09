(()=>{
	"use strict";
	
	const config = require( 'json-cfg' ).trunk;
	const {MongoClient} = require( 'mongodb' );
	
	let __dbInst = null;
	module.exports = {
		init:()=>{
			return MongoClient
			.connect( config.conf.dbURI || 'mongodb://127.0.0.1:27017/r_states' )
			.then((db)=>{ __dbInst = db; });
		},
		get inst(){ return __dbInst; }
	}
})();
