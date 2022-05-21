const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const port = process.argv[2] || 80;

const dataCollector = require('./dataCollector.js');



http.createServer(function (req, res) {
	console.log(`${req.method} ${req.url}`);

	// parse URL

	req.url = "/client" + req.url;
	if (req.url == "/client/") 
		req.url = "/client/index.html";
		
	const parsedUrl = url.parse(req.url);
	
	// extract URL path
	let pathname = `.${parsedUrl.pathname}`;
	// based on the URL path, extract the file extension. e.g. .js, .doc, ...
	const ext = path.parse(pathname).ext;
	
	// maps file extension to MIME typere
	const map = {
		'.ico': 'image/x-icon',
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.json': 'application/json',
		'.css': 'text/css',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.wav': 'audio/wav',
		'.mp3': 'audio/mpeg',
		'.svg': 'image/svg+xml',
		'.pdf': 'application/pdf',
		'.doc': 'application/msword'
	};
	
	//console.log(parsedUrl);
	

	fs.exists(pathname, function (exist) {
		console.log(pathname);
		if(pathname == "./client/api"){
			var query = querystring.parse(parsedUrl.query);
			
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			
			if (query.type === "getUser") {
				dataCollector.getUserData(query.username, res);
				//dataCollector.getUserData(query.username, res);
			} else if (query.type === "getMatches") {
				dataCollector.getMatchesData(query.puuid, res);
				
			} else if (query.type === "updateUser") {
				dataCollector.updateUserData(query.username, res);
				//res.end("not implemented...");
			} else if (query.type === "updateMatches") {
				dataCollector.updateMatchesData(query.puuid, res);
				
			} else if (query.type === "test") {
				
				
				
			} else if (query.type === "requests") {
				dataCollector.getRequestsCount(res);
			} else {
				res.end("Such query type does not exist!");
			}
			
			
			//summonerV4(query.username, res);
			//res.end(pog);
			//res.end(JSON.stringify(showUser(query.username)));
			return;
		}
			
		
		if(!exist) {
			// if the file is not found, return 404
			res.statusCode = 404;
			res.end(`File ${pathname} not found!`);
			return;
		}

		// if is a directory search for index file matching the extension
		//if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

		// read file from file system
		fs.readFile(pathname, function(err, data){
			if(err){
				res.statusCode = 500;
				res.end(`Error getting the file: ${err}.`);
			} else {
				// if the file is found, set Content-type and send data
				res.setHeader('Content-type', map[ext] || 'text/plain' );
				res.end(data);
			}
		});
	});


}).listen(parseInt(port));




console.log(`Server listening on port ${port}`);