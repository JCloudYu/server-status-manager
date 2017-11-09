# Server Status Manager #

## Install
* Clone project:
```bash 
$ git clone [project url]
```
* Install dependency package:
```bash
$ npm install
```

## Build and Run
* Run project:
```bash
$ node entry --conf [config json file name]
```
* Run project for sample:
```bash
$ npm run entry_sample
```

## How to use
* Update   
POST localhost:8080   
(Header set: "Authorization: bearer [token string]")

* Fetch  
GET localhost:8080   
(Header set: "Authorization: bearer [token string]")


<style>*{text-align:justify;}body{font-size:16px;}pre{tab-size:4;}.note{font-size:0.8em;}.bold{font-weight:bold;}.italic{font-style:italic;}</style>