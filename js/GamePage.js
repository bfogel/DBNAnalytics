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
    game.ScorePhases();
    // console.log(reqGame.ResponseContent);
    // console.log(game);

    div.innerHTML = "";

    document.title = "Game: " + game.GameLabel;
    var card = div.addTitleCard(document.title);
    //    card.addText("A compendium of all competitions covered on DBN");

    var board = new dbnFullBoard(card);

    // var divBoard = card.addDiv();
    // divBoard.style.border = "10px solid black";
    // divBoard.style.borderRadius = "10px";
    // divBoard.style.overflowX = "auto";

    // var divRow = divBoard.addDiv();
    // divRow.style.display = "table-row";

    // let divsb = divRow.addDiv();
    // divsb.style.display = "table-cell";
    // divsb.style.verticalAlign = "top";
    // var sb = new dbnScoreboard(divsb);

    // let divmv = divRow.addDiv();
    // divmv.style.display = "table-cell";
    // divmv.style.width = "100%";
    // divmv.style.minWidth = "300px";

    // var mv = new dbnMapView(divmv);
    // sb.BindToMapView(mv);

    board.Game = game;
    var phase = game.GamePhases[19];
    board.GamePhase = phase;

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

