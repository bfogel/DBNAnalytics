// Scrape the scores from a game and set the scoring table to those scores
async function scrapeGameScores() {
	url = document.getElementById("gameUrlInput").value;
	scrapedCenterCounts = {"austria": 0, "england": 0, "france": 0, "germany": 0,
		"italy": 0, "russia": 0, "turkey": 0}

	// Update button text to "Processing"
	document.getElementById("submitButton").innerHTML = "Processing..."

	try {
		// Get the site from the URL
		// src: b for backstabbr, w for webdip, v for vdip
		let src = "";
		let gameId = "";

		if (url.includes("webdiplomacy.")) {
			src = "w";
			gameId = url.split("gameID=")[1];

		} else if (url.includes("vdiplomacy.")) {
			src = "v";
			gameId = url.split("gameID=")[1];

		} else if (url.includes("backstabbr.")) {
			src = "b";
			splitUrl = url.split("/");
			gameId = splitUrl[splitUrl.length - 1];

			// Handle a trailing slash or /gameId/year/turn in the URL
			// TODO: add a way to specify the year+turn in /retrieve.php?
			let i = 2;
			while (gameId.length < 7) {
				gameId = splitUrl[splitUrl.length - i];
				++i;
			}
		}

		// For debugging URL parsing
		// console.log(src, gameId);

		// Hardcoded server URL for fetching games
		let response = await fetch(
			"https://diplobn.com/wp-content/plugins/DBNAnalytics/external/retrieve.php?src=" + src + "&id=" + gameId);
		let data = await response.text();

		var webpage = document.createElement("html");
		webpage.innerHTML = data;
		
		// Let's parse :tada:
		if (url.includes("webdiplomacy.")) {
			parseWebDipGame(webpage, scrapedCenterCounts);
		} else if (url.includes("vdiplomacy.")) {
			parseVDipGame(webpage, scrapedCenterCounts);
		} else if (url.includes("backstabbr.")) {
			parseBackstabbrGame(webpage, scrapedCenterCounts);
		}

	} catch(err) {
		console.log(err);
	}

	setCenterCounts(scrapedCenterCounts);

	// Update button text back to "Submit"
	document.getElementById("submitButton").innerHTML = "Submit";

	// Turned off clearing the URL because maybe people would want to refresh the same game?
	// document.getElementById("gameUrlInput").value = null;
}

// you have to find ongoing games for complete testing e.g. retreats
// test URLs
// webdip, drawn game: https://webdiplomacy.net/board.php?gameID=340030
// webdip, won game: https://webdiplomacy.net/board.php?gameID=334382
// webdip, game with a CD: https://webdiplomacy.net/board.php?gameID=404806
function parseWebDipGame(webpage, scrapedCenterCounts) {
	let table = webpage.getElementsByClassName("membersFullTable")[0].children[0];
	let rows = table.getElementsByClassName("member");

	// Go through each country to get the name and center count
	for (var i = rows.length - 1; i >= 0; i--) {
		let span = rows[i].getElementsByClassName("memberCountryName")[0];
		// console.log(rows[i]);
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
}

// test URLs
// vdip, drawn game: https://vdiplomacy.com/board.php?gameID=50673
// vdip, won game: https://vdiplomacy.com/board.php?gameID=50129
function parseVDipGame(webpage, scrapedCenterCounts) {
	let table = webpage.getElementsByClassName("membersFullTable")[0].children[0];
	let rows = table.getElementsByClassName("member");

	// Go through each country to get the name and center count
	for (var i = rows.length - 1; i >= 0; i--) {
		let span = rows[i].getElementsByClassName("memberLeftSide")[0];
		// console.log(rows[i]);
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
}

// test URLs
// Backstabbr, drawn game - https://www.backstabbr.com/game/Mar-Apr-Speednoat-Final1/6229962389716992
// Backstabbr, won game - https://www.backstabbr.com/game/SB-Game-143/5154168504582144
function parseBackstabbrGame(webpage, scrapedCenterCounts) {
	let legend = webpage.getElementsByClassName("legend")[0];
	let spans = legend.getElementsByTagName("span");
	for (var i = spans.length - 1; i >= 0; i--) {
		let strings = spans[i].textContent.trim().split(" ");
		if (strings.length === 2) {
			scrapedCenterCounts[strings[0].toLowerCase()] = Number(strings[1]);
		}
	}
}

// Set the scores from a given dictionary of {countryName: centerCount}
function setCenterCounts(countryCountDict) {
	var i = 1;

	// Assumes that country order is consistently A,E,F,G,I,R,T
	Object.entries(countryCountDict).forEach(([country, count]) => {
		mCenterCounts[i - 1] = count;
		++i;
	});

	UpdateDisplay();
}