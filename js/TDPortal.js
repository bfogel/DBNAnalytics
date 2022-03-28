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

class CompetitionManager {
    /**
     * @param {dbnCompetition} competition 
     */
    constructor(competition) { this.Competition = competition; }

    /** @type{dbnCompetition} */
    Competition;

    get Key() { return this.Competition.CompetitionName; }

    /** @type{CompetitionPowerAssignmentController} */
    #PowerAssignmentController;
    get PowerAssignmentController() { if (!this.#PowerAssignmentController) this.#PowerAssignmentController = new CompetitionPowerAssignmentController(this.Competition); return this.#PowerAssignmentController; }

}

class DBNIYearGroup {
    /**
     * @param {number} year 
     */
    constructor(year) { this.Year = year; }

    /** @type{number} */
    Year;

    /** @type{CompetitionManager[]} */
    CompetitionManagers = [];

    get Key() {
        if (this.Year == 0) return "Other";
        var last = this.Year % 10;
        if (last == 0) last = this.year % 100;
        return (this.Year - 1) + "-" + last + " DBNI Season";
    }

    /**
     * @param {dbnCompetition} competition 
     */
    AddCompetition(competition) {
        this.CompetitionManagers.push(new CompetitionManager(competition));
    }

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
        myDBNIYearGroups[year].AddCompetition(x);
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
        group.CompetitionManagers.forEach(x => {
            list.AddItem(myManager.MakeDrilldownLink(x.Key, x.Key))
        });
        return;
    }

    var compmgr = group.CompetitionManagers.find(x => x.Key == keys[1]);
    if (!compmgr) {
        div.addText("Could not locate competition " + keys[1]);
        return;
    }

    var comp = compmgr.Competition;
    card.addHeading(1, comp.CompetitionName);
    if (comp.CompletionDate) {
        card.addText("Nothing to do for  " + comp.CompetitionName);
    } else {
        card.addHeading(2, "Power assignment");
        card.add(compmgr.PowerAssignmentController);
    }
}

//#region Schedule and Random Power Assignment

class CompetitionPowerAssignmentController extends dbnDiv {

    /**
     * 
     * @param {dbnCompetition} competition
     */
    constructor(competition) {
        super();
        this.Competition = competition;

        var req = new dbnHubRequest_CompetitionPlayerSchedule(_AsTD, competition.CompetitionID);
        req.SendAlone();

        this.Schedules = req.ResponseToObjects();

        this.addButton("Save All Rounds", this.#SaveSchedules.bind(this));
        this.addLineBreak();

        var tabs = this.addTabs();

        for (let i = 1; i < 4; i++) {
            var rdiv = new CompetitionPowerAssignmentRound(this, i);
            this.#RoundControllers.push(rdiv);
            tabs.addTab("Round " + i, rdiv);
        }

        this.#RoundControllers[0].TryAddPlayer(myHub.Players.find(x => x.PlayerID == 203));
        this.#RoundControllers[0].TryAddPlayer(myHub.Players.find(x => x.PlayerID == 222));

        tabs.SelectTabByIndex(0);
    }

    /** @type {dbnCompetition} */
    Competition;

    /** @type {dbnCompetitionPlayerSchedule[]} */
    Schedules = [];

    /** @type{CompetitionPowerAssignmentRound[]} */
    #RoundControllers = [];

    /**
     * @param {number} playerid
     * @returns {dbnCompetitionPlayerSchedule[]} 
     */
    GetScheduleForPlayer(playerid) {
        var ret = this.Schedules.filter(x => x.CompetitionID == this.Competition.CompetitionID && x.PlayerID == playerid);
        ret.sort((a, b) => a.Round - b.Round);
        return ret;
    }

    #SaveSchedules() {
        var schedules = [];
        this.#RoundControllers.forEach(x => schedules.push(...x.Schedules));
        var req = new dbnHubRequest_SaveCompetitionPlayerSchedules(this.Competition.CompetitionID, schedules);
        req.SendAlone();
        req.ReportToConsole();
    }
}

class CompetitionPowerAssignmentRound extends dbnDiv {
    constructor(controller, round) {
        super();
        this.Controller = controller;
        this.Round = round;

        this.style.minHeight = "400px";
        this.style.padding = "10px";

        var div = this.addDiv();
        div.addText("Add Player: ");
        div.add(this.#PlayerSelector);
        this.#PlayerSelector.placeholder = "Search";
        this.#PlayerSelector.OnPlayerSelected.AddListener(this.#OnPlayerSelected.bind(this));

        this.addLineBreak();

        this.add(this.#PlayersUI);

        this.#UpdateDisplay();
    }

    /** @type{CompetitionPowerAssignmentController} */
    Controller;

    /** @type{number} */
    Round;

    /** @type {dbnCompetitionPlayerSchedule[]} */
    Schedules = [];

    #PlayerSelector = new dbnPlayerSelector();
    #PlayersUI = new dbnDiv();

    /**
     * @param {dbnPlayer} player 
     */
    TryAddPlayer(player) {
        if (this.Schedules.some(x => x.PlayerID == player.PlayerID)) return;
        var schedule = new dbnCompetitionPlayerSchedule();
        schedule.PlayerID = player.PlayerID;
        schedule.PlayerName = player.PlayerName;
        schedule.CompetitionID = this.Controller.Competition.CompetitionID;
        schedule.CompetitionName = this.Controller.Competition.CompetitionName;
        schedule.Round = this.Round;
        schedule.BidsLocked = false;

        this.Schedules.push(schedule);
        this.Schedules.sort((a, b) => a.PlayerName.localeCompare(b.PlayerName));
        this.#UpdateDisplay();
    }

    #OnPlayerSelected(e) {
        var newplayer = this.#PlayerSelector.SelectedPlayer;
        if (!newplayer) return;
        this.TryAddPlayer(newplayer);
        this.#PlayerSelector.SelectedPlayer = null;
    }

    #UpdateDisplay() {
        this.#PlayersUI.innerHTML = "";

        if (this.Schedules.length == 0) {
            this.#PlayersUI.addText("No players selected.")
        } else {
            var tbl = this.#PlayersUI.addTable();
            tbl.Headers = ["Player", "Games"];
            var data = [];

            this.Schedules.forEach(x => {
                data.push([x.PlayerName, 0]);
            });

            tbl.Data = data;
            tbl.Generate();
        }
    }

}

//#endregion



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
