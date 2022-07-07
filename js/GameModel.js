"use strict";

/**
 * @typedef {import('./DBNGames')}
 */

//#region Enums

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

//#endregion

//#region GameModel hub

class gmGameModel {

    LandProvinces = [ProvinceEnum.Tyr, ProvinceEnum.Vie, ProvinceEnum.Tri, ProvinceEnum.Bud, ProvinceEnum.Boh, ProvinceEnum.Gal, ProvinceEnum.Cly, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Wal, ProvinceEnum.Yor, ProvinceEnum.Lon, ProvinceEnum.Gas, ProvinceEnum.Bre, ProvinceEnum.Par, ProvinceEnum.Pic, ProvinceEnum.Bur, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Ruh, ProvinceEnum.Mun, ProvinceEnum.Ber, ProvinceEnum.Pru, ProvinceEnum.Sil, ProvinceEnum.Pie, ProvinceEnum.Ven, ProvinceEnum.Tus, ProvinceEnum.Rom, ProvinceEnum.Apu, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Lvn, ProvinceEnum.Mos, ProvinceEnum.War, ProvinceEnum.Ukr, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Arm, ProvinceEnum.Smy, ProvinceEnum.Syr, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Fin, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Naf, ProvinceEnum.Tun, ProvinceEnum.Ser, ProvinceEnum.Alb, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];
    SeaProvinces = [ProvinceEnum.NAO, ProvinceEnum.NWG, ProvinceEnum.BAR, ProvinceEnum.IRI, ProvinceEnum.NTH, ProvinceEnum.SKA, ProvinceEnum.BOT, ProvinceEnum.HEL, ProvinceEnum.BAL, ProvinceEnum.ENG, ProvinceEnum.MAO, ProvinceEnum.LYO, ProvinceEnum.WES, ProvinceEnum.TYS, ProvinceEnum.ADR, ProvinceEnum.ION, ProvinceEnum.BLA, ProvinceEnum.AEG, ProvinceEnum.EAS];
    CoastalProvinces = [ProvinceEnum.Tri, ProvinceEnum.Cly, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Wal, ProvinceEnum.Yor, ProvinceEnum.Lon, ProvinceEnum.Gas, ProvinceEnum.Bre, ProvinceEnum.Pic, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Ber, ProvinceEnum.Pru, ProvinceEnum.Pie, ProvinceEnum.Ven, ProvinceEnum.Tus, ProvinceEnum.Rom, ProvinceEnum.Apu, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Lvn, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Arm, ProvinceEnum.Smy, ProvinceEnum.Syr, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Fin, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Naf, ProvinceEnum.Tun, ProvinceEnum.Alb, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];

    SupplyCenters = [ProvinceEnum.Vie, ProvinceEnum.Tri, ProvinceEnum.Bud, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Lon, ProvinceEnum.Bre, ProvinceEnum.Par, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Mun, ProvinceEnum.Ber, ProvinceEnum.Ven, ProvinceEnum.Rom, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Mos, ProvinceEnum.War, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Smy, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Tun, ProvinceEnum.Ser, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];

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

        // if ("Competition" in json) this.Competition = json["Competition"];
        // if ("GameLabel" in json) this.GameLabel = json["GameLabel"];
        // if ("URL" in json) this.URL = json["URL"];
        // if ("DatePlayed" in json) this.DatePlayed = json["DatePlayed"];
        // if ("DateBegan" in json) this.DateBegan = json["DateBegan"];
        // if ("DateEnded" in json) this.DateEnded = json["DateEnded"];
        // if ("ScoringSystem" in json) this.ScoringSystem = json["ScoringSystem"];
        // if ("Modality" in json) this.Modality = json["Modality"];
        // if ("CommunicationType" in json) this.CommunicationType = json["CommunicationType"];
        // if ("Competition" in json) this.Competition = json["Competition"];
        // if ("Competition" in json) this.Competition = json["Competition"];
        // if ("Competition" in json) this.Competition = json["Competition"];

        if (this.GamePhases) this.GamePhases = this.GamePhases.map(x => new gmGamePhase(x));
        //if (this.ResultSummary) this.ResultSummary = this.ResultSummary.map(x => new gmResultLine(x));

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
}

//#endregion

//#region GamePhase

class gmGamePhase {

    constructor(json) {
        Object.keys(this).forEach(x => { if (x in json) this[x] = json[x]; });

        if (this.Units) {
            var newo = {};
            Object.keys(this.Units).forEach(x => newo[x] = this.Units[x].map(y => new gmUnitWithLocation(y)));
            this.Units = newo;
        }
        if (this.Orders) {
            var newo = {};
            Object.keys(this.Orders).forEach(x => newo[x] = this.Orders[x].map(y => new gmOrderAndResolution(y)));
            this.Orders = newo;
        }
        if (this.RetreatOrders) {
            var newo = {};
            Object.keys(this.RetreatOrders).forEach(x => newo[x] = this.RetreatOrders[x].map(y => new gmOrderAndResolution(y)));
            this.RetreatOrders = newo;
        }
    }

    /**@type{number} */
    Phase;
    /**@type{string} */
    Status;
    /**@type{gmDrawVote} */
    DrawVote;

    /**@type{Object.<string,number>} */
    CenterCounts; //key is CountryEnum

    /**@type{Object.<string,string[]>} */
    SupplyCenters; //key is CountryEnum, value is ProvinceEnum[]

    /**@type{Object.<string,any[]>} */
    Units; //key is CountryEnum, value is UnitWithLocation[]

    /**@type{Object.<string,any[]>} */
    Orders; //key is CountryEnum, value is OrderAndResolution[]

    /**@type{string[]} */
    DislodgedUnits; //values are ProvinceEnum

    /**@type{Object.<string,any[]>} */
    RetreatOrders; //key is CountryEnum, value is OrderAndResolution[]

    MakeSupplyCentersByProvince() {
        /** @type{Object.<string,string>}         */
        var ret = {};
        Object.entries(this.SupplyCenters).forEach(kv => kv[1].forEach(x => ret[x] = kv[0]));
        return ret;
    }
}

//#endregion

//#region gmResultLine and gmDrawVote

class gmResultLine {
    constructor(json) {
        Object.keys(this).forEach(x => { if (x in json) this[x] = json[x]; });
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
    constructor(json) {
        if (typeof json == "string") {
            this.Province = json;
            this.ProvinceCoast = ProvinceCoastEnum.None;
        } else {
            this.Province = json[0];
            if (json.length > 1) this.ProvinceCoast = json[1];
        }
    }

    /**@type{string} */
    Province;
    /**@type{string} */
    ProvinceCoast;
}

class gmUnitWithLocation {
    constructor(json) {
        this.UnitType = json[0];
        this.Location = new gmLocation(json[1]);
    }

    /**@type{string} */
    UnitType;
    /**@type{any} */
    Location;
}

//#endregion

//#region OrderAndResolution

class gmOrderAndResolution {
    constructor(json) {
        this.Province = json[0];
        this.Order = json[1];
        if (json.length > 2) this.Result = json[2];
    }

    /**@type{string} */
    Province;
    /**@type{any} */
    Order;
    /**@type{any} */
    Result;
}

//#endregion
