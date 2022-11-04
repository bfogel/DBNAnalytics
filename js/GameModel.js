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

const OrderTypeEnum = { Hold: "h", Move: "m", SupportHold: "sh", SupportMove: "sm", Convoy: "c", Build: "b", Disband: "d" };

//#endregion

//#region GameModel hub

class gmGameModel {

    LandProvinces = [ProvinceEnum.Tyr, ProvinceEnum.Vie, ProvinceEnum.Tri, ProvinceEnum.Bud, ProvinceEnum.Boh, ProvinceEnum.Gal, ProvinceEnum.Cly, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Wal, ProvinceEnum.Yor, ProvinceEnum.Lon, ProvinceEnum.Gas, ProvinceEnum.Bre, ProvinceEnum.Par, ProvinceEnum.Pic, ProvinceEnum.Bur, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Ruh, ProvinceEnum.Mun, ProvinceEnum.Ber, ProvinceEnum.Pru, ProvinceEnum.Sil, ProvinceEnum.Pie, ProvinceEnum.Ven, ProvinceEnum.Tus, ProvinceEnum.Rom, ProvinceEnum.Apu, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Lvn, ProvinceEnum.Mos, ProvinceEnum.War, ProvinceEnum.Ukr, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Arm, ProvinceEnum.Smy, ProvinceEnum.Syr, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Fin, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Naf, ProvinceEnum.Tun, ProvinceEnum.Ser, ProvinceEnum.Alb, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];
    SeaProvinces = [ProvinceEnum.NAO, ProvinceEnum.NWG, ProvinceEnum.BAR, ProvinceEnum.IRI, ProvinceEnum.NTH, ProvinceEnum.SKA, ProvinceEnum.BOT, ProvinceEnum.HEL, ProvinceEnum.BAL, ProvinceEnum.ENG, ProvinceEnum.MAO, ProvinceEnum.LYO, ProvinceEnum.WES, ProvinceEnum.TYS, ProvinceEnum.ADR, ProvinceEnum.ION, ProvinceEnum.BLA, ProvinceEnum.AEG, ProvinceEnum.EAS];
    CoastalProvinces = [ProvinceEnum.Tri, ProvinceEnum.Cly, ProvinceEnum.Edi, ProvinceEnum.Lvp, ProvinceEnum.Wal, ProvinceEnum.Yor, ProvinceEnum.Lon, ProvinceEnum.Gas, ProvinceEnum.Bre, ProvinceEnum.Pic, ProvinceEnum.Mar, ProvinceEnum.Kie, ProvinceEnum.Ber, ProvinceEnum.Pru, ProvinceEnum.Pie, ProvinceEnum.Ven, ProvinceEnum.Tus, ProvinceEnum.Rom, ProvinceEnum.Apu, ProvinceEnum.Nap, ProvinceEnum.Stp, ProvinceEnum.Lvn, ProvinceEnum.Sev, ProvinceEnum.Con, ProvinceEnum.Ank, ProvinceEnum.Arm, ProvinceEnum.Smy, ProvinceEnum.Syr, ProvinceEnum.Nwy, ProvinceEnum.Swe, ProvinceEnum.Fin, ProvinceEnum.Den, ProvinceEnum.Bel, ProvinceEnum.Hol, ProvinceEnum.Por, ProvinceEnum.Spa, ProvinceEnum.Naf, ProvinceEnum.Tun, ProvinceEnum.Alb, ProvinceEnum.Rum, ProvinceEnum.Bul, ProvinceEnum.Gre];
    DualCoastProvinces = [ProvinceEnum.Spa, ProvinceEnum.Stp, ProvinceEnum.Bul];

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

    constructor(json = null) {
        if (json) this.#LoadFromJSON(json);
    }

    #LoadFromJSON(json) {
        Object.keys(this).forEach(x => { if (x in json) this[x] = json[x]; });
        if (this.ResultSummary) this.ResultSummary = this.MapByCountries(this.ResultSummary, x => new gmResultLine(x));
        if (this.GamePhases) this.GamePhases = this.GamePhases.map(x => gmGamePhase.FromJSON(x));
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
        /**@type{dbnGameScoreboard} */
        let sbPrevious = null;

        this.GamePhases.forEach(gp => {
            var sb = new dbnGameScoreboard(this.ScoringSystem);
            Object.values(CountryEnum).forEach(country => {
                var cc = gp.CenterCounts[country] ?? 0;
                var prev = sbPrevious?.ResultLines[country];
                var yoe = cc == 0 ? prev?.Kernel.YearOfElimination ?? gp.PhaseYear : null;
                sb.RegisterCountry(country, cc, cc != 0, yoe);
            });
            sb.CalculateScores();
            gp.Scoreboard = sb;
            sbPrevious = sb;
        });
    }

    /**@type{gmAdjudicator} */
    Adjudicator;

}

//#endregion

//#region GamePhase

class gmGamePhase {

    //#region JSON, Duplicate

    Duplicate() { return gmGamePhase.FromJSON(this.ToJSON()); }

    static FromJSON(json) {
        let ret = new gmGamePhase();

        if (json) Object.keys(ret).forEach(x => { if (x in json) ret[x] = json[x]; });

        if (json.Units) {
            var newo = {};
            Object.keys(json.Units).forEach(x => newo[x] = ret.Units[x].map(y => gmUnitWithLocation.FromJSON(y)));
            ret.Units = newo;
        }
        if (json.Orders) {
            var newo = {};
            Object.keys(json.Orders).forEach(x => newo[x] = ret.Orders[x].map(y => gmOrderAndResolution.FromJSON(y)));
            ret.Orders = newo;
        }
        if (json.RetreatOrders) {
            var newo = {};
            Object.keys(json.RetreatOrders).forEach(x => newo[x] = ret.RetreatOrders[x].map(y => gmOrderAndResolution.FromJSON(y)));
            ret.RetreatOrders = newo;
        }
        return ret;
    }

    ToJSON() {
        let ret = {};
        ret.Phase = this.Phase;
        ret.Status = this.Status;
        ret.DrawVote = this.DrawVote?.ToJSON();
        if (this.CenterCounts) ret.CenterCounts = { ...this.CenterCounts };
        if (this.SupplyCenters) ret.SupplyCenters = { ...this.SupplyCenters };

        if (this.Units) {
            let nunits = {};
            Object.entries(this.Units).forEach(x => nunits[x[0]] = x[1].map(y => y.ToJSON()));
            ret.Units = nunits;
        }

        if (this.Orders) {
            let norders = {};
            Object.entries(this.Orders).forEach(x => norders[x[0]] = x[1].map(y => y.ToJSON()));
            ret.Orders = norders;
        }

        if (this.DislodgedUnits) ret.DislodgedUnits = { ...this.DislodgedUnits };

        if (this.RetreatOrders) {
            let nretreats = {};
            Object.entries(this.RetreatOrders).forEach(x => nretreats[x[0]] = x[1].map(y => y.ToJSON()));
            ret.RetreatOrders = nretreats;
        }

        return ret;
    }

    //#endregion

    /**@type{number} */
    Phase;
    get PhaseYear() { return Math.floor(this.Phase / 10); }
    get PhaseSeason() { return this.Phase % 10; }

    get PhaseTextLong() {
        var year = this.PhaseYear;
        var season = this.PhaseSeason;
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
        var year = this.PhaseYear;
        var season = this.PhaseSeason;
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

    //---------- Methods

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

    GetUnitWithLocationForCountry(province, country) {
        if (country in this.Units) {
            const units = this.Units[country];
            for (const uwl of units) {
                if (uwl.Location.Province == province) return uwl;
            }
        }
        return null;
    }

    GetCountryWithUnitInProvince(province) {
        for (const country in this.Units) {
            const units = this.Units[country];
            for (const uwl of units) {
                if (uwl.Location.Province == province) return country;
            }
        }
        return null;
    }

    GetSupplyCenterOwner(province) {
        for (const country in this.SupplyCenters) {
            const centers = this.SupplyCenters[country];
            for (const sc of centers) {
                if (sc == province) return country;
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

    /**
     * 
     * @param {string} country 
     * @param {gmOrderAndResolution} oar 
     */
    RemoveOrderIfExists(country, oar) {
        if (country in this.Orders) {
            const search = oar.ToString();
            let searchi = -1;
            this.Orders[country].forEach((x, i) => {
                if (x.ToString() == search) searchi = i;
            });
            if (searchi != -1) this.Orders[country].splice(searchi, 1);
        }
    }

    /**
     * @callback OrderIteratorCallback
     * @param {string} country
     * @param {gmOrderAndResolution[]} oars
     */

    /**
     * 
     * @param {OrderIteratorCallback} ff 
     */
    IterateUnresolvedOrders(ff) {
        Object.entries(this.Orders).forEach(x => {
            let country = x[0], oars = x[1];
            ff(country, oars.filter(oar => !oar.Result));
        });
    }

    // ------------------  Not in published schema

    /**@type{dbnGameScoreboard} */
    Scoreboard;

    /**@type{string} */
    OrderAdjudicationReport;

    ConsoleLogOrderReport() {
        let s = "ADJUDICATION REPORT\n";
        let unresolved = [];
        let succeeded = [];
        let failed = [];
        Object.entries(this.Orders).forEach(x => {
            let country = x[0], oars = x[1];
            oars.forEach(oar => {
                if (oar.Result) {
                    if (oar.Result.Succeeded) {
                        succeeded.push(oar.Province);
                    } else {
                        failed.push(oar.Province);
                        s += "FAIL (" + country.substring(0, 1) + ") " + oar.ToString() + " (" + oar.Result.Reason + ")\n";
                    }
                } else {
                    unresolved.push(oar.Province);
                }
            });
        });

        console.log(s);
        console.log("SUCCEEDED", succeeded);
        // console.log("FAILED", failed);
        console.log("UNRESOLVED", unresolved);
    }
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

    ToJSON() { throw "NIE"; }

    Duplicate() {
        throw "NIE";
    }
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
    ToString() { return this.Province + ((this.ProvinceCoast ?? ProvinceCoastEnum.None) != ProvinceCoastEnum.None ? " " + this.ProvinceCoast : ""); }

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
    ToJSON() {
        let ret = [this.Province, this.Order?.ToJSON()];
        if (this.Result) ret.push(this.Result.ToJSON());
        return ret;
    }

    // ToString() { return this.Province + " " + (this.Order ? this.Order.ToString() : "(no order)"); }
    ToString() { return this.Province + " " + (this.Order?.ToString() ?? "(no order)"); }

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

    ToMoveOrder() {
        /**@type{gmOrderMove} */
        let ret = this;
        return ret;
    }

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
    ToString() { return "- " + (this.ToLocation?.ToString() ?? "?"); }

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
    ToString() { return "S " + (this.HoldLocation?.ToString() ?? "?") + " H"; }

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
    ToString() { return "S " + (this.FromLocation?.ToString() ?? "?") + "-" + (this.ToLocation?.ToString() ?? "?"); }

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
    ToString() { return "C " + (this.FromLocation?.ToString() ?? "?") + "-" + (this.ToLocation?.ToString() ?? "?"); }

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

//#region DATC

/**
 * This callback is displayed as part of the Requester class.
 * @callback gmAdjudicationTestCaseCallback
 * @returns {boolean}
 */

class gmAdjudicationTestCase {
    constructor(label) {
        this.Label = label;

        this.Game.GamePhases = [this.GamePhase];

        this.GamePhase.SupplyCenters = {};
        this.GamePhase.Units = {};
        this.GamePhase.Orders = {};

        Object.values(CountryEnum).forEach(x => {
            this.GamePhase.Units[x] = [];
            this.GamePhase.Orders[x] = [];
        });
    }

    Label = "";

    Game = new gmGame();
    GamePhase = new gmGamePhase();

    get Adjudicator() { return this.Game.Adjudicator; }
    set Adjudicator(value) { this.Game.Adjudicator = value; }

    /**@type{Object.<string,gmAdjudicationTestCaseCallback>} */
    Tests = {};

    Adjudicate() {
        this.GamePhase = this.Game.Adjudicator.AdjudicateOrders(this.GamePhase);
    }

    VerifyResults() {
        let bResult = true;

        this.GamePhase.IterateUnresolvedOrders((country, oars) => {
            if (oars?.length > 0) bResult = false;
            //bResult = false;
        });

        if (!bResult) {
            console.log("There are unresolved orders");
        } else {
            Object.entries(this.Tests).forEach(x => {
                let label = x[0], test = x[1];
                if (!test()) {
                    bResult = false;
                    console.log("FAILED " + label);
                }
            });
        }

        if (bResult) console.log("PASSED " + this.Label);
        return bResult;
    }

}

class gmAdjudicationTestCase6A extends gmAdjudicationTestCase {
    constructor() {
        super("6.A - Basic Checks");

        //6.A.1 -- attempt move to non-neighbor
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.NTH)));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.NTH, new gmOrderMove(new gmLocation(ProvinceEnum.Pic)), null));
        this.Tests["6.A.1"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.NTH)[CountryEnum.England][0].Result.Succeeded == false; };

        //6.A.2 -- move army to sea
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Lvp)));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Lvp, new gmOrderMove(new gmLocation(ProvinceEnum.IRI)), null));
        this.Tests["6.A.2"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Lvp)[CountryEnum.England][0].Result.Succeeded == false; };

        //6.A.3 -- move fleet to land
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Kie)));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.Kie, new gmOrderMove(new gmLocation(ProvinceEnum.Mun)), null));
        this.Tests["6.A.3"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Kie)[CountryEnum.Germany][0].Result.Succeeded == false; };

        //6.A.4 -- move to self
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Ber)));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.Ber, new gmOrderMove(new gmLocation(ProvinceEnum.Ber)), null));
        this.Tests["6.A.4"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Ber)[CountryEnum.Germany][0].Result.Succeeded == false; };

        //6.A.5 -- move to self with convoy
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.NWG)));
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Nwy)));
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Stp)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Swe)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Fin)));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.NWG, new gmOrderConvoy(new gmLocation(ProvinceEnum.Nwy), new gmLocation(ProvinceEnum.Nwy)), null));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Nwy, new gmOrderMove(new gmLocation(ProvinceEnum.Nwy)), null));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Stp, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Nwy), new gmLocation(ProvinceEnum.Nwy)), null));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.Swe, new gmOrderMove(new gmLocation(ProvinceEnum.Nwy)), null));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.Fin, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Swe), new gmLocation(ProvinceEnum.Nwy)), null));
        this.Tests["6.A.5"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Swe)[CountryEnum.Germany][0].Result.Succeeded == true; };

        //6.A.6 -- ordering a unit of another country
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Fin, new gmOrderMove(new gmLocation(ProvinceEnum.BOT)), null));
        this.Tests["6.A.6"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Fin)[CountryEnum.England][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Fin)[CountryEnum.Germany][0].Result.Succeeded == true;
        };

        //6.A.7 -- fleets cannot be convoyed
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.MAO)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Bre)));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Bre, new gmOrderMove(new gmLocation(ProvinceEnum.Por)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.MAO, new gmOrderConvoy(new gmLocation(ProvinceEnum.Bre), new gmLocation(ProvinceEnum.Por)), null));
        this.Tests["6.A.7"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Bre)[CountryEnum.France][0].Result.Succeeded == false; };

        //6.A.8 -- self-support not allowed
        this.GamePhase.Units[CountryEnum.Italy].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Tyr)));
        this.GamePhase.Units[CountryEnum.Italy].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Ven)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Tri)));
        this.GamePhase.Orders[CountryEnum.Italy].push(new gmOrderAndResolution(ProvinceEnum.Ven, new gmOrderMove(new gmLocation(ProvinceEnum.Tri)), null));
        this.GamePhase.Orders[CountryEnum.Italy].push(new gmOrderAndResolution(ProvinceEnum.Tyr, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Ven), new gmLocation(ProvinceEnum.Tri)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Tri, new gmOrderSupportHold(new gmLocation(ProvinceEnum.Tri)), null));
        this.Tests["6.A.8"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Ven)[CountryEnum.Italy][0].Result.Succeeded == true; };

        //6.A.9 -- fleet must follow coast
        this.GamePhase.Units[CountryEnum.Italy].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Rom)));
        this.GamePhase.Orders[CountryEnum.Italy].push(new gmOrderAndResolution(ProvinceEnum.Rom, new gmOrderMove(new gmLocation(ProvinceEnum.Apu)), null));
        this.Tests["6.A.9"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Rom)[CountryEnum.Italy][0].Result.Succeeded == false; };

        //6.A.10 -- fleet cannot support to an adjacent province it can't reach
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Smy)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Con)));
        this.GamePhase.Units[CountryEnum.Russia].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Ank)));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Con, new gmOrderMove(new gmLocation(ProvinceEnum.Ank)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Smy, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Con), new gmLocation(ProvinceEnum.Ank)), null));
        this.Tests["6.A.10"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Con)[CountryEnum.Turkey][0].Result.Succeeded == false; };

        //6.A.11 -- simple bounce
        this.GamePhase.Units[CountryEnum.Russia].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.War)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Sev)));
        this.GamePhase.Orders[CountryEnum.Russia].push(new gmOrderAndResolution(ProvinceEnum.War, new gmOrderMove(new gmLocation(ProvinceEnum.Ukr)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Sev, new gmOrderMove(new gmLocation(ProvinceEnum.Ukr)), null));
        this.Tests["6.A.11"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.War)[CountryEnum.Russia][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Sev)[CountryEnum.Turkey][0].Result.Succeeded == false;
        };

        //6.A.12 -- triple bounce
        this.GamePhase.Units[CountryEnum.Russia].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Rum)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Gre)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Ser)));
        this.GamePhase.Orders[CountryEnum.Russia].push(new gmOrderAndResolution(ProvinceEnum.Rum, new gmOrderMove(new gmLocation(ProvinceEnum.Bul)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Gre, new gmOrderMove(new gmLocation(ProvinceEnum.Bul)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Ser, new gmOrderMove(new gmLocation(ProvinceEnum.Bul)), null));
        this.Tests["6.A.11"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Rum)[CountryEnum.Russia][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Gre)[CountryEnum.Turkey][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Ser)[CountryEnum.Austria][0].Result.Succeeded == false;
        };

    }

}

class gmAdjudicationTestCase6B1 extends gmAdjudicationTestCase {
    constructor() {
        super("6.B - Coastal issues part 1");

        //6.B.1 -- unspecified coast when two are available
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Por)));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Por, new gmOrderMove(new gmLocation(ProvinceEnum.Spa)), null));
        this.Tests["6.B.1"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Por)[CountryEnum.France][0].Result.Succeeded == false; };

        //6.B.2 -- unspecified coast when only one is available
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Nwy)));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Nwy, new gmOrderMove(new gmLocation(ProvinceEnum.Stp)), null));
        this.Tests["6.B.2"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Nwy)[CountryEnum.England][0].Result.Succeeded == true; };

        //6.B.3 -- wrongly specified coast when only one is available
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Mar)));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Mar, new gmOrderMove(new gmLocation(ProvinceEnum.Spa, ProvinceCoastEnum.nc)), null));
        this.Tests["6.B.3"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Mar)[CountryEnum.France][0].Result.Succeeded == false; };

        //6.B.4 -- support to unreachable coast allowed
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Rum)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Gre)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.AEG)));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Rum, new gmOrderMove(new gmLocation(ProvinceEnum.Bul)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Gre, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Rum), new gmLocation(ProvinceEnum.Bul)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.AEG, new gmOrderMove(new gmLocation(ProvinceEnum.Bul)), null));
        this.Tests["6.B.4"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Rum)[CountryEnum.Austria][0].Result.Succeeded == true; };
    }
}

class gmAdjudicationTestCase6B2 extends gmAdjudicationTestCase {
    constructor() {
        super("6.B - Coastal issues part 2");

        //6.B.5 -- support from unreachable coast not allowed
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Mar)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Spa, ProvinceCoastEnum.nc)));
        this.GamePhase.Units[CountryEnum.Italy].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.LYO)));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Mar, new gmOrderMove(new gmLocation(ProvinceEnum.LYO)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Spa, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Mar), new gmLocation(ProvinceEnum.LYO)), null));
        this.Tests["6.B.5"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Mar)[CountryEnum.France][0].Result.Succeeded == false; };

        //6.B.6 -- support can be cut from other coast
        this.GamePhase.Units[CountryEnum.Russia].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.BAR)));
        this.GamePhase.Units[CountryEnum.Russia].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Stp, ProvinceCoastEnum.nc)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.BOT)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Nwy)));
        this.GamePhase.Orders[CountryEnum.Russia].push(new gmOrderAndResolution(ProvinceEnum.BAR, new gmOrderMove(new gmLocation(ProvinceEnum.Nwy)), null));
        this.GamePhase.Orders[CountryEnum.Russia].push(new gmOrderAndResolution(ProvinceEnum.Stp, new gmOrderSupportMove(new gmLocation(ProvinceEnum.BAR), new gmLocation(ProvinceEnum.Nwy)), null));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.BOT, new gmOrderMove(new gmLocation(ProvinceEnum.Stp)), null));
        this.Tests["6.B.6"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.BAR)[CountryEnum.Russia][0].Result.Succeeded == false; };

        //6.B.7 -- support with unspecified coast
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Con)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Ser)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Gre)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Rum)));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Con, new gmOrderMove(new gmLocation(ProvinceEnum.Bul, ProvinceCoastEnum.ec)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Ser, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Con), new gmLocation(ProvinceEnum.Bul)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Gre, new gmOrderMove(new gmLocation(ProvinceEnum.Bul, ProvinceCoastEnum.sc)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Rum, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Gre), new gmLocation(ProvinceEnum.Bul)), null));
        this.Tests["6.B.7"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Con)[CountryEnum.Turkey][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Gre)[CountryEnum.Austria][0].Result.Succeeded == false;
        };
    }
}

class gmAdjudicationTestCase6B3 extends gmAdjudicationTestCase {
    constructor() {
        super("6.B - Coastal issues part 3");

        //6.B.8 -- support destination coast doesn't match move coast
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Con)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Ser)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Gre)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Rum)));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Con, new gmOrderMove(new gmLocation(ProvinceEnum.Bul, ProvinceCoastEnum.ec)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Ser, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Con), new gmLocation(ProvinceEnum.Bul, ProvinceCoastEnum.sc)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Gre, new gmOrderMove(new gmLocation(ProvinceEnum.Bul, ProvinceCoastEnum.sc)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Rum, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Gre), new gmLocation(ProvinceEnum.Bul)), null));
        this.Tests["6.B.8"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Con)[CountryEnum.Turkey][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Gre)[CountryEnum.Austria][0].Result.Succeeded == false;
        };

        //6.B.13 -- coastal crawl not allowed
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Por)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Spa, ProvinceCoastEnum.nc)));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Por, new gmOrderMove(new gmLocation(ProvinceEnum.Spa, ProvinceCoastEnum.sc)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Spa, new gmOrderMove(new gmLocation(ProvinceEnum.Por)), null));
        this.Tests["6.B.13"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Spa)[CountryEnum.France][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Por)[CountryEnum.France][0].Result.Succeeded == false;
        };

    }
}

class gmAdjudicationTestCase6C1 extends gmAdjudicationTestCase {
    constructor() {
        super("6.C - Circular movement");

        //6.C.1 -- three army circular movement
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Ank)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Con)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Smy)));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Ank, new gmOrderMove(new gmLocation(ProvinceEnum.Con)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Con, new gmOrderMove(new gmLocation(ProvinceEnum.Smy)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.Smy, new gmOrderMove(new gmLocation(ProvinceEnum.Ank)), null));
        this.Tests["6.C.1"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Con)[CountryEnum.Turkey][0].Result.Succeeded == true
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Ank)[CountryEnum.Turkey][0].Result.Succeeded == true
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Smy)[CountryEnum.Turkey][0].Result.Succeeded == true;
        };

        //6.C.2 -- three army circular movement when one gets support
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Ser)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Bul)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Rum)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Bud)));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Ser, new gmOrderMove(new gmLocation(ProvinceEnum.Bul)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Bul, new gmOrderMove(new gmLocation(ProvinceEnum.Rum)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Rum, new gmOrderMove(new gmLocation(ProvinceEnum.Ser)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Bud, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Rum), new gmLocation(ProvinceEnum.Ser)), null));
        this.Tests["6.C.2"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Ser)[CountryEnum.Austria][0].Result.Succeeded == true
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Bul)[CountryEnum.Austria][0].Result.Succeeded == true
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Rum)[CountryEnum.Austria][0].Result.Succeeded == true;
        };

        //6.C.3 -- disrupted three army circular movement
        this.GamePhase.Units[CountryEnum.Italy].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Ven)));
        this.GamePhase.Units[CountryEnum.Italy].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Tus)));
        this.GamePhase.Units[CountryEnum.Italy].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Rom)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Pie)));
        this.GamePhase.Orders[CountryEnum.Italy].push(new gmOrderAndResolution(ProvinceEnum.Ven, new gmOrderMove(new gmLocation(ProvinceEnum.Tus)), null));
        this.GamePhase.Orders[CountryEnum.Italy].push(new gmOrderAndResolution(ProvinceEnum.Tus, new gmOrderMove(new gmLocation(ProvinceEnum.Rom)), null));
        this.GamePhase.Orders[CountryEnum.Italy].push(new gmOrderAndResolution(ProvinceEnum.Rom, new gmOrderMove(new gmLocation(ProvinceEnum.Ven)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Pie, new gmOrderMove(new gmLocation(ProvinceEnum.Ven)), null));
        this.Tests["6.C.3"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Ven)[CountryEnum.Italy][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Tus)[CountryEnum.Italy][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Rom)[CountryEnum.Italy][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Pie)[CountryEnum.France][0].Result.Succeeded == false;
        };

        //6.C.4 -- circular movement with convoy
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Por)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Spa)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Mar)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.LYO)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.WES)));
        this.GamePhase.Units[CountryEnum.France].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.MAO)));
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.NAO)));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Por, new gmOrderMove(new gmLocation(ProvinceEnum.Spa)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Spa, new gmOrderMove(new gmLocation(ProvinceEnum.Mar)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.Mar, new gmOrderMove(new gmLocation(ProvinceEnum.Por)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.LYO, new gmOrderConvoy(new gmLocation(ProvinceEnum.Mar), new gmLocation(ProvinceEnum.Por)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.WES, new gmOrderConvoy(new gmLocation(ProvinceEnum.Mar), new gmLocation(ProvinceEnum.Por)), null));
        this.GamePhase.Orders[CountryEnum.France].push(new gmOrderAndResolution(ProvinceEnum.MAO, new gmOrderConvoy(new gmLocation(ProvinceEnum.Mar), new gmLocation(ProvinceEnum.Por)), null));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.NAO, new gmOrderMove(new gmLocation(ProvinceEnum.MAO)), null));
        this.Tests["6.C.4"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Por)[CountryEnum.France][0].Result.Succeeded == true
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Spa)[CountryEnum.France][0].Result.Succeeded == true
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Mar)[CountryEnum.France][0].Result.Succeeded == true
        };

        //6.C.5 -- circular movement with disrupted convoy
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Edi)));
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Yor)));
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Lon)));
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.NTH)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Den)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.HEL)));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Edi, new gmOrderMove(new gmLocation(ProvinceEnum.Yor)), null));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Yor, new gmOrderMove(new gmLocation(ProvinceEnum.Lon)), null));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Lon, new gmOrderMove(new gmLocation(ProvinceEnum.Edi)), null));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.NTH, new gmOrderConvoy(new gmLocation(ProvinceEnum.Lon), new gmLocation(ProvinceEnum.Edi)), null));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.Den, new gmOrderMove(new gmLocation(ProvinceEnum.NTH)), null));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.HEL, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Den), new gmLocation(ProvinceEnum.NTH)), null));
        this.Tests["6.C.5"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Edi)[CountryEnum.England][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Yor)[CountryEnum.England][0].Result.Succeeded == false
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Lon)[CountryEnum.England][0].Result.Succeeded == false
        };

        //6.C.6 -- two armies, two convoys
        this.GamePhase.Units[CountryEnum.Russia].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Lvn)));
        this.GamePhase.Units[CountryEnum.Russia].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.BOT)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Army, new gmLocation(ProvinceEnum.Swe)));
        this.GamePhase.Units[CountryEnum.Germany].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.BAL)));
        this.GamePhase.Orders[CountryEnum.Russia].push(new gmOrderAndResolution(ProvinceEnum.Lvn, new gmOrderMove(new gmLocation(ProvinceEnum.Swe)), null));
        this.GamePhase.Orders[CountryEnum.Russia].push(new gmOrderAndResolution(ProvinceEnum.BOT, new gmOrderConvoy(new gmLocation(ProvinceEnum.Lvn), new gmLocation(ProvinceEnum.Swe)), null));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.Swe, new gmOrderMove(new gmLocation(ProvinceEnum.Lvn)), null));
        this.GamePhase.Orders[CountryEnum.Germany].push(new gmOrderAndResolution(ProvinceEnum.BAL, new gmOrderConvoy(new gmLocation(ProvinceEnum.Swe), new gmLocation(ProvinceEnum.Lvn)), null));
        this.Tests["6.C.5"] = () => {
            return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Lvn)[CountryEnum.Russia][0].Result.Succeeded == true
                && this.GamePhase.GetOrdersForProvince(ProvinceEnum.Swe)[CountryEnum.Germany][0].Result.Succeeded == true
        };

    }
}

class gmAdjudicationTestCaseCoastsRequired extends gmAdjudicationTestCase {
    constructor() {
        super("Coasts Required");

        //6.B.2 -- unspecified coast when only one is available
        this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Nwy)));
        this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Nwy, new gmOrderMove(new gmLocation(ProvinceEnum.Stp)), null));
        this.Tests["6.B.2"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Nwy)[CountryEnum.England][0].Result.Succeeded == false; };

        //6.B.7 -- support move order requires coast
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Rum)));
        this.GamePhase.Units[CountryEnum.Austria].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Gre)));
        this.GamePhase.Units[CountryEnum.Turkey].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.AEG)));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Rum, new gmOrderMove(new gmLocation(ProvinceEnum.Bul, ProvinceCoastEnum.ec)), null));
        this.GamePhase.Orders[CountryEnum.Austria].push(new gmOrderAndResolution(ProvinceEnum.Gre, new gmOrderSupportMove(new gmLocation(ProvinceEnum.Rum), new gmLocation(ProvinceEnum.Bul)), null));
        this.GamePhase.Orders[CountryEnum.Turkey].push(new gmOrderAndResolution(ProvinceEnum.AEG, new gmOrderMove(new gmLocation(ProvinceEnum.Bul, ProvinceCoastEnum.sc)), null));
        this.Tests["6.B.7"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Rum)[CountryEnum.Austria][0].Result.Succeeded == false; };

    }

}

class gmAdjudicationTestCaseAdjustments extends gmAdjudicationTestCase {
    constructor() {
        super("Adjustments");

        //6.B.14 -- building with unspecified coast
        // this.GamePhase.Units[CountryEnum.England].push(new gmUnitWithLocation(UnitTypeEnum.Fleet, new gmLocation(ProvinceEnum.Nwy)));
        // this.GamePhase.Orders[CountryEnum.England].push(new gmOrderAndResolution(ProvinceEnum.Nwy, new gmOrderMove(new gmLocation(ProvinceEnum.Stp)), null));
        // this.Tests["6.B.2"] = () => { return this.GamePhase.GetOrdersForProvince(ProvinceEnum.Nwy)[CountryEnum.England][0].Result.Succeeded == false; };

    }
}

//#endregion

//#region Adjudicator

class gmAdjudicationResolver {
    constructor(province) { this.Province = province; }

    Resolved = false;

    /**@type{string} */
    Province;

    /**@type{gmAdjudicationOrderTrackerStub[]} */
    MovingUnitStubs = [];
    /**@type{gmAdjudicationOrderTrackerStub} */
    ExistingUnitStub;

    /**@type{gmAdjudicationResolver[]} */
    Antecedents = [];
    /**@type{gmAdjudicationResolver[]} */
    Subsequents = [];

    /**
     * 
     * @param {gmAdjudicationResolver} antecedent 
     */
    RemoveAntecedent(antecedent) {
        this.Antecedents.splice(this.Antecedents.indexOf(antecedent), 1);
        //antecedent.Subsequents.splice(antecedent.Subsequents.indexOf(this), 1);
        // x.Antecedents.filter(y => y != resolver);
    }

    /**
     * 
     * @param {string[]} chain
     * @returns {string[]|null}
     */
    FindCycle(chain = []) {
        if (this.Antecedents.length == 0) return null;

        let bInChainAlready = chain.includes(this.Province);
        let ret = chain.slice();
        ret.push(this.Province);

        if (bInChainAlready) return ret;

        for (const ant of this.Antecedents) {
            let test = ant.FindCycle(ret);
            if (test) return test;
        }

        return null;
    }

    /**
     * 
     * @param {dbnMapData} mapdata 
     */
    TryResolve(mapdata) {
        //Verify moves can reach
        this.MovingUnitStubs.forEach(stub => stub.VerifyMoveCanReach(mapdata));

        let validMovers = this.MovingUnitStubs.filter(x => !x.OAR.Result);

        //Cut supports
        if (this.ExistingUnitStub && !this.ExistingUnitStub.OAR.Result) {
            let oar = this.ExistingUnitStub.OAR;
            if ((oar.Order instanceof gmOrderSupportHold || oar.Order instanceof gmOrderSupportMove))
                if (validMovers.some(x => x.Country != this.ExistingUnitStub.Country)) {
                    //Support is cut
                    oar.Result = new gmOrderResult(false, "Support is cut");
                } else {
                    //Support succeeds
                    oar.Result = new gmOrderResult(true);
                }
        }

        //Resolve moves
        let moverMax = 0;
        /**@type{[[gmAdjudicationOrderTrackerStub,number]]} */
        let moversAndPowers = validMovers.map(x => {
            let power = x.Power;
            moverMax = Math.max(moverMax, power);
            return [x, power];
        });
        let topMovers = moversAndPowers.filter(x => x[1] == moverMax).map(x => x[0]);

        let existingPower = 0;
        if (moversAndPowers.length > 0 && this.ExistingUnitStub) {
            if (this.ExistingUnitStub.OAR.Order instanceof gmOrderMove) {
                if (!this.ExistingUnitStub.OAR.Result && moverMax <= 1 && topMovers.length <= 1) {
                    //console.log("Can't resolve " + this.Province + " yet ");
                    return; //Can't resolve conflict until existing unit is known to stay or not
                }
                if (this.ExistingUnitStub.OAR.Result && !this.ExistingUnitStub.OAR.Result.Succeeded) existingPower++;
            } else {
                existingPower = this.ExistingUnitStub.Power;
            }
        }

        // if (this.Province == ProvinceEnum.Ukr) console.log(this.Province, this, moversAndPowers, topMovers, moverMax);

        let bAMoveSucceeded = false;

        moversAndPowers.forEach(x => {
            let stub = x[0], power = x[1];
            if (power < moverMax) {
                stub.OAR.Result = new gmOrderResult(false, "Overpowered by another mover");
            } else if (power == moverMax && topMovers.length > 1) {
                stub.OAR.Result = new gmOrderResult(false, "Stand off with another mover");
            } else if (power <= existingPower) {
                stub.OAR.Result = new gmOrderResult(false, "Power insufficient to dislodge existing unit");
            } else {
                //succeeds
                stub.OAR.Result = new gmOrderResult(true);
                bAMoveSucceeded = true;
            }

        });

        if (this.ExistingUnitStub && !(this.ExistingUnitStub.OAR.Order instanceof gmOrderMove) && !this.ExistingUnitStub.OAR.Result) {
            if (bAMoveSucceeded) {
                //Dislodged
                this.ExistingUnitStub.OAR.Result = new gmOrderResult(false, "Dislodged");
            } else {
                this.ExistingUnitStub.OAR.Result = new gmOrderResult(true);
            }
        }

        //this is resolved.  Remove dependencies and resolve forward.
        this.Resolved = true;
        this.Subsequents.forEach(x => {
            x.RemoveAntecedent(this);
            if (x.Antecedents.length == 0 && !x.Resolved) x.TryResolve(mapdata);
        });

    }

}

class gmAdjudicationOrderTrackerStub {

    /**@type{string} */
    Country;
    /**@type{gmOrderAndResolution} */
    OAR;
    /**@type{gmUnitWithLocation} */
    UWL;

    /**@type{gmOrderAndResolution[]} */
    Supports = [];

    /**@type{gmOrderAndResolution[]} */
    Convoys = [];

    get Power() {
        return 1 + this.Supports.filter(x => x.Result.Succeeded).length
    }

    /**
     * 
     * @param {dbnMapData} mapdata 
     * @param {gmLocation|gmUnitWithLocation} toLocationOrUWL
     * @returns 
     */
    #VerifyUnitCanMoveToLocation(mapdata, toLocationOrUWL) {
        let toUWL = toLocationOrUWL instanceof gmUnitWithLocation ? toLocationOrUWL.Key : toLocationOrUWL.ToUnitWithLocation(this.UWL.UnitType);
        let neighbors = mapdata.AllNeighborsByKey[this.UWL.Key].map(x => x.Key);
        return neighbors.includes(toUWL.Key);
    }

    /**
     * 
     * @param {dbnMapData} mapdata 
     */
    VerifyMoveCanReach(mapdata) {
        /**@type{gmOrderMove} */
        let move = this.OAR.Order;

        if (!this.#VerifyUnitCanMoveToLocation(mapdata, move.ToLocation)) {
            if (this.UWL.UnitType == UnitTypeEnum.Fleet) {
                this.OAR.Result = new gmOrderResult(false, "No route");
            } else {
                //Check for convoy path
                let bConvoyPathFound = false;

                let toProvince = move.ToLocation.Province;

                let nextSeaProvinces = mapdata.AllSeaNeighbors[this.OAR.Province];
                let convoysRemaining = this.Convoys.filter(x => x.Result?.Succeeded).map(x => x.Province);
                let bFinished = !nextSeaProvinces || nextSeaProvinces.length == 0 || convoysRemaining.length == 0;

                /**@type{string[]} */
                let previousSeaProvinces = [];
                let count = 0;
                while (!bFinished) {
                    count++;
                    if (count > 10) {
                        bFinished = true;
                        console.log("GRR " + this.OAR.Province, convoysRemaining, previousSeaProvinces, nextSeaProvinces);
                    }

                    nextSeaProvinces = nextSeaProvinces.filter(x => convoysRemaining.includes(x));
                    convoysRemaining = convoysRemaining.filter(x => !nextSeaProvinces.includes(x));

                    nextSeaProvinces.forEach(province => {
                        if (!bFinished) {
                            let neighbors = mapdata.AllLandNeighbors[province];
                            if (neighbors.includes(toProvince)) {
                                //Convoy path exists
                                bConvoyPathFound = true;
                                bFinished = true;
                            }
                        }
                    });

                    if (!bFinished) {
                        if (convoysRemaining.length == 0) {
                            bFinished = true;
                        } else {
                            /**@type{string[]} */
                            let newNext = [];
                            previousSeaProvinces.push(...nextSeaProvinces);
                            nextSeaProvinces.forEach(p => {
                                newNext.push(...mapdata.AllSeaNeighbors[p].filter(x => !previousSeaProvinces.includes(x) && !newNext.includes(x)));
                            });
                            nextSeaProvinces = newNext;
                            if (nextSeaProvinces.length == 0) bFinished = true;
                        }
                    }
                }
                if (!bConvoyPathFound) this.OAR.Result = new gmOrderResult(false, "No route");

            }
        }
    }
}

class gmAdjudicationOrderTracker {

    /**@type{dbnMapData} */
    MapData;

    RequireCoastDesignationForSupportMoveOrders = false;

    /**@type{Object.<string,gmAdjudicationOrderTrackerStub>} */
    Stubs = {};

    /**@type{Object.<string,gmAdjudicationResolver>} */
    Resolvers = {};

    /**
     * 
     * @param {string} province 
     */
    #GetResolver(province) {
        if (!(province in this.Resolvers)) this.Resolvers[province] = new gmAdjudicationResolver(province);
        return this.Resolvers[province];
    }

    /**
     * @param {string} country
     * @param {gmOrderAndResolution} oar 
     * @param {gmUnitWithLocation} uwl 
     */
    RegisterOrder(country, oar, uwl) {
        let stub = new gmAdjudicationOrderTrackerStub();
        stub.Country = country;
        stub.OAR = oar;
        stub.UWL = uwl;
        this.Stubs[oar.Province] = stub;

        // if (!(oar.Province in this.Stubs)) this.Stubs[oar.Province] = new gmAdjudicationOrderTrackerStub();
        // if (oar.Order instanceof gmOrderMove) {
        //     stub.ReferencedProvinces.push(oar.Order.ToLocation.Province);
        // }
    }

    /**
     * 
     * @param {string} antecedentProvince
     * @param {string} subsequentProvince
     */
    #RegisterResolverDependency(antecedentProvince, subsequentProvince) {
        let ant = this.#GetResolver(antecedentProvince);
        let subs = this.#GetResolver(subsequentProvince);
        ant.Subsequents.push(subs);
        subs.Antecedents.push(ant);
    }

    /**
     * 
     * @param {gmUnitWithLocation} sourceUWL 
     * @param {string} destProvince 
     * @returns 
     */
    #VerifySupportingUnitCanReachSupportDestination(sourceUWL, destProvince) {
        let pd = this.MapData.ProvinceData[sourceUWL.Location.Province];
        let neighbors = pd.Neighbors[sourceUWL.Key].map(x => x.Location.Province);
        return neighbors.includes(destProvince);
    }

    Adjudicate() {
        this.#CheckForCoordinationFailuresAndRegisterDependencies();

        Object.values(this.Resolvers).filter(x => x.Antecedents.length == 0).forEach(x => x.TryResolve(this.MapData));

        let remaining = Object.values(this.Resolvers).filter(x => !x.Resolved);
        let count = 0;
        do {
            count++;
            if (count > 10) return;

            if (remaining.length > 0) {
                //console.log("Hunting cycles ", count);
                let cycle = remaining[0].FindCycle();
                if (cycle) {
                    cycle.splice(0, cycle.indexOf(cycle[cycle.length - 1]) + 1);
                    this.#ResolveCycle(cycle);
                } else {
                    console.log("COUND NOT FIND CYCLE");
                }

            }
            remaining = Object.values(this.Resolvers).filter(x => !x.Resolved);
        } while (remaining.length > 0 && count <= 9);

        if (count >= 10) {
            console.log("COULD NOT COMPLETE ADJUDICATION");
            // alert("Could not complete adjudication");
        }

        //console.log("CYCLE:", this.#GetResolver(ProvinceEnum.Par).FindCycle());
        // while (remaining.length > 0) {
        //     let chain = [remaining[0]];
        //     let bCycleDetected = false;
        //     while (!bCycleDetected) {

        //     }

        // }

    }

    //#region Coordination Failures and dependency registration

    #CheckForCoordinationFailuresAndRegisterDependencies() {

        //Check basic convoy validity
        Object.values(this.Stubs).forEach(stub => {
            this.#GetResolver(stub.OAR.Province).ExistingUnitStub = stub;

            if (stub.OAR.Order instanceof gmOrderConvoy) {
                if (stub.UWL.UnitType == UnitTypeEnum.Army) {
                    stub.OAR.Result = new gmOrderResult(false, "Armies cannot convoy");
                } else if (this.MapData.ProvinceData[stub.OAR.Province].ProvinceType != ProvinceTypeEnum.Water) {
                    oar.Result = new gmOrderResult(false, "Fleets in coastal provinces cannot convoy");
                }
            }
        });

        Object.values(this.Stubs).filter(x => !x.OAR.Result).forEach(stub => {
            if (stub.OAR.Order instanceof gmOrderSupportMove || stub.OAR.Order instanceof gmOrderConvoy) {
                let fromProvince = "";
                /**@type{gmLocation} */
                let toLocation = null;
                if (stub.OAR.Order instanceof gmOrderSupportMove) { fromProvince = stub.OAR.Order.FromLocation.Province; toLocation = stub.OAR.Order.ToLocation; }
                if (stub.OAR.Order instanceof gmOrderConvoy) { fromProvince = stub.OAR.Order.FromLocation.Province; toLocation = stub.OAR.Order.ToLocation; }

                let stubFrom = this.Stubs[fromProvince];
                let orderFrom = stubFrom?.OAR.Order;

                if (!stubFrom || !(orderFrom instanceof gmOrderMove)
                    || (this.RequireCoastDesignationForSupportMoveOrders && orderFrom.ToLocation.Key != toLocation.Key)
                    || (!this.RequireCoastDesignationForSupportMoveOrders && orderFrom.ToLocation.Province != toLocation.Province)) {
                    stub.OAR.Result = new gmOrderResult(false, "No matching move order");
                } else if (stub.OAR.Order instanceof gmOrderSupportMove && !this.#VerifySupportingUnitCanReachSupportDestination(stub.UWL, toLocation.Province)) {
                    stub.OAR.Result = new gmOrderResult(false, "Not adjacent");
                } else {
                    //Order passes coordination tests
                    this.#RegisterResolverDependency(stub.OAR.Province, toLocation.Province)
                    if (stub.OAR.Order instanceof gmOrderSupportMove) {
                        stubFrom.Supports.push(stub.OAR);
                    } else {
                        stubFrom.Convoys.push(stub.OAR);
                    }
                }

            } else if (stub.OAR.Order instanceof gmOrderSupportHold) {
                let stubHold = this.Stubs[stub.OAR.Order.HoldLocation.Province];
                if (stubHold && stubHold.OAR.Order.Type != "m") {
                    if (this.#VerifySupportingUnitCanReachSupportDestination(stub.UWL, stubHold.OAR.Province)) {
                        //Order passes coordination tests
                        this.#RegisterResolverDependency(stub.OAR.Province, stub.OAR.Order.HoldLocation.Province);
                        stubHold.Supports.push(stub.OAR);
                    } else {
                        stub.OAR.Result = new gmOrderResult(false, "Not adjacent");
                    }
                } else {
                    console.log("No stationary unit: ", stub.OAR.Order.HoldLocation.Province, stubHold);
                    stub.OAR.Result = new gmOrderResult(false, "No stationary unit");
                }

            } else if (stub.OAR.Order instanceof gmOrderMove) {
                if (stub.OAR.Province == stub.OAR.Order.ToLocation.Province) {
                    //No self moves
                    stub.OAR.Result = new gmOrderResult(false, "Self-move not allowed");
                } else {
                    this.#GetResolver(stub.OAR.Order.ToLocation.Province).MovingUnitStubs.push(stub);
                    this.#RegisterResolverDependency(stub.OAR.Order.ToLocation.Province, stub.OAR.Province);
                }
            }
        });
    }

    //#endregion

    //#region Resolve

    /**
     * 
     * @param {string[]} cycle 
     */
    #ResolveCycle(cycle) {
        //console.log("Attempting to resolve cycle: ", cycle);

        let ress = cycle.map(x => this.#GetResolver(x));
        let stubs = ress.map(x => x.ExistingUnitStub);
        let oars = stubs.map(x => x.OAR);
        let orders = stubs.map(x => x.OAR.Order);

        if (cycle.length == 2) {
            //Should only be a head to head match
            if (orders[0] instanceof gmOrderMove && orders[1] instanceof gmOrderMove && orders[0].ToLocation.Province == oars[1].Province && orders[1].ToLocation.Province == oars[0].Province) {
                let powers = stubs.map(x => x.Power);
                for (let i = 0; i < 2; i++) {
                    if (!(powers[i] > powers[1 - i]) && !ress[i].Resolved) {
                        oars[i].Result = new gmOrderResult(false, "Insufficient attack strength in head-to-head");
                        ress[i].RemoveAntecedent(ress[1 - i]);
                        ress[i].TryResolve(this.MapData);
                    }
                }
            } else {
                console.log("NOT CONFIRMED");
            }
        } else {
            if (orders.every(x => x instanceof gmOrderMove)) {
                if (orders[0].ToMoveOrder().ToLocation.Province != oars[1].Province) {
                    ress.reverse();
                    stubs.reverse();
                    oars.reverse();
                    orders.reverse();
                }

                //see if any provinces can be resolved without cyclic movers
                ress.forEach((res, i) => {
                    if (!res.Resolved) {
                        //console.log("Trying to break cycle by resolving " + res.Province);
                        res.TryResolve(this.MapData);
                        // console.log(res.Province + " resolution: " + res.Resolved);
                    }
                });

                if (ress.some(x => !x.Resolved)) {
                    if (ress.some(x => x.Resolved)) throw "Should be all or nothing";

                    //check for cyclical movement with no obstacles
                    if (orders.every((x, i) => {
                        /**@type{gmOrderMove} */
                        let om = x;
                        let iNext = i < oars.length - 1 ? i + 1 : 0
                        return om.ToLocation.Province == oars[iNext].Province && ress[iNext].MovingUnitStubs.length == 1
                    })) {
                        oars.forEach(x => x.Result = new gmOrderResult(true));
                        ress.forEach(x => x.TryResolve(this.MapData));
                    }
                }

            }
        }

    }

    //#endregion

}

class gmAdjudicator {

    /**
     * 
     * @param {dbnMapData} mapdata 
     */
    constructor(mapdata) { this.MapData = mapdata; }

    /**@type{dbnMapData} */
    MapData;

    //NOTE: You should have unit tests for these settings
    RequireCoastDesignationForUnambiguousMoveOrders = false;
    RequireCoastDesignationForSupportMoveOrders = false;

    /**
     * 
     * @param {gmGamePhase} gamephase 
     */
    AdjudicateOrders(gamephase) {

        if (!this.MapData) throw "Adjudication requires a Map";

        let ret = gamephase.Duplicate();
        ret.OrderAdjudicationReport = "";

        if (ret.Orders) Object.values(ret.Orders).forEach(oars => oars.forEach(oar => oar.Result = null));
        if (ret.RetreatOrders) Object.values(ret.RetreatOrders).forEach(oars => oars.forEach(oar => oar.Result = null));

        if (!ret.Orders) return;

        this.#CheckForBasicValidity(ret);
        if (!this.RequireCoastDesignationForUnambiguousMoveOrders) this.#AddCoastsIfNeeded(ret);
        this.#AddHoldsForUnorderedUnits(ret);

        let tracker = new gmAdjudicationOrderTracker();
        tracker.MapData = this.MapData;
        tracker.RequireCoastDesignationForSupportMoveOrders = this.RequireCoastDesignationForSupportMoveOrders;

        ret.IterateUnresolvedOrders((country, oars) =>
            oars.forEach(oar => {
                tracker.RegisterOrder(country, oar, gamephase.GetUnitWithLocation(oar.Province));
            })
        );
        tracker.Adjudicate();
        ret.OrderAdjudicationReport += tracker.Report;

        //return new gamephase with DislodgedUnits, Units, and SupplyCenters filled in (need some indication for retreats)
        //OR: the gamephase has properties for AdjudicatedUnits and AdjudicatedSupplyCenters, and these get set by a separate method
        //  -- this method is only for setting the results of the OARs

        return ret;

    }

    /**
     * 
     * @param {gmGamePhase} gamephase 
     */
    #CheckForBasicValidity(gamephase) {

        //NOTE: Identical orders still get caught in the second filter.  Need to overhaul this algorithm to fix that.

        //search for exact duplicates
        gamephase.IterateUnresolvedOrders((country, oars) => {
            /**@type{Object.<string,gmOrderAndResolution[]>} */
            let ordersByKey = {};
            oars.forEach(oar => {
                let key = oar.ToString();
                if (!(key in ordersByKey)) ordersByKey[key] = [];
                ordersByKey[key].push(oar);
            });
            Object.entries(ordersByKey).filter(x => x[1].length > 1).forEach(x => {
                x[1].forEach((oar, i) => { if (i > 1) oar.Result = new gmOrderResult(false, "Duplicate order"); });
            });
        });

        //check for multiple orders for the same province
        gamephase.IterateUnresolvedOrders((country, oars) => {
            /**@type{Object.<string,gmOrderAndResolution[]>} */
            let ordersByProvince = {};
            oars.forEach(oar => {
                if (!(oar.Province in ordersByProvince)) ordersByProvince[oar.Province] = [];
                ordersByProvince[oar.Province].push(oar);
            })
            Object.entries(ordersByProvince).filter(x => x[1].length > 1).forEach(x => {
                x[1].forEach(oar => oar.Result = new gmOrderResult(false, "Multiple orders exist for " + oar.Province));
            });
        });

        //Check for orders without units
        gamephase.IterateUnresolvedOrders((country, oars) =>
            oars.forEach(oar => {
                if (gamephase.GetCountryWithUnitInProvince(oar.Province) != country) {
                    oar.Result = new gmOrderResult(false, country + " does not have a unit in " + oar.Province);
                }
            })
        );
    }

    /**
     * 
     * @param {gmGamePhase} gamephase 
     */
    #AddCoastsIfNeeded(gamephase) {
        gamephase.IterateUnresolvedOrders((country, oars) =>
            oars.forEach(oar => {
                if (oar.Order instanceof gmOrderMove && myGameModel.DualCoastProvinces.includes(oar.Order.ToLocation.Province) && ((oar.Order.ToLocation.ProvinceCoast ?? ProvinceCoastEnum.None) == ProvinceCoastEnum.None)) {
                    let toProvince = oar.Order.ToLocation.Province;
                    let uwl = gamephase.GetUnitWithLocationForCountry(oar.Province, country);
                    if (uwl && uwl.UnitType == UnitTypeEnum.Fleet) {
                        let neighbors = this.MapData.ProvinceData[oar.Province].Neighbors[uwl.Key];
                        neighbors = neighbors.filter(x => x.Location.Province == toProvince);
                        if (neighbors.length == 1) oar.Order.ToLocation = neighbors[0].Location;
                    }
                }
            })
        );
    }

    /**
     * 
     * @param {gmGamePhase} gamephase 
     */
    #AddHoldsForUnorderedUnits(gamephase) {
        Object.entries(gamephase.Units).forEach(x => {
            let country = x[0], units = x[1];
            units.forEach(uwl => {
                let orders = gamephase.GetOrdersForProvince(uwl.Location.Province);
                if (!orders || !(country in orders) || !orders[country] || orders[country].length == 0) {
                    gamephase.Orders[country].push(new gmOrderAndResolution(uwl.Location.Province, new gmOrderHold(), null));
                }
            });
        });
    }
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


            case ScoringSystemEnum.Carnage: this.#ScoreCarnage(); break;
            // case ScoringSystemEnum.Carnage100: ScoreCarnage(); Normalize100(); break;
            // case ScoringSystemEnum.Carnage21: ScoreCarnage(21034); break;
            // case ScoringSystemEnum.CenterCountCarnage: ScoreCarnageCenterCount(); break;
            // case ScoringSystemEnum.SimpleRank: ScoreSimpleRank(); break;
            // case ScoringSystemEnum.SimpleRankWithOE: ScoreSimpleRankWithOE(); break;
            // case ScoringSystemEnum.Maxonian: ScoreMaxonian(); break;

            // case ScoringSystemEnum.DrawSize: ScoreDrawSize(); break;
            case ScoringSystemEnum.Dixie: this.#ScoreDixie(); break;

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
        //Place by center count
        let remaining = this.ResultLineValues.slice();
        let iPlace = 1;
        while (remaining.length > 0) {
            let max = Math.max(...remaining.map(x => x.Kernel.CenterCount));
            let these = remaining.filter(x => x.Kernel.CenterCount == max);
            these.forEach(x => {
                x.Scoring.Rank = iPlace;
                x.Scoring.RankScore = iPlace + (these.length - 1) / 2;
                x.Scoring.Topshare = iPlace == 1 ? 1 / these.length : 0;
                x.Scoring.RankWithOE = x.Scoring.Rank;
                x.Scoring.RankScoreWithOE = x.Scoring.RankScore;
            });
            iPlace += these.length;
            remaining = remaining.filter(x => x.Kernel.CenterCount != max);
        }

        //Order of elimination
        remaining = this.ResultLineValues.filter(x => x.Kernel.CenterCount == 0);
        if (remaining.every(x => x.Kernel.YearOfElimination != null)) {
            iPlace = 0;
            while (remaining.length > 0) {
                let max = Math.max(...remaining.map(x => x.Kernel.YearOfElimination));
                let these = remaining.filter(x => x.Kernel.YearOfElimination == max);
                these.forEach(x => {
                    x.Scoring.RankWithOE = x.Scoring.Rank + iPlace;
                    x.Scoring.RankScoreWithOE = x.Scoring.RankWithOE + (these.length - 1) / 2;
                });
                iPlace += these.length;
                remaining = remaining.filter(x => x.Kernel.YearOfElimination != max);
            }
        }
    }

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

    #ScoreDixie() {
        let bonuspts = [270, 70, 50, 34, 20, 10, 0];

        let remaining = this.ResultLineValues.slice().map(x => [x.Kernel.InDraw ? 1000 : 8 - x.Scoring.RankWithOE, x]);
        let iPlace = 1;
        while (remaining.length > 0) {
            let max = Math.max(...remaining.map(x => x[0]));
            let these = remaining.filter(x => x[0] == max);

            let bonussection = bonuspts.slice(iPlace - 1, iPlace + these.length - 1)
            let bonus = bonussection.reduce((p, x) => x + p ?? 0);

            these.forEach(x => {
                x[1].Scoring.Score = 4 * x[1].Kernel.CenterCount + bonus / these.length;
            });
            iPlace += these.length;
            remaining = remaining.filter(x => max != x[0]);
        }
    }

    #ScoreCarnage() {
        this.ResultLineValues.forEach(x => x.Scoring.Score = 1000 * (8 - x.Scoring.RankScoreWithOE) + x.Kernel.CenterCount);
    }

    //#endregion

}

  //#endregion