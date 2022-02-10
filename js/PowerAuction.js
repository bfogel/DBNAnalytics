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

            for (let iRound = 0; iRound < mgr.RoundCount; iRound++) {
                mgr.BoardNamesByRound[iRound] = Array.from(Array(mgr.BoardsPerRound), (x, i) => "Board " + i);
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
    BoardNamesByRound = {};
    MinimumIndividualBid = 0;
    TotalPointsPerPlayer = 0;
    MustUseAllPoints = false;
    IdenticalBidsProhibited = true;
    ReseedByRound = true;

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

    get MaximumTotalPerRound() { return this.TotalPointsPerPlayer - ((this.BoardsPerPlayer - 1) * this.MinimumTotalPerRound); }
    get MaximumIndividualBid() { return this.TotalPointsPerPlayer - (this.BoardsPerPlayer * this.MinimumTotalPerRound) + (this.MinimumIndividualBid + this.PowerNames.length - 1); }

    MakeNewBidSet() { return new BidSet(this.CompetitionID); }

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
    /**
     * @param {BidSet} bidset 
     */
    RegisterBidSet(bidset) {
        if (!this.RegisteredBidSetsByPlayerAndRound.hasOwnProperty(bidset.PlayerName)) {
            this.RegisteredBidSetsByPlayerAndRound[bidset.PlayerName] = {};
        }
        this.RegisteredBidSetsByPlayerAndRound[bidset.PlayerName][bidset.Round] = bidset;
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
            bs.Validate(tot - ((roundsleft - 1) * this.MinimumTotalPerRound));
            roundsleft--;
            tot -= bs.Total;
        });
    }

    //#endregion
}

class PowerBidConfiguration {

    PowerNames;
    BoardNames;
    MinimumIndividualBid;
    MaximumIndividualBid;
    MaximumTotal;
    IdenticalBidsProhibited;
    MustUseAllPoints;
    ReseedByRound = true;

    Duplicate() {
        var ret = new PowerBidConfiguration();
        ret.PowerNames = this.PowerNames;
        ret.MinimumIndividualBid = this.MinimumIndividualBid;
        ret.MaximumIndividualBid = this.MaximumIndividualBid;
        ret.MaximumTotal = this.MaximumTotal;
        ret.IdenticalBidsProhibited = this.IdenticalBidsProhibited;
        ret.MustUseAllPoints = this.MustUseAllPoints;
        ret.BoardNames = this.BoardNames;
        ret.ReseedByRound = this.ReseedByRound;
        return ret;
    }

    MakeNewBidSet() { return new BidSet(this); }

    MakeNewAuction(pBidSets) { return new Auction(this, pBidSets) }

    get PlayerCount() { return 7 * this.BoardNames.length; }

    MakeInstructions() {
        var ret = new dbnDiv();

        var p = ret.addParagraph();
        p.addText("Players have 200 points to bid for ");
        p.addItalicText("both games combined");
        p.addText(".");

        ret.addText("Bids for a single game are subject to these constraints:");
        var ol = ret.addOrderedList();
        ol.AddItem("Individual bids must be no less than 0 and no more than 164 points.");
        ol.AddItem("A player's total bid can be no more than 179 points.");
        ol.AddItem("A player cannot bid the same amount on any two powers. This means that a player's total bid must be at least 21 points.");

        return ret;
    }

}

var mConfiguration = new PowerBidConfiguration();
mConfiguration.PowerNames = ["Austria", "England", "France", "Germany", "Italy", "Russia", "Turkey"];
mConfiguration.BoardNames = ["Board A", "Board B"];

mConfiguration.MaximumTotal = 179;
mConfiguration.MustUseAllPoints = false;
mConfiguration.MaximumIndividualBid = 164;
mConfiguration.MinimumIndividualBid = 0;
mConfiguration.IdenticalBidsProhibited = true;
mConfiguration.ReseedByRound = true;

class BidSet {

    constructor(competitionid) {
        this.CompetitionID = competitionid;
        this.ClearBids();
    }

    /** @type {number} */
    CompetitionID;
    get Manager() { return PowerBidManager.GetManagerForCompetition(this.CompetitionID); }
    get PowerNames() { return this.Manager.PowerNames; }

    PlayerName;
    SeedInTourney;
    Round;
    SeedInRound;

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
                sortret = this.PowerNames.indexOf(a) - this._config.PowerNames.indexOf(b);
            }
            return sortret;
        });
        return ret;
    }

    //#region Assignment

    BoardIndex = undefined;

    _PowerAssignment;
    get PowerAssignment() { return this._PowerAssignment }
    set PowerAssignment(value) {
        this._PowerAssignment = value;
        var i = 1;
        this.RankOfPowerAssignmentAmongBids = this.PowerNames.length - this.PowersOrderedByBidSize.indexOf(value);
    }

    RankOfPowerAssignmentAmongBids;

    //#endregion

    //#region Modify bids

    ClearBids() {
        this.PowerNames.forEach(x => this.Bids[x] = 0);
    }

    MakeRandom() {
        this.ClearBids();

        var options = [];
        for (let i = this.Manager.MinimumIndividualBid; i < this.Manager.MaximumIndividualBid + 1; i++) options.push(i);

        var toselect = this.PowerNames.slice(); //make a copy

        while (toselect.length > 0) {
            var iPower = Math.floor(Math.random() * toselect.length);
            var selectedPower = toselect[iPower];
            toselect.splice(iPower, 1);

            var selectedBid;
            if (toselect.length == 0) {
                selectedBid = options[options.length - 1];
            } else {
                selectedBid = options[Math.floor(Math.random() * options.length)];
            }

            this.Bids[selectedPower] = selectedBid;

            var tot = this.Total;

            var minrest = 0;
            for (let j = 0; j < toselect.length - 1; j++) minrest += options[j];

            options = options.filter(x => (x < this.Manager.MaximumTotal - tot - minrest + 1) && !(this.Manager.IdenticalBidsProhibited && x == selectedBid));
        }
    }

    MakeEven() {
        this.ClearBids();

        var iMin = this.Manager.MinimumIndividualBid;
        var n = this.PowerNames.length;
        while (iMin * n + n * (n - 1) / 2 < this.Manager.MaximumTotal) {
            iMin++;
        }

        var options = [];
        for (let i = 0; i < this.PowerNames.length; i++) options.push(i + iMin);

        var tot = 0;
        var i = 0;
        do {
            options[i]--; i++;
            tot = 0;
            options.forEach(x => tot += x);
        }
        while (tot > this.Manager.MaximumTotal);

        var toselect = this.PowerNames.slice(); //make a copy

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

    OnValidate;

    _LastValidationMessages = "";
    get LastValidationMessages() { return this._LastValidationMessages };

    ValidateAndGetMessages() {
        this.Validate();
        return this.LastValidationMessages;
    }

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

        this._LastValidationMessages = s;

        if (this.OnValidate) this.OnValidate();

        return s == '';
    };

    //#endregion

}

class BidSetOLD {

    constructor(pConfiguration) {
        this._config = pConfiguration;
        this.ClearBids();
    }

    _config;
    get Configuration() { return this._config }

    PlayerName;
    SeedInTourney;
    Round;
    SeedInRound;

    Bids = {};

    get Total() {
        var ret = 0;
        this._config.PowerNames.forEach(x => ret += this.Bids[x]);
        return ret;
    }

    get SeedForBoardAssignment() { return this._config.ReseedByRound ? this.SeedInRound : this.SeedInTourney; }

    get PowersOrderedByBidSize() {
        var ret = this._config.PowerNames.slice();
        ret.sort((a, b) => {
            var sortret = this.Bids[a] - this.Bids[b];
            if (sortret == 0) {
                sortret = this._config.PowerNames.indexOf(a) - this._config.PowerNames.indexOf(b);
            }
            return sortret;
        });
        return ret;
    }

    //#region Assignment

    BoardIndex = undefined;

    _PowerAssignment;
    get PowerAssignment() { return this._PowerAssignment }
    set PowerAssignment(value) {
        this._PowerAssignment = value;
        var i = 1;
        this.RankOfPowerAssignmentAmongBids = this.Configuration.PowerNames.length - this.PowersOrderedByBidSize.indexOf(value);
    }

    RankOfPowerAssignmentAmongBids;

    //#endregion

    //#region Modify bids

    ClearBids() {
        this._config.PowerNames.forEach(x => this.Bids[x] = 0);
    }

    MakeRandom() {
        this.ClearBids();

        var options = [];
        for (let i = this._config.MinimumIndividualBid; i < this._config.MaximumIndividualBid + 1; i++) options.push(i);

        var toselect = this._config.PowerNames.slice(); //make a copy

        while (toselect.length > 0) {
            var iPower = Math.floor(Math.random() * toselect.length);
            var selectedPower = toselect[iPower];
            toselect.splice(iPower, 1);

            var selectedBid;
            if (toselect.length == 0) {
                selectedBid = options[options.length - 1];
            } else {
                selectedBid = options[Math.floor(Math.random() * options.length)];
            }

            this.Bids[selectedPower] = selectedBid;

            var tot = this.Total;

            var minrest = 0;
            for (let j = 0; j < toselect.length - 1; j++) minrest += options[j];

            options = options.filter(x => (x < this._config.MaximumTotal - tot - minrest + 1) && !(this._config.IdenticalBidsProhibited && x == selectedBid));
        }
    }

    MakeEven() {
        this.ClearBids();

        var iMin = this._config.MinimumIndividualBid;
        var n = this._config.PowerNames.length;
        while (iMin * n + n * (n - 1) / 2 < this._config.MaximumTotal) {
            iMin++;
        }

        var options = [];
        for (let i = 0; i < this._config.PowerNames.length; i++) options.push(i + iMin);

        var tot = 0;
        var i = 0;
        do {
            options[i]--; i++;
            tot = 0;
            options.forEach(x => tot += x);
        }
        while (tot > this._config.MaximumTotal);

        var toselect = this._config.PowerNames.slice(); //make a copy

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

    _LastValidationMessages = "";
    get LastValidationMessages() { return this._LastValidationMessages };

    ValidateAndGetMessages() {
        this.Validate();
        return this.LastValidationMessages;
    }

    Validate() {
        var tot = 0;

        var s = '';

        var powersByBidSize = [];

        this._config.PowerNames.forEach(powername => {
            var val = this.Bids[powername];
            if (isNaN(val)) {
                s += powername + ' is not a number.<br>';
            } else {
                val = Number(val);
                if (!Array.isArray(powersByBidSize[val])) powersByBidSize[val] = [];
                powersByBidSize[val].push(powername);
                tot += val;
                if (val < this._config.MinimumIndividualBid) s += powername + ' is below the minimum (' + this._config.MinimumIndividualBid + ').<br>';
                if (val > this._config.MaximumIndividualBid) s += powername + ' is above the maximum (' + this._config.MaximumIndividualBid + ').<br>';
            }
        });

        if (this._config.IdenticalBidsProhibited) {
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

        if (this._config.MustUseAllPoints && tot != this._config.MaximumTotal) s += 'The total must equal ' + this._config.MaximumTotal + '.<br>';
        if (tot > this._config.MaximumTotal) s += 'The total is above the maximum (' + this._config.MaximumTotal + ').<br>';

        this._LastValidationMessages = s;

        return s == '';
    };

    //#endregion

}

class Auction {

    _config;

    constructor(pConfiguration, pBidSets) {
        this._config = pConfiguration;
        this._bidsets = pBidSets.slice();
    }

    ResolutionFailed = false;

    _bidsets = Array(0).map(x => new BidSet());
    get BidSets() { return this._bidsets; }

    _remainingBidSets = Array(0).map(x => new BidSet());
    _powerAssignmentCounts;

    _auditlinecount;
    _audittrail = "";

    GetAuditTrail() {
        return this._audittrail;
    }

    AddToAuditTrail(pLine) {
        if (this._audittrail == "") this._auditlinecount = 0;
        this._auditlinecount++;
        this._audittrail += this._auditlinecount + ": " + pLine + "<br>";
    }

    get remainingPowers() {
        var ret = [];
        this._config.PowerNames.forEach(powername => {
            if (this._powerAssignmentCounts[powername] < this._config.BoardNames.length) ret.push(powername);
        });
        return ret;
    }

    get BoardSeedAverages() {
        var ret = this._config.BoardNames.map((name, i) => []);
        this.BidSets.forEach(bs => {
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
        this._audittrail = "";
        this._remainingBidSets = this.BidSets.slice();

        this._powerAssignmentCounts = {};
        this._config.PowerNames.forEach(powername => this._powerAssignmentCounts[powername] = 0);

        var bValid = true;

        this._bidsets.sort((a, b) => a.SeedInTourney - b.SeedInTourney);
        this._bidsets.forEach((x, i) => {
            x.PowerAssignment = undefined;
            x.BoardIndex = undefined;
            x.SeedInRound = i + 1
            var msg = x.ValidateAndGetMessages();
            if (msg != '') bValid = false;
        });

        if (!bValid) {
            this.ResolutionFailed = true;
            this.AddToAuditTrail("There are invalid bids.");
            return;
        }

        while (this._remainingBidSets.length > 0) {

            var highestBid = -1;
            var powersWithHighestBid;
            var bidsetsWithHighestBid;
            var lowestSeedOfPowersWithHighestBid;

            this.remainingPowers.forEach(powername => {
                this._remainingBidSets.forEach(bs => {
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
            this._powerAssignmentCounts[selectedPower] += 1;

            this.AddToAuditTrail("Assign " + selectedPower + " to seed " + selectedBidset.SeedInRound
                + "  (" + highestBid + " pts, #" + selectedBidset.RankOfPowerAssignmentAmongBids + ") ---- ");

            this._remainingBidSets = this._remainingBidSets.filter(bs => bs != selectedBidset);


            //Assign to boards
            if (this._powerAssignmentCounts[selectedPower] == this._config.BoardNames.length) {
                //collect players
                var bidsetsWithPower = this.BidSets.filter(bs => bs.PowerAssignment == selectedPower);
                bidsetsWithPower.sort((a, b) => a.SeedInRound - b.SeedInRound);

                var avgs = this.BoardSeedAverages;
                var boardinds = [];
                this._config.BoardNames.map((x, i) => boardinds.push(i));

                boardinds.sort((a, b) => -(avgs[a] - avgs[b]));

                for (let i = 0; i < boardinds.length; i++) {
                    var bs = bidsetsWithPower[i];
                    bs.BoardIndex = boardinds[i];
                    this.AddToAuditTrail(" ---- Seed " + bs.SeedForBoardAssignment + " (" + bs.PowerAssignment + ") to board " + (bs.BoardIndex + 1) + "  (" + avgs[boardinds[i]].toFixed(1) + " avg seed)");
                }

            }

        }

        var finalavgs = this.BoardSeedAverages;
        finalavgs.forEach((x, i) => {
            this.AddToAuditTrail("Board " + (i + 1) + " seed avg: " + x.toFixed(1));
        });

        this.ResolutionFailed = false;

    }

}

//#region UI

class PlayerBidInput {
    inputs = {};

    seedInRoundSpan = null;
    seedInTourneySpan = null;
    playerNameSpan = null;
    totalSpan = null;
    validateSpan = null;
    resultSpans = {};

    OnChange;

    MakeRow() {
        var row = [];

        this.seedInRoundSpan = new dbnSpan();
        this.seedInTourneySpan = new dbnSpan();
        this.playerNameSpan = new dbnSpan();

        row.push(this.seedInRoundSpan, this.seedInTourneySpan, this.playerNameSpan);

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

        var spanValidate = new dbnSpan();
        spanValidate.className = "validationCell";
        this.validateSpan = spanValidate;
        row.push(spanValidate);

        return row;
    }

    OnInput(powername) {
        var val = this.inputs[powername].domelement.value;
        if (!isNaN(val)) this.BidSet.Bids[powername] = Number(val);
        this.BidSet.Manager.ValidateBidSets();
        this.#HandleChange();
    }

    #HandleChange() {
        if (this.OnChange) this.OnChange();
    }

    /** @type {BidSet} */
    #BidSet;
    get BidSet() { return this.#BidSet; }
    set BidSet(value) {
        if (this.#BidSet) this.#BidSet.OnValidate = null;
        this.#BidSet = value; this.UpdateDisplay();
        this.#BidSet.OnValidate = () => { this.UpdateDisplay(); };
    }

    UpdateDisplay() {
        this.seedInRoundSpan.domelement.innerHTML = this.BidSet.SeedInRound;
        this.seedInTourneySpan.domelement.innerHTML = this.BidSet.SeedInTourney ? this.BidSet.SeedInTourney : this.BidSet.SeedInRound;
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

        this.totalSpan.domelement.innerHTML = this.BidSet.Total;
        this.validateSpan.domelement.innerHTML = this.BidSet.LastValidationMessages;
    }

    MakeNewBidset() {
        var bs = mConfiguration.MakeNewBidSet();
        bs.SeedInTourney = this.BidSet.SeedInTourney;
        bs.PlayerName = this.BidSet.PlayerName;
        return bs;
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