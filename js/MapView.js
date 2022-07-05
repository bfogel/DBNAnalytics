"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames')}
 * @typedef {import('./GameModel')}
 */

/**
 * 
 * @param {dbnMapData} mapdata 
 */
function ProcessMapData(mapdata, gamedata) {
    var game = new gmGame(gamedata);

    var mv = new dbnMapView(dbnHere());
    mv.MapData = new dbnMapData(mapdata);

    mv.Game = game;
    mv.GamePhase = game.GamePhases[game.GamePhases.length - 1];
    //mv.GamePhase = game.GamePhases[0];

    mv.Draw();

}

//#region Graphics classes 

class dbnPoint {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }

    /**@type{number} */
    X;

    /**@type{number} */
    Y;
}
class dbnSize {
    /**
     * 
     * @param {number} width 
     * @param {number} height
     */
    constructor(width, height) {
        this.Height = height;
        this.Width = width;
    }

    /**@type{number} */
    Height;

    /**@type{number} */
    Width;
}

//#endregion

//#region dbnProvinceData

class dbnProvinceData {

    //#region constructor

    /**
     * 
     * @param {string} province 
     * @param {object} json 
     */
    constructor(province, json) {
        this.Province = province;
        this.ProvinceType = (myGameModel.SeaProvinces.includes(province)) ? ProvinceTypeEnum.Water : ProvinceTypeEnum.Land;
        this.HasSupplyCenter = myGameModel.SupplyCenters.includes(province);
        this.HomeCountry = myGameModel.GetHomeCountryForProvince(province);

        if ("FullName" in json) this.FullName = json["FullName"];
        if ("TextLocation" in json) this.TextLocation = json["TextLocation"];
        if ("DotLocation" in json) this.DotLocation = json["DotLocation"];

        if ("UnitLocations" in json) Object.entries(json["UnitLocations"]).forEach(x => this.UnitLocations[x[0]] = x[1]);
        if ("Neighbors" in json) Object.entries(json["Neighbors"]).forEach(x => this.Neighbors[x[0]] = x[1]);

        if ("BorderPath" in json) this.BorderPath = this.#PathArrayToString(json["BorderPath"]);
        if ("CoastPaths" in json) Object.entries(json["CoastPaths"]).forEach(x => this.CoastPaths[x[0]] = x[1]);

        var ulx, uly, lrx, lry;

        json["BorderPath"].forEach(x => {
            ulx = Math.min(x[0], ulx ?? x[0]);
            uly = Math.min(x[1], uly ?? x[1]);
            lrx = Math.max(x[0], lrx ?? x[0]);
            lry = Math.max(x[1], lry ?? x[1]);
        });
        this.UpperLeft = [ulx, uly];
        this.LowerRight = [lrx, lry];
    }

    /**@type{number[]} */
    UpperLeft;
    /**@type{number[]} */
    LowerRight;

    /**
     * 
     * @param {number[][]} points 
     */
    #PathArrayToString(points) {
        var ret = "";
        points.forEach((x, i) => ret += (i == 0 ? "M" : "L") + x[0] + " " + x[1] + " ");
        ret += "Z";
        return ret;
    }

    //#endregion

    //#region Game Structure

    /**@type{string} */
    Province;

    /**@type{string} */
    ProvinceType;

    /**@type{boolean} */
    HasSupplyCenter;

    /**@type{string} */
    HomeCountry;

    //#endregion

    //#region Visual properties

    /**@type{string} */
    FullName;

    /**@type{number[]} */
    TextLocation;
    /**@type{number[]|null} */
    DotLocation = null;

    /**@type{Object.<string,number[]>} */
    UnitLocations = {};

    /**@type{Object.<string,string[]>} */
    Neighbors = {};

    /**@type{number[][]} */
    BorderPath;

    /**@type{Object.<string,number[][]>} */
    CoastPaths = {};

    //     public Point GetLocationForUnit(GameModel.UnitWithLocation unit)
    // {
    //     if (UnitLocations.ContainsKey(unit)) return UnitLocations[unit];
    //     return new Point(0, 0);
    // }

    //#endregion


}

//#endregion

//#region MapData

class dbnMapData {

    constructor(json) {
        if ("Properties" in json) {
            var props = json["Properties"];
            if ("Label" in props) this.Label = props["Label"];
            if ("CornerRadius" in props) this.CornerRadius = props["CornerRadius"];
            if ("WaterColor" in props) this.WaterColor = props["WaterColor"];
        }

        this.ProvinceData = {};
        if ("Provinces" in json) {
            Object.entries(json.Provinces).forEach(x => {
                var pd = new dbnProvinceData(x[0], x[1]);
                this.ProvinceData[x[0]] = pd;
            });
        }

        // this.NeutralColor = "tan";
        this.NeutralColor = "#D2B48C";
        this.CountryColors["Austria"] = this.#RGB2HTML(204, 0, 0);
        this.CountryColors["England"] = this.#RGB2HTML(30, 30, 225);
        this.CountryColors["France"] = this.#RGB2HTML(153, 153, 255);
        this.CountryColors["Germany"] = this.#RGB2HTML(75, 75, 75);
        this.CountryColors["Italy"] = this.#RGB2HTML(0, 170, 0);
        this.CountryColors["Russia"] = this.#RGB2HTML(187, 0, 187);
        this.CountryColors["Turkey"] = this.#RGB2HTML(240, 210, 0);
        // this.CountryColors["Turkey"] = this.#RGB2HTML(187, 187, 0);
        this.WaterColor = this.#RGB2HTML(146, 230, 255);

        // this.NeutralColor = this.#RGB2HTML(234, 222, 168);
        // this.CountryColors["Austria"] = this.#RGB2HTML(175, 10, 10);
        // this.CountryColors["England"] = this.#RGB2HTML(228, 47, 208);
        // this.CountryColors["France"] = this.#RGB2HTML(0, 140, 255);
        // this.CountryColors["Germany"] = this.#RGB2HTML(100, 100, 100);
        // this.CountryColors["Italy"] = this.#RGB2HTML(10, 175, 10);
        // this.CountryColors["Russia"] = this.#RGB2HTML(102, 22, 158);
        // this.CountryColors["Turkey"] = this.#RGB2HTML(240, 210, 0);
        // this.WaterColor = this.#RGB2HTML(146, 230, 255);
    }

    /**@type{string} */
    Label;

    /**@type{number} */
    CornerRadius;

    // /**@type{boolean} */
    // UseBackgroundMap;

    /**@type{Object.<string,dbnProvinceData>} */
    ProvinceData;

    /**@type{dbnPoint[]} */
    Canals;

    /** @type{number[]} */
    get NativeSize() {
        var x = 0;
        var y = 0;
        Object.values(this.ProvinceData).forEach(pd => { x = Math.max(x, pd.LowerRight[0]); y = Math.max(y, pd.LowerRight[1]); });
        //Canals.ForEachKV((k, v) => v.ForEach(xx => { x = Math.Max(x, xx.X); y = Math.Max(y, xx.Y); }));
        return [x, y];
    }

    /**@type{string} */
    WaterColor;
    /**@type{string} */
    NeutralColor;

    /**@type{Object.<string,string>} */
    CountryColors = {};
    #RGB2HTML(red, green, blue) {
        var decColor = 0x1000000 + blue + 0x100 * green + 0x10000 * red;
        return '#' + decColor.toString(16).substr(1);
    }

}

//#endregion

//#region MapView

class dbnMapView extends dbnSVG {

    constructor(parent = null) {
        super(parent);
        this.domelement.setAttribute("preserveAspectRatio", "none");
        this.style = "background-color: white";
        this.SetSize(800, 600);
    }

    /**@type{dbnMapData} */
    #MapData;
    get MapData() { return this.#MapData; }
    set MapData(value) {
        this.#MapData = value;
        var size = this.#MapData.NativeSize;
        this.domelement.setAttribute("viewBox", "0 0 " + size[0] + " " + size[1]);
    }

    /**@type{gmGame} */
    Game;

    /**@type{gmGamePhase} */
    GamePhase;

    Draw() {
        if (!this.MapData) return;

        this.innerHTML = "";

        // if (_MapScale == 0) return;
        // gr.Scale(_MapScale, _MapScale);
        // gr.AntiAlias = true;

        //if (!this.GamePhase) return;

        // FillTerritories(gr);
        this.#DrawProvinces();
        // DrawProvinceLabels(gr);
        // DrawSupplyCenters(gr);

        // if (ViewingMode != GameViewingModeEnum.ProvincesOnly) {
        //     DrawUnits(gr);
        //     if (ViewingMode != GameViewingModeEnum.ProvincesAndUnitsOnly) {

        //         if (ViewingMode == GameViewingModeEnum.EverythingWithoutReveal || (ViewingMode == GameViewingModeEnum.EverythingWithReveal && !Map.WaitingToRevealOrders)) {
        //             if (ShowOrders) DrawOrders(gr);
        //             if (ShowWrittenOrders) DrawWrittenOrders(gr);
        //         }

        //     }

        // }

        // if (Map.ShowPlayerNames) DrawNames(gr);

        // DrawGameStatus(gr);
    }

    #DrawProvinces() {
        var owners = this.GamePhase?.MakeSupplyCentersByProvince();

        Object.values(this.MapData.ProvinceData).forEach(x => {
            var fill;
            if (x.ProvinceType == ProvinceTypeEnum.Water) {
                fill = this.MapData.WaterColor;
            } else {
                var owner = owners ? owners[x.Province] : null;
                fill = owner ? this.MapData.CountryColors[owner] : this.MapData.NeutralColor;
            }
            this.AddPath(x.BorderPath, "black", "2", fill);
            //var pp = this.createAndAppendElement("")
            //gr.DrawPath(uiPen.NewSolid(Color.White, 1.25F), x.Value.MakeGraphicsPath())
        });
        // if (MapData.CornerRadius > 0) {
        //     MapData.FindAllTriplePoints().ForEach(x => gr.FillEllipse(Color.White, new RectangleF(x, new SizeF(0.75F * MapData.CornerRadius, 0.75F * MapData.CornerRadius)).WithNewCenterPoint(bfAlignmentEnum.MiddleCenter)));
        // }
    }
}

//#endregion