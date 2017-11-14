const moment = require('moment');
const config = require( 'json-cfg' ).trunk;
const threshold = config.conf.threshold || {"timeSec": 300, "memPercent": 70, "diskPercent": 70};

const now = moment().unix();

function bytesToSize(bytes) {
    
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
};

module.exports = function(params={}){

    let dangerClass = 'text-danger',
        successClass = 'text-success';

    // time
    let time = moment.unix(params.time).format('YYYY/M/D ddd kk:mm:ss'),
        timeClass = (moment(now).diff(params.time) >= threshold.timeSec) ? dangerClass : 'text-primary';

    // cpu
    let cpuCount = params.cpu.times.length;

    // memory
    let {main: mem} = params.mem,
        memUsed = bytesToSize(mem.used),
        memTotal = bytesToSize(mem.total),
        memPercent = mem.percent,
        memClass = (mem.percent >= threshold.memPercent) ? dangerClass : successClass;
    
    // disk
    let diskList = [];
    Object.keys(params.disk).sort().map(function(objKey, idx) {
        let {usage: val} = params.disk[objKey];
        diskList.push({
            'no': idx + 1,
            'title': objKey,
            'used': bytesToSize(val.used),
            'total': bytesToSize(val.total),
            'percent': val.percent,
            'class': (val.percent >= threshold.diskPercent) ? dangerClass : successClass
        });
    });

    return `
<div class='card-text-row time'>
    <div class='center ${timeClass}'>${time}</div>
</div>
<div class='card-text-row cpu'>
    <div class='title left'># CPU Cnt:</div>
    <div class='content center'>${cpuCount}</div>
</div>
<div class='card-text-row mem'>
    <div class='title left'># Memory:</div>
    <div class='content right ${memClass}'>${memUsed} / ${memTotal} (${memPercent}%)</div>
</div>
<div class='disks'>
    <div class='title left'># Disks:</div>
    <div class='content'>${
        diskList.map(disk => 
            `<div class='card-text-row disk ${disk.class}'>
                <div class='title left'>(${disk.no}) ${disk.title}:</div>
                <div class='content right'>${disk.used} / ${disk.total} (${disk.percent}%)</div>
            </div>`
        ).join('')
    }</div>
</div>
`;
};