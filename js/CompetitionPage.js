"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 * @typedef {import('./PowerAuction')}
 */

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