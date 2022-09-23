"use strict";

//#region Enums

const CountryEnum = {
    Austria: "Austria",
    England: "England",
    France: "France",
    Germany: "Germany",
    Italy: "Italy",
    Russia: "Russia",
    Turkey: "Turkey"
}

const ProvinceEnum = { NAO: "NAO", NWG: "NWG", BAR: "BAR", IRI: "IRI", NTH: "NTH", SKA: "SKA", BOT: "BOT", HEL: "HEL", BAL: "BAL", ENG: "ENG", MAO: "MAO", LYO: "LYO", WES: "WES", TYS: "TYS", ADR: "ADR", ION: "ION", BLA: "BLA", AEG: "AEG", EAS: "EAS", Tyr: "Tyr", Vie: "Vie", Tri: "Tri", Bud: "Bud", Boh: "Boh", Gal: "Gal", Cly: "Cly", Edi: "Edi", Lvp: "Lvp", Wal: "Wal", Yor: "Yor", Lon: "Lon", Gas: "Gas", Bre: "Bre", Par: "Par", Pic: "Pic", Bur: "Bur", Mar: "Mar", Kie: "Kie", Ruh: "Ruh", Mun: "Mun", Ber: "Ber", Pru: "Pru", Sil: "Sil", Pie: "Pie", Ven: "Ven", Tus: "Tus", Rom: "Rom", Apu: "Apu", Nap: "Nap", Stp: "Stp", Lvn: "Lvn", Mos: "Mos", War: "War", Ukr: "Ukr", Sev: "Sev", Con: "Con", Ank: "Ank", Arm: "Arm", Smy: "Smy", Syr: "Syr", Nwy: "Nwy", Swe: "Swe", Fin: "Fin", Den: "Den", Bel: "Bel", Hol: "Hol", Por: "Por", Spa: "Spa", Naf: "Naf", Tun: "Tun", Ser: "Ser", Alb: "Alb", Rum: "Rum", Bul: "Bul", Gre: "Gre" };
function ProvinceEnumFromID(id) { switch (id) { case 0: return "NAO"; case 1: return "NWG"; case 2: return "BAR"; case 3: return "IRI"; case 4: return "NTH"; case 5: return "SKA"; case 6: return "BOT"; case 7: return "HEL"; case 8: return "BAL"; case 9: return "ENG"; case 10: return "MAO"; case 11: return "LYO"; case 12: return "WES"; case 13: return "TYS"; case 14: return "ADR"; case 15: return "ION"; case 16: return "BLA"; case 17: return "AEG"; case 18: return "EAS"; case 19: return "Tyr"; case 20: return "Vie"; case 21: return "Tri"; case 22: return "Bud"; case 23: return "Boh"; case 24: return "Gal"; case 25: return "Cly"; case 26: return "Edi"; case 27: return "Lvp"; case 28: return "Wal"; case 29: return "Yor"; case 30: return "Lon"; case 31: return "Gas"; case 32: return "Bre"; case 33: return "Par"; case 34: return "Pic"; case 35: return "Bur"; case 36: return "Mar"; case 37: return "Kie"; case 38: return "Ruh"; case 39: return "Mun"; case 40: return "Ber"; case 41: return "Pru"; case 42: return "Sil"; case 43: return "Pie"; case 44: return "Ven"; case 45: return "Tus"; case 46: return "Rom"; case 47: return "Apu"; case 48: return "Nap"; case 49: return "Stp"; case 50: return "Lvn"; case 51: return "Mos"; case 52: return "War"; case 53: return "Ukr"; case 54: return "Sev"; case 55: return "Con"; case 56: return "Ank"; case 57: return "Arm"; case 58: return "Smy"; case 59: return "Syr"; case 60: return "Nwy"; case 61: return "Swe"; case 62: return "Fin"; case 63: return "Den"; case 64: return "Bel"; case 65: return "Hol"; case 66: return "Por"; case 67: return "Spa"; case 68: return "Naf"; case 69: return "Tun"; case 70: return "Ser"; case 71: return "Alb"; case 72: return "Rum"; case 73: return "Bul"; case 74: return "Gre"; default: return undefined; } }
const ProvinceCoastEnum = { None: "None", ec: "ec", wc: "wc", sc: "sc", nc: "nc" };
function ProvinceCoastEnumFromID(id) { switch (id) { case 0: return "None"; case 1: return "ec"; case 2: return "wc"; case 3: return "sc"; case 4: return "nc"; default: return undefined; } }
const ProvinceTypeEnum = { Land: "Land", Water: "Water" };
function ProvinceTypeEnumFromID(id) { switch (id) { case 0: return "Land"; case 1: return "Water"; default: return undefined; } }
const ScoringSystemEnum = { Unscored: "Unscored", DrawSize: "DrawSize", Dixie: "Dixie", SimpleRank: "SimpleRank", SimpleRankWithOE: "SimpleRankWithOE", SumOfSquares: "SumOfSquares", Tribute: "Tribute", HalfTribute: "HalfTribute", ManorCon: "ManorCon", OpenTributeFrac: "OpenTributeFrac", Bangkok: "Bangkok", Bangkok100: "Bangkok100", WorldClassic: "WorldClassic", Whipping: "Whipping", Detour09: "Detour09", Carnage: "Carnage", Carnage21: "Carnage21", Carnage100: "Carnage100", CenterCountCarnage: "CenterCountCarnage", Maxonian: "Maxonian", CDiplo: "CDiplo", SuperPastis: "SuperPastis", CDiploRoundDown: "CDiploRoundDown", CDiploNamur: "CDiploNamur", WinNamur: "WinNamur", DiploLigue: "DiploLigue", MindTheGap: "MindTheGap", EDC2021: "EDC2021", OpenMindTheGap: "OpenMindTheGap", PoppyCon2021: "PoppyCon2021", OpenTribute: "OpenTribute", SemiTribute: "SemiTribute", ManorConOriginal: "ManorConOriginal", ManorConV2: "ManorConV2", Manual: "Manual" };
function ScoringSystemEnumFromID(id) { switch (id) { case 0: return "Unscored"; case 1: return "DrawSize"; case 2: return "Dixie"; case 5: return "SimpleRank"; case 6: return "SimpleRankWithOE"; case 10: return "SumOfSquares"; case 11: return "Tribute"; case 12: return "HalfTribute"; case 13: return "ManorCon"; case 14: return "OpenTributeFrac"; case 15: return "Bangkok"; case 16: return "Bangkok100"; case 17: return "WorldClassic"; case 18: return "Whipping"; case 19: return "Detour09"; case 20: return "Carnage"; case 21: return "Carnage21"; case 22: return "Carnage100"; case 23: return "CenterCountCarnage"; case 24: return "Maxonian"; case 30: return "CDiplo"; case 31: return "SuperPastis"; case 32: return "CDiploRoundDown"; case 33: return "CDiploNamur"; case 34: return "WinNamur"; case 35: return "DiploLigue"; case 50: return "MindTheGap"; case 51: return "EDC2021"; case 52: return "OpenMindTheGap"; case 80: return "PoppyCon2021"; case 114: return "OpenTribute"; case 115: return "SemiTribute"; case 116: return "ManorConOriginal"; case 117: return "ManorConV2"; case 1000: return "Manual"; default: return undefined; } }
const GameCommunicationTypeEnum = { Full: "Full", PublicOnly: "PublicOnly", None: "None" };
function GameCommunicationTypeEnumFromID(id) { switch (id) { case 0: return "Full"; case 1: return "PublicOnly"; case 2: return "None"; default: return undefined; } }
const GameLanguageEnum = { English: "English", French: "French", German: "German" };
function GameLanguageEnumFromID(id) { switch (id) { case 0: return "English"; case 1: return "French"; case 2: return "German"; default: return undefined; } }
const GameDeadlineTypeEnum = { Live: "Live", Extended: "Extended" };
function GameDeadlineTypeEnumFromID(id) { switch (id) { case 0: return "Live"; case 1: return "Extended"; default: return undefined; } }
const GameLimitTypeEnum = { Unlimited: "Unlimited", TimeLimited: "TimeLimited", YearLimited: "YearLimited" };
function GameLimitTypeEnumFromID(id) { switch (id) { case 0: return "Unlimited"; case 1: return "TimeLimited"; case 2: return "YearLimited"; default: return undefined; } }
const GameAnonymityTypeEnum = { None: "None", Partial: "Partial", Full: "Full" };
function GameAnonymityTypeEnumFromID(id) { switch (id) { case 0: return "None"; case 1: return "Partial"; case 2: return "Full"; default: return undefined; } }

const GameViewingModeEnum = { ProvincesOnly: "ProvincesOnly", ProvincesAndUnitsOnly: "ProvincesAndUnitsOnly", EverythingWithReveal: "EverythingWithReveal", EverythingWithoutReveal: "EverythingWithoutReveal" };
const UnitTypeEnum = { Army: "A", Fleet: "F" };
const GamePhaseStatusEnum = { AwaitingOrders: "AwaitingOrders", AwaitingRetreats: "AwaitingRetreats", Completed: "Completed", GameEnded: "GameEnded" };

//#endregion

//#region GameModel hub

class gmGameModel {

    LandProvinces = [ProvinceEnum.Tyr, ProvinceEnum.Vie, ProvinceEnum.Tri, ProvinceEnum.Bud, ProvinceEnum.Boh, ProvinceEnum.Gal, ProvinceEnum.Cly, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Wal, ProvinceEnum.Yor, ProvinceEnum.Lon, ProvinceEnum.Gas, ProvinceEnum.Bre, ProvinceEnum.Par, ProvinceEnum.Pic, ProvinceEnum.Bur, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Ruh, ProvinceEnum.Mun, ProvinceEnum.Ber, ProvinceEnum.Pru, ProvinceEnum.Sil, ProvinceEnum.Pie, ProvinceEnum.Ven, ProvinceEnum.Tus, ProvinceEnum.Rom, ProvinceEnum.Apu, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Lvn, ProvinceEnum.Mos, ProvinceEnum.War, ProvinceEnum.Ukr, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Arm, ProvinceEnum.Smy, ProvinceEnum.Syr, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Fin, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Naf, ProvinceEnum.Tun, ProvinceEnum.Ser, ProvinceEnum.Alb, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];
    SeaProvinces = [ProvinceEnum.NAO, ProvinceEnum.NWG, ProvinceEnum.BAR, ProvinceEnum.IRI, ProvinceEnum.NTH, ProvinceEnum.SKA, ProvinceEnum.BOT, ProvinceEnum.HEL, ProvinceEnum.BAL, ProvinceEnum.ENG, ProvinceEnum.MAO, ProvinceEnum.LYO, ProvinceEnum.WES, ProvinceEnum.TYS, ProvinceEnum.ADR, ProvinceEnum.ION, ProvinceEnum.BLA, ProvinceEnum.AEG, ProvinceEnum.EAS];
    CoastalProvinces = [ProvinceEnum.Tri, ProvinceEnum.Cly, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Wal, ProvinceEnum.Yor, ProvinceEnum.Lon, ProvinceEnum.Gas, ProvinceEnum.Bre, ProvinceEnum.Pic, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Ber, ProvinceEnum.Pru, ProvinceEnum.Pie, ProvinceEnum.Ven, ProvinceEnum.Tus, ProvinceEnum.Rom, ProvinceEnum.Apu, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Lvn, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Arm, ProvinceEnum.Smy, ProvinceEnum.Syr, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Fin, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Naf, ProvinceEnum.Tun, ProvinceEnum.Alb, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];

    SupplyCenters = [ProvinceEnum.Vie, ProvinceEnum.Tri, ProvinceEnum.Bud, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Lon, ProvinceEnum.Bre, ProvinceEnum.Par, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Mun, ProvinceEnum.Ber, ProvinceEnum.Ven, ProvinceEnum.Rom, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Mos, ProvinceEnum.War, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Smy, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Tun, ProvinceEnum.Ser, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];

    /**@type{Object.<string,string[]>} */
    #SupplyCentersByCountry;
    get SupplyCentersByCountry() {
        if (!this.#SupplyCentersByCountry) {
            this.#SupplyCentersByCountry = {};
            Object.values(CountryEnum).forEach(x => this.#SupplyCentersByCountry[x] = []);
            this.SupplyCenters.forEach(province => {
                var country = this.GetHomeCountryForProvince(province);
                if (!country) return;
                this.#SupplyCentersByCountry[country].push(province);
            });
        }
        return this.#SupplyCentersByCountry;
    }

    GetHomeCountryForProvince(province) {
        switch (province) {
            case ProvinceEnum.Tyr: return CountryEnum.Austria;
            case ProvinceEnum.Vie: return CountryEnum.Austria;
            case ProvinceEnum.Tri: return CountryEnum.Austria;
            case ProvinceEnum.Bud: return CountryEnum.Austria;
            case ProvinceEnum.Boh: return CountryEnum.Austria;
            case ProvinceEnum.Gal: return CountryEnum.Austria;

            case ProvinceEnum.Cly: return CountryEnum.England;
            case ProvinceEnum.Edi: return CountryEnum.England;
            case ProvinceEnum.Lvp: return CountryEnum.England;
            case ProvinceEnum.Wal: return CountryEnum.England;
            case ProvinceEnum.Yor: return CountryEnum.England;
            case ProvinceEnum.Lon: return CountryEnum.England;

            case ProvinceEnum.Gas: return CountryEnum.France;
            case ProvinceEnum.Bre: return CountryEnum.France;
            case ProvinceEnum.Par: return CountryEnum.France;
            case ProvinceEnum.Pic: return CountryEnum.France;
            case ProvinceEnum.Bur: return CountryEnum.France;
            case ProvinceEnum.Mar: return CountryEnum.France;

            case ProvinceEnum.Kie: return CountryEnum.Germany;
            case ProvinceEnum.Ruh: return CountryEnum.Germany;
            case ProvinceEnum.Mun: return CountryEnum.Germany;
            case ProvinceEnum.Ber: return CountryEnum.Germany;
            case ProvinceEnum.Pru: return CountryEnum.Germany;
            case ProvinceEnum.Sil: return CountryEnum.Germany;

            case ProvinceEnum.Pie: return CountryEnum.Italy;
            case ProvinceEnum.Ven: return CountryEnum.Italy;
            case ProvinceEnum.Tus: return CountryEnum.Italy;
            case ProvinceEnum.Rom: return CountryEnum.Italy;
            case ProvinceEnum.Apu: return CountryEnum.Italy;
            case ProvinceEnum.Nap: return CountryEnum.Italy;

            case ProvinceEnum.Stp: return CountryEnum.Russia;
            case ProvinceEnum.Lvn: return CountryEnum.Russia;
            case ProvinceEnum.Mos: return CountryEnum.Russia;
            case ProvinceEnum.War: return CountryEnum.Russia;
            case ProvinceEnum.Ukr: return CountryEnum.Russia;
            case ProvinceEnum.Sev: return CountryEnum.Russia;

            case ProvinceEnum.Con: return CountryEnum.Turkey;
            case ProvinceEnum.Ank: return CountryEnum.Turkey;
            case ProvinceEnum.Arm: return CountryEnum.Turkey;
            case ProvinceEnum.Smy: return CountryEnum.Turkey;
            case ProvinceEnum.Syr: return CountryEnum.Turkey;

            default: return null;
        }
    }

};
const myGameModel = new gmGameModel();

//#endregion

//#region Game

class gmGame {

    constructor(json) {
        Object.keys(this).forEach(x => { if (x in json) this[x] = json[x]; });
        if (this.ResultSummary) this.ResultSummary = this.MapByCountries(this.ResultSummary, x => new gmResultLine(x));
        if (this.GamePhases) this.GamePhases = this.GamePhases.map(x => new gmGamePhase(x));
    }

    /**
     * 
     * @param {object} obj 
     * @param {Function} func 
     */
    MapByCountries(obj, func) {
        var ret = {};
        Object.keys(CountryEnum).forEach(k => { if (k in obj) ret[k] = func(obj[k]); });
        return ret;
    }

    /**@type{string} */
    Competition;
    /**@type{string} */
    GameLabel;
    /**@type{string} */
    URL;
    /**@type{string} */
    DatePlayed;
    /**@type{string} */
    DateBegan;
    /**@type{string} */
    DateEnded;
    /**@type{string} */
    ScoringSystem;
    /**@type{string} */
    Modality;
    /**@type{string} */
    CommunicationType;
    /**@type{string} */
    Language;
    /**@type{string} */
    DeadlineType;
    /**@type{string} */
    LimitType;
    /**@type{string} */
    AnonymityType;
    /**@type{string} */
    EndedBy;
    /**@type{string} */
    Note;

    /**@type{Object.<string,string>} */
    Players; // key is CountryEnum, value is name

    /**@type{Object.<string,gmResultLine>} */
    ResultSummary; // key is CountryEnum

    /**@type{gmGamePhase[]]} */
    GamePhases;

    // ------------------  Not in published schema

    ScorePhases() {
        this.GamePhases.forEach(gp => {
            var sb = new dbnGameScoreboard(this.ScoringSystem);
            Object.values(CountryEnum).forEach(country => {
                var cc = gp.CenterCounts[country] ?? 0;
                sb.RegisterCountry(country, cc, cc != 0, null);
            });
            sb.CalculateScores();
            gp.Scoreboard = sb;
        });
    }

}

//#endregion

//#region GamePhase

class gmGamePhase {

    constructor(json = null) {
        if (json) Object.keys(this).forEach(x => { if (x in json) this[x] = json[x]; });

        if (this.Units) {
            var newo = {};
            Object.keys(this.Units).forEach(x => newo[x] = this.Units[x].map(y => gmUnitWithLocation.FromJSON(y)));
            this.Units = newo;
        }
        if (this.Orders) {
            var newo = {};
            Object.keys(this.Orders).forEach(x => newo[x] = this.Orders[x].map(y => gmOrderAndResolution.FromJSON(y)));
            this.Orders = newo;
        }
        if (this.RetreatOrders) {
            var newo = {};
            Object.keys(this.RetreatOrders).forEach(x => newo[x] = this.RetreatOrders[x].map(y => gmOrderAndResolution.FromJSON(y)));
            this.RetreatOrders = newo;
        }
    }

    /**@type{number} */
    Phase;
    get PhaseTextLong() {
        var year = Math.floor(this.Phase / 10);
        var season = this.Phase % 10;
        var ss = "";
        switch (season) {
            case 1: ss = "Spring"; break;
            case 2: ss = "Fall"; break;
            case 3: ss = "Winter"; break;
            default: break;
        }
        return ss + " " + year;
    }
    get PhaseTextShort() {
        var year = Math.floor(this.Phase / 10);
        var season = this.Phase % 10;
        var ss = "";
        switch (season) {
            case 1: ss = "S"; break;
            case 2: ss = "F"; break;
            case 3: ss = "W"; break;
            default: break;
        }
        return ss + String(year).substring(2);
    }

    /**@type{string}  - GamePhaseStatusEnum*/
    Status;
    /**@type{gmDrawVote} */
    DrawVote;

    /**@type{Object.<string,number>}*/
    CenterCounts; //key is CountryEnum

    /**@type{Object.<string,string[]>} */
    SupplyCenters; //key is CountryEnum, value is ProvinceEnum[]

    /**@type{Object.<string,gmUnitWithLocation[]>} */
    Units; //key is CountryEnum, value is UnitWithLocation[]

    /**@type{Object.<string,gmOrderAndResolution[]>} */
    Orders; //key is CountryEnum, value is OrderAndResolution[]

    /**@type{string[]} */
    DislodgedUnits; //values are ProvinceEnum

    /**@type{Object.<string,any[]>} */
    RetreatOrders; //key is CountryEnum, value is OrderAndResolution[]

    MakeSupplyCentersByProvince() {
        /** @type{Object.<string,string>}         */
        var ret = {};
        Object.entries(this.SupplyCenters).forEach(kv => (kv[1] ?? []).forEach(x => ret[x] = kv[0]));
        return ret;
    }

    GetUnitWithLocation(province) {
        for (const country in this.Units) {
            const units = this.Units[country];
            for (const uwl of units) {
                if (uwl.Location.Province == province) return uwl;
            }
        }
        return null;
    }

    GetOrdersForProvince(province) {
        /**@type{Object.<string,gmOrderAndResolution[]>} */
        var ret = {};
        for (const country in this.Orders) {
            const orders = this.Orders[country];
            for (const oar of orders) {
                if (oar.Province == province) {
                    if (!ret.hasOwnProperty(country)) ret[country] = [];
                    ret[country].push(oar);
                }
            }
        }
        return ret;
    }

    // ------------------  Not in published schema

    /**@type{dbnGameScoreboard} */
    Scoreboard;
}

//#endregion

//#region gmResultLine and gmDrawVote

class gmResultLine {
    constructor(json) {
        Object.keys(this).forEach(x => { if (x in json) this[x] = json[x]; });

        if (typeof this.InGameAtEnd == "string") this.InGameAtEnd = this.InGameAtEnd == "true";
    }

    /**@type{number} */
    CenterCount;
    /**@type{number|null} */
    YearOfElimination;
    /**@type{boolean} */
    InGameAtEnd;
    /**@type{number} */
    Score;
    /**@type{number} */
    Rank;
}

class gmDrawVote {

}

//#endregion

//#region Locataion and UnitWithLocation

class gmLocation {
    /**
     * 
     * @param {string} province 
     * @param {string} provincecoast 
     */
    constructor(province, provincecoast = null) {
        this.Province = province;
        this.ProvinceCoast = provincecoast ?? ProvinceCoastEnum.None;
    }

    /**@type{string} */
    Province;
    /**@type{string} */
    ProvinceCoast;

    get Key() { return JSON.stringify(this.ToJSON()); }
    ToString() { return this.Province + ((this.ProvinceCoast ?? ProvinceCoastEnum.None) != ProvinceCoastEnum.None ? this.ProvinceCoast : ""); }

    ToJSON() { return (this.ProvinceCoast ?? ProvinceCoastEnum.None) == ProvinceCoastEnum.None ? this.Province : [this.Province, this.ProvinceCoast]; }
    static FromJSON(json) {
        if (typeof json == "string") {
            return new gmLocation(json, ProvinceCoastEnum.None);
        } else {
            return new gmLocation(json[0], (json.length > 1) ? json[1] : ProvinceCoastEnum.None);
        }
    }

    /**
     * 
     * @param {string} unittype
     */
    ToUnitWithLocation(unittype) { return new gmUnitWithLocation(unittype, this); }
}

class gmUnitWithLocation {
    /**
     * 
     * @param {string} unittype 
     * @param {gmLocation} location 
     */
    constructor(unittype, location) {
        this.UnitType = unittype;
        this.Location = location;
    }

    /**@type{string} */  //UnitTypeEnum
    UnitType;
    /**@type{gmLocation} */
    Location;

    get Key() { return JSON.stringify(this.ToJSON()); };
    ToString() { return this.UnitType.substring(0, 1) + " " + this.Location.ToString(); }

    ToJSON() { return [this.UnitType, this.Location.ToJSON()]; }
    static FromJSON(json) { return new gmUnitWithLocation(json[0], gmLocation.FromJSON(json[1])); }

}

//#endregion

//#region OrderAndResolution

class gmOrderAndResolution {
    /**
     * 
     * @param {*} province 
     * @param {*} order 
     * @param {*} result 
     */
    constructor(province, order, result) {
        this.Province = province;
        this.Order = order;
        this.Result = result;
    }

    static FromJSON(json) { return new gmOrderAndResolution(json[0], gmOrder.FromJSON(json[1]), (json.length > 2) ? gmOrderResult.FromJSON(json[2]) : null); }

    ToString() { return this.Province + " " + this.Order.ToString(); }

    /**@type{string} */
    Province;
    /**@type{gmOrder} */
    Order;
    /**@type{gmOrderResult} */
    Result;
}

class gmOrderResult {
    /**
     * 
     * @param {boolean} succeeded 
     * @param {string} reason 
     */

    constructor(succeeded, reason) { this.Succeeded = succeeded; this.Reason = reason; }
    /**@type{boolean} */ Succeeded;
    /**@type{string} */ Reason;

    ToJSON() {
        var s = this.Succeeded ? "s" : "f";
        if ((this.Reason ?? "") == "") return s;
        return [s, this.Reason];
    }

    static FromJSON(json) {
        if (typeof json == "string") {
            switch (json) {
                case "s": return new gmOrderResult(true, null);
                case "f": return new gmOrderResult(false, null);
                default: throw "Invalid order result: " + json;
            }
        }

        if (!(Array.isArray(json)) || json.length == 0) throw "Invalid OrderResult: " + JSON.stringify(json);
        var ret = new gmOrderResult(null, null);
        switch (json[0]) {
            case "s": ret.Succeeded = true; break;
            case "f": ret.Succeeded = false; break;
            default: throw "Invalid order result: " + JSON.stringify(json);
        }
        if (json.length > 1) ret.Reason = json[1];
        return ret;
    }
}

class gmOrder {

    /**
     * 
     * @param {string} type 
     */
    constructor(type) { this.Type = type; }

    /**@type{string} */
    Type;

    ToString() { throw "NIE"; }
    ToJSON() { throw "NIE"; }

    get IsAdjustment() { return this.Type == "b" || this.Type == "d"; }

    static FromJSON(json) {
        if (typeof json == "string") {
            switch (json) {
                case "h": return new gmOrderHold();
                case "d": return new gmOrderDisband();
                default: throw "Order not recognized: " + json;
            }
        }

        if (!(Array.isArray(json)) || json.length == 0) throw "Invalid order: " + JSON.stringify(json);
        switch (json[0]) {
            case "h": return new gmOrderHold();
            case "m": return gmOrderMove.FromJSON(json);
            case "sh": return gmOrderSupportHold.FromJSON(json);
            case "sm": return gmOrderSupportMove.FromJSON(json);
            case "c": return gmOrderConvoy.FromJSON(json);
            case "b": return gmOrderBuild.FromJSON(json);
            case "d": return new gmOrderDisband();
            default: throw "Invalid order: " + JSON.stringify(json);
        }
    }
}

class gmOrderHold extends gmOrder {
    constructor() { super("h"); }

    ToString() { return "H"; };
    ToJSON() { return this.Type; };
}

class gmOrderMove extends gmOrder {
    /**
     * 
     * @param {gmLocation} tolocation 
     */
    constructor(tolocation) { super("m"); this.ToLocation = tolocation; }

    /**@type{gmLocation} */ ToLocation;
    ToString() { return "- " + this.ToLocation.ToString(); }

    ToJSON() { return [this.Type, this.ToLocation.ToJSON()]; }
    static FromJSON(json) {
        if (!Array.isArray(json)) throw "gmOrderMove: json must be an array";
        if (json.length != 2) throw "Bad move order: " + JSON.stringify(json);
        return new gmOrderMove(gmLocation.FromJSON(json[1]));
    }
}

class gmOrderSupportHold extends gmOrder {
    /**
     * 
     * @param {gmLocation} holdlocation 
     */
    constructor(holdlocation) { super("sh"); this.HoldLocation = holdlocation; }

    /**@type{gmLocation} */ HoldLocation;
    ToString() { return "S " + this.HoldLocation.ToString(); }

    ToJSON() { return [this.Type, this.HoldLocation.ToJSON()]; }
    static FromJSON(json) {
        if (!Array.isArray(json)) throw "gmOrderSupportHold: json must be an array";
        if (json.length != 2) throw "Bad support hold order: " + JSON.stringify(json);
        return new gmOrderSupportHold(gmLocation.FromJSON(json[1]));
    }
}

class gmOrderSupportMove extends gmOrder {
    /**
     * 
     * @param {gmLocation} fromlocation 
     * @param {gmLocation} tolocation 
     */
    constructor(fromlocation, tolocation) { super("sm"); this.FromLocation = fromlocation; this.ToLocation = tolocation; }

    /**@type{gmLocation} */ FromLocation;
    /**@type{gmLocation} */ ToLocation;
    ToString() { return "S " + this.FromLocation.ToString() + "-" + this.ToLocation.ToString(); }

    ToJSON() { return [this.Type, this.FromLocation.ToJSON(), this.ToLocation.ToJSON()]; }
    static FromJSON(json) {
        if (!Array.isArray(json)) throw "gmOrderSupportMove: json must be an array";
        if (json.length != 3) throw "Bad support move order: " + JSON.stringify(json);
        return new gmOrderSupportMove(gmLocation.FromJSON(json[1]), gmLocation.FromJSON(json[2]));
    }
}

class gmOrderConvoy extends gmOrder {
    /**
     * 
     * @param {gmLocation} fromlocation 
     * @param {gmLocation} tolocation 
     */
    constructor(fromlocation, tolocation) { super("c"); this.FromLocation = fromlocation; this.ToLocation = tolocation; }

    /**@type{gmLocation} */ FromLocation;
    /**@type{gmLocation} */ ToLocation;
    ToString() { return "C " + this.FromLocation.ToString() + "-" + this.ToLocation.ToString(); }

    ToJSON() { return [this.Type, this.FromLocation.ToJSON(), this.ToLocation.ToJSON()]; }
    static FromJSON(json) {
        if (!Array.isArray(json)) throw "gmOrderConvoy: json must be an array";
        if (json.length != 3) throw "Bad convoy order: " + JSON.stringify(json);
        return new gmOrderConvoy(gmLocation.FromJSON(json[1]), gmLocation.FromJSON(json[2]));
    }
}

class gmOrderBuild extends gmOrder {
    /**
     * 
     * @param {gmUnitWithLocation} unitwithlocation 
     */
    constructor(unitwithlocation) { super("b"); this.UnitWithLocation = unitwithlocation; }

    ToString() { return "Build " + this.UnitWithLocation.UnitType; }

    ToJSON() { return [this.Type, this.UnitWithLocation.ToJSON()]; }
    static FromJSON(json) {
        if (!Array.isArray(json)) throw "gmOrderBuild: json must be an array";
        if (json.length != 2) throw "Bad build order: " + JSON.stringify(json);
        return new gmOrderBuild(gmUnitWithLocation.FromJSON(json[1]));
    }
}

class gmOrderDisband extends gmOrder {
    constructor() { super("d"); }
    ToString() { return "Disb"; };
    ToJSON() { return this.Type; };
}

//#endregion

//#region GameScoreboard

//#region Lines

class dbnScoreboardResultLine {
    constructor(country) { this.Country = country; }
    /**@type{string} */  Country;
    /**@type{dbnScoreboardResultLineKernel} */  Kernel;
    /**@type{dbnScoreboardResultLineScoring} */  Scoring;
}

class dbnScoreboardResultLineKernel {
    /**@type{number} */ CenterCount;

    /**@type{number|null} */ YearOfElimination;

    /**@type{bool} */ InDraw;
    /**@type{bool} */ UnexcusedResignation;
    /**@type{number} */ ManualScoreAdjustment;

    /**@type{bool} */  ScoreCounts;
    /**@type{number|null} */ TiebreakerRank;

    /**@type{number|null} */ LookbackRankScore;

    toString() {
        return CenterCount + ", " + (InDraw ? "InDraw" : "OutDraw") + (YearOfElimination ? ", [elim: " + YearOfElimination + "]" : "");
    }
}

class dbnScoreboardResultLineScoring {
    /**@type{number} */  Score;
    /**@type{number} */  Topshare;

    /**@type{number} */  Rank;
    /**@type{number} */  RankScore;
    /**@type{number} */  RankWithOE;
    /**@type{number} */  RankScoreWithOE;
}

//#endregion

class dbnGameScoreboard {

    //#region Engine

    /**
     * 
     * @param {string} scoringsystem ScoringSystemEnum
     */
    constructor(scoringsystem) {
        this.ScoringSystem = scoringsystem;
        Object.values(CountryEnum).forEach(x => this.ResultLines[x] = new dbnScoreboardResultLine(x));
    }

    /**@type{string} */ ScoringSystem;
    /**@type{Object.<string,dbnScoreboardResultLine} */ ResultLines = {};
    get ResultLineValues() { return Object.values(this.ResultLines); }

    //#region Aggregates

    get DrawSize() { let ret = 0; this.ResultLineValues.forEach(x => ret += x.Kernel.InDraw); return ret; }
    get TopperCenterCount() { let ret = 0; this.ResultLineValues.forEach(x => ret = Math.max(ret, x.Kernel.CenterCount)); return ret; }
    get Toppers() { let tc = this.TopperCenterCount; return this.ResultLineValues.filter(x => x.Kernel.CenterCount == tc); }

    //#endregion

    /**
     * 
     * @param {string} country 
     * @param {number} centercount 
     * @param {boolean} indraw 
     * @param {int|undefined} yearOfElimination 
     */
    RegisterCountry(country, centercount, indraw, yearOfElimination) {
        let kern = new dbnScoreboardResultLineKernel();
        kern.CenterCount = centercount;
        kern.InDraw = indraw;
        kern.YearOfElimination = yearOfElimination;
        this.ResultLines[country].Kernel = kern;
    }

    CalculateScores() {
        //CheckForAllResults();

        //if (ScoringSystem.DrawsIncludeAllSurvivors()) EnforceDIAS();
        Object.entries(this.ResultLines).forEach(([country, rl], i) => rl.Scoring = new dbnScoreboardResultLineScoring());

        this.#CalculateRanks();

        switch (this.ScoringSystem) {
            // case ScoringSystemEnum.Tribute: ScoreTribute(); break;
            case ScoringSystemEnum.OpenTribute: this.#ScoreOpenTribute(true); break;
            case ScoringSystemEnum.OpenTributeFrac: this.#ScoreOpenTribute(false); break;

            // case ScoringSystemEnum.CDiplo: ScoreCDiplo(); break;
            // case ScoringSystemEnum.CDiploRoundDown: ScoreCDiploRoundDown(); break;
            // case ScoringSystemEnum.CDiploNamur: ScoreCDiploNamur(); break;
            // case ScoringSystemEnum.EDC2021: ScoreEDC2021(); break;
            // case ScoringSystemEnum.PoppyCon2021: ScorePoppyCon2021(); break;

            // case ScoringSystemEnum.Bangkok: ScoreBangkok(); break;
            // case ScoringSystemEnum.Bangkok100: ScoreBangkok(); Normalize100(); break;
            // case ScoringSystemEnum.SumOfSquares: ScoreSumOfSquares(); break;
            // case ScoringSystemEnum.ManorCon: ScoreManorCon(75, true); break;
            // case ScoringSystemEnum.ManorConOriginal: ScoreManorCon(100, true); break;
            // case ScoringSystemEnum.ManorConV2: ScoreManorCon(100, false); break;


            // case ScoringSystemEnum.Carnage: ScoreCarnage(); break;
            // case ScoringSystemEnum.Carnage100: ScoreCarnage(); Normalize100(); break;
            // case ScoringSystemEnum.Carnage21: ScoreCarnage(21034); break;
            // case ScoringSystemEnum.CenterCountCarnage: ScoreCarnageCenterCount(); break;
            // case ScoringSystemEnum.SimpleRank: ScoreSimpleRank(); break;
            // case ScoringSystemEnum.SimpleRankWithOE: ScoreSimpleRankWithOE(); break;
            // case ScoringSystemEnum.Maxonian: ScoreMaxonian(); break;

            // case ScoringSystemEnum.DrawSize: ScoreDrawSize(); break;
            //case ScoringSystemEnum.Dixie: this.#ScoreOpenTribute(true); break;

            // case ScoringSystemEnum.WorldClassic: ScoreWorldClassic(); break;
            // case ScoringSystemEnum.Whipping: ScoreWhipping(); break;
            // case ScoringSystemEnum.Detour09: ScoreDetour09(); break;

            // case ScoringSystemEnum.MindTheGap: ScoreMindTheGap(); break;
            // case ScoringSystemEnum.OpenMindTheGap: ScoreOpenMindTheGap(); break;

            // case ScoringSystemEnum.Unscored: break;
            // case ScoringSystemEnum.Manual: break;
            default: console.log("GameScoreboard: Scoring system not recognized (" + this.ScoringSystem + ")");
        }

        // Lines.Values.Where(x => x.Kernel.ManualScoreAdjustment.HasValue).ForEach(x => x.Scoring.Score += x.Kernel.ManualScoreAdjustment.Value);

        // foreach(var rl in Lines.Values)
        // {
        //     rl.Scoring.Score *= Multiplier;
        //     if (rl.Kernel.UnexcusedResignation) rl.Scoring.Score = 0;
        // }
    }

    #CalculateRanks() {
        var ics = this.ResultLineValues.map((x, i) => [x, x.Kernel.CenterCount]);
        ics.sort((a, b) => b[1] - a[1]);

        var iPlace = 1;
        var placegroups = [[1, []]];
        var iLastCC = ics[0][1];
        ics.forEach(x => {
            if (x[1] == iLastCC) {
                placegroups[placegroups.length - 1][1].push(x[0]);
            } else {
                iPlace += placegroups[placegroups.length - 1][1].length;
                placegroups.push([iPlace, [x[0]]]);
                iLastCC = x[1];
            }
        });

        placegroups.forEach(x => {
            x[1].forEach(y => {
          /** @type{dbnScoreboardResultLine} */ var z = y;
                z.Scoring.Rank = x[0];
                z.Scoring.RankScore = x[0] + (x[1].length - 1) / 2;
                z.Scoring.Topshare = (x[0] == 1 ? 1 / x[1].length : 0);
            });
        });
    }

    // function GetRankGroupsWithOE() {
    //     var ics = mCenterCounts.map((x, i) => [i, x + (x == 0 ? mElims[i] / 2000 : 0)]);
    //     ics.sort((a, b) => b[1] - a[1]);

    //     var iPlace = 1;
    //     var ret = [[1, []]];
    //     var iLastCC = ics[0][1];
    //     ics.forEach(x => {
    //         if (x[1] == iLastCC) {
    //             ret[ret.length - 1][1].push(x[0]);
    //         } else {
    //             iPlace += ret[ret.length - 1][1].length;
    //             ret.push([iPlace, [x[0]]]);
    //             iLastCC = x[1];
    //         }
    //     });
    //     return ret;
    // }

    //#endregion

    //#region Systems

    /**
     * 
     * @param {boolean} noFractions 
     */
    #ScoreOpenTribute(nofractions) {
        var iTopCenterCount = this.TopperCenterCount;
        var toppers = this.Toppers;
        var iDrawSize = this.DrawSize;

        if (iDrawSize == 1) {
            this.ResultLineValues.forEach(rl => rl.Scoring.Score = rl.Kernel.InDraw ? 340 : 0);
        } else {
            var tribute = 0.0;

            this.ResultLineValues.forEach(rl => {
                var x = rl.Kernel.CenterCount;
                var score = 34 + 3 * x + (x == 0 ? -17 : 0);
                score -= iTopCenterCount - x;
                tribute += iTopCenterCount - x;
                if (x == 0) score = 0;
                rl.Scoring.Score = score;
            });

            tribute /= (toppers.length * toppers.length);
            if (nofractions) tribute = Math.floor(tribute);
            toppers.forEach(rl => rl.Scoring.Score += tribute);
        }
    }

    // #ScoreDixie()
    //     {
    //         this.ResultLineValues.forEach(rl=> rl.Scoring.Score = 4 * rl.Kernel.CenterCount);

    //         var bonuspts = [ 0, 10, 20, 34, 50, 70, 270 ];

    //         var rankgroups = new SortedDictionary<int, List<CountryEnum>>();

    //         foreach (var rl in Lines.Values)
    //         {
    //             var key = rl.Kernel.InDraw ? 1 : rl.Scoring.RankWithOE;
    //             if (!rankgroups.ContainsKey(key)) rankgroups.Add(key, new List<CountryEnum>());
    //             rankgroups[key].Add(rl.Country);
    //         }

    //         var bnstart = 0; var bnend = 0;
    //         foreach (var slot in rankgroups.Reverse())
    //         {
    //             bnend = bnstart + slot.Value.Count - 1;
    //             double pts = 0;
    //             for (int i = bnstart; i <= bnend; i++) pts += bonuspts[i];
    //             pts /= slot.Value.Count;
    //             foreach (var cc in slot.Value) Lines[cc].Scoring.Score += pts;
    //             bnstart = bnend + 1;
    //         }
    //     }

    //#endregion

}

  //#endregion