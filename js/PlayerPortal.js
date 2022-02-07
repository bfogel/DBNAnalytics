
function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var req = reqs.addPlayerProfile(playertoken);

    if (reqs.Send()) {
        div.addText("Success: " + req.Success);
        div.addLineBreak();
        div.addText(JSON.stringify(req.Response));
    } else {
        div.addText("fail " + reqs.ErrorMessage);
    }

}



MakePage();