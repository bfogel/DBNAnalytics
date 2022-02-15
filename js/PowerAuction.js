"use strict";

class PowerBidManager {
    //#region Static Managers

    static Managers = {};

    /**
     * @param {number} competitionid 
     */
    static GetManagerForCompetition(competitionid) {
        /** @type {PowerBidManager} */
        var ret;

        if (!this.Managers.hasOwnProperty(competitionid)) {
            var mgr = new PowerBidManager(competitionid);
            mgr.RoundCount = 4;
            mgr.BoardsPerRound = 2;
            mgr.BoardsPerPlayer = 2;
            mgr.MinimumIndividualBid = 0;
            mgr.TotalPointsPerPlayer = 200;
            mgr.MustUseAllPoints = false;
            mgr.IdenticalBidsProhibited = true;

            for (let iRound = 1; iRound < mgr.RoundCount + 1; iRound++) {
                var names = Array.from(Array(mgr.BoardsPerRound), (x, i) => "R" + iRound + "B" + (i + 1));
                mgr.SetBoardNamesForRound(iRound, names);
            }

            this.Managers[competitionid] = mgr;
        }
        ret = this.Managers[competitionid];
        return ret;
    }

    //#endregion

    //#region Basics

    CompetitionID = 0;
    PowerNames = ["Austria", "England", "France", "Germany", "Italy", "Russia", "Turkey"];
    RoundCount = 0;
    BoardsPerRound = 0;
    BoardsPerPlayer = 0;
    MinimumIndividualBid = 0;
    TotalPointsPerPlayer = 0;
    MustUseAllPoints = false;
    IdenticalBidsProhibited = true;
    ReseedByRound = true;

    /** @type {Object.<number,string[]>} */
    #BoardNames = {};

    /**
     * 
     * @param {number} competitionid 
     */
    constructor(competitionid) { this.CompetitionID = competitionid; }

    get MinimumTotalPerRound() {
        var ret = 0;
        for (let i = 0; i < this.PowerNames.length; i++) ret += this.MinimumIndividualBid + i;
        return ret;
    }

    get PlayersPerRound() { return this.PowerNames.length * this.BoardsPerRound; }

    get MaximumTotalPerRound() { return this.TotalPointsPerPlayer - ((this.BoardsPerPlayer - 1) * this.MinimumTotalPerRound); }
    get MaximumIndividualBid() { return this.TotalPointsPerPlayer - (this.BoardsPerPlayer * this.MinimumTotalPerRound) + (this.MinimumIndividualBid + this.PowerNames.length - 1); }

    /**
     * @param {number} round 
     * @param {string[]} names 
     */
    SetBoardNamesForRound(round, names) {
        if (names.length != this.BoardsPerRound) throw "Number of names does not match BoardsPerRound";
        this.#BoardNames[round] = names.slice();
    }

    GetBoardNamesForRound(round) {
        if (this.#BoardNames.hasOwnProperty(round)) return this.#BoardNames[round];
        var ret = [];
        for (let i = 0; i < this.BoardsPerRound; i++) {
            ret.push("Board " + i);
        }
        return ret;
    }

    MakeNewBidSet() { return new BidSet(this.CompetitionID); }

    /** @type {Object.<number,Auction>} */
    #Auctions = {};

    /**
     * @param {number} round 
     * @returns {Auction}
     */
    GetAuction(round) {
        if (!this.#Auctions.hasOwnProperty(round)) this.#Auctions[round] = new Auction(this, round);
        return this.#Auctions[round];
    }

    MakeInstructions() {
        var ret = new dbnDiv();

        var p = ret.addParagraph();
        p.addText("Players have " + this.TotalPointsPerPlayer + " points to bid for ");
        p.addItalicText("both games combined");
        p.addText(".");

        ret.addText("Bids for a single game are subject to these constraints:");
        var ol = ret.addOrderedList();
        ol.AddItem("Individual bids must be no less than " + this.MinimumIndividualBid + " and no more than " + this.MaximumIndividualBid + " points.");
        ol.AddItem("A player's total bid can be no more than " + this.MaximumTotalPerRound + " points.");
        ol.AddItem("A player cannot bid the same amount on any two powers. This means that a player's total bid must be at least " + this.MinimumTotalPerRound + " points.");

        return ret;
    }

    //#endregion

    //#region Registered BidSets

    /** @type {Object.<string,Object.<number,BidSet>> */
    RegisteredBidSetsByPlayerAndRound = {};

    ClearRegisteredBidSets() {
        this.RegisteredBidSetsByPlayerAndRound = {};
    }

    /**
     * @param {BidSet} bidset 
     */
    RegisterBidSet(bidset) {
        if (!this.RegisteredBidSetsByPlayerAndRound.hasOwnProperty(bidset.PlayerName)) {
            this.RegisteredBidSetsByPlayerAndRound[bidset.PlayerName] = {};
        }
        this.RegisteredBidSetsByPlayerAndRound[bidset.PlayerName][bidset.Round] = bidset;
        this.#ReseedByRound(bidset.Round);
    }

    #ReseedByRound(round) {
        var bss = this.GetBidSetsByRound(round);
        bss.sort((a, b) => a.SeedInTourney - b.SeedInTourney);
        bss.forEach((x, i) => x.SeedInRound = i + 1);
    }

    /**
     * @param {number} round 
     * @returns {BidSet[]}
     */
    GetBidSetsByRound(round) {
        var ret = [];
        Object.values(this.RegisteredBidSetsByPlayerAndRound).forEach(x => {
            Object.values(x).forEach(bs => { if (bs.Round == round) ret.push(bs) });
        });
        return ret;
    }

    /**
     * Returns null if no bidset is registered for the player
     * @param {string} playername 
     */
    GetBidSetsByRoundForPlayer(playername) {
        if (!this.RegisteredBidSetsByPlayerAndRound.hasOwnProperty(playername)) return null;
        return this.RegisteredBidSetsByPlayerAndRound[playername];
    }

    /**
     * Returns [] if no bidset is registered for the player
     * @param {string} playername 
     */
    GetArrayOfBidSets(playername) {
        /** @type {BidSet[]} */
        var ret = [];
        if (this.RegisteredBidSetsByPlayerAndRound.hasOwnProperty(playername)) {
            ret.push(...Object.values(this.RegisteredBidSetsByPlayerAndRound[playername]));
        }
        ret.sort((a, b) => a.Round - b.Round);
        return ret;
    }

    /**
     * Returns null if no bidset is registered for the player and round
     * @param {string} playername 
     * @param {number} round 
     */
    GetBidSetForPlayerAndRound(playername, round) {
        var bss = this.GetBidSetsByRoundForPlayer(playername);
        if (bss == null) return null;
        if (!bss.hasOwnProperty(round)) return null;
        var xxx = bss[round];
        return bss[round];
    }

    /**
     * 
     * @param {string} playername 
     */
    ValidateBidSets(playername = null) {

        if (playername == null) {
            Object.keys(this.RegisteredBidSetsByPlayerAndRound).forEach(s => this.ValidateBidSets(s));
            return;
        }

        var tot = this.TotalPointsPerPlayer;
        var bidsets = this.GetArrayOfBidSets(playername);
        var roundsleft = this.BoardsPerPlayer;

        bidsets.forEach(bs => {
            var pointsAvailableForThisRound = tot - ((roundsleft - 1) * this.MinimumTotalPerRound);
            bs.Validate(pointsAvailableForThisRound);
            roundsleft--;
            tot -= bs.Total;
        });
    }

    //#endregion
}

class BidSet {

    constructor(competitionid) {
        this.CompetitionID = competitionid;
        this.ClearBids();
    }

    OnValidate = new dbnEvent();
    OnBoardOrPowerAssignment = new dbnEvent();

    /** @type {number} */
    CompetitionID;
    get Manager() { return PowerBidManager.GetManagerForCompetition(this.CompetitionID); }
    get PowerNames() { return this.Manager.PowerNames; }

    PlayerName;
    SeedInTourney;
    Round;
    SeedInRound;

    /** @type {Object.<string,number>} */
    Bids = {};

    get Total() {
        var ret = 0;
        this.PowerNames.forEach(x => ret += this.Bids[x]);
        return ret;
    }

    get SeedForBoardAssignment() { return this.Manager.ReseedByRound ? this.SeedInRound : this.SeedInTourney; }

    get PowersOrderedByBidSize() {
        var ret = this.PowerNames.slice();
        ret.sort((a, b) => {
            var sortret = this.Bids[a] - this.Bids[b];
            if (sortret == 0) {
                sortret = this.PowerNames.indexOf(a) - this.Manager.PowerNames.indexOf(b);
            }
            return sortret;
        });
        return ret;
    }

    //#region Assignment

    ClearAssignments() {
        this.BoardIndex = undefined;
        this.PowerAssignment = undefined;
    }

    /** @type {number} */
    #BoardIndex = undefined;
    get BoardIndex() { return this.#BoardIndex; }
    set BoardIndex(value) { this.#BoardIndex = value; this.OnBoardOrPowerAssignment.Raise(); }

    /** @type {string} */
    #PowerAssignment = undefined;
    get PowerAssignment() { return this.#PowerAssignment }
    set PowerAssignment(value) {
        this.#PowerAssignment = value;
        var i = 1;
        this.RankOfPowerAssignmentAmongBids = this.PowerNames.length - this.PowersOrderedByBidSize.indexOf(value);
        this.OnBoardOrPowerAssignment.Raise();
    }

    RankOfPowerAssignmentAmongBids;

    //#endregion

    //#region Modify bids

    ClearBids() {
        this.PowerNames.forEach(x => this.Bids[x] = 0);
    }

    MakeRandom(points) {
        this.ClearBids();

        var manager = this.Manager;
        points = points ?? (manager.TotalPointsPerPlayer / manager.BoardsPerPlayer);

        var options = [];
        for (let i = manager.MinimumIndividualBid; i < points + 1; i++) options.push(i);

        var toselect = manager.PowerNames.slice(); //make a copy

        while (toselect.length > 0) {
            //Remove options that don't leave enough room for the other bids
            var tot = this.Total;
            var minrest = 0;
            for (let j = 0; j < toselect.length - 1; j++) minrest += options[j];
            options = options.filter(x => (x < points - tot - minrest + 1) && !(manager.IdenticalBidsProhibited && x == selectedBid));

            //Select a power
            var iPower = Math.floor(Math.random() * toselect.length);
            var selectedPower = toselect[iPower];
            toselect.splice(iPower, 1);

            //Select a bid option
            var selectedBid;
            if (toselect.length == 0) {
                selectedBid = options[options.length - 1];
            } else {
                selectedBid = options[Math.floor(Math.random() * options.length)];
            }

            this.Bids[selectedPower] = selectedBid;
        }

        toselect = manager.PowerNames.slice();//reset selections
        while (this.Total != points) {
            var selectedPower = toselect[Math.floor(Math.random() * toselect.length)];
            var newbid = this.Bids[selectedPower] + 1;
            if (!Object.values(this.Bids).includes(newbid)) this.Bids[selectedPower] = newbid;
        }
    }

    /**
     * 
     * @param {numnber} points 
     */
    MakeEven(points = null) {
        this.ClearBids();

        var manager = this.Manager;
        points = points ?? (manager.TotalPointsPerPlayer / manager.BoardsPerPlayer);

        var iMin = manager.MinimumIndividualBid;
        var n = manager.PowerNames.length;

        while (iMin * n + n * (n - 1) / 2 < points) {
            iMin++;
        }

        var options = [];
        for (let i = 0; i < manager.PowerNames.length; i++) options.push(i + iMin);

        var tot = 0;
        var i = 0;
        do {
            options[i]--; i++;
            tot = 0;
            options.forEach(x => tot += x);
        }
        while (tot > points);

        var toselect = manager.PowerNames.slice(); //make a copy

        i = 0;
        while (toselect.length > 0) {
            var iPower = Math.floor(Math.random() * toselect.length);
            var selectedPower = toselect[iPower];
            toselect.splice(iPower, 1);

            this.Bids[selectedPower] = options[i];
            i++;
        }
    }

    //#endregion

    //#region Validation

    #LastValidationMessages = "";
    get LastValidationMessages() { return this.#LastValidationMessages };

    /**
     * @param {number} maxavailable 
     * @returns Whether the validation succeeded or not
     */
    Validate(maxavailable = null) {
        var manager = this.Manager;

        var tot = 0;

        var s = '';

        var powersByBidSize = [];

        this.PowerNames.forEach(powername => {
            var val = this.Bids[powername];
            if (isNaN(val)) {
                s += powername + ' is not a number.<br>';
            } else {
                val = Number(val);
                if (!Array.isArray(powersByBidSize[val])) powersByBidSize[val] = [];
                powersByBidSize[val].push(powername);
                tot += val;
                if (val < manager.MinimumIndividualBid) s += powername + ' is below the minimum (' + manager.MinimumIndividualBid + ').<br>';
                if (val > manager.MaximumIndividualBid) s += powername + ' is above the maximum (' + manager.MaximumIndividualBid + ').<br>';
            }
        });

        if (manager.IdenticalBidsProhibited) {
            powersByBidSize.forEach(powers => {
                if (powers.length > 1) {
                    var sPowers = '';
                    for (let i = 0; i < powers.length; i++) {
                        const pp = powers[i];
                        if (i > 0 && !(powers.length == 2 && i == 1)) sPowers += ",";
                        if (i == powers.length - 1) sPowers += " and";
                        sPowers += " " + pp;
                    }
                    s += sPowers + ' have identical bids.<br>';
                }

            });
        }

        if (manager.MustUseAllPoints && tot != manager.MaximumTotal) s += 'The total must equal ' + manager.MaximumTotal + '.<br>';

        var max = maxavailable ?? manager.MaximumTotalPerRound;
        if (tot > max) s += 'Only ' + max + ' points are available for this round.<br>';

        this.#LastValidationMessages = s;

        this.OnValidate.Raise(null);

        return s == '';
    };

    //#endregion

}

class Auction {

    /**
     * 
     * @param {PowerBidManager} manager 
     * @param {number} round 
     */
    constructor(manager, round) {
        this.Manager = manager;
        this.Round = round;
    }

    /** @type {PowerBidManager} */
    Manager;

    /** @type {number} */
    Round;

    ResolutionFailed = false;

    OnResolve = new dbnEvent();

    /** @type {BidSet[]} */
    #remainingBidSets;
    #powerAssignmentCounts;

    #auditlinecount;
    #audittrail = "Awaiting auction";

    GetAuditTrail() {
        return this.#audittrail;
    }

    AddToAuditTrail(pLine) {
        if (this.#audittrail == "") this.#auditlinecount = 0;
        this.#auditlinecount++;
        this.#audittrail += this.#auditlinecount + ": " + pLine + "<br>";
    }

    get remainingPowers() {
        /** @type {string[]} */
        var ret = [];
        this.Manager.PowerNames.forEach(powername => {
            if (this.#powerAssignmentCounts[powername] < this.Manager.BoardsPerRound) ret.push(powername);
        });
        return ret;
    }

    /**
     * @param {BidSet[]} bidsets 
     * @returns {number[]}
     */
    GetBoardSeedAverages(bidsets) {
        var ret = Array.from(Array(this.Manager.BoardsPerRound), x => []);
        bidsets.forEach(bs => {
            if (!isNaN(bs.BoardIndex)) ret[bs.BoardIndex].push(bs.SeedForBoardAssignment);
        });

        ret = ret.map(x => {
            if (x.length == 0) return 0;
            var tot = 0;
            x.forEach(y => tot += y);
            return tot / x.length;
        });
        return ret;
    }

    Resolve() {

        var bidsets = this.Manager.GetBidSetsByRound(this.Round);

        if (bidsets.length != this.Manager.PlayersPerRound) throw "Incorrect number of bidsets for resolution";

        this.#audittrail = "";
        this.#remainingBidSets = bidsets.slice();

        this.#powerAssignmentCounts = {};
        this.Manager.PowerNames.forEach(powername => this.#powerAssignmentCounts[powername] = 0);

        var bValid = true;

        this.Manager.ValidateBidSets();

        bidsets.sort((a, b) => a.SeedInTourney - b.SeedInTourney);
        bidsets.forEach((x, i) => {
            x.ClearAssignments();
            if (x.LastValidationMessages) bValid = false;
        });

        if (!bValid) {
            this.ResolutionFailed = true;
            this.AddToAuditTrail("There are invalid bids.");
        } else {

            while (this.#remainingBidSets.length > 0) {

                var highestBid = -1;
                var powersWithHighestBid;

                /** @type {Object.<string,BidSet[]>} */
                var bidsetsWithHighestBid;
                var lowestSeedOfPowersWithHighestBid;

                this.remainingPowers.forEach(powername => {
                    this.#remainingBidSets.forEach(bs => {
                        var bid = bs.Bids[powername];
                        if (bid > highestBid) {
                            highestBid = bid;
                            powersWithHighestBid = [];
                            bidsetsWithHighestBid = {};
                            lowestSeedOfPowersWithHighestBid = {};
                        }
                        if (bid == highestBid) {
                            if (!powersWithHighestBid.includes(powername)) {
                                powersWithHighestBid.push(powername);
                                bidsetsWithHighestBid[powername] = [];
                                lowestSeedOfPowersWithHighestBid[powername] = 0;
                            }
                            bidsetsWithHighestBid[powername].push(bs);
                            if (lowestSeedOfPowersWithHighestBid[powername] < bs.SeedInRound) lowestSeedOfPowersWithHighestBid[powername] = bs.SeedInRound;
                        }
                    })

                });

                //Assign power
                powersWithHighestBid.sort((a, b) => -(lowestSeedOfPowersWithHighestBid[a] - lowestSeedOfPowersWithHighestBid[b]));
                var selectedPower = powersWithHighestBid[0];
                var selectedBidsets = bidsetsWithHighestBid[selectedPower];
                selectedBidsets.sort((a, b) => a.SeedInRound - b.SeedInRound);

                var selectedBidset = selectedBidsets[0];
                selectedBidset.PowerAssignment = selectedPower;
                this.#powerAssignmentCounts[selectedPower] += 1;

                this.AddToAuditTrail("Assign " + selectedPower + " to seed " + selectedBidset.SeedInRound
                    + "  (" + highestBid + " pts, #" + selectedBidset.RankOfPowerAssignmentAmongBids + ") ---- ");

                this.#remainingBidSets = this.#remainingBidSets.filter(bs => bs != selectedBidset);


                //Assign to boards
                if (this.#powerAssignmentCounts[selectedPower] == this.Manager.BoardsPerRound) {
                    //collect players
                    var bidsetsWithPower = bidsets.filter(bs => bs.PowerAssignment == selectedPower);
                    bidsetsWithPower.sort((a, b) => a.SeedInRound - b.SeedInRound);

                    var avgs = this.GetBoardSeedAverages(bidsets);
                    var boardinds = avgs.map((x, i) => i);

                    boardinds.sort((a, b) => -(avgs[a] - avgs[b]));

                    for (let i = 0; i < boardinds.length; i++) {
                        var bs = bidsetsWithPower[i];
                        bs.BoardIndex = boardinds[i];
                        this.AddToAuditTrail(" ---- Seed " + bs.SeedForBoardAssignment + " (" + bs.PowerAssignment + ") to board " + (bs.BoardIndex + 1) + "  (" + avgs[boardinds[i]].toFixed(1) + " avg seed)");
                    }

                }

            }

            var finalavgs = this.GetBoardSeedAverages(bidsets);
            finalavgs.forEach((x, i) => {
                this.AddToAuditTrail("Board " + (i + 1) + " seed avg: " + x.toFixed(1));
            });

            this.ResolutionFailed = false;
        }
        this.OnResolve.Raise(null);
    }

}

//#region UI

class BidSetView {

    /**
     * @param {PowerBidManager} manager 
     */
    constructor(manager, bidslocked = false) {
        this.Manager = manager;
        this.#BidsLocked = bidslocked;
        this.#MakeUIElements();
    }

    /** @type {PowerBidManager} */
    Manager;

    /** @type {Object.<string,dbnDiv>} */
    UI_Bids = {};
    /** @type {Object.<string,dbnElement>} */
    #BidValueElements = {};
    #inputs = {};

    /** @type {dbnSpan} */
    UI_SeedInRound = null;
    /** @type {dbnSpan} */
    UI_SeedInTourney = null;
    /** @type {dbnSpan} */
    UI_PlayerName = null;

    /** @type {dbnSpan} */
    UI_BidTotal = null;
    /** @type {dbnSpan} */
    UI_ValidationMessage = null;

    /** @type {dbnSpan} */
    resultSpans = {};

    OnChange;

    #BidsLocked = false;
    get BidsLocked() { return this.#BidsLocked; }
    set BidsLocked(value) {
        this.#BidsLocked = value;
        this.Manager.PowerNames.forEach(x => this.#MakeBidElement(x));
        this.UpdateDisplay();
    }

    #MakeUIElements() {
        this.UI_SeedInRound = new dbnSpan();
        this.UI_SeedInTourney = new dbnSpan();
        this.UI_PlayerName = new dbnSpan();

        this.Manager.PowerNames.forEach(powername => {
            var div = new dbnDiv();
            div.className = "bidvalue";
            this.UI_Bids[powername] = div;
            this.#MakeBidElement(powername);
        });

        var spanTotal = new dbnSpan();
        spanTotal.addText(0);
        this.UI_BidTotal = spanTotal;

        var spanValidate = new dbnSpan();
        spanValidate.className = "validationCell";
        this.UI_ValidationMessage = spanValidate;
    }

    /**
     * @param {string} powername 
     */
    #MakeBidElement(powername) {
        if (!this.UI_Bids.hasOwnProperty(powername)) return;

        var div = this.UI_Bids[powername];
        div.innerHTML = "";

        if (this.BidsLocked) {
            var bid = div.addSpan();
            bid.className = "bid";
            div.appendChild(bid);
            this.#BidValueElements[powername] = bid;
        } else {
            var input = div.createAndAppendElement("input");
            input.className = "bid";
            input.domelement.type = "number";
            input.domelement.value = 0;
            input.domelement.max = this.Manager.MaximumIndividualBid;
            input.domelement.min = this.Manager.MinimumIndividualBid;
            input.domelement.oninput = () => this.OnInput(powername);

            this.#inputs[powername] = input;
            this.#BidValueElements[powername] = input;
        }

        var spanResult = div.addSpan();
        spanResult.className = "inlineresult";
        this.resultSpans[powername] = spanResult;
    }

    OnInput(powername) {
        var val = this.#inputs[powername].domelement.value;
        if (!isNaN(val)) this.BidSet.Bids[powername] = Number(val);
        this.BidSet.Manager.ValidateBidSets();
        this.#HandleChange();
    }

    #HandleChange() {
        if (this.OnChange) this.OnChange();
    }

    /** @type {BidSet} */
    #BidSet;
    #SinkID_BidSet_OnValidate; #SinkID_BidSet_OnAssign;
    get BidSet() { return this.#BidSet; }
    set BidSet(value) {
        if (this.#BidSet) {
            this.#BidSet.OnValidate.RemoveListener(this.#SinkID_BidSet_OnValidate);
            this.#BidSet.OnBoardOrPowerAssignment.RemoveListener(this.#SinkID_BidSet_OnAssign);
        }
        this.#BidSet = value; this.UpdateDisplay();
        if (this.#BidSet) {
            this.#SinkID_BidSet_OnValidate = this.#BidSet.OnValidate.AddListener(() => { this.UpdateDisplay() });
            this.#SinkID_BidSet_OnAssign = this.#BidSet.OnBoardOrPowerAssignment.AddListener(() => { this.UpdateDisplay() });
        }
    }

    UpdateDisplay() {
        if (this.UI_SeedInRound == null) return;
        if (!this.#BidSet) return;

        this.UI_SeedInRound.domelement.innerHTML = this.BidSet.SeedInRound;
        this.UI_SeedInTourney.domelement.innerHTML = this.BidSet.SeedInTourney ? this.BidSet.SeedInTourney : this.BidSet.SeedInRound;
        this.UI_PlayerName.domelement.innerHTML = this.BidSet.PlayerName;

        this.Manager.PowerNames.forEach(powername => {
            if (this.BidsLocked) {
                this.#BidValueElements[powername].innerHTML = this.BidSet.Bids[powername];
            } else {
                this.#BidValueElements[powername].domelement.value = this.BidSet.Bids[powername];
            }
        });

        this.Manager.PowerNames.forEach(x => {
            var elm = this.UI_Bids[x];
            elm.className = elm.className.replace(" selected", "");
            this.resultSpans[x].innerHTML = "";
        });

        if (!isNaN(this.BidSet.BoardIndex) && this.BidSet.PowerAssignment) {
            this.resultSpans[this.BidSet.PowerAssignment].innerHTML = " " + (this.BidSet.BoardIndex + 1);
            this.UI_Bids[this.BidSet.PowerAssignment].className += " selected";
        }

        this.UI_BidTotal.domelement.innerHTML = this.BidSet.Total;
        this.UI_ValidationMessage.domelement.innerHTML = this.BidSet.LastValidationMessages;
    }

    ClearResults() {
        for (const key in this.resultSpans) this.resultSpans[key].domelement.innerHTML = "";
    }

}

class AuctionView {

    /** @param {PowerBidManager} manager 
    */
    constructor(manager) {
        this.Manager = manager;
        this.#MakeUIElements();
    }

    /** @type {PowerBidManager} */
    Manager;

    /** @type {dbnDiv} */
    UI_AuditTrail;

    /** @type {dbnDiv[]]} */
    UI_Boards = [];

    get Round() { return this.Auction.Round; }

    /** @type {Auction} */
    #Auction;
    #SinkID_Auction_OnResolve;
    get Auction() { return this.#Auction; }
    set Auction(value) {
        if (this.#Auction) { this.#Auction.OnResolve.RemoveListener(this.#SinkID_Auction_OnResolve); }
        this.#Auction = value; this.UpdateDisplay();
        if (this.#Auction) { this.#SinkID_Auction_OnResolve = this.#Auction.OnResolve.AddListener(() => { this.UpdateDisplay() }); }
    }

    #MakeUIElements() {

        this.UI_AuditTrail = new dbnDiv();
        this.UI_AuditTrail.className = "board outputMessages";

        this.UI_Boards = Array.from(Array(this.Manager.BoardsPerRound), (x, boardi) => {
            var tbl = new dbnDiv(); tbl.className = "board"; return tbl;
        });
    }

    UpdateDisplay() {
        var auction = this.Manager.GetAuction(this.Round);
        this.UI_AuditTrail.innerHTML = auction.GetAuditTrail();

        var bidsets = this.Manager.GetBidSetsByRound(this.Round);
        var boardnames = this.Manager.GetBoardNamesForRound(this.Round);

        boardnames.forEach((name, boardi) => {
            var div = this.UI_Boards[boardi];
            div.innerHTML = null;
            var tbl = div.addTable();
            tbl.CountryRows = this.Manager.PowerNames.slice();
            tbl.Title = (boardi + 1) + ". " + name;

            var data = [];

            this.Manager.PowerNames.forEach((powername, iRow) => {
                var bssearch = bidsets.filter(x => x.BoardIndex == boardi && x.PowerAssignment == powername);
                var bidset = bssearch.length == 1 ? bssearch[0] : null;
                var row = [];

                row.push(powername + ":");

                if (bidset == null) {
                    row.push("--");
                } else {
                    row.push(bidset.PlayerName + " (" + bidset.SeedInTourney + ")");
                }
                row.push((bidset == null) ? "--" : "(#" + bidset.RankOfPowerAssignmentAmongBids + ")");

                data.push(row);
            });
            tbl.Data = data;
            tbl.Generate();
        });

    }
}