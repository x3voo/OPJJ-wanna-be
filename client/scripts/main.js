var user = document.getElementById("username");
var response = document.getElementById("response");
var matches = document.getElementById("matches");

var currentUserName;
var currentUserPuuid;

function showUser() {
	var url = "http://localhost/api?username="+ user.value +"&type=getUser";
	fetch(url)
		.then(response => response.text())
		.then((data) => {
			if(data == "USER_DEOS_NOT_EXISTS") {
				response.innerHTML = "<br> Summoner <b>" + user.value + "</b> doesn't exists.";
			} else {
				obj = JSON.parse(data);
				console.log(obj);
				var league = JSON.parse(obj.leagueEntries);
				response.innerHTML = "<b>" + obj.name + "</b><br>ID:" + obj.id + "<br>Account ID: " + obj.accountId + "<br>puuid: " + obj.puuid + "<br>Profile icon ID: " + obj.profileIconId + "<br> Revision Date: " + obj.revisionDate + "<br>Level: " + obj.summonerLevel + "<br>"+league[0].queueType+": " + league[0].tier + " " + league[0].rank + "<br>"+league[1].queueType+": " + league[1].tier + " " + league[1].rank;
				
				currentUserName = obj.name;
				currentUserPuuid = obj.puuid;
				
				showMatches(obj.puuid);
			}
	})
	
	
}
var temp;

function showMatches(puuid) {
	var url = "http://localhost/api?puuid="+ puuid +"&type=getMatches";
	fetch(url)
		.then(response => response.text())
		.then((data) => {
			matches.innerHTML = "";
			if(data == "NO_MATCHES"){
				matches.innerHTML = "<br>No matches found. Try updating";
			} else {
				obj = JSON.parse(data);
				//console.log(obj);
				var details;
				obj.forEach(match => {
					temp = match;
					matches.innerHTML += "<br>["+match.matchId+"]" + match.data.info.gameMode;
					
				});
			}
			
			
	})
}

function updateUser() {
	var url = "http://localhost/api?username="+ currentUserName +"&type=updateUser";
	fetch(url)
		.then(response => response.text())
		.then((data) => {
			updateMatches();
	})
}

function updateMatches() {
	var url = "http://localhost/api?puuid="+ currentUserPuuid +"&type=updateMatches";
	fetch(url)
		.then(response => response.text())
		.then((data) => {
			showUser();
	})
}

/*

function test() {
	var url = "http://localhost/api?username="+ user.value +"&type=test";
	fetch(url)
		.then(response => response.text())
		.then((data) => {
			console.log(data);
			})
}


function promiseProg(){
	function downloadThis
}



*/
