
function GetRankGroups() {
    var ics = mCenterCounts.map((x, i) => [i, x]);
    ics.sort((a, b) => b[1] - a[1]);

    var iPlace = 1;
    var ret = [[1, []]];
    var iLastCC = ics[0][1];
    ics.forEach(x => {
        if (x[1] == iLastCC) {
            ret[ret.length - 1][1].push(x[0]);
        } else {
            iPlace += ret[ret.length - 1][1].length;
            ret.push([iPlace, [x[0]]]);
            iLastCC = x[1];
        }
    });
    return ret;
}

function GetRankGroupsWithOE() {
    var ics = mCenterCounts.map((x, i) => [i, x + (x == 0 ? mElims[i] / 2000 : 0)]);
    ics.sort((a, b) => b[1] - a[1]);

    var iPlace = 1;
    var ret = [[1, []]];
    var iLastCC = ics[0][1];
    ics.forEach(x => {
        if (x[1] == iLastCC) {
            ret[ret.length - 1][1].push(x[0]);
        } else {
            iPlace += ret[ret.length - 1][1].length;
            ret.push([iPlace, [x[0]]]);
            iLastCC = x[1];
        }
    });
    return ret;
}

function FindSoloist() {
    var ret = 0;
    mCenterCounts.forEach(x => {
        if (x > 17) ret = x;
    });
    return ret;
}

function CalculatePPSC() {
    var ret = new Array(7);
    for (i = 0; i < mCenterCounts.length; i++) {
        ret[i] = mCenterCounts[i];
    }
    return ret;
}

function CalculateDSS() {

    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 1 : 0);

    var survived = mCenterCounts.map(x => (x > 0 ? 1 : 0));
    var drawsize = survived.reduce((tot, cc) => tot + cc);
    var ret = survived.map(x => x / drawsize);
    return ret;
}

function CalculateCarnage() {

    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 28034 : 0);

    var ranks = GetRankGroupsWithOE();

    var ret = mCenterCounts.map(x => x);
    ranks.forEach(x => {
        var place = x[0] + (x[1].length - 1) / 2;
        x[1].forEach(y => ret[y] += 1000 * (8 - place));
    });

    return ret;
}

function CalculateSoS() {

    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 100 : 0);

    var squares = mCenterCounts.map(x => x * x);
    var tot = squares.reduce((t, x) => t + x);
    var ret = squares.map(x => 100 * x / tot);

    return ret;
}

function CalculateManorCon() { return CalculateManorConBase(75, true); }
function CalculateManorConV2() { return CalculateManorConBase(100, false); }

function CalculateManorConBase(solovalue, elimsHaveWeight) {

    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? solovalue : 0);

    var squares = mCenterCounts.map(x => x * x + 4 * x + (elimsHaveWeight || x > 0 ? 16 : 0));
    var tot = squares.reduce((t, x) => t + x);

    var ret = squares.map(x => (x > 16) ? 100 * x / tot : 0);

    return ret;
}

function CalculateCDiplo() {

    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 100 : 0);

    var ranks = GetRankGroups();
    var ret = mCenterCounts.map(x => 1 + x);
    var bonuses = [38, 14, 7, 0, 0, 0, 0];

    var lastrank = 0;
    ranks.forEach(x => {
        var start = lastrank + 1;
        var end = start + x[1].length - 1;

        var bonus = 0;
        for (i = start; i <= end; i++) {
            bonus += bonuses[i - 1];
        }

        bonus /= x[1].length;

        lastrank += x[1].length;
        x[1].forEach(i => ret[i] += bonus);
    });

    return ret;
}

function CalculateDixie() {
    var solcc = FindSoloist();

    var ret = mCenterCounts.map(x => 4 * x);
    var bonuses = [270, 70, 50, 34, 20, 10, 0];

    var ranks = [];

    var bSolo = (solcc != 0);

    var survivors = [0, 1, 2, 3, 4, 5, 6].filter(i => ((bSolo && mCenterCounts[i] == solcc) || (!bSolo && mCenterCounts[i] > 0 && !mVotedOut[i])));

    var surrenderers = [0, 1, 2, 3, 4, 5, 6].filter(i => (!bSolo && mCenterCounts[i] > 0 && mVotedOut[i]));

    var ranksOE = GetRankGroupsWithOE();
    var iPlace = 1;

    ranks.push([iPlace, survivors]); iPlace += survivors.length;

    //if(surrenderers.length>0)
    //{
    //	ranks.push([iPlace, surrenderers]); iPlace += surrenderers.length;
    //}

    ranksOE.forEach(x => {
        var inthis = x[1].filter(i => !survivors.includes(i));

        if (inthis.length > 0) {
            ranks.push([iPlace, inthis]);
            iPlace += inthis.length;
        }
    });

    var lastrank = 0;
    ranks.forEach(x => {
        var start = lastrank + 1;
        var end = start + x[1].length - 1;

        var bonus = 0;
        for (i = start; i <= end; i++) {
            bonus += bonuses[i - 1];
        }
        bonus /= x[1].length;

        lastrank += x[1].length;
        x[1].forEach(i => ret[i] += bonus);
    });

    return ret;
}

function CalculateWorldClassic() {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 420 : 0);

    var topcenters = Math.max(...mCenterCounts);
    var toppers = mCenterCounts.filter(x => x == topcenters);
    var survivors = mCenterCounts.filter(x => x > 0);

    var survB = 30;

    var ret = mCenterCounts.map(x => {
        var score = 10 * x;
        if (x > 0) {
            score += survB;
            if (x == topcenters) {
                score += 48 / toppers.length;
            }
        }
        return score;
    });

    return ret;
}

function CalculateBangkok() {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 41 : 0);

    var topcenters = Math.max(...mCenterCounts);
    var toppers = mCenterCounts.filter(x => x == topcenters);
    var domshares = mCenterCounts.map(x => Math.max(3 - (topcenters - x), 0));

    var domtotal = 0;
    domshares.forEach(x => domtotal += x);

    var survB = 3;

    var ret = mCenterCounts.map((x, i) => {
        var score = x + 12 * domshares[i] / domtotal;
        if (x > 0) score += survB;
        return score;
    });

    return ret;
}

function CalculateWhipping() {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 468 : 0);

    var topcenters = Math.max(...mCenterCounts);
    var toppers = mCenterCounts.filter(x => x == topcenters);
    var survivors = mCenterCounts.filter(x => x > 0);

    var survB = 60 / survivors.length;

    var ret = mCenterCounts.map(x => {
        var score = 10 * x;
        if (x > 0) {
            score += survB;
            if (x == topcenters & toppers.length == 1) {
                score += 2 * x;
            }
        }
        return score;
    });

    return ret;
}

function CalculateTribute() {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 100 : 0);

    var topcenters = Math.max(...mCenterCounts);
    var toppers = mCenterCounts.filter(x => x == topcenters);
    var survivors = mCenterCounts.filter(x => x > 0);

    var survB = 66 / survivors.length;
    var tribute = Math.max(0, Math.min(topcenters - 6, survB));

    var ret = mCenterCounts.map(x => {
        var score = x;
        if (x > 0) {
            score += survB;
            if (x == topcenters) {
                score += (survivors.length - toppers.length) * tribute / toppers.length;
            }
            else {
                score -= tribute;
            }
        }
        return score;
    });

    return ret;
}

function CalculateMindTheGap() {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 100 : 0);

    var topcenters = Math.max(...mCenterCounts);
    var toppers = mCenterCounts.filter(x => x == topcenters);
    var nontoppers = mCenterCounts.filter(x => x != topcenters);
    var survivors = mCenterCounts.filter(x => x > 0);

    var survB = 49 / survivors.length;
    var secondcenters = toppers.length > 1 ? topcenters : Math.max(...nontoppers);
    var tribute = Math.min(topcenters - secondcenters, survB);

    var ret = mCenterCounts.map(x => {
        var score = 1.5 * x + (x > 0 ? survB : 0);
        if (x > 0) {
            if (x == topcenters) {
                score += nontoppers.length * tribute / toppers.length;
            }
            else {
                score -= tribute;
            }
        }
        return score;
    });

    return ret;
}

function CalculateOpenTribute(pC, pShareType, pSpoilVanquished) {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 34 * (pC + 7) : 0);

    var topcenters = Math.max(...mCenterCounts);
    var toppers = mCenterCounts.map((x, i) => (x == topcenters) ? i : -1);
    toppers = toppers.filter(x => x >= 0);
    //DebugPrint(toppers);

    var tribute = 0;
    var ret = mCenterCounts.map(x => {
        var score = 34 + pC * x + ((x == 0) ? -17 : 0);
        score -= topcenters - x;
        tribute += topcenters - x
        if (x == 0 && pSpoilVanquished) score = 0;
        return score;
    });

    if (toppers.length > 1) {
        switch (pShareType) {
            case 1:
                tribute /= toppers.length;
                break;
            case 2:
                tribute = 0;
                break;
        }
    }
    tribute /= toppers.length;
    toppers.forEach(i => ret[i] += tribute);

    return ret;
}

function CalculateOpenMindTheGap() {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 100 : 0);

    var topcenters = Math.max(...mCenterCounts);
    var rankgroups = GetRankGroups();

    var iTotalBeaten = 7;
    var iTotalBeatenBy = 0;
    var iTributeTarget = 0;
    var dbTotalTribute = 0.0;
    var toppers = null;

    var ret = mCenterCounts.map(x => 0);

    rankgroups.forEach(x => {
        var rank = x[0];
        var players = x[1];
        var centercount = mCenterCounts[players[0]];

        iTotalBeaten -= players.length;
        if (rank == 1) toppers = players;
        if (rank == 2 && toppers.length == 1) iTributeTarget = topcenters - centercount;

        players.forEach(pp => {
            ret[pp] = 1.5 * centercount + (centercount > 0 ? 9 : 0) + Math.max(0, 0.75 * (iTotalBeaten - iTotalBeatenBy));
            if (rank > 1) {
                var dbTribute = Math.min(iTributeTarget, 0.5 * ret[pp]);
                ret[pp] -= dbTribute;
                dbTotalTribute += dbTribute;
            }
        });

        iTotalBeatenBy += players.length;
    });

    if (toppers.length == 1) ret[toppers[0]] += dbTotalTribute;

    return ret;
}

function CalculateApex() {
    var soli = FindSoloist();
    if (soli != 0) return mCenterCounts.map(x => (x == soli) ? 340 : 0);

    var topcenters = Math.max(...mCenterCounts);
    var toppers = mCenterCounts.map((x, i) => (x == topcenters) ? i : -1);
    toppers = toppers.filter(x => x >= 0);

    var ret = mCenterCounts.map(x => {
        var score = 3 * x + ((x > 0) ? 30 : 0);
        return score;
    });

    switch (toppers.length) {
        case 1:
            ret[topppers[0]] = 10 * mCenterCounts[toppers[0]];
            break;
        case 2:
            toppers.forEach(x => ret[x] += 10);
            break;
        default:
            break;
    }

    return ret;
}