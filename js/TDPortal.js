"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

/** @type {dbnUserInfo} */
var myUserInfo;

var _AsTD = true;
var myManager = new dbnDrilldownPage("Portal Home");

//#region DBNIYearGroup

class DBNIYearGroup {
    /**
     * @param {number} year 
     */
    constructor(year) { this.Year = year; }

    /** @type{number} */
    Year;

    /** @type{dbnCompetition[]} */
    Competitions = [];

    get Key() {
        if (this.Year == 0) return "Other";
        var last = this.Year % 10;
        if (last == 0) last = this.year % 100;
        return (this.Year - 1) + "-" + last + " DBNI Season";
    }

    /**
     * @param {dbnCompetition} competition 
     * @returns {string}
     */
    KeyForCompetition(competition) { return competition.CompetitionName; }
}

/** @type{Object.<number,DBNIYearGroup>} */
var myDBNIYearGroups = {};
function GetDBNIYearGroups() {
    /** @type{DBNIYearGroup[]} */
    var groups = [];
    for (const year in myDBNIYearGroups) {
        groups.push(myDBNIYearGroups[year]);
    }
    groups.sort((a, b) => b.Year - a.Year);
    return groups;
}

//#endregion

function MakePage() {
    var reqs = myHub.MakeRequestList();
    var reqUserInfo = new dbnHubRequest_UserInfo();

    var reqCompList = new dbnHubRequest_CompetitionParticipationList(_AsTD);

    reqs.addRequest([reqUserInfo, reqCompList]);

    reqs.Send();

    myUserInfo = reqUserInfo.UserInfo;
    if (!myUserInfo) { dbnHere().addDiv().addBoldText("Could not locate user (" + reqUserInfo.Message + ")"); return; }
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    //Passed user and data retrieval
    myManager.Title = "DBN " + (_AsTD ? "TD" : "Player") + " Portal: " + myUserInfo.PlayerName;

    reqCompList.ResponseToObjects().forEach(x => {
        var year = x.DBNIYear ?? 0;
        if (x.CompetitionSeriesName == "DBNI") {
            var syear = x.CompetitionName.substring(x.CompetitionName.length - 5);
            year = parseInt(syear);
        }
        if (!myDBNIYearGroups.hasOwnProperty(year)) myDBNIYearGroups[year] = new DBNIYearGroup(year);
        myDBNIYearGroups[year].Competitions.push(x);
    });

    myManager.OnMakeContent = MakeContent;
}

/**
 * @param {string[]} keys 
 * @param {dbnDiv} div
 */
function MakeContent(keys, div) {
    var card = div.addCard();

    if (keys.length == 0) {
        card.addHeading(1, "Seasons");
        var list = card.addNavList();
        GetDBNIYearGroups().forEach(x => list.AddItem(myManager.MakeDrilldownLink(x.Key, x.Key)));
        return;
    }

    var group = GetDBNIYearGroups().find(x => x.Key == keys[0]);
    if (!group) {
        card.addText("Could not locate group " + keys[0]);
        return;
    }

    if (keys.length == 1) {
        card.addHeading(1, keys[0] + " Competitions");
        var list = card.addNavList();
        group.Competitions.forEach(x => {
            var key = group.KeyForCompetition(x);
            list.AddItem(myManager.MakeDrilldownLink(key, key))
        });
        return;
    }

    var competition = group.Competitions.find(x => group.KeyForCompetition(x) == keys[1]);
    if (!competition) {
        div.addText("Could not locate competition " + keys[1]);
        return;
    }

    card.addText("This is " + competition.CompetitionName);
}

// class dbnNavigationList extends dbnDiv {
//     constructor(parent) { super(parent); }

//     AddItem(text, href)
// }

//Below is the code for the TD page for the DBNI power bid auction

// /** @type {CompetitionAuctionController[]} */
// var myCompetitions = [];

// function MakePageOLD() {
//     var div = dbnHere().addDiv();

//     var reqs = myHub.MakeRequestList();
//     var reqUserInfo = new dbnHubRequest_UserInfo();
//     var reqSeeds = new dbnHubRequest_CompetitionPlayerSeed(true);
//     var reqSchedule = new dbnHubRequest_CompetitionPlayerSchedule(true);
//     var reqBids = new dbnHubRequest_Bids(true);

//     reqs.addRequest([reqUserInfo, reqSeeds, reqSchedule, reqBids]);

//     reqs.Send();

//     myUserInfo = reqUserInfo.UserInfo;
//     if (!myUserInfo) { div.addBoldText("Could not locate user (" + reqUserInfo.Message + ")"); return; }
//     if (!reqs.Success) { reqs.ReportToConsole(); return; }

//     //Passed user and data retrieval

//     div.addTitleCard("DBN TD Portal: " + myUserInfo.PlayerName);

//     var allseeds = reqSeeds.ResponseToObjects();
//     var allschedules = reqSchedule.ResponseToObjects();
//     var allbids = reqBids.ResponseToObjects();

//     //Collect competitions
//     allseeds.forEach(x => {
//         if (!myCompetitions.hasOwnProperty(x.CompetitionID)) {
//             var comp = new CompetitionAuctionController(x.CompetitionID, x.CompetitionName);
//             myCompetitions[x.CompetitionID] = comp;
//         }
//     });

//     myCompetitions.forEach(comp => {
//         comp.Manager = PowerBidManager.GetManagerForCompetition(comp.CompetitionID);

//         comp.Seeds = allseeds.filter(x => x.CompetitionID == comp.CompetitionID);
//         comp.Seeds.sort((a, b) => a.Seed - b.Seed);

//         comp.Rounds = [];
//         allschedules.forEach(x => { if (!comp.Rounds.includes(x.Round)) comp.Rounds.push(x.Round); });
//         comp.Rounds.sort();

//         comp.Schedules = allschedules.filter(x => x.CompetitionID == comp.CompetitionID);

//         comp.MakeBidSets(allbids);

//         var card = new dbnCard();
//         card.addHeading(1, comp.CompetitionName);
//         card.add(comp.MakeUI());

//         div.appendChild(card);

//     });
// }

MakePage();
