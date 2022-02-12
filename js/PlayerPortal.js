"use strict";

function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqUserInfo = new dbnHubRequest_UserInfo();
    var reqSeeds = new dbnHubRequest_CompetitionPlayerSeed();
    var reqSchedule = new dbnHubRequest_CompetitionPlayerSchedule();
    var reqBids = new dbnHubRequest_Bids();

    reqs.addRequest([reqUserInfo, reqSeeds, reqSchedule, reqBids]);

    reqs.Send();
    // reqs.ReportToConsole();
    // return;

    var userinfo = reqUserInfo.UserInfo;
    if (!userinfo) {
        div.addBoldText("Could not locate user");
        return;
    }

    if (!reqs.Success) {
        reqs.ReportToConsole();
        return;
    }

    div.addTitleCard("DBN Player Portal: " + userinfo.PlayerName);

    var allseeds = reqSeeds.ResponseToObjects();
    var allschedules = reqSchedule.ResponseToObjects();
    var allbids = reqBids.ResponseToObjects();

    allseeds.forEach(seed => {
        var manager = PowerBidManager.GetManagerForCompetition(seed.CompetitionID);
        var card = div.addCard();

        card.addHeading(1, seed.CompetitionName);

        var tbl = card.addTable();

        var headers = ["Round", "Tourn<br>Seed"];
        headers.push(...manager.PowerNames);
        headers.push("Total", "Random", "");
        tbl.Headers = headers;

        var data = [];
        var bOneIsUnlocked = false;

        allschedules.filter(x => x.CompetitionID == seed.CompetitionID).forEach(schedule => {

            var row = [];
            row.push("Round " + schedule.Round);

            var bs = manager.MakeNewBidSet();
            bs.SeedInTourney = seed.Seed;
            bs.PlayerName = seed.PlayerName;
            bs.Round = schedule.Round;

            var thesebids = allbids.filter(bid => bid.CompetitionID == schedule.CompetitionID && bid.Round == schedule.Round);
            thesebids.forEach(bid => bs.Bids[bid.Country] = bid.Bid);

            var pbi = new PlayerBidInput(manager);
            pbi.BidsLocked = schedule.BidsLocked;
            var rowui = pbi.MakeRow();
            rowui.splice(2, 1); //Remove PlayerNamne
            rowui.splice(0, 1); //Remove SeedInRound

            if (!schedule.BidsLocked) {
                bOneIsUnlocked = true;
                var bbSave = new dbnButtonBar();
                bbSave.Compact = true;
                bbSave.addButton("Save", ((inp) => SaveBids(inp)).bind(undefined, pbi));
                rowui.splice(1, 0, bbSave);
            }

            var bbRandom = new dbnButtonBar();
            bbRandom.Compact = true;
            bbRandom.addButton("Even", ((inp) => { inp.BidSet.MakeEven(); pbi.Manager.ValidateBidSets(); }).bind(undefined, pbi));
            bbRandom.addButton("Any", ((inp) => { inp.BidSet.MakeRandom(); pbi.Manager.ValidateBidSets(); }).bind(undefined, pbi));
            rowui.splice(rowui.length - 1, 0, bbRandom);

            row.push(...rowui);
            manager.RegisterBidSet(bs);
            pbi.BidSet = bs;

            data.push(row);
        });

        if (bOneIsUnlocked) tbl.Headers.splice(2, 0, "Save");
        tbl.CountryColumns = {};
        manager.PowerNames.forEach((x, i) => tbl.CountryColumns[i + 2 + (bOneIsUnlocked ? 1 : 0)] = x);

        tbl.Data = data;
        tbl.Generate();
        manager.ValidateBidSets();

        if (bOneIsUnlocked) card.appendChild(manager.MakeInstructions());

    });
}

/**
 * @param {PlayerBidInput} pbi 
 */
function SaveBids(pbi) {
    if (pbi.BidSet.LastValidationMessages) {
        alert("The bid set is not valid:\n" + pbi.BidSet.LastValidationMessages.replace("<br>", "\n"));
        return;
    }

    var parms = { "competitionid": pbi.BidSet.CompetitionID, "round": pbi.BidSet.Round, "bids": JSON.stringify(pbi.BidSet.Bids) };
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
