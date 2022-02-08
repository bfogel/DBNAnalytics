
function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqBids = new dbnHubRequest_Bids(playertoken);
    var reqPlayers = new dbnHubRequest_Players(playertoken);
    var reqSchedule = new dbnHubRequest_DBNISchedule(playertoken);

    reqs.addRequest([reqBids, reqPlayers, reqSchedule]);

    if (reqs.Send()) {
        reqs.Requests.forEach(x => {
            div.addText("Success: " + x.Success);
            div.addLineBreak();
            div.addText(x.Success ? JSON.stringify(x.ResponseContent) : x.Message);
            div.addLineBreak();
            div.addLineBreak();
        });

        div.addLineBreak();
        div.addText(reqs.ErrorMessage);

    } else {
        div.addText("fail " + reqs.ErrorMessage);
    }

}



MakePage();