


function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var req = reqs.addPlayerProfile("mytoken");

    if (reqs.Send()) {
        div.addText(req.Response);
    } else {
        div.addText("fail " + reqs.ErrorMessage);
    }

}



MakePage();