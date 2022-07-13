"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

function MakePage() {

    var reqs = myHub.MakeRequestList();
    var reqSeries = new dbnHubRequest_CompetitionSeriesByRoot("hi");

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
    tbl.Headers = ["Series", "#", "Earliest", "Latest"];
    var data = [];
    var urls = [];
    reqSeries.ResponseToObjects()
        .sort((a, b) => a.CompetitionSeriesName.localeCompare(b.CompetitionSeriesName))
        .forEach((x, i) => {
            data.push([x.CompetitionSeriesName, x.CompetitionCount, x.Earliest, x.Latest]);
            urls.push([i, myHub.MakeCompetitionSeriesURL(x.CompetitionSeriesID)])
        });
    tbl.Data = data;
    tbl.RowUrls = urls;
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

