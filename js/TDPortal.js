"use strict";

/** @type {dbnUserInfo} */
var myUserInfo;

/** @type {CompetitionAuctionController[]} */
var myCompetitions = [];

function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqUserInfo = new dbnHubRequest_UserInfo();
    var reqSeeds = new dbnHubRequest_CompetitionPlayerSeed(true);
    var reqSchedule = new dbnHubRequest_CompetitionPlayerSchedule(true);
    var reqBids = new dbnHubRequest_Bids(true);

    reqs.addRequest([reqUserInfo, reqSeeds, reqSchedule, reqBids]);

    reqs.Send();

    myUserInfo = reqUserInfo.UserInfo;
    if (!myUserInfo) { div.addBoldText("Could not locate user (" + reqUserInfo.Message + ")"); return; }
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    //Passed user and data retrieval

    div.addTitleCard("DBN TD Portal: " + myUserInfo.PlayerName);

    var allseeds = reqSeeds.ResponseToObjects();
    var allschedules = reqSchedule.ResponseToObjects();
    var allbids = reqBids.ResponseToObjects();

    //Collect competitions
    allseeds.forEach(x => {
        if (!myCompetitions.hasOwnProperty(x.CompetitionID)) {
            var comp = new CompetitionAuctionController(x.CompetitionID, x.CompetitionName);
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

        var card = new dbnCard();
        card.addHeading(1, comp.CompetitionName);
        card.add(comp.MakeUI());

        div.appendChild(card);

    });
}

MakePage();
