"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

/** @type{int|null} */
var myCompetitionGroupID = null;

function MakePage() {
    var urlparams = new URLSearchParams(window.location.search);
    if (urlparams.has("CompetitionGroupID")) myCompetitionGroupID = Number.parseInt(urlparams.get("CompetitionGroupID"));
    if ("CompetitionGroupID" in myHub.Parameters) myCompetitionGroupID = myHub.Parameters["CompetitionGroupID"];

    var reqs = myHub.MakeRequestList();
    var reqGroupInfo = new dbnHubRequest_CompetitionGroup(myCompetitionGroupID);
    var reqStandings = new dbnHubRequest_CompiledTable("CompetitionGroup_Standings", myCompetitionGroupID);
    var reqCompetitions = new dbnHubRequest_CompiledTable("CompetitionGroup_CompetitionList", myCompetitionGroupID);
    var reqStatistics = new dbnHubRequest_CompiledTable("CompetitionGroup_Statistics", myCompetitionGroupID);

    reqs.addRequest([reqGroupInfo, reqStandings, reqCompetitions, reqStatistics]);

    var div = dbnHere().addDiv();
    div.addText(myCompetitionGroupID);
    div.addText("Loading...");

    reqs.Send();
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    div.innerHTML = "";

    var groupinfo = reqGroupInfo.ResponseToObjects()[0];
    var card = div.addTitleCard(groupinfo.Label);

    // var tabs = div.addTabs();
    // tabs.addTab("Standings", reqStandings.MakeUITable());
    // if (reqAwards.CompiledTable) tabs.addTab("Awards", reqAwards.MakeUITable());

    // var divStats = new dbnDiv();
    // divStats.addRange([reqPowerSummary.MakeUITable(), reqPlayerSummary.MakeUITable()]);
    // tabs.addTab("Statistics", divStats);

    // tabs.addTab("Games", MakeGameList(reqGames.ResponseToObjects()));

    // tabs.SelectTabByIndex(0);


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

/** @type {CompetitionController} */
var myCompetition;

function MakeAuctionTab(competitionid) {
    var ret = dbnHere().addDiv();

    //NOTE: These requests should be modified to take a CompetitionID
    var reqs = myHub.MakeRequestList();
    var reqSeeds = new dbnHubRequest_CompetitionPlayerSeed(true);
    var reqSchedule = new dbnHubRequest_CompetitionPlayerSchedule(true);
    var reqBids = new dbnHubRequest_Bids(true);

    reqs.addRequest([reqSeeds, reqSchedule, reqBids]);

    reqs.Send();

    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    //Passed data retrieval

    var allseeds = reqSeeds.ResponseToObjects();
    var allschedules = reqSchedule.ResponseToObjects();
    var allbids = reqBids.ResponseToObjects();

    //Get competition
    var seeds = allseeds.filter(x => x.CompetitionID == competitionid);
    if (seeds.length == 0) return;

    myCompetition = new CompetitionAuctionController(seeds[0].CompetitionID, seeds[0].CompetitionName);

    myCompetition.Manager = PowerBidManager.GetManagerForCompetition(myCompetition.CompetitionID);

    myCompetition.Seeds = allseeds.filter(x => x.CompetitionID == myCompetition.CompetitionID);
    myCompetition.Seeds.sort((a, b) => a.Seed - b.Seed);

    myCompetition.Rounds = [];
    allschedules.forEach(x => { if (!myCompetition.Rounds.includes(x.Round)) myCompetition.Rounds.push(x.Round); });
    myCompetition.Rounds.sort();

    myCompetition.Schedules = allschedules.filter(x => x.CompetitionID == myCompetition.CompetitionID);

    myCompetition.MakeBidSets(allbids);

    ret.appendChild(myCompetition.MakeUI());

    return ret;
}
