
function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqBids = new dbnHubRequest_Bids(playertoken);
    var reqPlayers = new dbnHubRequest_Players(playertoken);
    var reqSchedule = new dbnHubRequest_DBNISchedule(playertoken);

    reqs.addRequest([reqPlayers, reqBids, reqSchedule]);

    reqs.Send();
    reqs.ReportToDiv(div);

}

MakePage();