"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

/** @type {CompetitionController} */
var myCompetition;

function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqSeeds = new dbnHubRequest_CompetitionPlayerSeed(true);
    var reqSchedule = new dbnHubRequest_CompetitionPlayerSchedule(true);
    var reqBids = new dbnHubRequest_Bids(true);

    reqs.addRequest([reqSeeds, reqSchedule, reqBids]);

    reqs.Send();

    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    //Passed data retrieval

    div.addTitleCard("DBN TD Portal: " + myUserInfo.PlayerName);

    var allseeds = reqSeeds.ResponseToObjects();
    var allschedules = reqSchedule.ResponseToObjects();
    var allbids = reqBids.ResponseToObjects();

    //Collect competitions
    allseeds.forEach(x => {
        if (!myCompetitions.hasOwnProperty(x.CompetitionID)) {
            var comp = new CompetitionController();
            comp.CompetitionID = x.CompetitionID;
            comp.CompetitionName = x.CompetitionName;
            myCompetitions[x.CompetitionID] = comp;
        }
    });

    myCompetitions.forEach(comp => {
        comp.Manager = PowerBidManager.GetManagerForCompetition(comp.CompetitionID);

        comp.Seeds = allseeds.filter(x => x.CompetitionID == comp.CompetitionID);
        comp.Seeds.sort((a, b) => a.Seed - b.Seed);

        comp.Rounds = [];
        allschedules.forEach(x => { if (!comp.Rounds.includes(x.Round)) comp.Rounds.push(x.Round); });
        comp.Rounds.sort();

        comp.Schedules = allschedules.filter(x => x.CompetitionID == comp.CompetitionID);

        comp.MakeBidSets(allbids);

        div.appendChild(comp.MakeUI());

    });
}

MakePage();
