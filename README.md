# Server Status Manager #

## Install
* Clone project:
```bash 
$ git clone <project-url>
```
* Install dependency package:
```bash
$ npm install
```

## Update status info to remote
* Run updater (use your own config json file):
```bash
$ node regular.js --conf <config-json-file-name>
```
* Run updater (use config.json):
```bash
$ npm run regular
```
* Run updater (use config.default.json):
```bash
$ npm run regular_default
```

## Build and Run
* Run management (use your own config json file):
```bash
$ node entry.js --conf <config-json-file-name>
```
* Run management (use config.json):
```bash
$ npm run entry
```
* Run management (use config.default.json):
```bash
$ npm run entry_default
```

## How to use
* Update:   
1. Headers set:  
    (1) Authorization = "bearer \<token-jwt-string\>"   
    (2) Content-Type = "application/json"
2. Body set your json content (use row)
3. **POST** localhost:8080

* Fetch:  
1. Headers set: Authorization = "bearer \<token-jwt-string\>"   
2. **GET** localhost:8080
