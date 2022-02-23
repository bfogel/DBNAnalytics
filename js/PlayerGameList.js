"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

var cardPlayerComparison = null;

/** @type {dbnPlayerSelector} */
var selPlayer1 = null;
/** @type {dbnPlayerSelector} */
var selPlayer2 = null;

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

    var titlecard = dbnHere().addTitleCard("Player Game History");
    titlecard.addText("DBNI qualifying events and exhibitions covered by DBN");

    cardPlayerComparison = dbnHere().addCard();

    var ss = cardPlayerComparison.createAndAppendElement("style");
    ss.addText(".otherPlayers {font-size: 15px !important; line-height: 130%; margin-bottom: 5px;}");

    cardPlayerComparison.addText("Player 1: ");
    selPlayer1 = new dbnPlayerSelector(cardPlayerComparison);

    cardPlayerComparison.createAndAppendElement("br");

    cardPlayerComparison.addText("Player 2: ");
    selPlayer2 = new dbnPlayerSelector(cardPlayerComparison);

    selPlayer1.onchange = LoadComparison;
    selPlayer2.onchange = LoadComparison;

    var style = "width: 300px; margin-bottom: 10px;";
    selPlayer1.domelement.style = style;
    selPlayer2.domelement.style = style;

    divSummary = cardPlayerComparison.addDiv();
    divGames = cardPlayerComparison.addDiv();

    divGamesStatus = cardPlayerComparison.addDiv();

    // selPlayer1.domelement.value = 203;
    // selPlayer2.domelement.value = 222;
    // LoadComparison();

}
MakePage();

function LoadComparison() {
    divGamesStatus.domelement.innerHTML = "Loading...";
    divGames.domelement.innerHTML = "";
    divSummary.domelement.innerHTML = "";

    var p1 = selPlayer1.SelectedPlayer;
    var p2 = selPlayer2.SelectedPlayer;

    if (p1 == null || p2 == null) {
        divGamesStatus.domelement.innerHTML = "No selection";
        return;
    }

    var games = myHub.GetGamesForPlayers(p1.PlayerID, p2.PlayerID);

    if (games == null) {
        divGamesStatus.domelement.innerHTML = "None";
    } else {
        MakeSummary([p1, p2], games);
        MakeGameList([p1, p2], games);
    }

}

/**
 * 
 * @param {dbnPlayer[]} players 
 * @param {dbnGame[]} games 
 */
function MakeSummary(players, games) {
    tblSummary = divSummary.addTable();

    tblSummary.Headers = ["Player", "Games", "Avg Length", "TopShare", "Avg Centers", "Avg Rank"];
    tblSummary.Data = players.map((player, iRow) => {
        var row = [player.PlayerName, games.length];

        var year = 1900 + games.reduce((prev, x) => prev + x.GameYearsCompleted, 0) / games.length;
        row.push(year.toFixed(1));

        var ts = games.reduce((prev, x) => prev + x.GetResultLineForPlayer(player.PlayerID).TopShare, 0);
        ts = 100 * ts / games.length;
        row.push(ts.toFixed() + "%");

        var centers = games.reduce((prev, x) => prev + x.GetResultLineForPlayer(player.PlayerID).CenterCount, 0) / games.length;
        row.push(centers.toFixed(1));

        var rank = games.reduce((prev, x) => prev + x.GetResultLineForPlayer(player.PlayerID).Rank, 0) / games.length;
        row.push(rank.toFixed(1));

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