
//#region DataRequest classes

class bfDataRequest {
  constructor(key, parameters) { this.Key = key; this.Parameters = parameters; }

  Key = null;
  Parameters = {};

  Success;
  Message;
  ResponseContent;

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
}

class bfDataRequestList {
  constructor(url) { this.Url = url; }

  Url;
  Requests = Array.from(Array(0), x => new bfDataRequest());

  ErrorMessage;

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
    req.send(this.MakeFormData());

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

  MakeRequestList() { return new bfDataRequestList("https://diplobn.com/wp-content/plugins/DBNAnalytics/hubget.php"); }

  #players = Array.from(Array(0), x => new dbnPlayer());
  get Players() {
    if (this.#players.length = []) {
      var req = new dbnHubRequest_Players();
      req.SendAlone();
      this.#players = req.ResponseToPlayers();
    }
    return this.#players;
  }

  GetGamesForPlayers(player1id, player2id = null) {
    var vals = { "p1": player1id };
    if (player2id != null) vals["p2"] = player2id;

    var req = new bfDataRequest("games", vals);
    req.SendAlone();

    if (!req.Success) return null;

    var games = req.ResponseContent.map(x => new dbnGame(x));

    return games;
  }
}
var myHub = new dbnHub();

//#endregion

//#region Misc DataRequest classes

class dbnHubRequest_Bids extends bfDataRequest { constructor(token) { super("bids", { "token": token }); } }
class dbnHubRequest_DBNISchedule extends bfDataRequest { constructor(token) { super("dbnischedule", { "token": token }); } }

class dbnHubRequest_Competitions extends bfDataRequest {
  constructor(compids, token) {
    super("competitions", { "compids": compids, "token": token });
  }
}

//#endregion

//#region Player

class dbnPlayer {
  constructor(playerid, playername) { this.PlayerID = parseInt(playerid); this.PlayerName = playername; }
  PlayerID = null;
  PlayerName = null;
  toString() { return "{Player " + this.PlayerID + ": " + this.PlayerName + "}"; }
}

class dbnHubRequest_Players extends bfDataRequest {
  constructor(token = null) { super("players", { "token": token }); }

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

class dbnPlayerSelector extends dbnElement {

  constructor(parent = null) {
    super(document.createElement("select"), parent);
    this.LoadPlayers();
  }

  get SelectedPlayer() {
    var i = this.domelement.value;
    if (i == null) return null;
    return myHub.Players.find(x => x.PlayerID == i);
  }

  LoadPlayers() {
    var optionNull = document.createElement("option");
    optionNull.text = "(none)";
    optionNull.value = null;
    this.domelement.add(optionNull);

    myHub.Players.forEach(x => {
      var option = document.createElement("option");
      option.text = x.PlayerName;
      option.value = x.PlayerID;
      this.domelement.add(option);
    }
    );
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

}

class dbnGameResultLine {

  Country = null;
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
    this.Player = { PlayerID: parseInt(json.Player.PlayerID), PlayerName: json.Player.PlayerName };
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
