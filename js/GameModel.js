"use strict";

/**
 * @typedef {import('./DBNGames')}
 */

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

    /**@type{string} */
    Status;
    /**@type{gmDrawVote} */
    DrawVote;

    /**@type{Object.<string,number>} */
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

    ToJSON() { throw "NIE"; }

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
     * @param {gmUnitWithLocation} UnitWithLocation 
     */
    constructor(unitwithlocation) { super("b"); this.UnitWithLocation = unitwithlocation; }

    ToString() { return "Build " + this.UnitWithLocation.ToString(); }

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
