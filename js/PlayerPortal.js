"use strict";

function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqPlayers = new dbnHubRequest_Players(playertoken);
    var reqSchedule = new dbnHubRequest_DBNISchedule(playertoken);
    var reqBids = new dbnHubRequest_Bids(playertoken);

    reqs.addRequest([reqPlayers, reqSchedule, reqBids]);

    if (reqs.Send()) {
        //reqs.ReportToDiv(div);

        var playername = reqPlayers.ResponseToObjects()[0]["PlayerName"];
        div.addTitleCard("DBNI Player Portal: " + playername);

        var allschedules = reqSchedule.ResponseToObjects();
        var allbids = reqBids.ResponseToObjects();

        allschedules.forEach(schedule => {
            var manager = PowerBidManager.GetManagerForCompetition(schedule.CompetitionID);
            var card = div.addCard();

            card.addHeading(2, schedule.CompetitionName);
            card.addHeading(3, "Seed #" + schedule.Seed);
            //card.appendChild(manager.MakeInstructions());

            var tbl = card.addTable();

            var headers = ["Round", "Tourn<br>Seed"];
            headers.push(...manager.PowerNames);
            headers.push("Total", "Random", "");
            tbl.Headers = headers;

            var data = [];
            var bOneIsUnlocked = false;

            for (let iRound = 1; iRound < manager.RoundCount + 1; iRound++) {
                if (schedule["InRound" + iRound]) {
                    var row = [];
                    row.push("Round " + iRound);

                    var bs = manager.MakeNewBidSet();
                    bs.SeedInTourney = schedule.Seed;
                    bs.PlayerName = playername;
                    bs.Round = iRound;

                    var locked = false;
                    allbids.filter(bid => {
                        if (bid.CompetitionID == schedule.CompetitionID && bid.Round == iRound) {
                            bs.Bids[bid.Country] = bid.Bid;
                            if (bid.Locked) locked = true;
                        }
                    });

                    var pbi = new PlayerBidInput(manager);
                    pbi.Locked = locked;
                    var rowui = pbi.MakeRow();
                    rowui.splice(2, 1); //Remove PlayerNamne
                    rowui.splice(0, 1); //Remove SeedInRound

                    if (!locked) {
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
                }
            }

            if (bOneIsUnlocked) tbl.Headers.splice(2, 0, "Save");
            tbl.CountryColumns = {};
            manager.PowerNames.forEach((x, i) => tbl.CountryColumns[i + 2 + (bOneIsUnlocked ? 1 : 0)] = x);

            tbl.Data = data;
            tbl.Generate();
            manager.ValidateBidSets();
        });
    };
}

/**
 * @param {PlayerBidInput} pbi 
 */
function SaveBids(pbi) {
    var parms = { "token": playertoken + "A", "round": pbi.BidSet.Round, "bids": JSON.stringify(pbi.BidSet.Bids) };
    var req = new bfDataRequest("savebid", parms);
    req.SendAlone();

    if (!req.Success) {
        alert("Unable to save: " + req.Message);
    } else {
        console.log(JSON.stringify(req.ResponseContent));
    }
}

MakePage();
