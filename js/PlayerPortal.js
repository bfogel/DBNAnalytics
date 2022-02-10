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
        var titlecard = div.addTitleCard("DBNI Player Portal: " + playername);

        var allschedules = reqSchedule.ResponseToObjects();
        var allbids = reqBids.ResponseToObjects();

        allschedules.forEach(schedule => {
            var manager = PowerBidManager.GetManagerForCompetition(schedule.CompetitionID);
            var card = div.addCard();

            card.addHeading(2, schedule.CompetitionName);
            card.addHeading(3, "Seed #" + schedule.Seed);
            card.appendChild(manager.MakeInstructions());

            var tbl = card.addTable();

            var headers = ["Round", "Tourn<br>Seed"];
            var countrycolumns = [];
            manager.PowerNames.forEach((x, i) => { headers.push(x); countrycolumns[i + 2] = x; });
            headers.push("Total", "Random", "");
            tbl.Headers = headers;
            tbl.CountryColumns = countrycolumns;

            var data = [];

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
                    var rowui = pbi.MakeRow();
                    rowui.splice(2, 1);
                    rowui.splice(0, 1);

                    var bbRow = new dbnButtonBar();
                    bbRow.Compact = true;
                    bbRow.addButton("Even", ((inp) => { inp.BidSet.MakeEven(); inp.UpdateDisplay(); }).bind(undefined, pbi));
                    bbRow.addButton("Any", ((inp) => { inp.BidSet.MakeRandom(); inp.UpdateDisplay(); }).bind(undefined, pbi));
                    rowui.splice(rowui.length - 1, 0, bbRow);

                    row.push(...rowui);
                    manager.RegisterBidSet(bs);
                    pbi.BidSet = bs;

                    data.push(row);
                }
            }
            tbl.Data = data;
            tbl.Generate();
            manager.ValidateBidSets();
        });
    };

}

MakePage();
