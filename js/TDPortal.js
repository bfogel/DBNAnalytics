"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

/** @type {dbnUserInfo} */
var myUserInfo;

var _AsTD = true;
var myManager = new dbnDrilldownPage("Portal Home");

//#region CompetitionManager and DBNIYearGroup

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

//#region MakePage and MakeContent for Drilldown

function MakePage() {

    // var xx = new dbnWeightedSelector();
    // xx.AddItem("A", 1);
    // xx.AddItem("B", 2);
    // xx.AddItem("C", 3);
    // xx.AddItem("D", 4);

    // console.log(xx);
    // xx.filter(x => x == "B");
    // console.log(xx);
    // return;

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

    myManager.OnMakeContent = MakeDrilldownContent;
}

/**
 * @param {string[]} keys 
 * @param {dbnDiv} div
 */
function MakeDrilldownContent(keys, div) {
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

//#endregion

//#region CompetitionPowerAssignmentController

class CompetitionPowerAssignmentController extends dbnDiv {

    /**
     * 
     * @param {dbnCompetition} competition
     */
    constructor(competition) {
        super();
        this.Competition = competition;

        var reqlist = myHub.MakeRequestList();
        var reqSchedules = new dbnHubRequest_CompetitionPlayerSchedule(_AsTD, competition.CompetitionID);
        var reqGameCounts = new dbnHubRequest_CompetitionPlayerGameCounts(competition.CompetitionID);

        reqlist.addRequest([reqSchedules, reqGameCounts]);
        reqlist.Send();

        if (!reqlist.Success) {
            reqlist.ReportToConsole();
            this.addText("Unable to retrieve data.");
            return;
        }

        var schedules = reqSchedules.ResponseToObjects();

        reqGameCounts.ResponseToObjects().forEach(x => {
            if (!this.#PlayerGameCounts.hasOwnProperty(x.PlayerID)) this.#PlayerGameCounts[x.PlayerID] = [0, 0, 0, 0, 0, 0, 0];
            this.#PlayerGameCounts[x.PlayerID][x.CountryID] = x.GameCount;
        });

        var bar = this.addButtonBar();
        this.#SaveButton = bar.addButton("Save All", this.#SaveSchedules.bind(this));
        this.#SaveButton.disabled = true;

        bar.addButton("Clear All", this.ClearAllSchedules.bind(this));

        this.add(this.#MessageDiv);
        this.#MessageDiv.style.color = "red";
        this.#MessageDiv.style.fontSize = "larger";
        this.#MessageDiv.style.margin = "10px";
        this.#MessageDiv.innerHTML = "&nbsp;";

        var tabs = this.addTabs();

        for (let i = 1; i < 4; i++) {
            var rdiv = new CompetitionPowerAssignmentRound(this, i);
            rdiv.Schedules = schedules.filter(x => x.Round == i);
            this.#RoundControllers.push(rdiv);
            tabs.addTab("Round " + i, rdiv);
        }

        tabs.SelectTabByIndex(0);
    }

    /** @type {dbnCompetition} */
    Competition;

    /** @type{CompetitionPowerAssignmentRound[]} */
    #RoundControllers = [];

    /** @type{Object.<number,number[]>} */
    #PlayerGameCounts = {};

    /**
     * @param {number} playerid 
     */
    GetGameCounts(playerid) {
        return this.#PlayerGameCounts.hasOwnProperty(playerid) ? this.#PlayerGameCounts[playerid] : [0, 0, 0, 0, 0, 0, 0];
    }

    /** @type{dbnButton} */
    #SaveButton;
    #MessageDiv = new dbnDiv();

    InformChanged() {
        this.#SaveButton.disabled = false;
        this.#MessageDiv.innerHTML = "You have unsaved changes.  Refresh the page to undo.";
    }

    ClearAllSchedules() {
        if (confirm("Are you sure you want to clear all rounds? (Note: You will still need to click Save to save the changes)")) {
            this.#RoundControllers.forEach(x => x.Schedules = []);
            this.InformChanged();
        }
    }

    #SaveSchedules() {
        var schedules = [];
        this.#RoundControllers.forEach(x => schedules.push(...x.Schedules));
        var req = new dbnHubRequest_SaveCompetitionPlayerSchedules(this.Competition.CompetitionID, schedules);
        req.SendAlone();

        if (req.Success) {
            this.#SaveButton.disabled = true;
            this.#MessageDiv.innerHTML = "&nbsp;";
        }

        req.ReportToConsole();
    }
}

//#endregion

//#region CompetitionPowerAssignmentRound

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

        this.addButton("Assign Powers", this.#AssignPowers.bind(this));
        this.addButton("Clear Assignments", this.#ClearAssignments.bind(this));

        this.#UpdateDisplay();
    }

    /** @type{CompetitionPowerAssignmentController} */
    Controller;

    /** @type{number} */
    Round;

    /** @type {dbnCompetitionPlayerSchedule[]} */
    #Schedules = [];
    get Schedules() { return this.#Schedules };
    set Schedules(value) { this.#Schedules = value; this.#SortSchedules(); this.#UpdateDisplay(); }

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
        this.#SortSchedules();
        this.#UpdateDisplay();

        this.Controller.InformChanged();
    }

    #SortSchedules() {
        this.Schedules.sort((a, b) => a.PlayerName.localeCompare(b.PlayerName));
    }

    /**
     * @param {dbnCompetitionPlayerSchedule} schedule 
     */
    #RemovePlayer(schedule) {
        this.#Schedules = this.#Schedules.filter(x => x.PlayerID != schedule.PlayerID);
        this.#UpdateDisplay();
        this.Controller.InformChanged();
    }

    #OnPlayerSelected(e) {
        var newplayer = this.#PlayerSelector.SelectedPlayer;
        if (!newplayer) return;
        this.TryAddPlayer(newplayer);
        this.#PlayerSelector.SelectedPlayer = null;
    }

    #UpdateDisplay() {
        this.#PlayersUI.innerHTML = "";

        this.#PlayersUI.addBoldText("Total players: " + this.#Schedules.length);
        this.#PlayersUI.addLineBreak();

        if (this.Schedules.length > 0) {

            var bHasAssignments = this.Schedules.some(x => x.Board || x.CountryID);
            if (bHasAssignments) {
                //this.Schedules.sort((a, b) => a.Board != b.Board ? a.Board - b.Board : a.CountryID - b.CountryID);
            }

            var tbl = this.#PlayersUI.addTable();
            tbl.ClickHeaderToSort = true;
            tbl.Headers = ["", "Player", "Games"];
            tbl.NumberColumns = [2];

            myHub.Countries.forEach((x, i) => {
                tbl.Headers.push(x.substring(0, 1))
                tbl.SetCountryForColumn(i + 3, x);
                tbl.NumberColumns.push(i + 3);
            });

            if (bHasAssignments) {
                tbl.Headers.push("Board", "Country", "Player");
                tbl.NumberColumns.push(10);
            }

            var data = [];

            this.Schedules.forEach((x, iRow) => {
                var removelink = new dbnFlatButton(new dbnIcon_TimesCircle(), this.#RemovePlayer.bind(this, x));
                var gcs = this.Controller.GetGameCounts(x.PlayerID);
                var total = gcs.reduce((p, x) => x + p, 0);
                var row = [removelink, x.PlayerName, total];
                row.push(...gcs);

                if (bHasAssignments) {
                    var country = x.CountryID != null && x.CountryID != undefined ? myHub.Countries[x.CountryID] : null;
                    row.push(x.Board, country, x.PlayerName + (country ? " (" + gcs[x.CountryID] + ")" : ""));
                    if (country) {
                        tbl.SetCountryForCell(iRow, 11, country);
                        tbl.SetCellClass(iRow, x.CountryID + 3, " bfboldtext");
                    }
                }
                data.push(row);
            });

            tbl.Data = data;
            tbl.Generate();
        }
    }

    #ClearAssignments() {
        this.Schedules.forEach(x => { x.Board = undefined; x.CountryID = undefined; })
        this.#UpdateDisplay();
    }

    #AssignPowers() {
        if (this.#Schedules.length % 7 != 0) {
            alert("The number of players must be a multiple of 7");
            return;
        }

        var bOk = false;

        for (let i = 0; i < 100; i++) {
            bOk = this.#AssignByForce();
            if (bOk) break;
        }

        if (!bOk) this.#AssignByRandom();

        this.#UpdateDisplay();
    }

    #AssignByForce() {
        this.#ClearAssignments();
        var scheds = this.Schedules.slice();
        var boardcount = scheds.length / 7;

        var countryAssignments = myHub.Countries.map(x => []);

        var allOptions = [];

        scheds.forEach(x => {
            var counts = this.Controller.GetGameCounts(x.PlayerID);
            var maxcount = counts.reduce((p, x) => Math.max(x, p), 0);

            for (let iCountry = 0; iCountry < 7; iCountry++) {
                var slot = 10 ** (maxcount - counts[iCountry] + 1) - counts[iCountry];
                allOptions.push([slot, [x, iCountry]]);
            }
        });

        allOptions.sort((a, b) => b[0] - a[0]);

        for (let iPlayer = 0; iPlayer < 7 * boardcount; iPlayer++) {
            if (allOptions.length == 0) return false;

            var bestSlot = allOptions[0][0];
            var best = allOptions.filter(x => x[0] == bestSlot);

            var selector = new dbnWeightedSelector();
            best.forEach(x => selector.AddItem(1, x[1]));

            var sel = selector.GetItem();

            /** @type{dbnCompetitionPlayerSchedule} */
            var sched = sel[0];
            sched.CountryID = sel[1];

            countryAssignments[sched.CountryID].push(sched);

            allOptions = allOptions.filter(x => sched.PlayerID != x[1][0].PlayerID);
            if (countryAssignments[sched.CountryID].length == boardcount) {
                allOptions = allOptions.filter(x => sched.CountryID != x[1][1]);

                var boardselector = new dbnWeightedSelector();
                countryAssignments[sched.CountryID].forEach(x => boardselector.AddItem(1, x));
                for (let iBoard = 1; iBoard <= boardcount; iBoard++) {
                    /** @type{dbnCompetitionPlayerSchedule} */
                    var bsel = boardselector.GetItem();
                    bsel.Board = iBoard;
                    boardselector.filterInPlace(x => x.PlayerID != bsel.PlayerID);
                }
            }
        }

        return true;
    }

    #AssignByRandom() {
        this.#ClearAssignments();
        var scheds = this.Schedules.slice();
        var boardcount = scheds.length / 7;

        var countryAssignments = myHub.Countries.map(x => []);

        var playerselector = new dbnWeightedSelector;

        scheds.forEach(x => {
            var counts = this.Controller.GetGameCounts(x.PlayerID);
            var maxcount = counts.reduce((p, x) => Math.max(x, p), 0);

            for (let iCountry = 0; iCountry < 7; iCountry++) {
                var weight = 10 ** (maxcount - counts[iCountry] + 1) - counts[iCountry];
                playerselector.AddItem(weight, [x, iCountry]);
            }
        });

        for (let iPlayer = 0; iPlayer < 7 * boardcount; iPlayer++) {
            var sel = playerselector.GetItem();

            /** @type{dbnCompetitionPlayerSchedule} */
            var sched = sel[0];
            sched.CountryID = sel[1];

            countryAssignments[sched.CountryID].push(sched);

            playerselector.filterInPlace(x => sched.PlayerID != x[0].PlayerID);

            if (countryAssignments[sched.CountryID].length == boardcount) {
                playerselector.filterInPlace(x => sched.CountryID != x[1]);

                var boardselector = new dbnWeightedSelector();
                countryAssignments[sched.CountryID].forEach(x => boardselector.AddItem(1, x));
                for (let iBoard = 1; iBoard <= boardcount; iBoard++) {
                    /** @type{dbnCompetitionPlayerSchedule} */
                    var bsel = boardselector.GetItem();
                    bsel.Board = iBoard;
                    boardselector.filterInPlace(x => x.PlayerID != bsel.PlayerID);
                }
            }
        }
        return true;
    }

}


//#endregion

//#region Power Bid

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

//#endregion

MakePage();
