
class PowerBidConfiguration {

    constructor(pPowerNames, pBoardCount, pMinimumIndividualBid, pMaximumIndividualBid, pMaximumTotal, pIdenticalBidsProhibited, pMustUseAllPoints) {
        this._PowerNames = pPowerNames;
        this._BoardCount = pBoardCount;
        this._MinimumIndividualBid = pMinimumIndividualBid;
        this._MaximumIndividualBid = pMaximumIndividualBid;
        this._MaximumTotal = pMaximumTotal;
        this._IdenticalBidsProhibited = pIdenticalBidsProhibited;
        this._MustUseAllPoints = pMustUseAllPoints;
    }

    _PowerNames;
    get PowerNames() { return this._PowerNames }
    set PowerNames(value) { this._PowerNames = value }

    _BoardCount;
    get BoardCount() { return this._BoardCount }
    set BoardCount(value) { this._BoardCount = value }

    _MinimumIndividualBid;
    get MinimumIndividualBid() { return this._MinimumIndividualBid }
    set MinimumIndividualBid(value) { this._MinimumIndividualBid = value }

    _MaximumIndividualBid;
    get MaximumIndividualBid() { return this._MaximumIndividualBid }
    set MaximumIndividualBid(value) { this._MaximumIndividualBid = value }

    _MaximumTotal;
    get MaximumTotal() { return this._MaximumTotal }
    set MaximumTotal(value) { this._MaximumTotal = value }

    _IdenticalBidsProhibited;
    get IdenticalBidsProhibited() { return this._IdenticalBidsProhibited }
    set IdenticalBidsProhibited(value) { this._IdenticalBidsProhibited = value }

    _MustUseAllPoints;
    get MustUseAllPoints() { return this._MustUseAllPoints }
    set MustUseAllPoints(value) { this._MustUseAllPoints = value }

    Duplicate() {
        var ret = new PowerBidConfiguration(this.PowerNames
            , this.BoardCount
            , this.MinimumIndividualBid
            , this.MaximumIndividualBid
            , this.MaximumTotal
            , this.IdenticalBidsProhibited
            , this.MustUseAllPoints);
        return ret;
    }

    MakeNewBidSet() {
        return new BidSet(this);
    }

    MakeNewAuction(pBidsets) {
        return new Auction(this, pBidsets)
    }
    GetAllBoardNumbers() {
        var ret = [];
        for (let iBoard = 0; iBoard < this.BoardCount; iBoard++) ret.push(iBoard + 1);
        return ret;
    }

    GetAllSeeds() {
        var ret = [];
        this.GetAllBoardNumbers().forEach(iBoard => {
            this.PowerNames.forEach((powername, iPower) => {
                ret.push((iBoard - 1) * this.PowerNames.length + iPower + 1)
            });
        });
        return ret;
    }

}

class BidSet {

    constructor(pConfiguration) {
        this._config = pConfiguration;
        this.ClearBids();
    }

    _config;
    get Configuration() { return this._config }

    _Bids = {};
    get Bids() { return this._Bids; }

    get Total() {
        var ret = 0;
        this._config.PowerNames.forEach(x => ret += this.Bids[x]);
        return ret;
    }

    get PowersOrderedByBidSize() {
        var ret = this._config.PowerNames.slice();
        ret.sort((a, b) => {
            var sortret = this._Bids[a] - this._Bids[b];
            if (sortret == 0) {
                sortret = this._config.PowerNames.indexOf(a) - this._config.PowerNames.indexOf(b);
            }
            return sortret;
        });
        return ret;
    }

    ClearBids() {
        this._config.PowerNames.forEach(x => this._Bids[x] = 0);
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

            this._Bids[selectedPower] = selectedBid;

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

            this._Bids[selectedPower] = options[i];
            i++;
        }
    }
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

}

class PlayerProfile {
    _Seed;
    get Seed() { return this._Seed }
    set Seed(value) { this._Seed = value }

    _BidSet;
    get BidSet() { return this._BidSet }
    set BidSet(value) { this._BidSet = value }

    _BoardAssignment;
    get BoardAssignment() { return this._BoardAssignment }
    set BoardAssignment(value) { this._BoardAssignment = value }

    _PowerAssignment;
    get PowerAssignment() { return this._PowerAssignment }
    set PowerAssignment(value) {
        this._PowerAssignment = value;
        var i = 1;
        this._RankOfPowerAssignmentAmongBids = this._BidSet.Configuration.PowerNames.length - this._BidSet.PowersOrderedByBidSize.indexOf(value);
    }

    _RankOfPowerAssignmentAmongBids;
    get RankOfPowerAssignmentAmongBids() { return this._RankOfPowerAssignmentAmongBids }
    //set RankOfPowerAssignmentAmongBids(value) { this._RankOfPowerAssignmentAmongBids = value }
}

class Auction {

    constructor(pConfiguration, pBidsets) {
        this._config = pConfiguration;
        this._profiles = [];
        pBidsets.forEach((bs, seedish) => {
            var prof = new PlayerProfile();
            prof.Seed = seedish + 1;
            prof.BidSet = bs;
            this._profiles.push(prof);
        });
    }

    _config;

    _profiles;
    get Profiles() { return this._profiles; }

    _remainingProfiles;
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
            if (this._powerAssignmentCounts[powername] < this._config.BoardCount) ret.push(powername);
        });
        return ret;
    }

    get BoardSeedAverages() {
        var ret = [];
        this._config.GetAllBoardNumbers().forEach(iBoard => ret[iBoard - 1] = []);
        this.Profiles.forEach(profile => {
            if (!isNaN(profile.BoardAssignment)) ret[profile.BoardAssignment - 1].push(profile.Seed);
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
        this._remainingProfiles = this.Profiles.slice();

        this._powerAssignmentCounts = [];
        this._config.PowerNames.forEach(powername => this._powerAssignmentCounts[powername] = 0);

        while (this._remainingProfiles.length > 0) {

            var highestBid = -1;
            var powersWithHighestBid;
            var profilesWithHighestBid;
            var lowestSeedOfPowersWithHighestBid;

            this.remainingPowers.forEach(powername => {
                this._remainingProfiles.forEach(profile => {
                    var bid = profile.BidSet.Bids[powername];
                    if (bid > highestBid) {
                        highestBid = bid;
                        powersWithHighestBid = [];
                        profilesWithHighestBid = {};
                        lowestSeedOfPowersWithHighestBid = {};
                    }
                    if (bid == highestBid) {
                        if (!powersWithHighestBid.includes(powername)) {
                            powersWithHighestBid.push(powername);
                            profilesWithHighestBid[powername] = [];
                            lowestSeedOfPowersWithHighestBid[powername] = 0;
                        }
                        profilesWithHighestBid[powername].push(profile);
                        if (lowestSeedOfPowersWithHighestBid[powername] < profile.Seed) lowestSeedOfPowersWithHighestBid[powername] = profile.Seed;
                    }
                })

            });

            //Assign power
            powersWithHighestBid.sort((a, b) => -(lowestSeedOfPowersWithHighestBid[a] - lowestSeedOfPowersWithHighestBid[b]));
            var selectedPower = powersWithHighestBid[0];
            var selectedProfiles = profilesWithHighestBid[selectedPower];
            selectedProfiles.sort((a, b) => a.Seed - b.Seed);

            var selectedProfile = selectedProfiles[0];
            selectedProfile.PowerAssignment = selectedPower;
            this._powerAssignmentCounts[selectedPower] += 1;

            this.AddToAuditTrail("Assign " + selectedPower + " to seed " + selectedProfile.Seed
                + "  (" + highestBid + " pts, #" + selectedProfile.RankOfPowerAssignmentAmongBids + ") ---- ");

            this._remainingProfiles = this._remainingProfiles.filter(profile => profile != selectedProfile);


            //Assign to boards
            if (this._powerAssignmentCounts[selectedPower] == this._config.BoardCount) {
                //collect players
                var profilesWithPower = this.Profiles.filter(profile => profile.PowerAssignment == selectedPower);
                profilesWithPower.sort((a, b) => a.Seed - b.Seed);

                var avgs = this.BoardSeedAverages;
                var boardinds = [];
                this._config.GetAllBoardNumbers().forEach(iBoard => boardinds.push(iBoard - 1));

                boardinds.sort((a, b) => -(avgs[a] - avgs[b]));

                for (let i = 0; i < boardinds.length; i++) {
                    var profile = profilesWithPower[i];
                    profile.BoardAssignment = boardinds[i] + 1;
                    this.AddToAuditTrail(" ---- Seed " + profile.Seed + " (" + profile.PowerAssignment + ") to board " + profile.BoardAssignment + "  (" + avgs[boardinds[i]].toFixed(1) + " avg seed)");
                }

            }

        }

        var finalavgs = this.BoardSeedAverages;
        finalavgs.forEach((x, i) => {
            this.AddToAuditTrail("Board " + (i + 1) + " seed avg: " + x.toFixed(1));
        });
    }

}
