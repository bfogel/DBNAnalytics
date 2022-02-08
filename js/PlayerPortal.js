
function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var req = new dbnHubRequest_Bids(playertoken);
    reqs.addRequest(req);

    if (reqs.Send()) {
        div.addText("Success: " + req.Success);
        div.addLineBreak();
        div.addText(JSON.stringify(req.ResponseContent));
        div.addLineBreak();
        div.addText(reqs.ErrorMessage);
    } else {
        div.addText("fail " + reqs.ErrorMessage);
    }

}



MakePage();