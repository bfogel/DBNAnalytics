
var cardTitle = dbnHere().addCard();
var cardDemo = dbnHere().addCard();

var mConfiguration = new PowerBidConfiguration();
mConfiguration.PowerNames = ["Austria", "England", "France", "Germany", "Italy", "Russia", "Turkey"];
mConfiguration.BoardNames = ["Board A", "Board B"];

mConfiguration.MaximumTotal = 179;
mConfiguration.MustUseAllPoints = false;
mConfiguration.MaximumIndividualBid = 164;
mConfiguration.MinimumIndividualBid = 0;
mConfiguration.IdenticalBidsProhibited = true;
mConfiguration.ReseedByRound = true;

var previousBids = [["Alessandro Tavani",6,1,[9,2,33,45,10,0,1]],["Andrei Gribakov",8,3,[1,2,164,3,4,5,0]],["Andrei Gribakov",8,4,[1,2,0,3,6,5,4]],["Ben Kellman",26,1,[37,3,2,1,13,24,0]],["Ben Kellman",26,2,[8,83,1,2,3,23,0]],["Brad Blitstein",28,1,[1,15,3,2,30,0,7]],["Brad Blitstein",28,3,[1,3,102,2,30,0,4]],["Christian Kline",7,3,[0,4,164,2,1,3,5]],["Christian Kline",7,4,[2,3,1,5,6,4,0]],["Conrad Woodring",23,1,[1,77,4,3,5,2,0]],["Conrad Woodring",23,3,[1,2,93,5,4,3,0]],["Craig Mayr",27,3,[1,20,30,12,10,0,25]],["Craig Mayr",27,4,[0,40,50,6,3,1,2]],["Dave Roberts",30,3,[1,2,42,40,3,12,0]],["Ed Sullivan",4,3,[6,5,4,3,2,1,0]],["Ed Sullivan",4,4,[3,4,5,164,1,2,0]],["Eustacchio Raulli",25,2,[5,4,3,1,6,0,2]],["Farren Jane",16,2,[0,6,1,4,3,2,5]],["Farren Jane",16,4,[0,164,2,4,5,3,1]],["Hunter Katcher",18,1,[0,1,2,3,4,5,6]],["Hunter Katcher",18,2,[0,1,150,4,3,2,19]],["Jason Mastbaum",29,3,[4,57,112,0,2,1,3]],["Jason Mastbaum",29,4,[4,2,164,0,5,1,3]],["Jaxon Roberts",13,1,[4,2,3,1,50,30,0]],["Jaxon Roberts",13,2,[5,95,3,1,0,4,2]],["John Anderson",2,1,[1,4,3,85,2,5,0]],["John Anderson",2,3,[2,4,5,1,79,6,3]],["Karthik Konath",10,2,[5,6,3,4,1,2,0]],["Karthik Konath",10,4,[5,164,4,3,2,1,0]],["Markus Zijlstra",24,1,[4,3,0,2,6,1,5]],["Markus Zijlstra",24,2,[0,164,5,4,3,1,2]],["Matthew Crill",20,2,[3,110,0,4,1,2,10]],["Matthew Crill",20,4,[7,0,10,1,2,30,20]],["Maxim Popov",11,1,[2,1,86,3,6,4,0]],["Maxim Popov",11,3,[2,1,4,3,81,7,0]],["Morgante Pell",3,2,[0,1,60,2,3,4,30]],["Morgante Pell",3,4,[1,4,79,6,3,2,5]],["Natty Shafer",19,1,[20,4,7,22,21,0,2]],["Natty Shafer",19,3,[2,4,106,8,3,0,1]],["Nicolas Sahuguet",5,1,[3,2,1,4,6,5,0]],["Nicolas Sahuguet",5,4,[3,2,164,4,5,1,0]],["Peter McNamara",14,2,[5,1,3,4,85,2,0]],["Peter McNamara",14,4,[17,15,20,18,0,16,14]],["Riaz Virani",22,2,[2,40,4,10,0,1,3]],["Riaz Virani",22,4,[3,125,5,4,0,1,2]],["Russ Dennis",21,1,[2,164,5,4,3,0,1]],["Russ Dennis",21,3,[1,4,2,3,5,0,6]],["Sergey Seregin",17,1,[4,3,2,1,0,64,25]],["Sergey Seregin",17,3,[4,3,2,1,0,69,22]],["Siobhan Nolen",12,2,[1,26,25,14,3,2,4]],["Siobhan Nolen",12,4,[3,6,104,4,5,2,1]],["Tanya Gill",1,3,[2,5,6,4,0,3,1]],["Tanya Gill",1,4,[4,1,164,5,0,3,2]],["Tom Mowe",15,2,[1,3,6,4,2,5,0]],["Tommy Anderson",9,1,[2,5,4,85,0,1,3]],["Tommy Anderson",9,2,[4,3,5,85,0,1,2]]];

var divOutput = new dbnDiv();
var divBoards = mConfiguration.BoardNames.map(x => divOutput.addDiv());
divBoards.forEach(x => x.className = "board");

var divMessages = divOutput.addDiv();
divMessages.className = "board outputMessages";

var mPlayerBidInputs = Array.from(Array(0), x => new PlayerBidInput());

function MakePage() {

    var title = cardTitle.createAndAppendElement("h1");
    title.addText("DBN Invitational Power Auction Demo");

    MakeInstructions();
    MakeInputTable();

    cardDemo.appendChild(divOutput);

    //SelectRealForAll();
    //LoadPrevious(1);
    MakeRandomForAll();
    ResolveBids();
}

//#region PlayerBidUI

class PlayerBidInput {
    inputs = {};

    seedInRoundSpan = null;
    seedInTourneySpan = null;
    playerNameSpan = null;
    totalSpan = null;
    validateSpan = null;
    resultSpans = {};

    MakeRow(pSeedInRound) {
        var row = [];

        this.seedInRoundSpan = new dbnSpan();
        this.seedInTourneySpan = new dbnSpan();
        this.playerNameSpan = new dbnSpan();

        row.push(this.seedInRoundSpan, this.seedInTourneySpan, this.playerNameSpan);
        this.SeedInRound = pSeedInRound;

        mConfiguration.PowerNames.forEach(powername => {
            var div = new dbnDiv();
            var input = div.createAndAppendElement("input");
            input.className = "bid";
            input.domelement.type = "number";
            input.domelement.value = 0;
            input.domelement.max = mConfiguration.MaximumIndividualBid;
            input.domelement.min = mConfiguration.MinimumIndividualBid;
            input.domelement.oninput = () => this.OnInput(powername);

            this.inputs[powername] = input;

            var spanResult = div.addSpan();
            spanResult.className = "inlineresult";
            this.resultSpans[powername] = spanResult;

            row.push(div);
        });

        var spanTotal = new dbnSpan();
        spanTotal.addText(0);
        row.push(spanTotal);
        this.totalSpan = spanTotal;

        var bbRow = new dbnButtonBar();
        bbRow.Compact = true;
        bbRow.addButton("2021", () => { this.SelectRandomReal(); ResolveBids(); });
        bbRow.addButton("179", () => { this.MakeRandom(); ResolveBids(); });
        bbRow.addButton("100", () => { this.MakeEven(); ResolveBids(); });
        row.push(bbRow);

        var spanValidate = new dbnSpan();
        spanValidate.className = "validationCell";
        this.validateSpan = spanValidate;
        row.push(spanValidate);

        var bs = mConfiguration.MakeNewBidSet();
        bs.SeedInTourney = pSeedInRound;
        bs.PlayerName = "Player " + pSeedInRound;
        this.BidSet = bs;

        return row;
    }

    OnInput(powername) {
        var val = this.inputs[powername].domelement.value;
        if (!isNaN(val)) this.BidSet.Bids[powername] = Number(val);
        //        console.log(this.BidSet.PlayerName + " " + powername + " " + val);
        // this.Validate();
        ResolveBids();
    }

    _BidSet;
    get BidSet() { return this._BidSet; }
    set BidSet(value) { this._BidSet = value; this.UpdateDisplay(); }

    UpdateDisplay() {
        this.seedInRoundSpan.domelement.innerHTML = this.BidSet.SeedInRound;
        this.seedInTourneySpan.domelement.innerHTML = this.BidSet.SeedInTourney;
        this.playerNameSpan.domelement.innerHTML = this.BidSet.PlayerName;
        mConfiguration.PowerNames.forEach(powername => this.inputs[powername].domelement.value = this.BidSet.Bids[powername]);

        if (!isNaN(this.BidSet.BoardIndex)) {
            mConfiguration.PowerNames.forEach(x => {
                var spx = this.resultSpans[x].domelement.parentNode;
                spx.className = spx.className.replace(" selected", "");
            });
            var span = this.resultSpans[this.BidSet.PowerAssignment].domelement;
            span.innerHTML = " " + (this.BidSet.BoardIndex + 1);
            span.parentNode.className += " selected";
        }

        this.Validate();
    }

    MakeNewBidset() {
        var bs = mConfiguration.MakeNewBidSet();
        bs.SeedInTourney = this.BidSet.SeedInTourney;
        bs.PlayerName = this.BidSet.PlayerName;
        return bs;
    }

    Validate() {
        this.totalSpan.domelement.innerHTML = this.BidSet.Total;
        this.validateSpan.domelement.innerHTML = this.BidSet.ValidateAndGetMessages();
    }

    MakeRandom() {
        var bs = this.MakeNewBidset();
        bs.MakeRandom();
        bs.PlayerName = "Random 179";
        this.BidSet = bs;
    }

    MakeEven() {
        var cc = mConfiguration.Duplicate();
        cc.MaximumTotal = 100;
        var bs = cc.MakeNewBidSet();
        bs.SeedInTourney = this.BidSet.SeedInTourney;
        bs.PlayerName = this.BidSet.PlayerName;
        bs.MakeEven();
        bs.PlayerName = "Even 100";
        this.BidSet = bs;
    }

    SelectRandomReal() {
        var bs = this.MakeNewBidset();
        var rando = previousBids[Math.floor(Math.random() * previousBids.length)];
        bs.PlayerName = rando[0];
        mConfiguration.PowerNames.forEach((powername, i) => bs.Bids[powername] = rando[3][i]);
        this.BidSet = bs;
    }

    Clear() {
        var bs = this.MakeNewBidset();
        bs.PlayerName = "Player " + bs.SeedInTourney;
        this.BidSet = bs;
    }

    ClearResults() {
        for (const key in this.resultSpans) this.resultSpans[key].domelement.innerHTML = "";
    }

}

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
    bbAll.style = "display: inline-block";
    for (let i = 0; i < 4; i++) {
        bbAll.addButton("2021 R" + (i + 1), () => LoadPrevious(i + 1));
    }

    cardDemo.addText(" ");

    bbAll = cardDemo.addButtonBar();
    bbAll.style = "display: inline-block";
    bbAll.addButton("Random 2021", SelectRealForAll);
    bbAll.addButton("All 179", MakeRandomForAll);
    bbAll.addButton("All 100", MakeEvenForAll);
    bbAll.addButton("Clear all", ClearAllSeeds);

    cardDemo.addLineBreak();
    // cardDemo.addText("(\"Actual\" bids are taken from the 2021 DBNI.)");

    var tbl = cardDemo.addTable();

    var headers = ["Round<br>Seed", "Tourn<br>Seed", "Name"];
    var countrycolumns = [];
    mConfiguration.PowerNames.forEach((x, i) => {
        headers.push(x);
        countrycolumns[i + 3] = x;
    });
    headers.push("Total", "", "");
    tbl.Headers = headers;
    tbl.CountryColumns = countrycolumns;

    var data = [];

    Array.from(Array(mConfiguration.PlayerCount), (x, iSeed) => {
        var pbi = new PlayerBidInput();
        mPlayerBidInputs.push(pbi);
        data.push(pbi.MakeRow(iSeed + 1));
    });

    tbl.Data = data;
    tbl.Generate();

}

//#endregion

//#region UI response

function GetAllBidsets() {
    return mPlayerBidInputs.map(x => x.BidSet);
}

function ValidateAllSeeds() {
    mPlayerBidInputs.forEach(x => x.Validate());
}

function SelectRealForAll() {
    mPlayerBidInputs.forEach(x => x.SelectRandomReal());
    ResolveBids();
}

function MakeEvenForAll() {
    mPlayerBidInputs.forEach(x => x.MakeEven());
    ResolveBids();
}

function MakeRandomForAll() {
    mPlayerBidInputs.forEach(x => x.MakeRandom());
    ResolveBids();
}

function ClearAllSeeds() {
    mPlayerBidInputs.forEach(x => x.Clear());
    ResolveBids();
}

function LoadPrevious(pRound) {
    var bss = previousBids.filter(x => x[2] == pRound);
    bss.sort((a, b) => a[1] - b[1]);
    mPlayerBidInputs.forEach((pbi, i) => {
        var row = bss[i];
        var bs = mConfiguration.MakeNewBidSet();
        bs.PlayerName = row[0];
        bs.SeedInTourney = row[1];
        mConfiguration.PowerNames.forEach((cc, ci) => bs.Bids[cc] = row[3][ci]);
        pbi.BidSet = bs;
    });
    ResolveBids();
}

//#endregion

//#region Bid resolution

function AllBidsAreValid() {
    ValidateAllSeeds();
    var ret = true;
    mPlayerBidInputs.forEach(pbi => {
        if (pbi.validateSpan.domelement.innerHTML != "") ret = false;
    });
    return ret;
}

function ResolveBids() {

    var boards = [];
    mConfiguration.BoardNames.forEach((name, boardi) => boards[boardi] = {});

    mPlayerBidInputs.forEach(pbi => pbi.ClearResults());

    var auction = mConfiguration.MakeNewAuction(GetAllBidsets());
    auction.Resolve();
    mPlayerBidInputs.forEach(pbi => {
        pbi.UpdateDisplay();
        var bs = pbi.BidSet;
        if (!isNaN(bs.BoardIndex)) boards[bs.BoardIndex][bs.PowerAssignment] = bs;
    });
    divMessages.domelement.innerHTML = auction.GetAuditTrail();

    if (auction.ResolutionFailed) return;

    mConfiguration.BoardNames.forEach((name, boardi) => {
        var div = divBoards[boardi];
        div.domelement.innerHTML = "";

        var tbl = div.addTable();
        tbl.Title = (boardi + 1) + ". " + mConfiguration.BoardNames[boardi];
        var data = [];
        var rowcountries = [];

        mConfiguration.PowerNames.forEach((powername, iRow) => {
            var bidset = boards[boardi][powername];
            var row = [];

            row.push(powername + ":");

            if (bidset === undefined) {
                row.push("--");
            } else {
                row.push(bidset.PlayerName + " (" + bidset.SeedInTourney + ")");
            }
            row.push((bidset === undefined) ? "--" : "(#" + bidset.RankOfPowerAssignmentAmongBids + ", " + bidset.Bids[powername] + ")");

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
