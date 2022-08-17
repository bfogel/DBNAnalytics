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
    var reqGame = new dbnHubRequest_GetGameJSON([myGameID]);
    // var reqGameData = new dbnHubRequest_GetGameData(myGameID);
    reqs.addRequest([reqGame]);

    var div = dbnHere().addDiv();
    div.addText("Loading...");

    reqs.Send();
    console.log(reqGame.ResponseToObjects()[0]);
    reqs.ReportToConsole(); return;
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    div.innerHTML = "";

    //    var gamephases =

    // var groupinfo = reqGroupInfo.ResponseToObjects()[0];
    var card = div.addTitleCard("All Competitions");
    card.addText("A compendium of all competitions covered on DBN");
    document.title = "All Competitions";

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

