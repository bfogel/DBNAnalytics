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

}

class BidSet {

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
        console.log(ret);
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
