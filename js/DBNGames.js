"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 */

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

//#endregion

//#region DataRequest classes

class bfDataSet {
  Fields;
  Data;

  get Fieldnames() { return this.Fields.map(ff => ff["name"]); }

  DataToObjects(objectfunction = null) {
    if (objectfunction == null) objectfunction = () => { return {}; };

    var fieldnames = this.Fieldnames;
    return this.Data.map(row => {
      var ret = objectfunction();
      fieldnames.forEach((f, i) => ret[f] = row[i]);
      return ret;
    });
  }
}

class bfDataRequest {
  constructor(key, parameters) {
    this.Key = key;
    this.Parameters = parameters;

    var src = new URLSearchParams(window.location.search);
    if (src.has("token")) {
      if (!this.Parameters) this.Parameters = {};
      this.Parameters["token"] = src.get("token");
    }

  }

  Key = null;
  Parameters = {};

  Success;
  Message;
  ResponseContent;
  AffectedRows;

  SendAlone() {
    var list = myHub.MakeRequestList();
    list.addRequest(this);
    return list.Send();
  }

  MakeRequestJSON() {
    var ret = {};
    ret["Key"] = this.Key;
    ret["Parameters"] = this.Parameters;
    return ret;
  }

  get ResponseIsDataSet() {
    if (typeof this.ResponseContent === "object" && this.ResponseContent != null && this.ResponseContent.hasOwnProperty("data") && this.ResponseContent.hasOwnProperty("data")) return true;
    return false;
  }

  ReponseToDataSet() {
    var ret = new bfDataSet();
    ret.Fields = this.ResponseContent["fields"];
    ret.Data = this.ResponseContent["data"];
    return ret;
  }

  ResponseToObjects(objectfunction = null) { return this.ResponseIsDataSet ? this.ReponseToDataSet().DataToObjects(objectfunction) : null; }
  GetFirstObject(objectfunction = null) { var objs = this.ResponseToObjects(objectfunction); return objs == null ? null : objs[0]; }

  ReportToConsole() {
    console.log("Request", this.Key, !this.Success ? "fail " + this.Message : (this.ResponseIsDataSet ? this.ResponseToObjects() : this.ResponseContent));
  }

  ReportToDiv(div) {
    div.addText((this.constructor.name) + " Success: " + this.Success);
    div.addLineBreak();
    if (this.Success) {
      if (this.ResponseIsDataSet) {
        var objs = this.ResponseToObjects();
        objs.forEach(x => { div.addText(JSON.stringify(x)); div.addLineBreak(); })
      } else {
        div.addText(JSON.stringify(this.ResponseContent)); div.addLineBreak();
      }
    } else {
      div.addText(this.Message); div.addLineBreak();
    }
  }
}

class bfDataRequestList {
  constructor(url) { this.Url = url; }

  Url;

  /** @type {bfDataRequest[]} */
  Requests = [];

  ErrorMessage;

  get Success() {
    return this.Requests.length > 0 && (this.Requests.filter(x => !x.Success).length == 0);
  }

  _SetErrorMessageAndLog(s) {
    console.log(s);
    this.ErrorMessage = s;
  }

  Send() {
    if (this.Requests.length == 0) {
      console.log("Error in dbnHubRequestList.Send: No requests.");
      return false;
    }

    var req = new XMLHttpRequest();
    req.open('POST', this.Url, false); //false for not-async

    var fd = this.MakeFormData();

    if (myHub.Ticket) {
      req.setRequestHeader('X-WP-Nonce', myHub.Ticket);
      fd.append("_wpnonce", myHub.Ticket);
    }

    req.send(fd);

    if (req.status == 200 && req.responseText != "nope") {
      var resp;
      try {
        resp = JSON.parse(req.responseText);
      } catch (error) {
        this._SetErrorMessageAndLog("Error in dbnHubRequestList.Send(1): " + error + "\n" + req.responseText);
        return false;
      }

      if (!(resp instanceof Array)) {
        this._SetErrorMessageAndLog("Error in dbnHubRequestList.Send(2): Response not an array. " + JSON.stringify(resp));
        return false;
      }

      if (resp.length != this.Requests.length) {
        this._SetErrorMessageAndLog("Error in dbnHubRequestList.Send(3): Response length (" + resp.length + ") not the same as Request length (" + this.Requests.length + ").");
        return false;
      }

      resp.forEach((x, i) => {
        var reqq = this.Requests[i];
        reqq.Success = x["success"];
        reqq.Message = x["message"];
        reqq.ResponseContent = x["content"];
      });

      return true;

    } else {
      this._SetErrorMessageAndLog("Error in dbnHubRequestList.Send(4): " + req.responseText);
      return false;
    }

  }

  ReportToConsole() {
    if (this.ErrorMessage) console.log("List ErrorMessage: " + this.ErrorMessage);
    this.Requests.forEach(req => req.ReportToConsole());
  }

  ReportToDiv(div) {
    if (this.ErrorMessage) {
      div.addLineBreak();
      div.addText("List ErrorMessage: " + this.ErrorMessage);
    }

    this.Requests.forEach(req => {
      req.ReportToDiv(div);
      div.addLineBreak();
    });
  }

  MakeFormData() {
    var data = this.Requests.map(x => x.MakeRequestJSON());
    var fd = new FormData();
    fd.append("requests", JSON.stringify(data));
    return fd;
  }

  /**
   * 
   * @param {*} requestOrRequests A bfDataRequest or array of bfDataRequest. 
   */
  addRequest(requestOrRequests) {
    if (requestOrRequests instanceof bfDataRequest) {
      this.Requests.push(requestOrRequests);
    } else if (requestOrRequests instanceof Array) {
      requestOrRequests.forEach(x => this.addRequest(x));
    } else {
      throw "request must be bfDataRequest or an array of bfDataRequest";
    }
  }

}

//#endregion

//#region DBN data access

class dbnHub {

  //MakeRequestList() { return new bfDataRequestList("https://diplobn.com/wp-content/plugins/DBNAnalytics/hubget.php"); }
  MakeRequestList() { return new bfDataRequestList("https://diplobn.com/wp-json/DBNAnalytics/v1/hubget/13"); }

  Ticket;
  /** @type{Object.<string,any>} */
  Parameters = {};

  Countries = Object.values(CountryEnum);

  /** @type{dbnPlayer[]} */
  #players = [];
  get Players() {
    if (this.#players.length == 0) {
      console.log("Retrieving players");
      var req = new dbnHubRequest_Players();
      req.SendAlone();
      this.#players = req.ResponseToPlayers();
    }
    return this.#players;
  }

  /**
   * @param {number[]} playerids 
   * @returns 
   */
  GetGamesForPlayers(playerids) {
    var vals = { "PlayerIDs": JSON.stringify(playerids) };

    var req = new bfDataRequest("games", vals);
    req.SendAlone();

    if (!req.Success) return null;

    if (req.ResponseContent instanceof Array) {
      return req.ResponseContent.map(x => new dbnGame(x));
    }

    return null;
  }
}
var myHub = new dbnHub();

//#endregion

//#region Basic DataRequest classes

//#region Competition

class dbnCompetition {
	/**@type{number}*/ CompetitionID;
	/**@type{string}*/ CompetitionName;
	/**@type{number}*/ CompetitionSeries_CompetitionSeriesID;
	/**@type{string}*/ CompetitionSeries_CompetitionSeriesName;
	/**@type{number}*/ Director_PlayerID;
	/**@type{string}*/ Director_PlayerName;
	/**@type{number}*/ StandingsTopCount;
	/**@type{number}*/ StandingsAvgOfRestMinimumDivisor;
	/**@type{number}*/ StandingsAvgOfRestBooster;
	/**@type{number}*/ StandingsMinimumScoreCountRequired;
	/**@type{number}*/ DefaultScoringSystem_ScoringSystemID;
  get DefaultScoringSystem() { return ScoringSystemEnumFromID(this.DefaultScoringSystem_ScoringSystemID); }
	/**@type{number}*/ DefaultCommunicationType_GameCommunicationTypeID;
  get DefaultCommunicationType() { return GameCommunicationTypeEnumFromID(this.DefaultCommunicationType_GameCommunicationTypeID); }
	/**@type{number}*/ DefaultLanguage_GameLanguageID;
  get DefaultLanguage() { return GameLanguageEnumFromID(this.DefaultLanguage_GameLanguageID); }
	/**@type{number}*/ DefaultDeadlineType_GameDeadlineType;
  get DefaultDeadlineType() { return GameDeadlineTypeEnumFromID(this.DefaultDeadlineType_GameDeadlineType); }
	/**@type{number}*/ DefaultGameLimitType_GameLimitTypeID;
  get DefaultGameLimitType() { return GameLimitTypeEnumFromID(this.DefaultGameLimitType_GameLimitTypeID); }
	/**@type{number}*/ DefaultAnonymityType_GameAnonymityTypeID;
  get DefaultAnonymityType() { return GameAnonymityTypeEnumFromID(this.DefaultAnonymityType_GameAnonymityTypeID); }
	/**@type{string}*/ CompletionDate;
	/**@type{number}*/ TopBoard_GameID;
	/**@type{number}*/ TopBoardType_TopBoardTypeID;
  get TopBoardType() { return TopBoardTypeEnumFromID(this.TopBoardType_TopBoardTypeID); }
	/**@type{number}*/ ExternalBoardCount;
	/**@type{boolean}*/ IncludedInFTFRankings;
	/**@type{number}*/ DBNIYear;
	/**@type{boolean}*/ WinnerAutoQualifiesForDBNI;
	/**@type{string}*/ Note;
}
class dbnHubRequest_Competition extends bfDataRequest {
  constructor(pCompetitionIDs) { super("competition", { "CompetitionIDs": pCompetitionIDs }); }
  /** @returns {dbnCompetition[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnCompetition()); }
}

//#endregion

//#endregion

//#region Misc DataRequest classes

class dbnUserInfo { PlayerID; PlayerName; }
class dbnHubRequest_UserInfo extends bfDataRequest {
  constructor() { super("userinfo", null); }
  /** @returns {dbnUserInfo} */
  get UserInfo() {
    if (this.ResponseContent) {
      var ret = new dbnUserInfo();
      Object.assign(ret, this.ResponseContent);
      return ret
    }
    return null;
  }
}

class dbnCompiledTable { Category; ItemID; TableJSON; }
class dbnHubRequest_CompiledTable extends bfDataRequest {
  constructor(category = "", itemid = 0) { super("compiledtable", { "Category": category, "ItemID": itemid }); }

  /** @type {dbnCompiledTable} */
  #CompiledTable;
  get CompiledTable() {
    if (this.#CompiledTable === undefined) {
      var ret = super.ResponseToObjects(() => new dbnCompiledTable());
      this.#CompiledTable = ret.length > 0 ? ret[0] : null;
    }
    return this.#CompiledTable;
  }

  MakeUITable() {
    if (!this.CompiledTable) return null;
    var ret = new dbnTable();
    Object.assign(ret, JSON.parse(this.CompiledTable.TableJSON));
    ret.Generate();
    return ret;
  }
}

class dbnCompetitionPlayerSeed { PlayerID; PlayerName; CompetitionID; CompetitionName; Seed; }
class dbnHubRequest_CompetitionPlayerSeed extends bfDataRequest {
  constructor(pAsTD = false) { super("compseeds", { "asTD": pAsTD }); }
  /** @returns {dbnCompetitionPlayerSeed[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnCompetitionPlayerSeed()); }
}

class dbnCompetitionPlayerSchedule {
  /** @type{number} */
  PlayerID;
  /** @type{string} */
  PlayerName;
  /** @type{number} */
  CompetitionID;
  /** @type{string} */
  CompetitionName;
  /** @type{number} */
  Round;
  /** @type{boolean} */
  BidsLocked;
  /** @type{?number} */
  Board;
  /** @type{?number} */
  CountryID;
}
class dbnHubRequest_CompetitionPlayerSchedule extends bfDataRequest {
  constructor(pAsTD = false, competitionID = null) { super("CompetitionSchedule_Get", { "asTD": pAsTD, "competitionID": competitionID }); }
  /** @returns {dbnCompetitionPlayerSchedule[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnCompetitionPlayerSchedule()); }
}
class dbnHubRequest_SaveCompetitionPlayerSchedules extends bfDataRequest {
  /**
   * @param {dbnCompetitionPlayerSchedule[]} schedules 
   */
  constructor(competitionID, schedules) { super("CompetitionSchedule_Save", { "competitionID": competitionID, "schedules": schedules }); }
  /** @returns {dbnCompetitionPlayerSchedule[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnCompetitionPlayerSchedule()); }
}

//Rename
class dbnPlayerCountryBid { PlayerID; Country; CompetitionID; Round; Bid; }
class dbnHubRequest_Bids extends bfDataRequest {
  constructor(pAsTD = false) { super("bids", { "asTD": pAsTD }); }
  /** @returns {dbnPlayerCountryBid[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnPlayerCountryBid()); }
}

class dbnCompetitionPlayerGameCount {
  /** @type{number} */
  PlayerID;
  /** @type{number} */
  CountryID;
  /** @type{number} */
  GameCount;
}
class dbnHubRequest_CompetitionPlayerGameCounts extends bfDataRequest {
  constructor(competitionID) { super("CompetitionPlayerCountries", { "competitionID": competitionID }); }
  /** @returns {dbnCompetitionPlayerGameCount[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnCompetitionPlayerGameCount()); }
}

//#endregion

//#region Competition (Ad Hoc -- Should replace with dbnCompetition)

class dbnCompetitionAdHoc {
  /** @type{number} */
  CompetitionID;
  /** @type{string} */
  CompetitionName;
  /** @type{number} */
  CompetitionSeriesID;
  /** @type{string} */
  CompetitionSeriesName;
  /** @type{string} */
  CompletionDate;
  /** @type{?number} */
  DBNIYear;
}

class dbnHubRequest_CompetitionParticipationList extends bfDataRequest {
  constructor(pAsTD = false) { super("competitionList", { "asTD": pAsTD }); }
  /** @returns {dbnCompetidbnCompetitionAdHoction[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnCompetitionAdHoc()); }
}

//#endregion

//#region Player and Player selectors

class dbnPlayer {
  constructor(playerid, playername) { this.PlayerID = parseInt(playerid); this.PlayerName = playername; }
  /** @type {number} */
  PlayerID = null;
  /** @type {string} */
  PlayerName = null;
  toString() { return "{Player " + this.PlayerID + ": " + this.PlayerName + "}"; }
}

class dbnHubRequest_Players extends bfDataRequest {
  constructor() { super("players", null); }

  ResponseToPlayers() {
    var ret = Array.from(Array(0), x => new dbnPlayer());

    if (this.Success) {
      var data = this.ResponseContent.data;
      ret = data.map(x => new dbnPlayer(x[0], x[1]));
      ret.sort((a, b) => {
        var aa = a.PlayerName.toLowerCase(); var bb = b.PlayerName.toLowerCase();
        return aa > bb ? 1 : (aa < bb ? -1 : 0);
      });
    }
    return ret;
  }
}

class dbnPlayerSelectorOLD extends dbnSelect {

  constructor(parent = null) {
    super(parent);
    this.className = "PlayerSelector";
    this.LoadPlayers();
  }

  get SelectedPlayer() {
    var i = this.SelectedValue;
    if (i == null) return null;
    return myHub.Players.find(x => x.PlayerID == i);
  }

  LoadPlayers() {
    this.AddOption("(none)", null);
    myHub.Players.forEach(x => this.AddOption(x.PlayerName, x.PlayerID));
  }

}

class dbnPlayerSelector extends dbnDropdownWithSearch {

  constructor() {
    super();
    this.className += " PlayerSelector";
    this.LoadPlayers();
    this.placeholder = "Player";

    this.OnItemSelected.AddListener(() => this.OnPlayerSelected.Raise(null));
  }

  OnPlayerSelected = new dbnEvent();

  /**
   * @type {dbnPlayer}
   */
  get SelectedPlayer() {
    var item = this.SelectedItem;
    if (!(item?.Value)) return null;
    return myHub.Players.find(x => x.PlayerID == item.Value);
  }
  set SelectedPlayer(value) {
    this.SelectedItem = value?.PlayerID;
  }

  LoadPlayers() {
    //this.AddItem("(none)", null);
    myHub.Players.forEach(x => this.AddItem(x.PlayerName, x.PlayerID));
  }

}

class dbnPlayerListLine extends dbnSpan {

  /** @type {dbnPlayer} */
  Player;

  PlayerList = new dbnPlayerSelector();
  RemoveLink = new dbnLink();

  /**
   * @param {dbnPlayer} player 
   */
  constructor(player) {
    super();
    this.Player = player;

    this.add(this.RemoveLink);
    this.RemoveLink.href = "#";
    this.RemoveLink.add(new dbnIcon_TimesCircle());
    this.RemoveLink.addText(this.Player.PlayerName);
  }

  OnClick() {
    alert("did it");
  }

}
class dbnPlayerList extends dbnDiv {

  OnSelectionChanged;

  PlayerSelector = new dbnPlayerSelector();

  /** @type {dbnPlayerListLine[]} */
  Lines = [];
  LinesDiv = new dbnDiv();

  constructor() {
    super(null);
    this.className = "dbnPlayerList";

    this.addText("Players: ");

    this.add(this.LinesDiv);
    this.LinesDiv.className = "dbnPlayerListCell";

    var divAdd = this.addDiv();
    divAdd.style = "margin-left: 5px";
    divAdd.add(this.PlayerSelector);
    this.PlayerSelector.placeholder = "Add player";
    this.PlayerSelector.OnPlayerSelected.AddListener(this.#PlayerSelected.bind(this));
  }

  #raiseOnChanged() { if (this.OnSelectionChanged) this.OnSelectionChanged(); }

  #PlayerSelected() {
    var player = this.PlayerSelector.SelectedPlayer;
    if (player == null) return;

    var bIn = this.Lines.some(x => x.Player.PlayerID == player.PlayerID);

    if (!bIn) this.AddPlayer(player);

    this.PlayerSelector.SelectedPlayer = null;
  }

  /**
   * @param {dbnPlayer} player 
   */
  AddPlayer(player) {
    var line = new dbnPlayerListLine(player);

    line.RemoveLink.onclick = this.RemovePlayer.bind(this, player);
    this.Lines.push(line);
    this.LinesDiv.add(line);
    this.#raiseOnChanged();
  }

  /**
   * @param {dbnPlayer} player 
   */
  RemovePlayer(player) {
    var lines = this.Lines.filter(x => x.Player.PlayerID == player.PlayerID);

    lines.forEach(x => {
      var i = this.Lines.indexOf(x);
      this.Lines.splice(i, 1);
      x.domelement.remove();
    });

    this.#raiseOnChanged();
  }

  get Players() {
    var ret = this.Lines.map(x => x.Player);
    return ret;
  }
}

//#endregion

//#region Game

class dbnHubRequest_GetGames extends bfDataRequest {
  constructor(pGameIDs = null, pCompetitionIDs = null, pPlayerIDs = null) {
    super("getgames", { GameIDs: pGameIDs, CompetitionIDs: pCompetitionIDs, PlayerIDs: pPlayerIDs });
    if (!pGameIDs && !pCompetitionIDs && !pPlayerIDs) throw "Must provide at least one of GameIDs, CompetitionIDs, or PlayerIDs";
  }
  /** @returns {dbnGame[]} */
  ResponseToObjects() { return this.ResponseContent.map(x => new dbnGame(x)); }
}

class dbnGame {

  GameID = null;
  Label = null;
  EndDate = null;
  DrawSize = null;
  GameYearsCompleted = null;
  Platform = null;
  URL = null;
  Competition = null;

  /** @type {number|null} */
  DBNIYear;

  /** @type {Object.<string,dbnGameResultLine>} */
  ResultLines = {};

  //constructor(gameid) { this.GameID = parseInt(gameid); }
  constructor(json) {
    this.GameID = parseInt(json.GameID);
    this.Label = json.Label;
    this.EndDate = json.EndDate;
    this.DrawSize = parseInt(json.DrawSize);
    this.GameYearsCompleted = parseInt(json.GameYearsCompleted);
    this.Platform = json.Platform;
    this.URL = json.URL;
    this.Competition = { CompetitionID: parseInt(json.Competition.CompetitionID), CompetitionName: json.Competition.CompetitionName };
    this.DBNIYear = json.DBNIYear == null ? null : parseInt(json.DBNIYear);

    if (json.ResultLines != null) {
      for (const key in json.ResultLines) {
        var line = new dbnGameResultLine(json.ResultLines[key]);
        this.ResultLines[line.Country] = line;
      }
    }
  }

  toString() { return "{Game " + this.GameID + ": " + this.Label + "}"; }

  GetResultLineForPlayer(playerid) {
    for (const country in this.ResultLines) {
      var line = this.ResultLines[country];
      if (line.Player.PlayerID == playerid) return line;
    }
    return null;
  }

  GetResultLinesByRank() {
    /** @type {Object.<number,dbnGameResultLine[]>} */
    var ret = {};

    Object.values(this.ResultLines).forEach(line => {
      if (!ret.hasOwnProperty(line.Rank)) ret[line.Rank] = [];
      ret[line.Rank].push(line);
    });

    return ret;
  }

}

class dbnGameResultLine {

  Country = null;

  /**@type {dbnPlayer} */
  Player = null;

  Note = null;
  CenterCount = null;
  InGameAtEnd = null;
  YearOfElimination = null;
  UnexcusedResignation = null;
  Score = null;
  Rank = null;
  RankScore = null;
  TopShare = null;
  SupplyCenters = null;

  constructor(json) {
    this.Country = json.Country;
    this.Player = new dbnPlayer(parseInt(json.Player.PlayerID), json.Player.PlayerName);
    this.Note = json.Note;
    this.CenterCount = parseInt(json.CenterCount);
    this.YearOfElimination = json.YearOfElimination != null ? parseInt(json.YearOfElimination) : null;
    this.InGameAtEnd = json.InGameAtEnd == "1";
    this.UnexcusedResignation = json.UnexcusedResignation == "1";
    this.Score = parseFloat(json.Score);
    this.Rank = parseInt(json.Rank);
    this.RankScore = parseFloat(json.RankScore);
    this.TopShare = parseFloat(json.TopShare);
    this.SupplyCenters = json.SupplyCenters;
  }
}

//#endregion

//#region Utility

class dbnWeightedSelector {

  WeightsAndItems = [];
  get Items() { return this.WeightsAndItems.map(x => x[1]); }

  get TotalWeight() {
    return this.WeightsAndItems.reduce((p, x) => p + x[0], 0);
  }

  /**
   * @param {number} weight 
   * @param {*} item 
   */
  AddItem(weight, item) {
    this.WeightsAndItems.push([weight, item]);
  }

  GetItem() {
    var tot = this.TotalWeight;
    var rnd = Math.random() * tot;

    var cur = 0;
    var ret;

    this.WeightsAndItems.every((x, i) => {
      if (rnd > cur && rnd <= cur + x[0]) { ret = x[1]; return false; }
      cur += x[0];
      return true;
    });

    return ret;
  }

  /** @callback PredicateCallback
   * @param {any} item 
   * @return {boolean} 
   */

  /**
   * 
   * @param {PredicateCallback} callback Takes one argument and returns a boolean
   */
  filterInPlace(callback) {
    this.WeightsAndItems = this.WeightsAndItems.filter(x => callback(x[1]));
  }

}

//#endregion