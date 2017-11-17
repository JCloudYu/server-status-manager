/**
 * Project: server-status-manager
 * File: dashboard
 * Author: JCloudYu
 * Create Date: Nov. 17, 2017
 */
(() => {
	"use strict";
	
	module.exports = ()=>{
		return '' +
	`<main class='clearfix'>
		<nav id='main-nav'></nav>
		<div id='viewport' class='viewport clearfix'>
			<div id='info-container' class='server-item-container'></div>
		</div>
	</main>
	<script data-tpl="server-item" type='text/html'>
		<li class='server-item {{if !active}}inactive{{/if}}' data-rel='\${identity}'>
			<div class='server-id'>\${identity}</div>
			<div class='info-bar' data-inspect='cpu'>
				<div class='logo'><span class='oops-memory'></span></div>
				<div class='progress'><div class='bar'></div></div>
				<div class='percentage'>\${cpu_rate}</div>
			</div>
			<div class='info-bar' data-inspect='memory'>
				<div class='logo'><span class='oops-layers'></span></div>
				<div class='progress'><div class='bar'></div></div>
				<div class='percentage'>\${mem_rate}</div>
			</div>
			<div class='info-bar' data-inspect='disk'>
				<div class='logo'><span class='oops-storage'></span></div>
				<div class='progress'><div class='bar'></div></div>
				<div class='percentage'>\${disk_rate}</div>
			</div>
			<div class='update-time '>\${update_time}</div>
		</li>
	</script>`;
	};
})();
