"use strict";

class CompetitionController {

    CompetitionID = 0;
    CompetitionName = "";

    /** @type {PowerBidManager} */
    Manager;

    /** @type {dbnCompetitionPlayerSeed[]} */
    Seeds;
    /** @type {number[]} */
    Rounds;
    /** @type {dbnCompetitionPlayerSchedule[]} */
    Schedules;

    /** @type {BidSet[]} */
    BidSets = [];

    /**
     * @param {number} playerid
     * @returns {dbnCompetitionPlayerSchedule[]} 
     */
    GetScheduleForPlayer(playerid) {
        var ret = this.Schedules.filter(x => x.CompetitionID == this.CompetitionID && x.PlayerID == playerid);
        ret.sort((a, b) => a.Round - b.Round);
        return ret;
    }

    /**
     * @param {dbnPlayerCountryBid[]} bids 
     */
    MakeBidSets(bids) {
        this.Seeds.forEach(seed => {
            this.GetScheduleForPlayer(seed.PlayerID).forEach(sched => {
                var thesebids = bids.filter(x => x.CompetitionID == this.CompetitionID && x.PlayerID == sched.PlayerID && x.Round == sched.Round);
                var bs = this.Manager.MakeNewBidSet();
                bs.SeedInTourney = seed.Seed;
                bs.PlayerName = seed.PlayerName;
                bs.Round = sched.Round;

                var thesebids = bids.filter(bid => bid.CompetitionID == sched.CompetitionID && bid.PlayerID == seed.PlayerID && bid.Round == sched.Round);
                thesebids.forEach(bid => bs.Bids[bid.Country] = bid.Bid);

                this.BidSets.push(bs);
                this.Manager.RegisterBidSet(bs);
            });
        });
        this.Manager.ValidateBidSets();
    }

    //#region UI Generation

    /** @type {Object.<number,Object<number,dbnSpan>>} */
    #UI_Locked = new Object();

    MakeUI() {
        var card = new dbnCard();
        card.addHeading(1, this.CompetitionName);

        var tab = new dbnTabs();
        card.appendChild(tab);
        tab.addTab("All bids", this.#MakeBidsTableUI(this.Schedules));
        this.Rounds.forEach((round, i) => {
            var schedules = this.Schedules.filter(x => x.Round == round);
            var divtab = new dbnDiv();
            var bbar = divtab.addButtonBar();
            bbar.AddButton("Unlock All", () => this.SetLocked(round, false));
            bbar.AddButton("Lock All", () => this.SetLocked(round, true));
            // bbar.AddButton("Run Auction", () => this.RunAuction(round));

            divtab.add(this.#MakeBidsTableUI(schedules));
            divtab.add(this.#MakeAuctionUI(round));
            tab.addTab("Round " + round, divtab);

            if (schedules.every(x => x.BidsLocked)) this.Manager.GetAuction(round).Resolve();
        });

        this.#UpdateDisplay();

        tab.SelectTabByIndex(0);

        return card;
    }

    /**
     * @param {dbnCompetitionPlayerSchedule[]} schedules 
     */
    #MakeBidsTableUI(schedules) {
        var ret = new dbnTable();

        var data = [];
        ret.Headers = ["Round<br>Seed", "Tourn<br>Seed", "Player", "Round", "Locked"];
        ret.Headers.push(...  this.Manager.PowerNames);
        ret.Headers.push("Total", "Note");

        ret.CountryColumns = new Object();
        this.Manager.PowerNames.forEach((cc, i) => ret.CountryColumns[i + 5] = cc);

        this.Seeds.forEach(seed => {
            var schedForPlayer = schedules.filter(x => x.PlayerID == seed.PlayerID);
            schedForPlayer.sort((a, b) => a.Round - b.Round);
            schedForPlayer.forEach(sched => {
                var row = [];
                var pbi = new PlayerBidInput(this.Manager, true);

                var bs = this.Manager.GetBidSetForPlayerAndRound(seed.PlayerName, sched.Round);
                if (bs) pbi.BidSet = bs;

                var spanLocked = new dbnSpan();
                if (!this.#UI_Locked.hasOwnProperty(sched.Round)) this.#UI_Locked[sched.Round] = new Object();
                this.#UI_Locked[sched.Round][sched.PlayerID] = spanLocked;

                row.push(pbi.UI_SeedInRound, pbi.UI_SeedInTourney, pbi.UI_PlayerName, sched.Round, spanLocked);
                row.push(...Object.values(pbi.UI_Bids));
                row.push(pbi.UI_BidTotal, pbi.UI_ValidationMessage);

                data.push(row);
            });
        });

        ret.Data = data;
        ret.Generate();
        return ret;
    }

    #MakeAuctionUI(round) {
        var ret = new dbnDiv();
        var av = new AuctionView(this.Manager, round);
        ret.addRange(av.UI_Boards);
        ret.add(av.UI_AuditTrail);
        av.Auction = this.Manager.GetAuction(round);
        return ret;
    }

    //#endregion

    //#region UI Response

    #UpdateDisplay() {
        this.Schedules.forEach(x => {
            var span = this.#UI_Locked[x.Round][x.PlayerID];
            span.innerHTML = x.BidsLocked ? "Locked" : "Open";
        });
    }

    /**
     * @param {number} round 
     * @param {boolean} value 
     */
    SetLocked(round, value) {
        var scheds = this.Schedules.filter(x => x.Round == round);
        if (scheds.every(x => x.BidsLocked == value)) {
            alert("All bids for Round " + round + " are already " + (value ? "locked" : "unlocked") + ".");
            return;
        }

        var bss = this.Manager.GetBidSetsByRound(round);
        if (value && !bss.every(x => !x.LastValidationMessages)) {
            alert("Unable to lock Round " + round + ".  There are invalid bids.")
            return;
        }

        var req = new bfDataRequest("setScheduleLock", { competitionid: this.CompetitionID, round: round, value: value });
        req.SendAlone();
        if (req.Success) {
            scheds.forEach(x => x.BidsLocked = value);
            this.#UpdateDisplay();

            if (value) {
                this.Manager.GetAuction(round).Resolve();
            } else {
                bss.forEach(x => x.ClearAssignments())
            }
        } else {
            alert("Error: " + req.Message);
        }
    }

    //#endregion
}

/** @type {dbnUserInfo} */
var myUserInfo;

/** @type {CompetitionController[]]} */
var myCompetitions = [];

function MakePage() {
    var div = dbnHere().addDiv();

    var reqs = myHub.MakeRequestList();
    var reqUserInfo = new dbnHubRequest_UserInfo();
    var reqSeeds = new dbnHubRequest_CompetitionPlayerSeed(true);
    var reqSchedule = new dbnHubRequest_CompetitionPlayerSchedule(true);
    var reqBids = new dbnHubRequest_Bids(true);

    reqs.addRequest([reqUserInfo, reqSeeds, reqSchedule, reqBids]);

    reqs.Send();

    console.log("User: ", reqUserInfo.ResponseContent);

    myUserInfo = reqUserInfo.UserInfo;
    if (!myUserInfo) { div.addBoldText("Could not locate user"); return; }
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    //Passed user and data retrieval

    div.addTitleCard("DBN TD Portal: " + myUserInfo.PlayerName);

    var allseeds = reqSeeds.ResponseToObjects();
    var allschedules = reqSchedule.ResponseToObjects();
    var allbids = reqBids.ResponseToObjects();

    //Collect competitions
    allseeds.forEach(x => {
        if (!myCompetitions.hasOwnProperty(x.CompetitionID)) {
            var comp = new CompetitionController();
            comp.CompetitionID = x.CompetitionID;
            comp.CompetitionName = x.CompetitionName;
            myCompetitions[x.CompetitionID] = comp;
        }
    });

    myCompetitions.forEach(comp => {
        comp.Manager = PowerBidManager.GetManagerForCompetition(comp.CompetitionID);

        comp.Seeds = allseeds.filter(x => x.CompetitionID == comp.CompetitionID);
        comp.Seeds.sort((a, b) => a.Seed - b.Seed);

        comp.Rounds = [];
        allschedules.forEach(x => { if (!comp.Rounds.includes(x.Round)) comp.Rounds.push(x.Round); });
        comp.Rounds.sort();

        comp.Schedules = allschedules.filter(x => x.CompetitionID == comp.CompetitionID);

        comp.MakeBidSets(allbids);

        div.appendChild(comp.MakeUI());

    });
}

/**
 * @param {PlayerBidInput} pbi 
 */
function SaveBids(pbi) {
    if (pbi.BidSet.LastValidationMessages) {
        alert("The bid set is not valid:\n" + pbi.BidSet.LastValidationMessages.replace("<br>", "\n"));
        return;
    }

    var playertoken = myHub.PlayerToken;

    var parms = { "token": playertoken, "competitionid": pbi.BidSet.CompetitionID, "round": pbi.BidSet.Round, "bids": JSON.stringify(pbi.BidSet.Bids) };
    var req = new bfDataRequest("savebid", parms);
    req.SendAlone();

    if (!req.Success) {
        alert("Unable to save: " + req.Message);
    } else {
        alert("Saved");
        // console.log(JSON.stringify(req.ResponseContent));
    }
}

MakePage();
