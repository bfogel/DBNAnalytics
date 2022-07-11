"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */

/** @type{string|null} */ var myGroupType = null;
/** @type{int|null} */ var myGroupID = null;

class GroupInfo {

    constructor(entity, itemid) {
        this.Entity = entity;
        this.ItemID = itemid;

        switch (this.Entity) {
            case "CompetitionSeries": this.Request=new dbnhubre; break;
            case "CustomCompetitionGroup": entity = "CustomCompetitionGroup"; break;
            case "DBNIQ": entity = "DBNIQ"; break;
            default: break;
        }
    }

	/**@type{string}*/ Entity;
	/**@type{number}*/ ItemID;

    /**@type{bfDataRequest}*/ Request;

}

function MakePage() {
    var urlparams = new URLSearchParams(window.location.search);

    if (urlparams.has("GroupID")) myGroupID = Number.parseInt(urlparams.get("GroupID"));
    if ("GroupID" in myHub.Parameters) myGroupID = myHub.Parameters["GroupID"];
    if (urlparams.has("GroupType")) myGroupType = urlparams.get("GroupType");
    if ("GroupType" in myHub.Parameters) myGroupType = myHub.Parameters["GroupType"];

    var entity = "";
    switch (myGroupType) {
        case "CS": entity = "CompetitionSeries"; break;
        case "CG": entity = "CustomCompetitionGroup"; break;
        case "DBNIQ": entity = "DBNIQ"; break;
        default: break;
    }

    if (entity == "") throw "Group type " + myGroupType + " not recognized";

    var reqs = myHub.MakeRequestList();
    // var reqGroupInfo = new dbnHubRequest_CompetitionGroup(myCompetitionGroupID);
    var reqStandings = new dbnHubRequest_CompiledTable(entity, myGroupID, "Standings");
    var reqCompetitions = new dbnHubRequest_CompiledTable(entity, myGroupID, "CompetitionList");
    var reqStatistics = new dbnHubRequest_CompiledTable(entity, myGroupID, "Statistics");

    reqs.addRequest([reqStandings, reqCompetitions, reqStatistics]);

    var div = dbnHere().addDiv();
    div.addText(entity + " " + myGroupID);
    div.addText("Loading...");

    reqs.Send();
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    div.innerHTML = "";

    // var groupinfo = reqGroupInfo.ResponseToObjects()[0];
    var card = div.addTitleCard("Add name here");
    card.style = "text-align: center";

    var tabs = div.addTabs();
    if (reqCompetitions.CompiledTable) tabs.addTab("Competitions", reqCompetitions.MakeUITable());
    if (reqStandings.CompiledTable) tabs.addTab("Standings", reqStandings.MakeUITable());
    if (reqStatistics.CompiledTable) tabs.addTab("Statistics", reqStatistics.MakeUITable());

    tabs.SelectTabByIndex(0);


}
MakePage();

//-------------------------------------------------------------------------------------------------------------------------------------

/**
 * 
 * @param {dbnGame[]} games 
 */
function MakeGameList(games) {
    var ret = new dbnDiv();

    //games = [games[0]];

    games.forEach(x => {
        var div = ret.addDiv();
        div.style = "display:inline-block; white-space: nowrap;";

        var table = div.addTable();
        table.Title = x.Label;
        var data = [];
        Object.values(x.ResultLines).forEach(rl => {
            data.push([rl.Country, rl.Player.PlayerName, "(" + rl.CenterCount + ")", rl.Score]);
        });
        table.Data = data;
        table.CountryRows = Object.keys(x.ResultLines);
        table.Generate();

        var mv = new dbnMapView(div);

        var game = new gmGame(x);
        mv.Game = game;

        var gp = new gmGamePhase(null);
        gp.SupplyCenters = {};
        Object.values(x.ResultLines).forEach(rl => {
            gp.SupplyCenters[rl.Country] = JSON.parse(rl.SupplyCenters);
        });
        game.GamePhases = [gp];
        mv.GamePhase = gp;

        mv.Draw();

        ret.addHardRule();
    });
    return ret;
}

//-------------------------------------------------------------------------------------------------------------------------------------

