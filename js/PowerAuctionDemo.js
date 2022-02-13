"use strict";

var previousBids = [["Alessandro Tavani", 6, 1, [9, 2, 33, 45, 10, 0, 1]], ["Andrei Gribakov", 8, 3, [1, 2, 164, 3, 4, 5, 0]], ["Andrei Gribakov", 8, 4, [1, 2, 0, 3, 6, 5, 4]], ["Ben Kellman", 26, 1, [37, 3, 2, 1, 13, 24, 0]], ["Ben Kellman", 26, 2, [8, 83, 1, 2, 3, 23, 0]], ["Brad Blitstein", 28, 1, [1, 15, 3, 2, 30, 0, 7]], ["Brad Blitstein", 28, 3, [1, 3, 102, 2, 30, 0, 4]], ["Christian Kline", 7, 3, [0, 4, 164, 2, 1, 3, 5]], ["Christian Kline", 7, 4, [2, 3, 1, 5, 6, 4, 0]], ["Conrad Woodring", 23, 1, [1, 77, 4, 3, 5, 2, 0]], ["Conrad Woodring", 23, 3, [1, 2, 93, 5, 4, 3, 0]], ["Craig Mayr", 27, 3, [1, 20, 30, 12, 10, 0, 25]], ["Craig Mayr", 27, 4, [0, 40, 50, 6, 3, 1, 2]], ["Dave Roberts", 30, 3, [1, 2, 42, 40, 3, 12, 0]], ["Ed Sullivan", 4, 3, [6, 5, 4, 3, 2, 1, 0]], ["Ed Sullivan", 4, 4, [3, 4, 5, 164, 1, 2, 0]], ["Eustacchio Raulli", 25, 2, [5, 4, 3, 1, 6, 0, 2]], ["Farren Jane", 16, 2, [0, 6, 1, 4, 3, 2, 5]], ["Farren Jane", 16, 4, [0, 164, 2, 4, 5, 3, 1]], ["Hunter Katcher", 18, 1, [0, 1, 2, 3, 4, 5, 6]], ["Hunter Katcher", 18, 2, [0, 1, 150, 4, 3, 2, 19]], ["Jason Mastbaum", 29, 3, [4, 57, 112, 0, 2, 1, 3]], ["Jason Mastbaum", 29, 4, [4, 2, 164, 0, 5, 1, 3]], ["Jaxon Roberts", 13, 1, [4, 2, 3, 1, 50, 30, 0]], ["Jaxon Roberts", 13, 2, [5, 95, 3, 1, 0, 4, 2]], ["John Anderson", 2, 1, [1, 4, 3, 85, 2, 5, 0]], ["John Anderson", 2, 3, [2, 4, 5, 1, 79, 6, 3]], ["Karthik Konath", 10, 2, [5, 6, 3, 4, 1, 2, 0]], ["Karthik Konath", 10, 4, [5, 164, 4, 3, 2, 1, 0]], ["Markus Zijlstra", 24, 1, [4, 3, 0, 2, 6, 1, 5]], ["Markus Zijlstra", 24, 2, [0, 164, 5, 4, 3, 1, 2]], ["Matthew Crill", 20, 2, [3, 110, 0, 4, 1, 2, 10]], ["Matthew Crill", 20, 4, [7, 0, 10, 1, 2, 30, 20]], ["Maxim Popov", 11, 1, [2, 1, 86, 3, 6, 4, 0]], ["Maxim Popov", 11, 3, [2, 1, 4, 3, 81, 7, 0]], ["Morgante Pell", 3, 2, [0, 1, 60, 2, 3, 4, 30]], ["Morgante Pell", 3, 4, [1, 4, 79, 6, 3, 2, 5]], ["Natty Shafer", 19, 1, [20, 4, 7, 22, 21, 0, 2]], ["Natty Shafer", 19, 3, [2, 4, 106, 8, 3, 0, 1]], ["Nicolas Sahuguet", 5, 1, [3, 2, 1, 4, 6, 5, 0]], ["Nicolas Sahuguet", 5, 4, [3, 2, 164, 4, 5, 1, 0]], ["Peter McNamara", 14, 2, [5, 1, 3, 4, 85, 2, 0]], ["Peter McNamara", 14, 4, [17, 15, 20, 18, 0, 16, 14]], ["Riaz Virani", 22, 2, [2, 40, 4, 10, 0, 1, 3]], ["Riaz Virani", 22, 4, [3, 125, 5, 4, 0, 1, 2]], ["Russ Dennis", 21, 1, [2, 164, 5, 4, 3, 0, 1]], ["Russ Dennis", 21, 3, [1, 4, 2, 3, 5, 0, 6]], ["Sergey Seregin", 17, 1, [4, 3, 2, 1, 0, 64, 25]], ["Sergey Seregin", 17, 3, [4, 3, 2, 1, 0, 69, 22]], ["Siobhan Nolen", 12, 2, [1, 26, 25, 14, 3, 2, 4]], ["Siobhan Nolen", 12, 4, [3, 6, 104, 4, 5, 2, 1]], ["Tanya Gill", 1, 3, [2, 5, 6, 4, 0, 3, 1]], ["Tanya Gill", 1, 4, [4, 1, 164, 5, 0, 3, 2]], ["Tom Mowe", 15, 2, [1, 3, 6, 4, 2, 5, 0]], ["Tommy Anderson", 9, 1, [2, 5, 4, 85, 0, 1, 3]], ["Tommy Anderson", 9, 2, [4, 3, 5, 85, 0, 1, 2]]];

var myManager = PowerBidManager.GetManagerForCompetition(3051);//DBNI 2022

var cardTitle = dbnHere().addCard();
var cardDemo = dbnHere().addCard();

var mPlayerBidInputs = Array.from(Array(0), x => new PlayerBidInput());
var mAuctionView;

function MakePage() {

    cardTitle.addHeading(1, "DBN Invitational Power Auction Demo");

    cardTitle.appendChild(myManager.MakeInstructions());
    MakeInputTable();

    mAuctionView = new AuctionView(myManager);
    mAuctionView.Auction = myManager.GetAuction(1);
    var div = cardDemo.addDiv();
    div.addRange(mAuctionView.UI_Boards);
    div.add(mAuctionView.UI_AuditTrail);

    CreateBidSets();

    //SelectRealForAll();
    //LoadPrevious(1);
    MakeRandomForAll();

    ResolveBids();
}

//#region MakeUI

function MakeInputTable() {

    var bbAll = cardDemo.addButtonBar();
    bbAll.style = "display: inline-block";
    for (let i = 0; i < 4; i++) {
        bbAll.addButton("2021 R" + (i + 1), () => LoadPrevious(i + 1));
    }

    cardDemo.addText(" ");

    bbAll = cardDemo.addButtonBar();
    bbAll.style = "display: inline-block";
    bbAll.addButton("Random Even", MakeEvenForAll);
    bbAll.addButton("Random 100", () => MakeRandomForAll(100));
    bbAll.addButton("Random 179", () => MakeRandomForAll(179));
    bbAll.addButton("Random 21", () => MakeRandomForAll(21));
    // bbAll.addButton("Clear all", ClearAllSeeds);

    cardDemo.addLineBreak();

    var tbl = cardDemo.addTable();

    var headers = ["Round<br>Seed", "Tourn<br>Seed", "Name"];
    var countrycolumns = [];
    myManager.PowerNames.forEach((x, i) => {
        headers.push(x);
        countrycolumns[i + 3] = x;
    });
    headers.push("Total", "Random", "");
    tbl.Headers = headers;
    tbl.CountryColumns = countrycolumns;

    var data = [];

    Array.from(Array(myManager.PlayersPerRound), (x, iSeed) => {
        var pbi = new PlayerBidInput(myManager);
        mPlayerBidInputs.push(pbi);

        var row = [pbi.UI_SeedInRound, pbi.UI_SeedInTourney, pbi.UI_PlayerName];
        row.push(...Object.values(pbi.UI_Bids), pbi.UI_BidTotal);

        var bbRow = new dbnButtonBar();
        bbRow.Compact = true;
        // bbRow.addButton("2021", () => { pbi.SelectRandomReal(); ResolveBids(); });
        bbRow.addButton("Even", ((inp) => { inp.BidSet.MakeEven(); inp.UpdateDisplay(); ResolveBids(); }).bind(undefined, pbi));
        bbRow.addButton("100", ((inp) => { inp.BidSet.MakeRandom(); inp.UpdateDisplay(); ResolveBids(); }).bind(undefined, pbi));
        bbRow.addButton("179", ((inp) => { inp.BidSet.MakeRandom(179); inp.UpdateDisplay(); ResolveBids(); }).bind(undefined, pbi));
        bbRow.addButton("21", ((inp) => { inp.BidSet.MakeRandom(21); inp.UpdateDisplay(); ResolveBids(); }).bind(undefined, pbi));
        row.push(bbRow, pbi.UI_ValidationMessage);

        data.push(row);
        pbi.OnChange = ResolveBids;
    });

    tbl.Data = data;
    tbl.Generate();

}

function CreateBidSets() {
    mPlayerBidInputs.forEach((pbi, i) => {
        var bs = myManager.MakeNewBidSet();
        bs.Round = 1;
        bs.SeedInTourney = i + 1;
        bs.PlayerName = "Player " + (i + 1);
        myManager.RegisterBidSet(bs);
        pbi.BidSet = bs;
    });
}

//#endregion

//#region UI response

function ValidateAllSeeds() {
    mPlayerBidInputs.forEach(x => x.BidSet.Validate());
}

function MakeEvenForAll() {
    mPlayerBidInputs.forEach(x => x.BidSet.MakeEven());
    ResolveBids();
}

function MakeRandomForAll(points) {
    mPlayerBidInputs.forEach(x => x.BidSet.MakeRandom(points));
    ResolveBids();
}

function ClearAllSeeds() {
    mPlayerBidInputs.forEach(x => x.ClearResults());
    ResolveBids();
}

function LoadPrevious(pRound) {
    myManager.ClearRegisteredBidSets();
    myManager.SetBoardNamesForRound(1, Array.from(Array(2), (x, i) => "R" + pRound + "B" + (i + 1)));

    var bss = previousBids.filter(x => x[2] == pRound);
    bss.sort((a, b) => a[1] - b[1]);
    mPlayerBidInputs.forEach((pbi, i) => {
        var row = bss[i];
        var bs = myManager.MakeNewBidSet();
        bs.PlayerName = row[0];
        bs.SeedInTourney = row[1];
        bs.Round = 1;
        myManager.PowerNames.forEach((cc, ci) => bs.Bids[cc] = row[3][ci]);
        pbi.BidSet = bs;
        myManager.RegisterBidSet(bs);
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
    myManager.GetAuction(1).Resolve();

}

//#endregion

MakePage();
