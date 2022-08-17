"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 * @typedef {import('./GameModel.js')}
 * @typedef {import('./MapView.js')}
 */


function MakePage() {

    var urlparams = new URLSearchParams(window.location.search);
    if (!urlparams.has("GameID")) {
        dbnHere().addText("No game selected");
        return;
    }

    var myGameID = Number.parseInt(urlparams.get("GameID"));
    //if ("competitionid" in myHub.Parameters) myCompetitionID = Number.parseInt(myHub.Parameters["competitionid"]);

    var reqs = myHub.MakeRequestList();
    var reqGame = new dbnHubRequest_GetGameJSON(myGameID);
    // var reqGameData = new dbnHubRequest_GetGameData(myGameID);
    reqs.addRequest([reqGame]);

    var div = dbnHere().addDiv();
    div.addText("Loading...");

    reqs.Send();
    var game = reqGame.ResponseToObject();
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    div.innerHTML = "";

    document.title = "Game: " + game.GameLabel;
    var card = div.addTitleCard(document.title);
    //    card.addText("A compendium of all competitions covered on DBN");

    div = card.addDiv();
    div.style.display = "table-row";
    // div.domelement.style.whiteSpace = "nowrap";
    // div.domelement.style.verticalAlign = "top";

    var div2 = div.addDiv();
    var table = game.MakeResultTable();
    div2.style.display = "table-cell";
    div2.style.verticalAlign = "top";
    div2.add(table);

    div2 = div.addDiv();
    div2.style.display = "table-cell";
    div2.style.width = "100%";
    var mv = new dbnMapView(div2);
    //    mv.style.display = "inline-block";
    mv.Game = game;
    mv.GamePhase = game.GamePhases[0];

}
MakePage();

//-------------------------------------------------------------------------------------------------------------------------------------

/**
 * 
 * @param {dbnGame[]} games 
 */
function MakeGameList(games) {
    var ret = new dbnDiv();

    //games = [games[0]];

    games.forEach(x => {
        var div = ret.addDiv();
        div.style = "display:inline-block; white-space: nowrap;";

        var table = div.addTable();
        table.Title = x.Label;
        var data = [];
        Object.values(x.ResultLines).forEach(rl => {
            data.push([rl.Country, rl.Player.PlayerName, "(" + rl.CenterCount + ")", rl.Score]);
        });
        table.Data = data;
        table.CountryRows = Object.keys(x.ResultLines);
        table.Generate();

        var mv = new dbnMapView(div);

        var game = new gmGame(x);
        mv.Game = game;

        var gp = new gmGamePhase(null);
        gp.SupplyCenters = {};
        Object.values(x.ResultLines).forEach(rl => {
            gp.SupplyCenters[rl.Country] = JSON.parse(rl.SupplyCenters);
        });
        game.GamePhases = [gp];
        mv.GamePhase = gp;

        mv.Draw();

        ret.addHardRule();
    });
    return ret;
}

//-------------------------------------------------------------------------------------------------------------------------------------

