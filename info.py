import psutil
import json

def gatherInfo():
	info={
		'cpu': {
			'stats': psutil.cpu_stats()._asdict(),
			'times': []
		},
		'mem': {
			'main': psutil.virtual_memory()._asdict(),
			'swap': psutil.swap_memory()._asdict()
		},
		'disk': {},
		'bootTime': psutil.boot_time()
	}

	cpuInfo=psutil.cpu_times(True)
	for cpu in cpuInfo:
		info['cpu']['times'].append(cpu._asdict())
	
	info['cpu']['usage'] = psutil.cpu_percent(interval=1, percpu=True);

	try:
		diskInfo=psutil.disk_partitions(False)
		for disk in diskInfo:
			diskId=disk.device.split('/')[-1]
			info['disk'][diskId]={
				'path': disk.mountpoint,
				'fs': disk.fstype,
				'opts': disk.opts,
				'usage': psutil.disk_usage(disk.mountpoint)._asdict()
			}
	except:
		pass;

	# The following code segments may cause encoding exceptions in Windows environment
	'''
	netCounter=psutil.net_io_counters(True);
	info['network'] = {};
	for (key, counter) in netCounter.items():
		info['network'][key] = counter._asdict()
	
	info['process'] = [];
	for proc in psutil.process_iter():
		try:
			pInfo = proc.as_dict(attrs=['pid', 'ppid', 'name', 'username', 'memory_percent', 'cmdline', 'create_time'])
		except psutil.NoSuchProcess:
			pass
		else:
			info['process'].append(pInfo)
	'''

	return info

if __name__ == "__main__":
	info = gatherInfo()
	print json.dumps(info,separators=(',',':'))
