"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

function MakePage() {

    // switch (grouptype) {
    //     case "CS": grouptype = "CompetitionSeries"; break;
    //     case "CG": grouptype = "CustomCompetitionGroup"; break;
    //     case "DBNIQ": grouptype = "DBNIQ"; break;
    //     default: break;
    // }

    var reqs = myHub.MakeRequestList();
    var reqSeries = new dbnHubRequest_CompetitionSeries();

    reqs.addRequest([reqSeries]);

    var div = dbnHere().addDiv();
    div.addText("Loading...");

    reqs.Send();
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    div.innerHTML = "";

    // var groupinfo = reqGroupInfo.ResponseToObjects()[0];
    var card = div.addTitleCard("DBN Competitions");
    document.title = "DBN Competitions";

    card.style = "text-align: center";

    // var tabs = div.addTabs();
    // if (reqCompetitions.CompiledTable) tabs.addTab("Competitions", reqCompetitions.MakeUITable());
    // if (reqStandings.CompiledTable) tabs.addTab("Standings", reqStandings.MakeUITable());
    // if (reqStatistics.CompiledTable) tabs.addTab("Statistics", reqStatistics.MakeUITable());
    // tabs.SelectTabByIndex(0);

    var tbl = div.addTable();
    data = [];
    reqSeries.ResponseToObjects().forEach(x => {
        data.push([x.CompetitionSeriesName]);
    });
    tbl.Data = data;
    tbl.Generate();

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

