
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

        var card = div.addCard();
        var sched = reqSchedule.ResponseToObjects();

        sched.forEach(x => {
            card.addText(x.CompetitionName); card.addLineBreak();
            for (let i = 1; i < 5; i++) {
                if (x["InRound" + i]) {
                    card.addText("Round " + i + ":"); card.addLineBreak();
                }

            }
        });
    };

}

MakePage();