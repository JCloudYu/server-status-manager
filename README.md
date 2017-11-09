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

## Build and Run
* Run project:
```bash
$ node entry --conf <config-json-file-name>
```
* Run project (for config.json):
```bash
$ npm run entry
```
* Run project for sample:
```bash
$ npm run entry_sample
```

## How to use
* Update:   
1. Headers set:  
    (1) Authorization = "bearer \<token-string\>"   
    (2) Content-Type = "application/json"
2. Body set your json content (use row)
3. **POST** localhost:8080

* Fetch:  
1. Headers set: Authorization = "bearer \<token-string\>"   
2. **GET** localhost:8080
