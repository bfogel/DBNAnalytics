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
        headers.push("Total", "Note");
        tbl.Headers = headers;

        var data = [];
        var bOneIsUnlocked = false;

        var theseschedules = allschedules.filter(x => x.CompetitionID == seed.CompetitionID);
        theseschedules.sort((a, b) => a.Round - b.Round);

        theseschedules.forEach(schedule => {

            var row = [];
            row.push("Round " + schedule.Round);

            var bs = manager.MakeNewBidSet();
            bs.SeedInTourney = seed.Seed;
            bs.PlayerName = seed.PlayerName;
            bs.Round = schedule.Round;

            var thesebids = allbids.filter(bid => bid.CompetitionID == schedule.CompetitionID && bid.Round == schedule.Round);
            thesebids.forEach(bid => bs.Bids[bid.Country] = bid.Bid);

            var pbi = new PlayerBidInput(manager, schedule.BidsLocked);
            pbi.BidsLocked = schedule.BidsLocked;

            row.push(pbi.UI_SeedInTourney);

            /** @type {dbnButton} */
            var btnSave;

            if (!schedule.BidsLocked) {
                bOneIsUnlocked = true;
                var bbSave = new dbnButtonBar();
                bbSave.Compact = true;
                btnSave = bbSave.addButton("Save", null);
                btnSave.onclick = ((inp, button) => SaveBids(inp, button)).bind(undefined, pbi, btnSave);
                btnSave.disabled = true;
                pbi.OnChange = () => btnSave.disabled = false;
                row.push(bbSave);
            }

            row.push(...Object.values(pbi.UI_Bids), pbi.UI_BidTotal);

            if (!schedule.BidsLocked) {
                var bbRandom = new dbnButtonBar();
                bbRandom.Compact = true;
                bbRandom.addButton("Even", ((inp, button) => { inp.BidSet.MakeEven(); button.disabled = false; pbi.Manager.ValidateBidSets(); }).bind(undefined, pbi, btnSave));
                bbRandom.addButton("Any", ((inp, button) => { inp.BidSet.MakeRandom(); button.disabled = false; pbi.Manager.ValidateBidSets(); }).bind(undefined, pbi, btnSave));
                row.push(bbRandom);
            }
            row.push(pbi.UI_ValidationMessage);

            manager.RegisterBidSet(bs);
            pbi.BidSet = bs;

            data.push(row);
        });

        if (bOneIsUnlocked) {
            tbl.Headers.splice(2, 0, "Save");
            tbl.Headers.splice(tbl.Headers.length - 2, 0, "Random");
        }
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
function SaveBids(pbi, btn) {
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
        btn.disabled = true;
        // console.log(JSON.stringify(req.ResponseContent));
    }
}

MakePage();
