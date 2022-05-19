const https = require('https');
const sqlite3 = require('sqlite3').verbose();

const riotAPI = require('./riotapi.js');

db = null;

class Database {
	constructor(){
		// open the database
		this.db = new sqlite3.Database('./db/opgg.db', sqlite3.OPEN_READWRITE, (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  //console.log('[DB] Connected to the opgg database.');
		});
	}
	
	disconnect() {
		this.db.close((err) => {
		  if (err) {
			console.error(err.message);
		  }
		  //console.log('[DB] Close the database connection.');
		  this.db = null;
		});
	}
}

var api_key = "RGAPI-dcece7a5-5e50-42a2-ba6f-cd2b6f8276ca";

module.exports = {
	getUserData: function(name, oriRes){
		console.log(name);
		getSummonerPipe(name, oriRes);
		
	},
	updateUserData: function(name, oriRes){
		updateUser(name, oriRes);
		
	},
	updateMatchesData: function(puuid, oriRes) {
		matchListPipe(puuid, oriRes);
		
		
	},
	getMatchesData: function(puuid, oriRes){
		getMatches(puuid, oriRes);
	},
	getRequestsCount: function(oriRes){
		oriRes.write(riotAPI.getRequestsCount().toString());
		oriRes.end();
	}
}

async function saveUserDataToDB(data) {
	
	return new Promise(function(resolve,reject){
		db.run('INSERT or REPLACE INTO summoner(id, accountId, puuid, name, profileIconId, revisionDate, summonerLevel, leagueEntries) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [data.id, data.accountId, data.puuid, data.name, data.profileIconId, data.revisionDate, data.summonerLevel, data.leagueEntries], (err) => {
				if(err) {
					return reject("[saveUserDataToDB] " + err.message); 
				}
				console.log('Row was added to the table: ${this.lastID}');
				resolve(true);
		});
	});
};


async function getUserDataFromDB(name){
	
    return new Promise(function(resolve,reject){
        db.all('SELECT *, COUNT(name) as res FROM summoner WHERE name=?', [name], (err, rows) => {
           if(err){console.log(name); return reject("[getUserDataFromDB] " + err.message);}
           resolve(rows[0]);
         });
    });
}
/* GET SUMMONER INFO / ADD NEW USER */
async function getSummonerPipe(name, oriRes) {
	try {
		dbInst = new Database(); db = dbInst.db;
		console.log("Pulling data from local db");
		
		var user = null;
		
		user = await getUserDataFromDB(name);
		
		console.log("USER return: " + user.res);
		if(user.res == 0) {
			//download
			const d = await riotAPI.getSummonerByName(name);
			//console.log(d);
			if(!d.hasOwnProperty('status')){
				const l = await riotAPI.getLeagueEntriesInAllQueues(d.id);
				d.leagueEntries = JSON.stringify(l);
				await saveUserDataToDB(d);
				oriRes.write(JSON.stringify(d));
				oriRes.end();
				
			} else {
				oriRes.end("USER_DEOS_NOT_EXISTS");
			}
		} else if (user.res == 1) {
			console.log("Username found in local db!");
			oriRes.write(JSON.stringify(user));
			oriRes.end();
			
		} else {
			console.log("Error");
			oriRes.end("Error");
		}
		
		
		db = null; dbInst.disconnect();
	} catch (error) {
		console.log(error);
	}
}

/* UPDATE USER */

async function updateUser(name, oriRes){
	try {
		dbInst = new Database(); db = dbInst.db;
		const d = await riotAPI.getSummonerByName(name);
		const l = await riotAPI.getLeagueEntriesInAllQueues(d.id);
		d.leagueEntries = JSON.stringify(l);
		if(d.name){
			await saveUserDataToDB(d);
			oriRes.end();
		} else {
			oriRes.end("User does not exists in Riot Database, or API is broken :)");
		}
		db = null; dbInst.disconnect();
	} catch (error) {
		console.log(error);
	}
}


/* GET MATCHES */

async function getMatchesFromDB(puuid){
	
    return new Promise(function(resolve,reject){
        db.all('SELECT match.matchId, match.data FROM match INNER JOIN matches on matches.matchId = match.matchId WHERE matches.puuid=?', [puuid], (err, rows) => {
           if(err){console.log(name); return reject("[getMatchesFromDB] " + err.message);}
		   var allData = [];
		   rows.forEach( row => {
				allData.push({matchId: row.matchId, data: JSON.parse(row.data)});
				
			});
			resolve(allData);
         });
    });
}

async function getMatches(puuid, oriRes){
	try {
		dbInst = new Database(); db = dbInst.db;
		var allData = [];
		allData = await getMatchesFromDB(puuid);
		console.log(allData.length);
		if(allData.length == 0){
			oriRes.write("NO_MATCHES");
		} else {
			oriRes.write(JSON.stringify(allData));
		}
		oriRes.end();
		db = null; dbInst.disconnect();
	} catch (error) {
		console.log(error);
	}
}


/* ---------------UPDATE MATCHES-----------*/


function chunkString(str, length) {
	return new Promise ((resolve) => {
		const chunked = str.match(new RegExp('.{1,' + length + '}', 'g'));
		resolve(chunked);
	});
}

async function matchListPipe(puuid, oriRes){
	try {
		dbInst = new Database(); db = dbInst.db;
		console.log("[Pipe1][1]Downloading list of match ids for "+puuid+"...");
		const obj = await riotAPI.getListOfMatchIds(puuid);
		console.log("[Pipe1][1]Done");
		console.log(obj);
		if(!obj.hasOwnProperty('status')){
			for (const element of obj) {
				console.log("[Pipe1]["+element+"]Adding match id to DB");
				await db.run('INSERT or REPLACE INTO matches(puuid, matchId) VALUES(?, ?)', [puuid, element]);
				console.log("[Pipe1]["+element+"]Done");
				console.log("[Pipe1]["+element+"] starting download Pipe");
				await matchDownloadPipe(element);
				console.log("[Pipe1]["+element+"] pipe completed");
			};
		} else {
			console.log("[MATCH_LIST_PIPE] Error");
		}
		
		console.log("[MATCH_LIST_PIPE] All tasks done!");
		oriRes.end();
		
		db = null; dbInst.disconnect();
	} catch (error) {
		console.log(error);
	}
}

async function matchDownloadPipe(matchId) {
	try {
		//dbInst = new Database(); db = dbInst.db;
		
		console.log("[MATCH_DATA_PIPE] Downloading game " + matchId + "...");
		const d = await riotAPI.getMatchDetails(matchId);
		console.log("[MATCH_DATA_PIPE] [" + matchId + "] Done");
		
		console.log("[MATCH_DATA_PIPE] ["+matchId+"] Saving match data to db");
		await db.run('INSERT or REPLACE INTO match(matchId, data) VALUES(?, ?)', [matchId, d]);
		
		console.log("[MATCH_DATA_PIPE] [" + matchId + "] Saved");
		
		//db = null; dbInst.disconnect();
	} catch (error) {
		console.log(error);
	}
}