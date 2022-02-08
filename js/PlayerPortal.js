
function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqBids = new dbnHubRequest_Bids(playertoken);
    var reqPlayers = new dbnHubRequest_Players(playertoken);
    reqs.addRequest([reqBids, reqPlayers]);

    if (reqs.Send()) {
        div.addText("Bids Success: " + reqBids.Success);
        div.addLineBreak();
        div.addText(JSON.stringify(reqBids.ResponseContent));
        div.addLineBreak();
        div.addLineBreak();

        div.addText("Player Success: " + reqPlayers.Success);
        div.addLineBreak();
        div.addText(JSON.stringify(reqPlayers.ResponseToPlayers())); div.addLineBreak();
        div.addText(JSON.stringify(reqPlayers.Message)); div.addLineBreak();

        div.addLineBreak();
        div.addText(reqs.ErrorMessage);
    } else {
        div.addText("fail " + reqs.ErrorMessage);
    }

}



MakePage();