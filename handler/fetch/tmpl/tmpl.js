/**
 * Project: server-status-manager
 * File: tmpl
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(() => {
	"use strict";
	
	module.exports = {
		layout: require( './layout' ),
		page: {
			dashboard: require( './dashboard' )
		}
	};
})();
