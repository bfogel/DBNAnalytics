"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

/**@type{string} */
var _RootKey = "DBN";

var cardPlayerComparison = null;

var _PlayerList = new dbnPlayerList();

var _RetrieveButton = new dbnButton("Load games", LoadComparison);

/** @type {dbnGame[]} */
var _Games;

var divFilter = new dbnSpan();
/** @type {dbnSelect} */
var selFilter;

/** @type {dbnDiv} */
var divGames = null;
/** @type {dbnDiv} */
var divGamesStatus = null;
/** @type {dbnDiv} */
var divSummary = null;

/** @type {dbnTable} */
var tblGames = null;
/** @type {dbnTable} */
var tblSummary = null;

function MakePage() {

    var urlparams = new URLSearchParams(window.location.search);

    if (urlparams.has("RootKey")) _RootKey = urlparams.get("RootKey");

    var titlecard = dbnHere().addTitleCard("Player Game History");
    titlecard.addText(myHub.RootDescription[_RootKey]);

    cardPlayerComparison = dbnHere().addCard();
    cardPlayerComparison.style = "min-height: 400px";

    _PlayerList.OnSelectionChanged = UpdateURL;
    cardPlayerComparison.add(_PlayerList);

    cardPlayerComparison.addLineBreak();

    var div = cardPlayerComparison.addDiv();
    div.add(_RetrieveButton);
    _RetrieveButton.style = "margin-right: 20px";
    div.add(divFilter);

    cardPlayerComparison.addLineBreak();
    //cardPlayerComparison.addLineBreak();

    // cardPlayerComparison.addLineBreak();

    divSummary = cardPlayerComparison.addDiv();
    divGames = cardPlayerComparison.addDiv();

    divGamesStatus = cardPlayerComparison.addDiv();

    if (urlparams.has("Players")) {
        var pps = JSON.parse(urlparams.get("Players"));
        console.log(pps);
        if (pps) {
            pps.forEach(pid => _PlayerList.AddPlayer(myHub.Players.find(x => x.PlayerID == pid)));
        }
        LoadComparison();
    }
    // _PlayerList.AddPlayer(myHub.Players.find(x => x.PlayerID == 203));
    // _PlayerList.AddPlayer(myHub.Players.find(x => x.PlayerID == 222));
    // LoadComparison();
}
MakePage();

function UpdateURL() {
    var url = new URL(document.URL);

    url.searchParams.set("RootKey", _RootKey);
    url.searchParams.set("Players", JSON.stringify(_PlayerList.Players.map(x => x.PlayerID)));

    window.history.replaceState(null, document.title, url)

}

function LoadComparison() {
    ClearTables();

    divGamesStatus.domelement.innerHTML = "Loading...";

    var players = _PlayerList.Players;

    if (players.length == 0) {
        divGamesStatus.domelement.innerHTML = "No players selected";
        return;
    }

    _Games = myHub.GetGamesForPlayers(players.map(x => x.PlayerID), _RootKey);

    if (_Games == null || _Games.length == 0) {
        divFilter.innerHTML = "";
        divGamesStatus.innerHTML = "None";
    } else {
        MakeFilter(_Games);
        MakeDataTables();
    }

}

/**
 * @param {dbnGame[]} games 
 */
function MakeFilter(games) {
    console.log("Making filter");

    divFilter.innerHTML = "";

    var DBNIYears = [];
    games.forEach(x => { if (!DBNIYears.includes(x.DBNIYear)) DBNIYears.push(x.DBNIYear); });
    DBNIYears.sort();

    divFilter.addText("Filter: ")
    selFilter = divFilter.addSelect();
    selFilter.AddOption("All", 0);
    DBNIYears.forEach(x => {
        if (x == null) {
            selFilter.AddOption("DBNI", x);
        } else {
            selFilter.AddOption(x + " DBNI Qualifying", x);
        }
    });

    selFilter.onchange = MakeDataTables;

    console.log("Made filter");
}

//----------------------

function ClearTables() {
    divGames.innerHTML = "";
    divSummary.innerHTML = "";
    // _Games = null;
}

function MakeDataTables() {
    ClearTables();

    var filter = selFilter.SelectedValue;
    if (filter == "null") filter = null;

    var games = _Games;

    if (!(filter == 0)) {
        games = games.filter(x => x.DBNIYear == filter);
    }

    //games.sort((a, b) => (a.EndDate ?? "0").localeCompare(b.EndDate ?? "0"));

    MakeSummary(_PlayerList.Players, games);
    MakeGameList(_PlayerList.Players, games);
}

/**
* @param {dbnPlayer[]} players 
* @param {dbnGame[]} games 
*/
function MakeSummary(players, games) {
    tblSummary = divSummary.addTable();

    /** @type {dbnPlayer[]} */
    var uniqueplayers = [];
    players.forEach(x => { if (!uniqueplayers.some(y => y.PlayerID == x.PlayerID)) uniqueplayers.push(x); });

    tblSummary.Headers = ["Player", "Games", "Rank", "TopShare"];
    tblSummary.Headers.push("Centers");

    myHub.Countries.forEach((cc, iCol) => {
        tblSummary.Headers.push(cc.substring(0, 1) + "#", "ts", "ctrs");
        tblSummary.SetCountryForColumn(3 * iCol + 5, cc);
        tblSummary.SetCountryForColumn(3 * iCol + 6, cc);
        tblSummary.SetCountryForColumn(3 * iCol + 7, cc);
    });

    tblSummary.Data = uniqueplayers.map((player, iRow) => {
        var row = [player.PlayerName, games.length];
        var lines = games.map(x => x.GetResultLineForPlayer(player.PlayerID));

        var rank = lines.reduce((prev, x) => prev + x.Rank, 0) / lines.length;
        row.push(rank.toFixed(1));

        var ts = lines.reduce((prev, x) => prev + x.TopShare, 0);
        ts = 100 * ts / lines.length;
        row.push(ts.toFixed() + "%");

        var centers = lines.reduce((prev, x) => prev + x.CenterCount, 0) / lines.length;
        row.push(centers.toFixed(1));

        /** @type {Object.<string,dbnGameResultLine[]>} */
        var linesByCC = {};
        myHub.Countries.forEach(cc => {
            linesByCC[cc] = lines.filter(x => x.Country == cc);
        });

        for (const cc in linesByCC) {
            var cclines = linesByCC[cc];
            if (cclines.length == 0) {
                row.push("", "", "");
            } else {
                row.push(cclines.length);
                var ccts = 100 * cclines.reduce((prev, x) => prev + x.TopShare, 0) / cclines.length;
                row.push(ccts.toFixed() + "%");
                var cccenters = cclines.reduce((prev, x) => prev + x.CenterCount, 0) / cclines.length;
                row.push(cccenters.toFixed(1));
            }
        }

        return row;
    });

    tblSummary.ClickHeaderToSort = true;
    tblSummary.Generate();

}



/**
* 
* @param {dbnPlayer[]} players 
* @param {dbnGame[]} games 
*/
function MakeGameList(players, games) {
    var playerids = players.map(x => x.PlayerID);

    divGamesStatus.domelement.innerHTML = "";

    tblGames = divGames.addTable();

    tblGames.Headers = ["Date", "Game", "Length", "", "", "", "", "", "", ""];

    tblGames.Data = games.map((game, iRow) => {
        var row = [game.EndDate];

        var dg = new dbnDiv();
        dg.addText(game.Competition.CompetitionName);
        dg.addLineBreak();
        dg.addText(game.Label);
        dg.addLineBreak();

        if (game.URL != null) {
            var link = new dbnLink();
            link.href = game.URL;
            link.addText("View game");
            link.checkForExternal();
            dg.appendChild(link);
        }
        row.push(dg);
        row.push(game.GameYearsCompleted + 1900);

        var fRes = (line) => line.CenterCount + "c " + line.Country + " (" + line.Rank + (line.Rank == line.RankScore ? "" : "T") + ")";

        var linesbyrank = game.GetResultLinesByRank();
        var after = [];
        for (let iRank = 1; iRank < 8; iRank++) {
            tblGames.SetCellClass(iRow, iRank + 2, "GamePlayer_Player");
            if (linesbyrank.hasOwnProperty(iRank)) {
                var cell = new dbnDiv();
                linesbyrank[iRank].forEach(line => {
                    var divPlayer = cell.addDiv();
                    divPlayer.className = "GamePlayer_Player bf" + line.Country + "Back";
                    if (playerids.includes(line.Player.PlayerID)) divPlayer.className += " GamePlayer_Selected";
                    divPlayer.addText(iRank + ". " + line.Player.PlayerName + " (" + line.CenterCount + "c)")
                });
                row.push(cell);
            } else {
                after.push("");
            }
        }
        row.push(...after);

        return row;

    });

    tblGames.ClickHeaderToSort = true;
    tblGames.Generate();
    tblGames.className += " GamePlayer";
}