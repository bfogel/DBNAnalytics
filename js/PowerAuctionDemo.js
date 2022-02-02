
var cardTitle = dbnHere().addCard();
var cardDemo = dbnHere().addCard();

var divOutput = new dbnDiv();
var divMessages = divOutput.addDiv();
divMessages.className = "board outputMessages";

var mConfiguration = new PowerBidConfiguration();
mConfiguration.PowerNames = ["Austria", "England", "France", "Germany", "Italy", "Russia", "Turkey"];
mConfiguration.BoardCount = 2;

mConfiguration.MaximumTotal = 179;
mConfiguration.MustUseAllPoints = false;
mConfiguration.MaximumIndividualBid = 164;
mConfiguration.MinimumIndividualBid = 0;
mConfiguration.IdenticalBidsProhibited = true;

function MakePage() {

    var title = cardTitle.createAndAppendElement("h1");
    title.addText("DBN Invitational Power Auction Demo");
    //titlecard.addText("DBNI qualifying events and exhibitions covered by DBN");

    MakeInputTable();

    dbnHere().appendChild(divOutput);

    // var ss = cardPlayerComparison.createAndAppendElement("style");
    // ss.addText(".otherPlayers {font-size: 15px !important; line-height: 130%; margin-bottom: 5px;}");

    // cardPlayerComparison.addText("Player 1: ");
    // selPlayer1 = new dbnPlayerSelector(cardPlayerComparison);

    // cardPlayerComparison.createAndAppendElement("br");

    // cardPlayerComparison.addText("Player 2: ");
    // selPlayer2 = new dbnPlayerSelector(cardPlayerComparison);

    // selPlayer1.onchange = LoadComparison;
    // selPlayer2.onchange = LoadComparison;

    // var style = "width: 300px; margin-bottom: 10px;";
    // selPlayer1.domelement.style = style;
    // selPlayer2.domelement.style = style;

    // divGames = cardPlayerComparison.addDiv();

    // divGamesStatus = cardPlayerComparison.addDiv();

    // selPlayer1.domelement.value = 203;
    // selPlayer2.domelement.value = 222;
    // LoadComparison();

}

class PlayerBidInput {
    seed = null;
    inputs = {};
    totalSpan = null;
    validateSpan = null;
    resultSpans = {};

    GetBidSet() {
        var ret = mConfiguration.MakeNewBidSet();

        for (const key in this.inputs) {
            var val = this.inputs[key].domelement.value;
            if (!isNaN(val)) ret.Bids[key] = Number(val);
        }
        return ret;
    }

    Validate() {
        var bs = this.GetBidSet();
        console.log(bs.Total);
        this.totalSpan.domelement.innerHTML = bs.Total;
        this.validateSpan.domelement.innerHTML = bs.ValidateAndGetMessages();
    }

    UpdateFromBidSet(pBidSet) {
        mConfiguration.PowerNames.forEach(powername => this.inputs[powername].domelement.value = pBidSet.Bids[powername]);
        this.Validate();
    }

    MakeRandom() {
        var bs = mConfiguration.MakeNewBidSet();
        bs.MakeRandom();
        this.UpdateFromBidSet(bs);
    }

    MakeEven() {
        var cc = mConfiguration.Duplicate();
        cc.MaximumTotal = 100;
        var bs = cc.MakeNewBidSet();
        bs.MakeEven();
        this.UpdateFromBidSet(bs);
    }

    Clear() {
        var bs = mConfiguration.MakeNewBidSet();
        this.UpdateFromBidSet(bs);
    }

    ClearResults() {
        for (const key in this.resultSpans) this.resultSpans[key].domelement.innerHTML = "";
    }

}
PlayerBidInputs = {};

function MakeInputTable() {

    cardDemo.addButton("Randomize all bids", MakeRandomForAll, "regular");
    cardDemo.addButton("Make all even 100", MakeEvenForAll, "regular");
    cardDemo.addButton("Clear all bids", ClearAllSeeds, "regular");
    cardDemo.addLineBreak();

    var tbl = cardDemo.addTable();

    // s += '<th class="inputTable seed">Seed</th>';
    var headers = ["Seed"];
    mConfiguration.PowerNames.forEach(x => headers.push(x));
    headers.push("Total", "");
    tbl.Headers = headers;

    var data = [];

    mConfiguration.GetAllSeeds().forEach(iSeed => {
        var row = [];
        var pbi = new PlayerBidInput();

        row.push(iSeed);  //      s += '<td class="inputTable seed">' + iSeed + '</td>';
        pbi.seed = iSeed;

        mConfiguration.PowerNames.forEach(powername => {
            //s += '<td class = "inputTable inputCell">';
            var div = new dbnDiv();
            var input = div.createAndAppendElement("input");
            input.className = "bid";
            input.domelement.type = "number";
            input.domelement.value = 0;
            input.domelement.max = mConfiguration.MaximumIndividualBid;
            input.domelement.min = mConfiguration.MinimumIndividualBid;
            input.domelement.oninput = () => OnInput(iSeed, powername);

            pbi.inputs[powername] = input;

            var spanResult = div.addSpan();
            spanResult.className = "inlineresult";
            pbi.resultSpans[powername] = spanResult;

            row.push(div);
        });

        var spanTotal = new dbnSpan();
        spanTotal.addText(0);
        row.push(spanTotal);
        pbi.totalSpan = spanTotal;

        var spanValidate = new dbnSpan();
        spanValidate.className = "validationCell";
        pbi.validateSpan = spanValidate;
        row.push(spanValidate);

        // s += '<td class="inputTable rowbuttons"><button onclick="MakeRandomForSeed(' + iSeed + ');ResolveBids()">Random</button>';
        // s += ' <button onclick="MakeEvenForSeed(' + iSeed + ');ResolveBids()">Even 100</button></td>';
        // s += '<td id="ValidationMessage' + iSeed + '" class="inputTable validationCell" ></td>';
        // s += '</tr>';

        PlayerBidInputs["Seed" + iSeed] = pbi;
        data.push(row);
    });

    tbl.Data = data;
    tbl.Generate();

}

//#region UI response

function GetAllBidsets() {
    var ret = [];
    for (const key in PlayerBidInputs) ret.push(PlayerBidInputs[key].GetBidSet());
    return ret;
}

function ValidateAllSeeds() {
    for (const key in PlayerBidInputs) PlayerBidInputs[key].Validate();
}

function MakeEvenForAll() {
    for (const key in PlayerBidInputs) PlayerBidInputs[key].MakeEven();
    ResolveBids();
}

function MakeRandomForAll() {
    for (const key in PlayerBidInputs) PlayerBidInputs[key].MakeRandom();
    ResolveBids();
}

function ClearAllSeeds() {
    for (const key in PlayerBidInputs) PlayerBidInputs[key].Clear();
    ResolveBids();
}

function OnInput(pSeed, pPower) {
    var pbi = PlayerBidInputs["Seed" + pSeed];
    pbi.Validate();
    ResolveBids();
}

//#endregion

//#region Bid resolution


function AllBidsAreValid() {
    ValidateAllSeeds();
    var ret = true;
    for (const key in PlayerBidInputs) {
        var pbi = PlayerBidInputs[key];
        if (pbi.validateSpan.domelement.innerHTML != "") ret = false;
    }
    return ret;
}

function ResolveBids() {

    var s = "";
    var sMessages = "";

    var boards = [];
    mConfiguration.GetAllBoardNumbers().forEach(boardnum => boards[boardnum] = {});

    for (const key in PlayerBidInputs) PlayerBidInputs[key].ClearResults();

    if (!AllBidsAreValid()) {
        sMessages = "There are invalid bids.";
    } else {
        var auction = mConfiguration.MakeNewAuction(GetAllBidsets());
        auction.Resolve();
        auction.Profiles.forEach(profile => {
            var pbi = PlayerBidInputs["Seed" + profile.Seed];
            pbi.resultSpans[profile.PowerAssignment].domelement.innerHTML = profile.BoardAssignment;
            boards[profile.BoardAssignment][profile.PowerAssignment] = profile;
        });
        sMessages = auction.GetAuditTrail();
    }
    divMessages.domelement.innerHTML = sMessages;
    return;

    // mConfiguration.GetAllBoardNumbers().forEach(boardnum => {
    //     s += "<div class='board'>";
    //     var sBoardLabel = boardnum;
    //     if (mBoardNames !== undefined) {
    //         sBoardLabel = mBoardNames[boardnum - 1];
    //     }
    //     s += "<b>Board " + sBoardLabel + "</b>";
    //     s += "<table>";
    //     mConfiguration.PowerNames.forEach(powername => {
    //         var profile = boards[boardnum][powername];
    //         s += "<tr>";
    //         s += "<td class='resultTable'>" + powername + ": </td>";
    //         s += "<td class='resultTable result'>";
    //         if (profile === undefined) {
    //             s += "--";
    //         } else {
    //             s += profile.Seed;
    //             s += "<td class='resultTable result'>";
    //             var name = GetNameFromSeed(profile.Seed);
    //             if (name != '') s += " " + name;
    //             s += "</td>";
    //         }
    //         s += "</td>";
    //         s += "<td class='resultTable result'>(";
    //         if (profile === undefined) {
    //             s += "--";
    //         } else {
    //             s += "#" + profile.RankOfPowerAssignmentAmongBids;
    //             //s += ", " + profile.BidSet.Bids[powername] + "";
    //         }
    //         s += ")</td>";
    //         s += "</tr>";
    //     });
    //     s += "</table>";
    //     s += "</div>";
    // });

    if (sMessages != "") {
        s += "<div class='board outputMessages'>" + sMessages + "</div>";
    }

    elm.innerHTML = s;

}

//#endregion

MakePage();
