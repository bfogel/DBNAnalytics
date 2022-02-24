"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

//#region Player selection

class PlayerSelectionLine extends dbnDiv {
    Selector = new dbnPlayerSelector();
    RemoveButton = new dbnButton("Remove", this.OnClick, null);

    constructor(parent) {
        super(parent);
        this.add(this.Selector);
        this.addText(" ");
        this.add(this.RemoveButton);
    }

    OnClick() {
        alert("did it");
    }

}

class PlayerSelectionView extends dbnDiv {

    OnSelectionChanged;

    /** @type {PlayerSelectionLine[]} */
    SelectorLines = [];

    SelectorDiv = new dbnDiv();
    AddLineButton = new dbnButton("Add Player", this.OnClick, null);

    constructor() {
        super(null);
        this.className = "PlayerSelectionView";

        this.add(this.SelectorDiv);
        this.add(this.AddLineButton);
        this.AddLineButton.onclick = this.#AddLine.bind(this);;

        this.#AddLine();
    }

    #raiseOnChanged() { if (this.OnSelectionChanged) this.OnSelectionChanged(); }

    #AddLine() {
        var line = new PlayerSelectionLine(this.SelectorDiv);
        line.Selector.onchange = this.#raiseOnChanged.bind(this);
        line.RemoveButton.onclick = this.#RemoveLine.bind(this, line);
        this.SelectorLines.push(line);
    }

    /**
     * @param {PlayerSelectionLine} line 
     */
    #RemoveLine(line) {
        var i = this.SelectorLines.indexOf(line);
        this.SelectorLines.splice(i, 1);
        line.domelement.remove();

        this.#raiseOnChanged();
    }

    get Players() {
        var ret = this.SelectorLines.map(x => x.Selector.SelectedPlayer);
        return ret;
    }
}

//#endregion

var cardPlayerComparison = null;

var _PlayerSelection = new PlayerSelectionView();

var divFilter = new dbnDiv();

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

    cardPlayerComparison.add(_PlayerSelection);
    cardPlayerComparison.addLineBreak();

    _PlayerSelection.OnSelectionChanged = LoadComparison.bind(this);

    cardPlayerComparison.add(divFilter);
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

    var players = _PlayerSelection.Players;

    if (players.some(x => x == null)) {
        divGamesStatus.domelement.innerHTML = "No selection";
        return;
    }

    var games = myHub.GetGamesForPlayers(players.map(x => x.PlayerID));

    if (games == null || games.length == 0) {
        divGamesStatus.domelement.innerHTML = "None";
    } else {
        //MakeFilter(games);
        MakeSummary(players, games);
        MakeGameList(players, games);
    }
}

/**
 * @param {dbnGame[]} games 
 */
function MakeFilter(games) {
    divFilter.innerHTML = "";

    var DBNIYears = [];
    games.forEach(x => { if (!DBNIYears.includes(x.DBNIYear)) DBNIYears.push(x.DBNIYear); });
    DBNIYears.sort();

    console.log(games);

    divFilter.addText("DBNI Season: ")
    var select = divFilter.addSelect();
    select.AddOption("All", null);
    DBNIYears.forEach(x => select.AddOption(x, x));

    divFilter.addLineBreak();
    divFilter.addLineBreak();
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