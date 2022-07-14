"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 * @typedef {import('./GameModel')}
 * @typedef {import('./MapView')}
 * @typedef {import('./PowerAuction')}
 */

/** @type{int|null} */
var myCompetitionID = null;

//myHub.Parameters["CompetitionID"] = 4069;

function MakePage() {
    var urlparams = new URLSearchParams(window.location.search);
    if (urlparams.has("CompetitionID")) myCompetitionID = Number.parseInt(urlparams.get("CompetitionID"));
    if ("CompetitionID" in myHub.Parameters) myCompetitionID = myHub.Parameters["CompetitionID"];

    var reqs = myHub.MakeRequestList();
    var reqCompetitionInfo = new dbnHubRequest_Competition(myCompetitionID);
    var reqStandings = new dbnHubRequest_CompiledTable("Competition", myCompetitionID, "Standings");
    var reqPowerSummary = new dbnHubRequest_CompiledTable("Competition", myCompetitionID, "PowerSummary");
    var reqPlayerSummary = new dbnHubRequest_CompiledTable("Competition", myCompetitionID, "PlayerSummary");
    var reqAwards = new dbnHubRequest_CompiledTable("Competition", myCompetitionID, "Awards");
    var reqGames = new dbnHubRequest_GetGames(null, [myCompetitionID]);

    reqs.addRequest([reqCompetitionInfo, reqStandings, reqPowerSummary, reqPlayerSummary, reqAwards, reqGames]);

    var div = dbnHere().addDiv();
    div.addText("Loading...");

    reqs.Send();
    if (!reqs.Success) { reqs.ReportToConsole(); return; }
    console.log(JSON.parse(reqStandings.CompiledTable.TableJSON));

    div.innerHTML = "";

    var compinfo = reqCompetitionInfo.ResponseToObjects()[0];
    document.title = compinfo.CompetitionName;

    var card = div.addTitleCard(compinfo.CompetitionName);
    if (compinfo.Director_PlayerName) { card.addText("Director: " + compinfo.Director_PlayerName); card.addLineBreak(); }
    card.addText("Scoring: " + compinfo.DefaultScoringSystem); card.addLineBreak();
    card.addText("Language: " + compinfo.DefaultLanguage); card.addLineBreak();

    var cslink = card.addLink();
    cslink.href = myHub.MakeCompetitionSeriesURL(compinfo.CompetitionSeries_CompetitionSeriesID);
    cslink.addText("Go to " + compinfo.CompetitionSeries_CompetitionSeriesName + " Series");

    if (compinfo.DBNIYear) {
        card.addLineBreak();
        var dbnilink = card.addLink();
        dbnilink.href = myHub.MakeDBNIQURL(compinfo.DBNIYear);
        dbnilink.addText("Go to DBNI " + compinfo.DBNIYear + " Qualifying");
    }

    var tabs = div.addTabs();
    if (reqStandings.CompiledTable) tabs.addTab("Standings", reqStandings.MakeUITable());
    if (reqAwards.CompiledTable) tabs.addTab("Awards", reqAwards.MakeUITable());

    var divStats = new dbnDiv();
    if (reqPowerSummary.CompiledTable) divStats.add(reqPowerSummary.MakeUITable());
    if (reqPlayerSummary.CompiledTable) divStats.add(reqPlayerSummary.MakeUITable());
    tabs.addTab("Statistics", divStats);

    tabs.addTab("Games", MakeGameList(reqGames.ResponseToObjects()));

    tabs.SelectTabByIndex(0);


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
        if (x.URL) {
            var titlink = new dbnLink();
            titlink.addText(x.Label + " ");
            var icon = titlink.createAndAppendElement("i");
            icon.className = "fa fa-external-link";
            icon.domelement.setAttribute("aria-hidden", "true");
            titlink.href = x.URL;
            table.Title = titlink;
        }


        var data = [];
        Object.values(x.ResultLines).forEach(rl => {
            data.push([rl.Country, rl.Player.PlayerName, "(" + rl.CenterCount + ")", rl.Score]);
        });
        table.Data = data;
        table.CountryRows = Object.keys(x.ResultLines);
        table.Generate();

        //Unfalse this to show final map state
        if (false) {
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
        }
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
