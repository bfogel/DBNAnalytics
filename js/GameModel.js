"use strict";

/**
 * @typedef {import('./DBNGames')}
 */

//#region Enums

const ProvinceTypeEnum = { Land: "Land", Water: "Water" };
const ProvinceEnum = { NAO: "NAO", NWG: "NWG", BAR: "BAR", IRI: "IRI", NTH: "NTH", SKA: "SKA", BOT: "BOT", HEL: "HEL", BAL: "BAL", ENG: "ENG", MAO: "MAO", LYO: "LYO", WES: "WES", TYS: "TYS", ADR: "ADR", ION: "ION", BLA: "BLA", AEG: "AEG", EAS: "EAS", Tyr: "Tyr", Vie: "Vie", Tri: "Tri", Bud: "Bud", Boh: "Boh", Gal: "Gal", Cly: "Cly", Edi: "Edi", Lvp: "Lvp", Wal: "Wal", Yor: "Yor", Lon: "Lon", Gas: "Gas", Bre: "Bre", Par: "Par", Pic: "Pic", Bur: "Bur", Mar: "Mar", Kie: "Kie", Ruh: "Ruh", Mun: "Mun", Ber: "Ber", Pru: "Pru", Sil: "Sil", Pie: "Pie", Ven: "Ven", Tus: "Tus", Rom: "Rom", Apu: "Apu", Nap: "Nap", Stp: "Stp", Lvn: "Lvn", Mos: "Mos", War: "War", Ukr: "Ukr", Sev: "Sev", Con: "Con", Ank: "Ank", Arm: "Arm", Smy: "Smy", Syr: "Syr", Nwy: "Nwy", Swe: "Swe", Fin: "Fin", Den: "Den", Bel: "Bel", Hol: "Hol", Por: "Por", Spa: "Spa", Naf: "Naf", Tun: "Tun", Ser: "Ser", Alb: "Alb", Rum: "Rum", Bul: "Bul", Gre: "Gre" };
const ProvinceCoastEnum = { None: "None", ec: "ec", wc: "wc", sc: "sc", nc: "nc" };

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
