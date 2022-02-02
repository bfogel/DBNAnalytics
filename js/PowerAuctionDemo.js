
var cardTitle = dbnHere().addCard();
var cardDemo = dbnHere().addCard();

var mConfiguration = new PowerBidConfiguration();
mConfiguration.PowerNames = ["Austria", "England", "France", "Germany", "Italy", "Russia", "Turkey"];
mConfiguration.BoardCount = 2;

mConfiguration.MaximumTotal = 179;
mConfiguration.MustUseAllPoints = false;
mConfiguration.MaximumIndividualBid = 164;
mConfiguration.MinimumIndividualBid = 0;
mConfiguration.IdenticalBidsProhibited = true;

var previousBids = [[1, 4, 3, 85, 2, 5, 0], [0, 4, 164, 2, 1, 3, 5], [2, 3, 1, 5, 6, 4, 0], [3, 110, 0, 4, 1, 2, 10], [7, 0, 10, 1, 2, 30, 20], [1, 2, 42, 40, 3, 12, 0], [3, 4, 5, 164, 1, 2, 0], [0, 1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1, 0], [0, 1, 150, 4, 3, 2, 19], [2, 1, 86, 3, 6, 4, 0], [2, 1, 4, 3, 81, 7, 0], [4, 57, 112, 0, 2, 1, 3], [4, 2, 164, 0, 5, 1, 3], [37, 3, 2, 1, 13, 24, 0], [8, 83, 1, 2, 3, 23, 0], [4, 3, 2, 1, 0, 64, 25], [4, 3, 2, 1, 0, 69, 22], [2, 5, 6, 4, 0, 3, 1], [4, 1, 164, 5, 0, 3, 2], [1, 20, 30, 12, 10, 0, 25], [0, 40, 50, 6, 3, 1, 2], [20, 4, 7, 22, 21, 0, 2], [2, 4, 106, 8, 3, 0, 1], [5, 1, 3, 4, 85, 2, 0], [17, 15, 20, 18, 0, 16, 14], [2, 40, 4, 10, 0, 1, 3], [3, 125, 5, 4, 0, 1, 2], [1, 77, 4, 3, 5, 2, 0], [1, 2, 93, 5, 4, 3, 0], [5, 6, 3, 4, 1, 2, 0], [5, 164, 4, 3, 2, 1, 0], [2, 5, 4, 85, 0, 1, 3], [4, 3, 5, 85, 0, 1, 2], [2, 164, 5, 4, 3, 0, 1], [1, 4, 2, 3, 5, 0, 6], [0, 1, 60, 2, 3, 4, 30], [3, 2, 1, 4, 6, 5, 0], [3, 2, 164, 4, 5, 1, 0], [4, 3, 0, 2, 6, 1, 5], [0, 164, 5, 4, 3, 1, 2], [1, 2, 164, 3, 4, 5, 0], [1, 2, 0, 3, 6, 5, 4], [4, 2, 3, 1, 50, 30, 0], [5, 95, 3, 1, 0, 4, 2], [0, 6, 1, 4, 3, 2, 5], [0, 164, 2, 4, 5, 3, 1], [1, 15, 3, 2, 30, 0, 7], [1, 3, 102, 2, 30, 0, 4], [9, 2, 33, 45, 10, 0, 1], [5, 4, 3, 1, 6, 0, 2], [1, 3, 6, 4, 2, 5, 0], [3, 6, 104, 4, 5, 2, 1], [1, 26, 25, 14, 3, 2, 4], [1, 4, 79, 6, 3, 2, 5], [2, 4, 5, 1, 79, 6, 3]];

var divOutput = new dbnDiv();
var divBoards = mConfiguration.GetAllBoardNumbers().map(x => divOutput.addDiv());
divBoards.forEach(x => x.className = "board");

var divMessages = divOutput.addDiv();
divMessages.className = "board outputMessages";

function MakePage() {

    var title = cardTitle.createAndAppendElement("h1");
    title.addText("DBN Invitational Power Auction Demo");

    MakeInstructions();
    MakeInputTable();

    cardDemo.appendChild(divOutput);

    SelectRealForAll();
    ResolveBids();
}

//#region PlayerBidUI

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

    SelectRandomReal() {
        var bs = mConfiguration.MakeNewBidSet();
        var rando = previousBids[Math.floor(Math.random() * previousBids.length)];
        mConfiguration.PowerNames.forEach((powername, i) => bs.Bids[powername] = rando[i]);
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

//#endregion

//#region MakeUI

function MakeInstructions() {
    var div = cardTitle.addDiv();

    var p = div.addParagraph();
    p.addText("Players have 200 points to bid for ");
    p.addItalicText("both games combined");
    p.addText(".");

    div.addText("Bids for a single game are subject to these constraints:");
    var ol = div.addOrderedList();
    ol.AddItem("Individual bids must be no less than 0 and no more than 164 points.");
    ol.AddItem("A player's total bid can be no more than 179 points.");
    ol.AddItem("A player cannot bid the same amount on any two powers. This means that a player's total bid must be at least 21 points.");

}

function MakeInputTable() {

    var bbAll = cardDemo.addButtonBar();

    bbAll.addButton("All use actual", SelectRealForAll);
    bbAll.addButton("All use 179", MakeRandomForAll);
    bbAll.addButton("All even 100", MakeEvenForAll);
    bbAll.addButton("Clear all bids", ClearAllSeeds);

    //cardDemo.addLineBreak();
    cardDemo.addText("(\"Actual\" bids are taken from the 2021 DBNI.)");

    var tbl = cardDemo.addTable();

    var headers = ["Seed"];
    var countrycolumns = [];
    mConfiguration.PowerNames.forEach((x, i) => {
        headers.push(x);
        countrycolumns[i + 1] = x;
    });
    headers.push("Total", "", "");
    tbl.Headers = headers;
    tbl.CountryColumns = countrycolumns;

    var data = [];

    mConfiguration.GetAllSeeds().forEach(iSeed => {
        var row = [];
        var pbi = new PlayerBidInput();

        row.push(iSeed);
        pbi.seed = iSeed;

        mConfiguration.PowerNames.forEach(powername => {
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

        var bbRow = new dbnButtonBar();
        bbRow.Compact = true;
        bbRow.addButton("Use actual", () => { pbi.SelectRandomReal(); ResolveBids(); });
        bbRow.addButton("Use 179", () => { pbi.MakeRandom(); ResolveBids(); });
        bbRow.addButton("Even 100", () => { pbi.MakeEven(); ResolveBids(); });
        row.push(bbRow);

        var spanValidate = new dbnSpan();
        spanValidate.className = "validationCell";
        pbi.validateSpan = spanValidate;
        row.push(spanValidate);

        PlayerBidInputs["Seed" + iSeed] = pbi;
        data.push(row);
    });

    tbl.Data = data;
    tbl.Generate();

}

//#endregion

//#region UI response

function GetAllBidsets() {
    var ret = [];
    for (const key in PlayerBidInputs) ret.push(PlayerBidInputs[key].GetBidSet());
    return ret;
}

function ValidateAllSeeds() {
    for (const key in PlayerBidInputs) PlayerBidInputs[key].Validate();
}

function SelectRealForAll() {
    for (const key in PlayerBidInputs) PlayerBidInputs[key].SelectRandomReal();
    ResolveBids();
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
            pbi.resultSpans[profile.PowerAssignment].domelement.innerHTML = " " + profile.BoardAssignment;
            boards[profile.BoardAssignment][profile.PowerAssignment] = profile;
        });
        sMessages = auction.GetAuditTrail();
    }
    divMessages.domelement.innerHTML = sMessages;

    mConfiguration.GetAllBoardNumbers().forEach(boardnum => {
        var div = divBoards[boardnum - 1];
        div.domelement.innerHTML = "";

        var tbl = div.addTable();
        tbl.Title = "Board " + boardnum;
        var data = [];
        var rowcountries = [];

        mConfiguration.PowerNames.forEach((powername, iRow) => {
            var profile = boards[boardnum][powername];
            var row = [];

            row.push(powername + ":");

            if (profile === undefined) {
                row.push("--");
            } else {
                row.push("Seed " + profile.Seed);
            }
            row.push((profile === undefined) ? "--" : "(#" + profile.RankOfPowerAssignmentAmongBids + ")");

            data.push(row);
            rowcountries.push(powername);
        });

        tbl.Data = data;
        tbl.CountryRows = rowcountries;
        tbl.Generate();
    });

}

//#endregion

MakePage();
