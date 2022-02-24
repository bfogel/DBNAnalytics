
/**
 * @typedef {import('./DBNUI.js')}
 */

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

  addRequest(request) {
    if (request instanceof bfDataRequest) {
      this.Requests.push(request);
    } else if (request instanceof Array) {
      request.forEach(x => this.addRequest(x));
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

  Countries = ["Austria", "England", "France", "Germany", "Italy", "Russia", "Turkey"];

  #players = Array.from(Array(0), x => new dbnPlayer());
  get Players() {
    if (this.#players.length = []) {
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
req.ReportToConsole();

    if (req.ResponseContent instanceof Array) {
      return req.ResponseContent.map(x => new dbnGame(x));
    }

    return null;
  }
}
var myHub = new dbnHub();

//#endregion

//#region Misc DataRequest classes

//---Add PlayerName to these requests for convience

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

class dbnCompetitionPlayerSeed { PlayerID; PlayerName; CompetitionID; CompetitionName; Seed; }
class dbnHubRequest_CompetitionPlayerSeed extends bfDataRequest {
  constructor(pAsTD = false) { super("compseeds", { "asTD": pAsTD }); }
  /** @returns {dbnCompetitionPlayerSeed[]} */
  ResponseToObjects() { return super.ResponseToObjects(() => new dbnCompetitionPlayerSeed()); }
}

class dbnCompetitionPlayerSchedule { PlayerID; PlayerName; CompetitionID; CompetitionName; Round; BidsLocked; }
class dbnHubRequest_CompetitionPlayerSchedule extends bfDataRequest {
  constructor(pAsTD = false) { super("compschedule", { "asTD": pAsTD }); }
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

class dbnCompetition { CompetitionID; CompetitionName; }
class dbnHubRequest_Competitions extends bfDataRequest {
  constructor(compids) {
    super("competitions", { "compids": compids });
  }
}

//#endregion

//#region Player

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

class dbnPlayerSelector extends dbnSelect {

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

  /** @type {number} */
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
    this.DBNIYear = parseInt(json.DBNIYear);

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
