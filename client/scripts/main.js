var localhost = "localhost"; // "192.168.1.48"

var user = document.getElementById("username");
var response = document.getElementById("response");
var matches = document.getElementById("matches");

var currentUserName;
var currentUserPuuid;


var retrivingState = false;
var updatingState = false;

function run(){
	user = document.getElementById("username");
	response = document.getElementById("response");
	matches = document.getElementById("matches");
	document.getElementById("get").addEventListener("click", () => getUserData(user.value));
	document.getElementById("update").addEventListener("click", () => updateUserDataCheck());
}


function favorite(){
	// TODO
}

var tempData;
var tempMatches;

function updateProfile(summonerData, summonerMatchData) {
	
	console.log(summonerData);
	
	tempData = summonerData;
	tempMatches = summonerMatchData;
	
	
	
	if(summonerData == "USER_DEOS_NOT_EXISTS") {
		response.innerHTML = "<br> Summoner <b>" + user.value + "</b> doesn't exists.";
	} else {
		var league = JSON.parse(summonerData.leagueEntries);
		/*
		response.innerHTML = "<b>" + summonerData.name + "</b><br>ID:" + summonerData.id + "<br>Account ID: " + summonerData.accountId + "<br>puuid: " + summonerData.puuid + "<br>Profile icon ID: " + summonerData.profileIconId + "<br> Revision Date: " + summonerData.revisionDate + "<br>Level: " + summonerData.summonerLevel + "<br>"+league[0].queueType+": " + league[0].tier + " " + league[0].rank + "<br>"+league[1].queueType+": " + league[1].tier + " " + league[1].rank;
		
		
		*/
		// PROFILE ICON
		document.getElementById("profileIconId").src = "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/profileicon/" + summonerData.profileIconId + ".png";
		document.getElementById("summonerLevel").innerHTML = summonerData.summonerLevel;
		
		// INFO
		document.getElementById("name").innerHTML = summonerData.name;
		
		// RANKED SOLO
		league.forEach(l => {
			if(l.queueType == "RANKED_SOLO_5x5") {
				document.getElementById("isRankedSoloSpan").style.display = "none";
				document.getElementById("isRankedSoloInfo").style.display = "flex";
				
				document.getElementById("tierIcon-solo").src = "../assets/images/emblems/" + l.tier + ".png";
				document.getElementById("tierIcon-solo").alt = l.tier;
				
				document.getElementById("tier-solo").innerHTML = l.tier.toLowerCase() + " " + romanToNumeral(l.rank);
				document.getElementById("leaguePoints-solo").innerHTML = l.leaguePoints + " LP";
				document.getElementById("win-lose-solo").innerHTML = "<div>" + l.wins + "W " + l.losses + "L</div>Win Ratio " + (Math.round((l.wins*100)/(l.wins + l.losses))) + "%";
			} else if(l.queueType == "RANKED_FLEX_SR") {
				document.getElementById("isRankedFlexSpan").style.display = "none";
				document.getElementById("isRankedFlexInfo").style.display = "flex";
				
				document.getElementById("tierIcon-flex").src = "../assets/images/emblems/" + l.tier + ".png";
				document.getElementById("tierIcon-flex").alt = l.tier;
				
				document.getElementById("tier-flex").innerHTML = l.tier.toLowerCase() + " " + romanToNumeral(l.rank);
				document.getElementById("leaguePoints-flex").innerHTML = l.leaguePoints + " LP";
				document.getElementById("win-lose-flex").innerHTML = "<div>" + l.wins + "W " + l.losses + "L</div>Win Ratio " + (Math.round((l.wins*100)/(l.wins + l.losses))) + "%";
			}
		});
		matches.innerHTML = "";
	
		if(summonerMatchData == "NO_MATCHES"){
			matches.innerHTML = "<br>No matches found. Try updating";
		} else {
			championPool = generateSummonerStatistics(tempMatches,currentUserPuuid);
			
			championPool.sort((a, b) => parseFloat(b.gamesPlayed) - parseFloat(a.gamesPlayed));
			//tu teraz
			
			var championStatsPreview = document.getElementById("championStatsPreview");
			
			championStatsPreview.innerHTML = ""; //Clear
			
			championPool.forEach(c => {
				championStatsPreview.appendChild(createChampionBox(c));
				
			});
			
			var more = document.createElement('p');
			more.classList.add("more");
			more.innerHTML = "";
			//more.href = ""; //TODO
			championStatsPreview.appendChild(more);
			
			var matchList = document.getElementById("matchList");
			
			matchList.innerHTML = ""; //Clear
			
			summonerMatchData.forEach(match => {
				var userStats;
				match.data.info.participants.forEach(p => {
					if(p.puuid == currentUserPuuid) {
						userStats = p;
					}
				});
				
				var matchListLi = document.createElement("li");
				matchListLi.classList.add("match-list-li");
				
				matchListLi.appendChild(createMatchSummaryBlock(match, userStats));
				
				matchList.appendChild(matchListLi);
				
				temp = match;
				//matches.innerHTML += "<br>["+match.matchId+"]" + match.data.info.gameMode;
				
			});
		}
	}
	

}

function createMatchSummaryBlock(m, user){
	var match = m.data.info;
	
	var matchSummaryBlock = document.createElement("div");
	matchSummaryBlock.classList.add("match-summary-block");
	if(user['win'] == false){
		matchSummaryBlock.classList.add("lose-con");
	}
	
	
	var game = document.createElement("div");
	game.classList.add("game");
	var info = document.createElement("div");
	info.classList.add("info");
	var participants = document.createElement("div");
	participants.classList.add("participants");
	var action = document.createElement("div");
	action.classList.add("action");
	
	//GAME
	var type = document.createElement("div");
	type.classList.add("type");
	type.innerHTML = queueType(match.queueId);
	var timeStamp = document.createElement("div");
	timeStamp.classList.add("time-stamp");
	timeStamp.innerHTML = ""; //TODO
	var bar = document.createElement("div");
	bar.classList.add("bar");
	var result = document.createElement("div");
	result.classList.add("result");
	if(user.win == true){
		result.innerHTML = "Victory";
	} else {
		result.innerHTML = "Defeat";
	}
	var length = document.createElement("div");
	length.classList.add("length");
	length.innerHTML = Math.floor(match['gameDuration']/60)+"m "+(match['gameDuration']%60)+"s";
	
	game.appendChild(type);
	game.appendChild(timeStamp);
	game.appendChild(bar);
	game.appendChild(result);
	game.appendChild(length);
	
	//INFO
	var infoDiv1 = document.createElement("div");
	
		//champion
	var champion = document.createElement("div");
	champion.classList.add("champion");
	
	var icon = document.createElement("div");
	icon.classList.add("icon");
	var imgIcon = document.createElement("img");
	imgIcon.width = "48";
	imgIcon.alt = user['championName'];
	imgIcon.src = "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/"+user['championName']+".png";
	icon.appendChild(imgIcon);
	
	var spells = document.createElement("div");
	spells.classList.add("spells");
	var spell1 = document.createElement("div");
	spell1.classList.add("spell");
	var imgSpellIcon1 = document.createElement("img");
	imgSpellIcon1.width = "22";
	imgSpellIcon1.alt = ""; // ehh pozniej
	imgSpellIcon1.src = "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/"+summonerSpell(user['summoner1Id'])+".png";
	spell1.appendChild(imgSpellIcon1);
	var spell2 = document.createElement("div");
	spell2.classList.add("spell");
	var imgSpellIcon2 = document.createElement("img");
	imgSpellIcon2.width = "22";
	imgSpellIcon2.alt = ""; // ehh pozniej
	imgSpellIcon2.src = "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/spell/"+summonerSpell(user['summoner2Id'])+".png";
	spell2.appendChild(imgSpellIcon2);
	spells.appendChild(spell1);
	spells.appendChild(spell2);
	
	var runes = document.createElement("div");
	runes.classList.add("runes");
	var rune1 = document.createElement("div");
	rune1.classList.add("rune");
	var imgRuneIcon1 = document.createElement("img");
	imgRuneIcon1.width = "22";
	imgRuneIcon1.alt = ""; // ehh pozniej
	imgRuneIcon1.src = "https://ddragon.leagueoflegends.com/cdn/img/"+getPerkStyle(user['perks']['styles'][0]['style']);
	rune1.appendChild(imgRuneIcon1);
	var rune2 = document.createElement("div");
	rune2.classList.add("rune");
	var imgRuneIcon2 = document.createElement("img");
	imgRuneIcon2.width = "22";
	imgRuneIcon2.alt = ""; // ehh pozniej
	imgRuneIcon2.src = "https://ddragon.leagueoflegends.com/cdn/img/"+getPerkStyle(user['perks']['styles'][1]['style']);
	rune2.appendChild(imgRuneIcon2);
	runes.appendChild(rune1);
	runes.appendChild(rune2);
	
	
	champion.appendChild(icon);
	champion.appendChild(spells);
	champion.appendChild(runes);
	
		//kda
	var kda = document.createElement("div");
	kda.classList.add("kda");
	
	var kdaNum = document.createElement("div");
	kdaNum.classList.add("k-d-a");
	kdaNum.innerHTML = '<span>'+user['kills']+'</span> / <span class="d">'+user['deaths']+'</span> / <span>'+user['assists']+'</span>';
	
	var ratio = document.createElement("div");
	ratio.classList.add("ratio");
	if(user['deaths'] == 0){
		ratio.innerHTML = "Perfect"
	} else {
		ratio.innerHTML = Math.round((user['kills']+user['assists'])/user['deaths'],2)+":1 KDA";
	}
	
	
	kda.appendChild(kdaNum);
	kda.appendChild(ratio);
	
		//stats
	var stats = document.createElement("div");
	stats.classList.add("stats");
	
	var pKills = document.createElement("div");
	pKills.classList.add("p-kill");
	var team = match.teams;
	var userTeam = team.find(e => e['teamId'] == user['teamId']);
	var pKillsRatio;
	if(userTeam['objectives']['champion']['kills'] == 0){
		pKillsRatio = 0;
	}else {
		pKillsRatio = Math.round(((user['kills']+user['assists'])*100)/userTeam['objectives']['champion']['kills']);
	}
	
	pKills.innerHTML = "P/Kill "+pKillsRatio+"%";
	
	var ward = document.createElement("div");
	ward.classList.add("ward");
	ward.innerHTML = "Control Ward "+user['visionWardsBoughtInGame'];
	
	var cs = document.createElement("div");
	cs.classList.add("cs");
	var creepScore = user['totalMinionsKilled'] + user['neutralMinionsKilled'];
	var avgCreepScorePreMin = Math.round(creepScore/(Math.round(user['timePlayed']/60)), 1);
	
	cs.innerHTML = "CS "+creepScore+" ("+avgCreepScorePreMin+")";
	
	var averageTier = document.createElement("div");
	averageTier.classList.add("average-tier");
	averageTier.innerHTML = ""; //to much info needed
	
	stats.appendChild(pKills);
	stats.appendChild(ward);
	stats.appendChild(cs);
	stats.appendChild(averageTier);

	
	infoDiv1.appendChild(champion);
	infoDiv1.appendChild(kda);
	infoDiv1.appendChild(stats);

	
	var infoDiv2 = document.createElement("div");
	
		//items
	var items = document.createElement("div");
	items.classList.add("items");
	
	var ul = document.createElement("ul");
	var li;
	var itemImg;
	for(var i = 0; i <= 5; i++){
		li = document.createElement("li");
		if(user['item'+i] != 0){
			itemImg = document.createElement("img");
			itemImg.width = "22";
			itemImg.alt = ""; // ehh pozniej
			itemImg.src = "https://ddragon.leagueoflegends.com/cdn/12.9.1/img/item/"+user['item'+i]+".png";
			li.appendChild(itemImg);
		}
		ul.appendChild(li);
	}
	var ward = document.createElement("div");
	ward.classList.add("ward");
	itemImg = document.createElement("img");
	itemImg.width = "22";
	itemImg.alt = ""; // ehh pozniej
	itemImg.src = "https://ddragon.leagueoflegends.com/cdn/12.9.1/img/item/"+user['item6']+".png";
	ward.appendChild(itemImg);
	
	items.appendChild(ul);
	items.appendChild(ward);
	
	
	infoDiv2.appendChild(items);
	
	var multiKill = document.createElement("div");
	multiKill.classList.add("multi-kill");
	if(user['pentaKills'] > 0){
		multiKill.innerHTML = "Penta Kill";
		infoDiv2.appendChild(multiKill);
	} else if(user['quadraKills'] > 0) {
		multiKill.innerHTML = "Quadra Kill";
		infoDiv2.appendChild(multiKill);
	} else if(user['tripleKills'] > 0) {
		multiKill.innerHTML = "Triple Kill";
		infoDiv2.appendChild(multiKill);
	} else if(user['doubleKills'] > 0) {
		multiKill.innerHTML = "Double Kill";
		infoDiv2.appendChild(multiKill);
	}
	
	info.appendChild(infoDiv1);
	info.appendChild(infoDiv2);
	
	//PARTICIPANTS
		//team1
		var ul = document.createElement("ul");
		var li, icon, name;
		match.participants.forEach(p => {
			if(p['teamId'] == 100){
				li = document.createElement("li");
				if(p['puuid'] == user['puuid']){
					li.classList.add("participant-li-user");//TODO2
				} else {
					li.classList.add("participant-li");//TODO
				}
				icon = document.createElement("div");
				icon.classList.add("icon");
				
				pIcon = document.createElement("img");
				pIcon.width = "16";
				pIcon.alt = ""; // ehh pozniej
				pIcon.src = "https://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/"+p['championName']+".png";
				
				icon.appendChild(pIcon);
				
				name = document.createElement("div");
				name.classList.add("name");
				name.innerHTML = p['summonerName'];
				
				li.appendChild(icon);
				li.appendChild(name);
				ul.appendChild(li);
			}
		});
		
		participants.appendChild(ul);
		//team2
		var ul = document.createElement("ul");
		var li, icon, name;
		match.participants.forEach(p => {
			if(p['teamId'] == 200){
				li = document.createElement("li");
				if(p['puuid'] == user['puuid']){
					li.classList.add("participant-li-user");//TODO2
				} else {
					li.classList.add("participant-li");//TODO
				}
				icon = document.createElement("div");
				icon.classList.add("icon");
				
				pIcon = document.createElement("img");
				pIcon.width = "16";
				pIcon.alt = ""; // ehh pozniej
				pIcon.src = "https://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/"+p['championName']+".png";
				
				icon.appendChild(pIcon);
				
				name = document.createElement("div");
				name.classList.add("name");
				name.innerHTML = p['summonerName'];
				
				li.appendChild(icon);
				li.appendChild(name);
				ul.appendChild(li);
			}
		});
		
		participants.appendChild(ul);
	
	//ACTION
	var detail = document.createElement("button");
	detail.classList.add("detail");
	detail.innerHTML = "";
	
	action.appendChild(detail);
	
	matchSummaryBlock.appendChild(game);
	matchSummaryBlock.appendChild(info);
	matchSummaryBlock.appendChild(participants);
	matchSummaryBlock.appendChild(action);
	
	return matchSummaryBlock;
}

function createChampionBox(champion){
	var face = document.createElement("div");
	face.classList.add("face");
	var img = document.createElement("img");
	img.width = "32";
	img.alt = champion['champion'];
	img.src = "http://ddragon.leagueoflegends.com/cdn/12.9.1/img/champion/"+champion['champion']+".png";
	face.appendChild(img);
	
	var info = document.createElement("div");
	info.classList.add("info");
	var name = document.createElement("div");
	name.classList.add("name");
	name.innerHTML = champion['champion'];
	info.appendChild(name);
	var cs = document.createElement("div");
	cs.classList.add("cs");
	cs.innerHTML = "CS "+champion['avgCreepScore']+" ("+champion['avgCreepScorePreMin']+")";
	info.appendChild(cs);
	
	var kda = document.createElement("div");
	kda.classList.add("kda");
	var div = document.createElement("div");
	div.style.position = "relative";
	var kdaValue = document.createElement("div");
	kdaValue.classList.add("kda-value");
	kdaValue.innerHTML = champion['avgKDA']+":1 KDA";
	div.appendChild(kdaValue);
	kda.appendChild(div);
	var detail = document.createElement("div");
	detail.classList.add("detail");
	detail.innerHTML = champion['avgKills']+" / "+champion['avgDeaths']+" / "+champion['avgAssists'];
	kda.appendChild(detail);
	
	var played = document.createElement("div");
	played.classList.add("played");
	var div = document.createElement("div");
	div.style.position = "relative";
	var playedValue = document.createElement("div");
	playedValue.classList.add("played-value");
	playedValue.innerHTML = champion['winRate']+"%";
	div.appendChild(playedValue);
	played.appendChild(div);
	var count = document.createElement("div");
	count.classList.add("count");
	count.innerHTML = champion['gamesPlayed']+" Played";
	played.appendChild(count);
	
	var championBox = document.createElement("div");
	championBox.classList.add("champion-box");
	championBox.appendChild(face);
	championBox.appendChild(info);
	championBox.appendChild(kda);
	championBox.appendChild(played);
	
	return championBox;
};

var championPool = [];

function generateSummonerStatistics(matches, puuid){
	
	championPool = []; //Clear
	
	var gameTemp;
	matches.forEach(match => {
		match.data.info.participants.forEach(p => {
			if(p.puuid == puuid) {
				gameTemp = championPool.find(e => e['champion'] == p.championName);
				
				if(gameTemp == null) {
					gameTemp = createNewChampionStat(p.championName);
					
					championPool.push(gameTemp);
				}
				
				gameTemp['killsTotal'] += p.kills;
				gameTemp['deathsTotal'] += p.deaths;
				gameTemp['assistsTotal'] += p.assists;
				if(p.win == true) {
					gameTemp['gamesWon'] += 1;
				} else {
					gameTemp['gamesLoss'] += 1;
				}
				gameTemp['creepScoreTotal'] += p.totalMinionsKilled + p.neutralMinionsKilled;
				gameTemp['creepScorePerMinTotal'] += Math.round((p.totalMinionsKilled + p.neutralMinionsKilled)/Math.round(p.timePlayed/60), 1);
				gameTemp['goldTotal'] += p.goldEarned;
				gameTemp['damageDealtTotal'] += p.totalDamageDealt;
				gameTemp['damageTakenTotal'] += p.totalDamageTaken;
				
				gameTemp['doubleKills'] += p.doubleKills;
				gameTemp['tripleKills'] += p.tripleKills;
				gameTemp['quadraKills'] += p.quadraKills;
				gameTemp['pentaKills'] += p.pentaKills;
				
				if(p.kills > gameTemp['maxKills']) {
					gameTemp['maxKills'] = p.kills;
				}
				if(p.deaths > gameTemp['maxDeaths']) {
					gameTemp['maxDeaths'] = p.deaths;
				}
				if(p.assists > gameTemp['maxAssists']) {
					gameTemp['maxAssists'] = p.assists;
				}
				gameTemp['timePlayedTotal'] += p.timePlayed;
			}
		});
	});
	
	
	championPool.forEach(c => {
		var totalGames = c['gamesWon'] + c['gamesLoss'];
		c['avgKills'] = Math.round(c['killsTotal']/totalGames, 1);
		c['avgDeaths'] = Math.round(c['deathsTotal']/totalGames, 1);
		c['avgAssists'] = Math.round(c['assistsTotal']/totalGames, 1);
		if(c['avgDeaths'] == 0){
			c['avgKDA'] = "Perfect"
		} else {
			c['avgKDA'] = Math.round((c['avgKills'] + c['avgAssists']) / c['avgDeaths'], 2);
		}
		
		c['winRate'] = Math.round((c['gamesWon'] * 100) / totalGames);
		c['gamesPlayed'] = totalGames;
		c['avgCreepScore'] = Math.round(c['creepScoreTotal']/totalGames);
		c['avgCreepScorePreMin'] = Math.round(c['creepScorePerMinTotal']/totalGames, 1);
		c['avgGold'] = Math.round(c['goldTotal']/totalGames);
	});
	
	return championPool;
}

function createNewChampionStat(championName){
	var gameTemp = [];
	gameTemp['champion'] = championName;
	gameTemp['killsTotal'] = 0;
	gameTemp['deathsTotal'] = 0;
	gameTemp['assistsTotal'] = 0;
	gameTemp['gamesWon'] = 0;
	gameTemp['gamesLoss'] = 0;
	gameTemp['creepScoreTotal'] = 0;
	gameTemp['creepScorePerMinTotal'] = 0;
	gameTemp['goldTotal'] = 0;
	gameTemp['damageDealtTotal'] = 0;
	gameTemp['damageTakenTotal'] = 0;
	gameTemp['timePlayedTotal'] = 0;
	
	//Achievements ?
	gameTemp['doubleKills'] = 0;
	gameTemp['tripleKills'] = 0;
	gameTemp['quadraKills'] = 0;
	gameTemp['pentaKills'] = 0;
	gameTemp['maxKills'] = 0;
	gameTemp['maxDeaths'] = 0;
	gameTemp['maxAssists'] = 0;
	
	
	// To process
	gameTemp['avgKills'] = 0;
	gameTemp['avgDeaths'] = 0;
	gameTemp['avgAssists'] = 0;
	gameTemp['avgKDA'] = 0;
	gameTemp['winRate'] = 0;
	gameTemp['gamesPlayed'] = 0;
	gameTemp['avgCreepScore'] = 0;
	gameTemp['avgCreepScorePreMin'] = 0;
	gameTemp['avgGold'] = 0;
	
	return gameTemp;
}

function getPerkStyle(id){
	//http://ddragon.leagueoflegends.com/cdn/12.9.1/data/en_US/runesReforged.json
	var perk = [
	{
        "icon": "perk-images/Styles/7200_Domination.png",
        "id": "8100"
    },
	{
        "icon": "perk-images/Styles/7204_Resolve.png",
        "id": "8400"
    },
	{
        "icon": "perk-images/Styles/7202_Sorcery.png",
        "id": "8200"
    },
	{
        "icon": "perk-images/Styles/7201_Precision.png",
        "id": "8000"
    },
	{
        "icon": "perk-images/Styles/7203_Whimsy.png",
        "id": "8300"
    }
	];
	var p = perk.find(e => e['id'] == id);
	
	return p['icon'];
}

function summonerSpell(key){
	//https://static.developer.riotgames.com/docs/lol/queues.json
	var spell = [
	{
        "id": "SummonerBarrier",
        "key": "21"
    },
	{
        "id": "SummonerBoost",
        "key": "1"
    },
	{
        "id": "SummonerDot",
        "key": "14"
    },
	{
        "id": "SummonerExhaust",
        "key": "3"
    },
	{
        "id": "SummonerFlash",
        "key": "4"
    },
	{
        "id": "SummonerHaste",
        "key": "6"
    },
	{
        "id": "SummonerHeal",
        "key": "7"
    },
	{
        "id": "SummonerMana",
        "key": "13"
    },
	{
        "id": "SummonerPoroRecall",
        "key": "30"
    },
	{
        "id": "SummonerPoroThrow",
        "key": "31"
    },
	{
        "id": "SummonerSmite",
        "key": "11"
    },
	{
        "id": "SummonerSnowURFSnowball_Mark",
        "key": "39"
    },
	{
        "id": "SummonerSnowball",
        "key": "32"
    },
	{
        "id": "SummonerTeleport",
        "key": "12"
    },
	{
        "id": "Summoner_UltBookPlaceholder",
        "key": "54"
    },
	{
        "id": "Summoner_UltBookSmitePlaceholder",
        "key": "55"
    }
	];
	var s = spell.find(e => e['key'] == key);
	
	return s['id'];
}

function queueType(queueId){
	//https://static.developer.riotgames.com/docs/lol/queues.json
	var queues = [
    {
        "queueId": 0,
        "map": "Custom games",
        "description": null,
        "notes": null
    },
    {
        "queueId": 2,
        "map": "Summoner's Rift",
        "description": "5v5 Blind Pick games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 430"
    },
    {
        "queueId": 4,
        "map": "Summoner's Rift",
        "description": "5v5 Ranked Solo games",
        "notes": "Deprecated in favor of queueId 420"
    },
    {
        "queueId": 6,
        "map": "Summoner's Rift",
        "description": "5v5 Ranked Premade games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 7,
        "map": "Summoner's Rift",
        "description": "Co-op vs AI games",
        "notes": "Deprecated in favor of queueId 32 and 33"
    },
    {
        "queueId": 8,
        "map": "Twisted Treeline",
        "description": "3v3 Normal games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 460"
    },
    {
        "queueId": 9,
        "map": "Twisted Treeline",
        "description": "3v3 Ranked Flex games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 470"
    },
    {
        "queueId": 14,
        "map": "Summoner's Rift",
        "description": "5v5 Draft Pick games",
        "notes": "Deprecated in favor of queueId 400"
    },
    {
        "queueId": 16,
        "map": "Crystal Scar",
        "description": "5v5 Dominion Blind Pick games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 17,
        "map": "Crystal Scar",
        "description": "5v5 Dominion Draft Pick games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 25,
        "map": "Crystal Scar",
        "description": "Dominion Co-op vs AI games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 31,
        "map": "Summoner's Rift",
        "description": "Co-op vs AI Intro Bot games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 830"
    },
    {
        "queueId": 32,
        "map": "Summoner's Rift",
        "description": "Co-op vs AI Beginner Bot games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 840"
    },
    {
        "queueId": 33,
        "map": "Summoner's Rift",
        "description": "Co-op vs AI Intermediate Bot games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 850"
    },
    {
        "queueId": 41,
        "map": "Twisted Treeline",
        "description": "3v3 Ranked Team games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 42,
        "map": "Summoner's Rift",
        "description": "5v5 Ranked Team games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 52,
        "map": "Twisted Treeline",
        "description": "Co-op vs AI games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 800"
    },
    {
        "queueId": 61,
        "map": "Summoner's Rift",
        "description": "5v5 Team Builder games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 65,
        "map": "Howling Abyss",
        "description": "5v5 ARAM games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 450"
    },
    {
        "queueId": 67,
        "map": "Howling Abyss",
        "description": "ARAM Co-op vs AI games",
        "notes": "Game mode deprecated"
    },
    {
        "queueId": 70,
        "map": "Summoner's Rift",
        "description": "One for All games",
        "notes": "Deprecated in patch 8.6 in favor of queueId 1020"
    },
    {
        "queueId": 72,
        "map": "Howling Abyss",
        "description": "1v1 Snowdown Showdown games",
        "notes": null
    },
    {
        "queueId": 73,
        "map": "Howling Abyss",
        "description": "2v2 Snowdown Showdown games",
        "notes": null
    },
    {
        "queueId": 75,
        "map": "Summoner's Rift",
        "description": "6v6 Hexakill games",
        "notes": null
    },
    {
        "queueId": 76,
        "map": "Summoner's Rift",
        "description": "Ultra Rapid Fire games",
        "notes": null
    },
    {
        "queueId": 78,
        "map": "Howling Abyss",
        "description": "One For All: Mirror Mode games",
        "notes": null
    },
    {
        "queueId": 83,
        "map": "Summoner's Rift",
        "description": "Co-op vs AI Ultra Rapid Fire games",
        "notes": null
    },
    {
        "queueId": 91,
        "map": "Summoner's Rift",
        "description": "Doom Bots Rank 1 games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 950"
    },
    {
        "queueId": 92,
        "map": "Summoner's Rift",
        "description": "Doom Bots Rank 2 games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 950"
    },
    {
        "queueId": 93,
        "map": "Summoner's Rift",
        "description": "Doom Bots Rank 5 games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 950"
    },
    {
        "queueId": 96,
        "map": "Crystal Scar",
        "description": "Ascension games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 910"
    },
    {
        "queueId": 98,
        "map": "Twisted Treeline",
        "description": "6v6 Hexakill games",
        "notes": null
    },
    {
        "queueId": 100,
        "map": "Butcher's Bridge",
        "description": "5v5 ARAM games",
        "notes": null
    },
    {
        "queueId": 300,
        "map": "Howling Abyss",
        "description": "Legend of the Poro King games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 920"
    },
    {
        "queueId": 310,
        "map": "Summoner's Rift",
        "description": "Nemesis games",
        "notes": null
    },
    {
        "queueId": 313,
        "map": "Summoner's Rift",
        "description": "Black Market Brawlers games",
        "notes": null
    },
    {
        "queueId": 315,
        "map": "Summoner's Rift",
        "description": "Nexus Siege games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 940"
    },
    {
        "queueId": 317,
        "map": "Crystal Scar",
        "description": "Definitely Not Dominion games",
        "notes": null
    },
    {
        "queueId": 318,
        "map": "Summoner's Rift",
        "description": "ARURF games",
        "notes": "Deprecated in patch 7.19 in favor of queueId 900"
    },
    {
        "queueId": 325,
        "map": "Summoner's Rift",
        "description": "All Random games",
        "notes": null
    },
    {
        "queueId": 400,
        "map": "Summoner's Rift",
        "description": "5v5 Draft Pick games",
        "notes": null
    },
    {
        "queueId": 410,
        "map": "Summoner's Rift",
        "description": "5v5 Ranked Dynamic games",
        "notes": "Game mode deprecated in patch 6.22"
    },
    {
        "queueId": 420,
        "map": "Summoner's Rift",
        "description": "Ranked Solo",//"description": "5v5 Ranked Solo games",
        "notes": null
    },
    {
        "queueId": 430,
        "map": "Summoner's Rift",
        "description": "5v5 Blind Pick games",
        "notes": null
    },
    {
        "queueId": 440,
        "map": "Summoner's Rift",
        "description": "5v5 Ranked Flex games",
        "notes": null
    },
    {
        "queueId": 450,
        "map": "Howling Abyss",
        "description": "5v5 ARAM games",
        "notes": null
    },
    {
        "queueId": 460,
        "map": "Twisted Treeline",
        "description": "3v3 Blind Pick games",
        "notes": "Deprecated in patch 9.23"
    },
    {
        "queueId": 470,
        "map": "Twisted Treeline",
        "description": "3v3 Ranked Flex games",
        "notes": "Deprecated in patch 9.23"
    },
    {
        "queueId": 600,
        "map": "Summoner's Rift",
        "description": "Blood Hunt Assassin games",
        "notes": null
    },
    {
        "queueId": 610,
        "map": "Cosmic Ruins",
        "description": "Dark Star: Singularity games",
        "notes": null
    },
    {
        "queueId": 700,
        "map": "Summoner's Rift",
        "description": "Clash games",
        "notes": null
    },
    {
        "queueId": 800,
        "map": "Twisted Treeline",
        "description": "Co-op vs. AI Intermediate Bot games",
        "notes": "Deprecated in patch 9.23"
    },
    {
        "queueId": 810,
        "map": "Twisted Treeline",
        "description": "Co-op vs. AI Intro Bot games",
        "notes": "Deprecated in patch 9.23"
    },
    {
        "queueId": 820,
        "map": "Twisted Treeline",
        "description": "Co-op vs. AI Beginner Bot games",
        "notes": null
    },
    {
        "queueId": 830,
        "map": "Summoner's Rift",
        "description": "Co-op vs. AI Intro Bot games",
        "notes": null
    },
    {
        "queueId": 840,
        "map": "Summoner's Rift",
        "description": "Co-op vs. AI Beginner Bot games",
        "notes": null
    },
    {
        "queueId": 850,
        "map": "Summoner's Rift",
        "description": "Co-op vs. AI Intermediate Bot games",
        "notes": null
    },
    {
        "queueId": 900,
        "map": "Summoner's Rift",
        "description": "ARURF games",
        "notes": null
    },
    {
        "queueId": 910,
        "map": "Crystal Scar",
        "description": "Ascension games",
        "notes": null
    },
    {
        "queueId": 920,
        "map": "Howling Abyss",
        "description": "Legend of the Poro King games",
        "notes": null
    },
    {
        "queueId": 940,
        "map": "Summoner's Rift",
        "description": "Nexus Siege games",
        "notes": null
    },
    {
        "queueId": 950,
        "map": "Summoner's Rift",
        "description": "Doom Bots Voting games",
        "notes": null
    },
    {
        "queueId": 960,
        "map": "Summoner's Rift",
        "description": "Doom Bots Standard games",
        "notes": null
    },
    {
        "queueId": 980,
        "map": "Valoran City Park",
        "description": "Star Guardian Invasion: Normal games",
        "notes": null
    },
    {
        "queueId": 990,
        "map": "Valoran City Park",
        "description": "Star Guardian Invasion: Onslaught games",
        "notes": null
    },
    {
        "queueId": 1000,
        "map": "Overcharge",
        "description": "PROJECT: Hunters games",
        "notes": null
    },
    {
        "queueId": 1010,
        "map": "Summoner's Rift",
        "description": "Snow ARURF games",
        "notes": null
    },
    {
        "queueId": 1020,
        "map": "Summoner's Rift",
        "description": "One for All games",
        "notes": null
    },
    {
        "queueId": 1030,
        "map": "Crash Site",
        "description": "Odyssey Extraction: Intro games",
        "notes": null
    },
    {
        "queueId": 1040,
        "map": "Crash Site",
        "description": "Odyssey Extraction: Cadet games",
        "notes": null
    },
    {
        "queueId": 1050,
        "map": "Crash Site",
        "description": "Odyssey Extraction: Crewmember games",
        "notes": null
    },
    {
        "queueId": 1060,
        "map": "Crash Site",
        "description": "Odyssey Extraction: Captain games",
        "notes": null
    },
    {
        "queueId": 1070,
        "map": "Crash Site",
        "description": "Odyssey Extraction: Onslaught games",
        "notes": null
    },
    {
        "queueId": 1090,
        "map": "Convergence",
        "description": "Teamfight Tactics games",
        "notes": null
    },
    {
        "queueId": 1100,
        "map": "Convergence",
        "description": "Ranked Teamfight Tactics games",
        "notes": null
    },
    {
        "queueId": 1110,
        "map": "Convergence",
        "description": "Teamfight Tactics Tutorial games",
        "notes": null
    },
    {
        "queueId": 1111,
        "map": "Convergence",
        "description": "Teamfight Tactics test games",
        "notes": null
    },
    {
        "queueId": 1200,
        "map": "Nexus Blitz",
        "description": "Nexus Blitz games",
        "notes": "Deprecated in patch 9.2"
    },
    {
        "queueId": 1300,
        "map": "Nexus Blitz",
        "description": "Nexus Blitz games",
        "notes": null
    },
    {
        "queueId": 1400,
        "map": "Summoner's Rift",
        "description": "Ultimate Spellbook games",
        "notes": null
    },
    {
        "queueId": 1900,
        "map": "Summoner's Rift",
        "description": "Pick URF games",
        "notes": null
    },
    {
        "queueId": 2000,
        "map": "Summoner's Rift",
        "description": "Tutorial 1",
        "notes": null
    },
    {
        "queueId": 2010,
        "map": "Summoner's Rift",
        "description": "Tutorial 2",
        "notes": null
    },
    {
        "queueId": 2020,
        "map": "Summoner's Rift",
        "description": "Tutorial 3",
        "notes": null
    }
	];
	
	var q = queues.find(e => e['queueId'] == queueId);
	
	return q['description'];
}

function romanToNumeral(roman) {
	if(Number.isInteger(roman)){
		return roman;
	} else {
		var numeral = 1;
		switch(roman){
			case "I":
				numeral = 1;
				break;
			case "II":
				numeral = 2;
				break;
			case "III":
				numeral = 3;
				break;
			case "IV":
				numeral = 4;
				break;
			case "V":
				numeral = 5;
				break;
		}
		return numeral;
	}
}


async function getUserData(username){
	try {
		retrivingState = true;
		console.log("[getUserData] Retriving data for " + username + "...");
		let summonerData = await requestUserData(username);
		let summonerMatchData = await requestMatchesData(summonerData.puuid);
		
		currentUserName = summonerData.name;
		currentUserPuuid = summonerData.puuid;
		
		updateProfile(summonerData, summonerMatchData);
		console.log("[getUserData] Done.");
		retrivingState = false;
	} catch(error) {
		console.error("[getUserData] API or SERVER or updateProfile() broke: " + error);
		console.error(error);
		retrivingState = false;
	}
}

function updateUserDataCheck() {
	if(currentUserName != null && currentUserPuuid != null){
		updateUserData(currentUserName, currentUserPuuid);
	} else {
		console.error("No user data.");
	}
}

async function updateUserData(username, puuid){
	try {
		updatingState = true;
		console.log("[updateUserData] Updating data for " + username + "...");
		
		let tempFeature1 = await requestUserDataUpdate(username);
		let tempFeature2 = await requestMatchesDataUpdate(puuid);
		
		getUserData(username);
		
		console.log("[updateUserData] Done.");
		updatingState = false;
	} catch(error) {
		console.error("[updateUserData] API or SERVER or updateProfile() broke: " + error);
		console.error(error);
		updatingState = false;
	}
}

async function requestUserData(username) {
	return new Promise((resolve, reject) => {
		var url = "http://"+localhost+"/api?username="+ username +"&type=getUser";
		console.log("[requestUserData] Fetch " + url);
		
		fetch(url)
			.then(response => response.text())
			.then((data) => {
				if(data == "USER_DEOS_NOT_EXISTS") {
					console.log("[requestUserData] Resolved USER_DEOS_NOT_EXISTS");
					resolve("USER_DEOS_NOT_EXISTS");
					
				} else {
					console.log("[requestUserData] Resolved");
					obj = JSON.parse(data);
					resolve(obj);
					
				}
		}).catch(error => {
			reject(error);
		});
	});
	
	
}

async function requestMatchesData(puuid) {
	return new Promise((resolve, reject) => {
		var url = "http://"+localhost+"/api?puuid="+ puuid +"&type=getMatches";
		console.log("[requestMatchesData] Fetch " + url);
		
		fetch(url)
			.then(response => response.text())
			.then((data) => {
				if(data == "NO_MATCHES"){
					console.log("[requestMatchesData] Resolved NO_MATCHES");
					resolve("NO_MATCHES");
					
				} else {
					console.log("[requestMatchesData] Resolved");
					obj = JSON.parse(data);
					resolve(obj);
					
				}
		}).catch(error => {
			reject(error);
		});
	});
}

async function requestUserDataUpdate(username) {
	return new Promise((resolve, reject) => {
		var url = "http://"+localhost+"/api?username="+ username +"&type=updateUser";
		console.log("[requestUserDataUpdate] Fetch " + url);
		
		fetch(url)
			.then(response => response.text())
			.then((data) => {
				console.log("[requestUserDataUpdate] Resolved");
				resolve(true);
				
		}).catch(error => {
			reject(error);
		});
	});
}

async function requestMatchesDataUpdate(puuid) {
	return new Promise((resolve, reject) => {
		var url = "http://"+localhost+"/api?puuid="+ puuid +"&type=updateMatches";
		console.log("[requestMatchesDataUpdate] Fetch " + url);
		
		fetch(url)
			.then(response => response.text())
			.then((data) => {
				console.log("[requestMatchesDataUpdate] Resolved");
				resolve(true);
				
		}).catch(error => {
			reject(error);
		});
	});
}
