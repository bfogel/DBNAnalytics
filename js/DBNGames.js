"use strict";

/**
 * @typedef {import('./DBNUI.js')}
 */

//#region GameModel Enums

const CountryEnum = {
  Austria: "Austria",
  England: "England",
  France: "France",
  Germany: "Germany",
  Italy: "Italy",
  Russia: "Russia",
  Turkey: "Turkey"
}

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
	get DefaultScoringSystem(){return ScoringSystemEnumFromID(this.DefaultScoringSystem_ScoringSystemID);}
	/**@type{number}*/ DefaultCommunicationType_GameCommunicationTypeID;
	get DefaultCommunicationType(){return GameCommunicationTypeEnumFromID(this.DefaultCommunicationType_GameCommunicationTypeID);}
	/**@type{number}*/ DefaultLanguage_GameLanguageID;
	get DefaultLanguage(){return GameLanguageEnumFromID(this.DefaultLanguage_GameLanguageID);}
	/**@type{number}*/ DefaultDeadlineType_GameDeadlineType;
	get DefaultDeadlineType(){return GameDeadlineTypeEnumFromID(this.DefaultDeadlineType_GameDeadlineType);}
	/**@type{number}*/ DefaultGameLimitType_GameLimitTypeID;
	get DefaultGameLimitType(){return GameLimitTypeEnumFromID(this.DefaultGameLimitType_GameLimitTypeID);}
	/**@type{number}*/ DefaultAnonymityType_GameAnonymityTypeID;
	get DefaultAnonymityType(){return GameAnonymityTypeEnumFromID(this.DefaultAnonymityType_GameAnonymityTypeID);}
	/**@type{string}*/ CompletionDate;
	/**@type{number}*/ TopBoard_GameID;
	/**@type{number}*/ TopBoardType_TopBoardTypeID;
	get TopBoardType(){return TopBoardTypeEnumFromID(this.TopBoardType_TopBoardTypeID);}
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

//#region Competition

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