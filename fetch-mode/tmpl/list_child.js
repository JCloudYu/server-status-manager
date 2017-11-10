const moment = require('moment');
const config = require( 'json-cfg' ).trunk;
const threshold = config.conf.threshold;

const now = moment().unix();

function bytesToSize(bytes) {
    
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

module.exports = function(params={}){

    let title = params.identity;

    // time
    let time = moment.unix(params.time).format('lll'),
        timeClass = (moment(now).diff(params.time) >= threshold.timeSec) ? 'out' : '';

    // cpu
    let cpuCount = params.cpu.times.length;

    // memory
    let {main: mem} = params.mem,
        memUsed = bytesToSize(mem.used),
        memTotal = bytesToSize(mem.total),
        memPercent = mem.percent,
        memClass = (mem.percent >= threshold.memPercent) ? 'out' : '';
    
    // disk
    let diskList = [];
    Object.keys(params.disk).sort().map(function(objKey, idx) {
        let {usage: val} = params.disk[objKey];
        diskList.push({
            'title': objKey,
            'used': bytesToSize(val.used),
            'total': bytesToSize(val.total),
            'percent': val.percent,
            'class': (val.percent >= threshold.diskPercent) ? 'out' : ''
        });
    });

    return `
<div class='block'>
    <h2 class='title' title=${title}>${title}</h2>
    <div class='time ${timeClass}'>${time}</div>
    <div class='cpu'>Cpu count: ${cpuCount}</div>
    <div class='mem ${memClass}'>Mem: ${memUsed} / ${memTotal} (${memPercent}%)</div>
    <div class='disks'>Disk: ${
        diskList.map(disk => 
            `<div class='disk ${disk.class}'>${disk.title}: ${disk.used} / ${disk.total} (${disk.percent}%)</div>`
        ).join('')
    }</div>
</div>
`;
};