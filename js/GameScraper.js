// Scrape the scores from a game and set the scoring table to those scores
async function scrapeGameScores() {
	url = document.getElementById("gameUrlInput").value;
	scrapedCenterCounts = {"austria": 0, "england": 0, "france": 0, "germany": 0,
		"italy": 0, "russia": 0, "turkey": 0}

	// Update button text to "Processing"
	document.getElementById("submitButton").innerHTML = "Processing..."

	// TODO: separate different websites into different functions
	try {
		// Get the site from the URL
		// src: b for backstabbr, w for webdip
		let src = ""
		let gameId = ""
		if (url.includes("webdiplomacy.")) {
			src = "w"
			gameId = url.split("gameID=")[1]
		} else if (url.includes("backstabbr.")) {
			src = "b"
			splitUrl = url.split("/")[1]
			gameId = splitUrl[splitUrl.length - 1]
		}

		console.log(src, gameId);

		// Hardcoded server URL for fetching games
		let response = await fetch(
			"https://diplobn.com/wp-content/plugins/DBNAnalytics/external/retrieve.php?src=" + src + "&id=" + gameId);
		let data = await response.text();

		var webpage = document.createElement("html");
		webpage.innerHTML = data;
		
		// webdip (and theoretically vdip if the diplobn /retrieve.php supports it)
		// test URLs
		// drawn game: https://webdiplomacy.net/board.php?gameID=340030
		// won game: https://webdiplomacy.net/board.php?gameID=334382
		// you have to find ongoing games for complete testing e.g. retreats
		if (url.includes("webdiplomacy.") || url.includes("vdiplomacy.")) {
			let table = webpage.getElementsByClassName("membersFullTable")[0];
    		let rows = table.getElementsByClassName("member");

    		// Go through each country to get the name and center count
    		for (let i = rows.length - 1; i >= 0; i--) {
    			let span = rows[i].getElementsByClassName("memberCountryName")[0];
    			let countryName = span.textContent.trim().toLowerCase();

    			// Handles a weird dash during retreat phases
    			if (countryName[0] == "-") {
    				countryName = countryName.split(" ")[1];
    			}

				let scCount = "0";
				try {
    				let text = rows[i].getElementsByClassName("memberSCCount")[0].innerHTML;
    				scCount = text.split("</em>")[0].substr(4);
    			} catch(err) {
    				// Error? Assume no field and 0 centers
    				scCount = "0";
    			}
				scrapedCenterCounts[countryName] = Number(scCount);
    		}
		} else if (url.includes("backstabbr.")) {	// Backstabbr
			// Example games:
			// drawn game - https://www.backstabbr.com/game/Mar-Apr-Speednoat-Final1/6229962389716992
			// won game - https://www.backstabbr.com/game/SB-Game-143/5154168504582144
			let legend = webpage.getElementsByClassName("legend")[0];
			let spans = legend.getElementsByTagName("span");
			for (let i = spans.length - 1; i >= 0; i--) {
				let strings = spans[i].textContent.trim().split(" ");
				if (strings.length === 2) {
					scrapedCenterCounts[strings[0].toLowerCase()] = Number(strings[1]);
				}
			}
		}

	} catch(err) {
		console.log(err);
	}

	setCenterCounts(scrapedCenterCounts);

	// New center counts? Need to update the scores!
	updateScores();

	// Update button text back to "Submit"
	document.getElementById("submitButton").innerHTML = "Submit";

	// Turned off clearing the URL because maybe people would want to refresh the same game?
	// document.getElementById("gameUrlInput").value = null;
}

// Set the scores from a given dictionary of {countryName: centerCount}
function setCenterCounts(countryCountDict) {
	var i = 1;
	var totalCenters = 0;

	// Assumes that country order is consistently A,E,F,G,I,R,T
	Object.entries(countryCountDict).forEach(([country, count]) => {
		var countElement = document.getElementById("cc" + i.toString());
		countElement.innerHTML = count;
		totalCenters += count;
		++i;
	});

	document.getElementById("ccT").innerHTML = totalCenters;
}

function updateScores() {
	// Empty for now, testing things
}