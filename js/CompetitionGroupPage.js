"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 * @typedef {import('./DBNGames.js')}
 */


/** @type{GroupInfo} */ var myGroupInfo = null;

const CompetitionGroupType = { CompetitionSeries: "CompetitionSeries", CustomCompetitionGroup: "CustomCompetitionGroup", DBNIQ: "DBNIQ" };

class GroupInfo {

    constructor(entity, itemid) {
        this.Entity = entity;
        this.ItemID = itemid;

        switch (this.Entity) {
            case CompetitionGroupType.CompetitionSeries: this.InfoRequest = new dbnHubRequest_CompetitionSeries(this.ItemID); break;
            case CompetitionGroupType.CustomCompetitionGroup: throw "not implemented"; break;
            case CompetitionGroupType.DBNIQ: break;
            default: throw "Entity type not recognized";
        }

        // var reqStandings = new dbnHubRequest_CompiledTable(entity, myGroupID, "Standings");
        // var reqCompetitions = new dbnHubRequest_CompiledTable(entity, myGroupID, "CompetitionList");
        // var reqStatistics = new dbnHubRequest_CompiledTable(entity, myGroupID, "Statistics");

    }

	/**@type{string}*/ Entity;
	/**@type{number}*/ ItemID;

    /**@type{bfDataRequest}*/ InfoRequest;
    // /**@type{dbnHubRequest_CompiledTable}*/ StandingsRequest;
    // /**@type{dbnHubRequest_CompiledTable}*/ CompetitionsRequest;
    // /**@type{dbnHubRequest_CompiledTable}*/ StatisticsRequest;

    get Label() {
        switch (this.Entity) {
            case CompetitionGroupType.CompetitionSeries: {
                /**@type{dbnHubRequest_CompetitionSeries} */ var req = this.InfoRequest;
                return req.ResponseToObjects()[0].CompetitionSeriesName;
            }
            case CompetitionGroupType.CustomCompetitionGroup: throw "not implemented"; break;
            case CompetitionGroupType.DBNIQ: return this.ItemID + " DBN Invitational " + " Qualifying";
            default: throw "Entity type not recognized";
        }
    }

    get RootKey() {
        switch (this.Entity) {
            case CompetitionGroupType.CompetitionSeries: {
                /**@type{dbnHubRequest_CompetitionSeries} */ var req = this.InfoRequest;
                return req.ResponseToObjects()[0].RootKey;
            }
            case CompetitionGroupType.CustomCompetitionGroup: throw "not implemented"; break;
            case CompetitionGroupType.DBNIQ: return "DBN";
            default: throw "Entity type not recognized";
        }
    }
}

function MakePage() {
    var urlparams = new URLSearchParams(window.location.search);

    var groupid = 0; var grouptype = "";

    if (urlparams.has("GroupID")) groupid = Number.parseInt(urlparams.get("GroupID"));
    if ("GroupID" in myHub.Parameters) groupid = myHub.Parameters["GroupID"];

    if (urlparams.has("GroupType")) grouptype = urlparams.get("GroupType");
    if ("GroupType" in myHub.Parameters) grouptype = myHub.Parameters["GroupType"];

    switch (grouptype) {
        case "CS": grouptype = CompetitionGroupType.CompetitionSeries; break;
        case "CG": grouptype = CompetitionGroupType.CustomCompetitionGroup; break;
        case "DBNIQ": grouptype = CompetitionGroupType.DBNIQ; break;
        default: break;
    }

    myGroupInfo = new GroupInfo(grouptype, groupid);

    var reqs = myHub.MakeRequestList();
    var reqStandings = new dbnHubRequest_CompiledTable(myGroupInfo.Entity, myGroupInfo.ItemID, "Standings");
    var reqCompetitions = new dbnHubRequest_CompiledTable(myGroupInfo.Entity, myGroupInfo.ItemID, "CompetitionList");
    var reqStatistics = new dbnHubRequest_CompiledTable(myGroupInfo.Entity, myGroupInfo.ItemID, "Statistics");

    if (myGroupInfo.InfoRequest) reqs.addRequest(myGroupInfo.InfoRequest);
    reqs.addRequest([reqStandings, reqCompetitions, reqStatistics]);

    var div = dbnHere().addDiv();
    //div.addText(entity + " " + myGroupID);
    div.addText("Loading...");

    reqs.Send();
    if (!reqs.Success) { reqs.ReportToConsole(); return; }

    div.innerHTML = "";

    // var groupinfo = reqGroupInfo.ResponseToObjects()[0];
    var card = div.addTitleCard(myGroupInfo.Label);
    document.title = myGroupInfo.Label;
    var alllink = card.addLink();
    alllink.href = myHub.MakeCompetitionRootURL("DBN");
    if (myGroupInfo.RootKey == "DBN") alllink.addText("Go to All Competitions");
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

