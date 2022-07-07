"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 * @typedef {import('./PowerAuction')}
 */

/** @type{int|null} */
var myCompetitionID = null;

myHub.Parameters["CompetitionID"] = 4069;

function MakePage() {
    var urlparams = new URLSearchParams(window.location.search);
    if (urlparams.has("CompetitionID")) myCompetitionID = Number.parseInt(urlparams.get("CompetitionID"));
    if ("CompetitionID" in myHub.Parameters) myCompetitionID = myHub.Parameters["CompetitionID"];

    var reqs = myHub.MakeRequestList();
    var reqCompetitionInfo = new dbnHubRequest_Competition(myCompetitionID);
    var reqStandings = new dbnHubRequest_CompiledTable("CompetitionStandings", myCompetitionID);
    var reqPowerSummary = new dbnHubRequest_CompiledTable("CompetitionPowerSummary", myCompetitionID);
    var reqPlayerSummary = new dbnHubRequest_CompiledTable("CompetitionPlayerSummary", myCompetitionID);
    var reqAwards = new dbnHubRequest_CompiledTable("CompetitionAwards", myCompetitionID);
    var reqGames = new dbnHubRequest_GetGames([4478, 4483]);

    reqGames.SendAlone();
    reqGames.ReportToConsole();
    return;

    reqs.addRequest([reqCompetitionInfo, reqStandings, reqPowerSummary, reqPlayerSummary, reqAwards]);

    var div = dbnHere().addDiv();
    div.addText("Loading...");

    reqs.Send();
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    div.innerHTML = "";

    var compinfo = reqCompetitionInfo.ResponseToObjects()[0];
    var card = div.addTitleCard(compinfo.CompetitionName);
    if (compinfo.Director_PlayerName) card.addText("Director: " + compinfo.Director_PlayerName); card.addLineBreak();
    card.addText("Scoring: " + compinfo.DefaultScoringSystem); card.addLineBreak();
    card.addText("Language: " + compinfo.DefaultLanguage);

    var tabs = div.addTabs();
    tabs.addTab("Standings", reqStandings.MakeUITable());
    if (reqAwards.CompiledTable) tabs.addTab("Awards", reqAwards.MakeUITable());

    var divStats = new dbnDiv();
    divStats.addRange([reqPowerSummary.MakeUITable(), reqPlayerSummary.MakeUITable()]);
    tabs.addTab("Statistics", divStats);

    tabs.addTab("Games", "hi");

    tabs.SelectTabByIndex(0);


}
MakePage();

//-------------------

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
