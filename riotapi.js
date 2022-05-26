const https = require('https');

var api_key = "RGAPI-b421ee20-69b1-40dd-b009-7d4d0e5fc0a2";

var gamesPerUpdate = 10;

/*
VIEW
0 requests

VIEW (if doesnt exists in db)
2 requests (profile, leagues)

UPDATE
2 requests (profile, leagues)
1 request (list of 10 matchIds)
10 requests (match-data)
= 13

*/

/*
RATE LIMITS
20 requests every 1 seconds(s)
100 requests every 2 minutes(s)
Note that rate limits are enforced per routing value (e.g., na1, euw1, americas).
*/
var rateLimitsPerSecond = 20;
var rateLimitPerTwoMinutes = 100;
var requests = 0;
var lastUpdate = 0;
// TODO (not mandatory atm)


module.exports = {
	getSummonerByName: function(name){
		//console.log(name);
		return RiotAPI_getSummonerByName(name);
		
	},
	getListOfMatchIds: function(puuid){
		return RiotAPI_getListOfMatchIds(puuid);
	},
	getMatchDetails: function(matchId){
		return RiotAPI_getMatchDetails(matchId);
	},
	getLeagueEntriesInAllQueues: function(id){
		return RiotAPI_getLeagueEntriesInAllQueues(id);
	},
	getRequestsCount: function(){
		return requests;
	}
}

async function RiotAPI_getSummonerByName(nameVar) {
	
	return new Promise ((resolve, reject) => {
		var url = encodeURI('/lol/summoner/v4/summoners/by-name/'+nameVar);
		requests++;
		const options = {
			hostname: 'eun1.api.riotgames.com',
			port: 443,
			path: url,
			method: 'GET',
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9,pl;q=0.86",
				"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
				'Origin': 'https://developer.riotgames.com',
				'Content-Type': 'application/json',
				'X-Riot-Token': api_key
			}
		};
		
		let req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`);

			res.on('data', d => {
				resolve(JSON.parse(d));
			});
		});

		req.on('error', error => {
			console.error(error);
			reject(error);
		});

		req.end();
	});
};

async function RiotAPI_getLeagueEntriesInAllQueues(id) {
	
	return new Promise ((resolve, reject) => {
		var url = encodeURI('/lol/league/v4/entries/by-summoner/'+id);
		requests++;
		const options = {
			hostname: 'eun1.api.riotgames.com',
			port: 443,
			path: url,
			method: 'GET',
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9,pl;q=0.86",
				"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
				'Origin': 'https://developer.riotgames.com',
				'Content-Type': 'application/json',
				'X-Riot-Token': api_key
			}
		};
		
		let req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`);
			
			res.on('data', d => {
				resolve(JSON.parse(d));
				
			});
		});

		req.on('error', error => {
			
			console.error(error);
			reject(error);
		});

		req.end();
	});

};


async function RiotAPI_getListOfMatchIds(puuid) {
	
	return new Promise ((resolve, reject) => {
		var url = encodeURI('/lol/match/v5/matches/by-puuid/'+puuid+'/ids?start=0&count='+gamesPerUpdate);
		requests++;
		const options = {
			hostname: 'europe.api.riotgames.com',
			port: 443,
			path: url,
			method: 'GET',
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9,pl;q=0.86",
				"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
				'Origin': 'https://developer.riotgames.com',
				'Content-Type': 'application/json',
				'X-Riot-Token': api_key
			}
		};
		
		let req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`);

			
			
			res.on('data', d => {
				resolve(JSON.parse(d));
				
			});
		});

		req.on('error', error => {
			
			console.error(error);
			reject(error);
		});

		req.end();
	});

};



async function RiotAPI_getMatchDetails(matchId) {
	
	return new Promise ((resolve, reject) => {
	
		var url = encodeURI('/lol/match/v5/matches/' + matchId);
		requests++;
		const options = {
			hostname: 'europe.api.riotgames.com',
			port: 443,
			path: url,
			method: 'GET',
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9,pl;q=0.86",
				"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
				'Origin': 'https://developer.riotgames.com',
				'Content-Type': 'application/json',
				'X-Riot-Token': api_key
			}
		};
		
		var req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`);
			
			var d = "";
			
			res.on('data', function(chunk) {
				d += chunk;
				
			}).on('end', function() {
				resolve(d);
				
			});
		});

		req.on('error', error => {
			console.error(error);
			reject(error);
		});

		req.end();
	});
};