"use strict";

class CompetitionController {

    CompetitionID = 0;
    CompetitionName = "";

    /** @type {PowerBidManager} */
    Manager;

    /** @type {dbnCompetitionPlayerSeed[]} */
    Seeds;
    /** @type {number[]} */
    Rounds;
    /** @type {dbnCompetitionPlayerSchedule[]} */
    Schedules;

    /** @type {BidSet[]} */
    BidSets;

    #ViewDiv;

    MakeBidSets() {
        this.Schedules.forEach(sched => {
            var bs = manager.MakeNewBidSet();
            bs.SeedInTourney = seed.Seed;
            bs.PlayerName = seed.PlayerName;
            bs.Round = schedule.Round;

            var thesebids = allbids.filter(bid => bid.CompetitionID == schedule.CompetitionID && bid.Round == schedule.Round);
            thesebids.forEach(bid => bs.Bids[bid.Country] = bid.Bid);

        });
    }

    MakeUI() {
        var card = new dbnCard();

        card.addHeading(1, this.CompetitionName);
        var bbRounds = card.addButtonBar();
        bbRounds.addButton("All bids", () => alert("yep" + round));
        this.Rounds.forEach((round, i) => {
            bbRounds.addButton("Round " + round, () => alert("yep" + round));
        });

        this.#ViewDiv = card.addDiv();
        return card;
    }

    #MakeAllBidsUI() {
        var ret = new dbnTable();


    }
}

/** @type {dbnUserInfo} */
var myUserInfo;

/** @type {CompetitionController[]]} */
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
      reqs.ReportToConsole(); return;

    myUserInfo = reqUserInfo.UserInfo;
    if (!myUserInfo) { div.addBoldText("Could not locate user"); return; }
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    //Passed user and data retrieval

    div.addTitleCard("DBN TD Portal: " + myUserInfo.PlayerName);

    var allseeds = reqSeeds.ResponseToObjects();
    var allschedules = reqSchedule.ResponseToObjects();
    // var allbids = reqBids.ResponseToObjects();

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

        div.appendChild(comp.MakeUI());

    });
    // allschedules.forEach(schedule => {
    //     var manager = PowerBidManager.GetManagerForCompetition(schedule.CompetitionID);
    //     var card = div.addCard();

    //     card.addHeading(1, schedule.CompetitionName);

    //     var tbl = card.addTable();

    //     var headers = ["Round", "Tourn<br>Seed"];
    //     headers.push(...manager.PowerNames);
    //     headers.push("Total", "Random", "");
    //     tbl.Headers = headers;

    //     var data = [];
    //     var bOneIsUnlocked = false;

    //     for (let iRound = 1; iRound < manager.RoundCount + 1; iRound++) {
    //         if (schedule["InRound" + iRound]) {
    //             var row = [];
    //             row.push("Round " + iRound);

    //             var bs = manager.MakeNewBidSet();
    //             bs.SeedInTourney = schedule.Seed;
    //             bs.PlayerName = playername;
    //             bs.Round = iRound;

    //             var locked = false;
    //             allbids.filter(bid => {
    //                 if (bid.CompetitionID == schedule.CompetitionID && bid.Round == iRound) {
    //                     bs.Bids[bid.Country] = bid.Bid;
    //                     if (bid.Locked) locked = true;
    //                 }
    //             });

    //             var pbi = new PlayerBidInput(manager);
    //             pbi.Locked = locked;
    //             var rowui = pbi.MakeRow();
    //             rowui.splice(2, 1); //Remove PlayerNamne
    //             rowui.splice(0, 1); //Remove SeedInRound

    //             if (!locked) {
    //                 bOneIsUnlocked = true;
    //                 var bbSave = new dbnButtonBar();
    //                 bbSave.Compact = true;
    //                 bbSave.addButton("Save", ((inp) => SaveBids(inp)).bind(undefined, pbi));
    //                 rowui.splice(1, 0, bbSave);
    //             }

    //             var bbRandom = new dbnButtonBar();
    //             bbRandom.Compact = true;
    //             bbRandom.addButton("Even", ((inp) => { inp.BidSet.MakeEven(); pbi.Manager.ValidateBidSets(); }).bind(undefined, pbi));
    //             bbRandom.addButton("Any", ((inp) => { inp.BidSet.MakeRandom(); pbi.Manager.ValidateBidSets(); }).bind(undefined, pbi));
    //             rowui.splice(rowui.length - 1, 0, bbRandom);

    //             row.push(...rowui);
    //             manager.RegisterBidSet(bs);
    //             pbi.BidSet = bs;

    //             data.push(row);
    //         }
    //     }

    //     if (bOneIsUnlocked) tbl.Headers.splice(2, 0, "Save");
    //     tbl.CountryColumns = {};
    //     manager.PowerNames.forEach((x, i) => tbl.CountryColumns[i + 2 + (bOneIsUnlocked ? 1 : 0)] = x);

    //     tbl.Data = data;
    //     tbl.Generate();
    //     manager.ValidateBidSets();

    //     if (bOneIsUnlocked) card.appendChild(manager.MakeInstructions());

    // });
}

/**
 * @param {PlayerBidInput} pbi 
 */
function SaveBids(pbi) {
    if (pbi.BidSet.LastValidationMessages) {
        alert("The bid set is not valid:\n" + pbi.BidSet.LastValidationMessages.replace("<br>", "\n"));
        return;
    }

    var playertoken = myHub.PlayerToken;

    var parms = { "token": playertoken, "competitionid": pbi.BidSet.CompetitionID, "round": pbi.BidSet.Round, "bids": JSON.stringify(pbi.BidSet.Bids) };
    var req = new bfDataRequest("savebid", parms);
    req.SendAlone();

    if (!req.Success) {
        alert("Unable to save: " + req.Message);
    } else {
        alert("Saved");
        // console.log(JSON.stringify(req.ResponseContent));
    }
}

MakePage();
