
//#region Data hub

class hubrequest {
  constructor(key) { Key = key; }
  Key = null;
  Parameters = {};

  Success;
  Response;

  MakeRequestJSON() {
    var ret = {};
    ret.Key = Key;
    ret.Parameters = this.Parameters;
    return ret;
  }
}

class dbnHub {

  hubget(src, vals = null) {
    var data = null;

    var req = new XMLHttpRequest();
    var url = "https://diplobn.com/wp-content/plugins/DBNAnalytics/hubget.php?src=" + src;
    if (vals != null) {
      for (const key in vals) {
        url += "&" + key + "=" + vals[key];
      }
    }
    req.open('GET', url, false);
    req.send(null);
    if (req.status == 200 && req.responseText != "nope") data = JSON.parse(req.responseText);
    return data;
  }

  hubgetNEW(requests) {
    var data = null;

    var req = new XMLHttpRequest();
    var url = "https://diplobn.com/wp-content/plugins/DBNAnalytics/hubget.php";

    var data = requests.map(x => x.MakeRequestJSON());
    var fd = new FormData();
    fd.append("requests", JSON.stringify(data));

    XHR.open('POST', url, false); //false for not-async
    XHR.send(fd);

    if (req.status == 200 && req.responseText != "nope") data = JSON.parse(req.responseText);

    var ret = Array.from(Array(0), x => new hubrequest());
    requests.forEach(x => ret.push(x));

    return ret;
  }

  #players = null;
  get Players() {
    if (this.#players == null) {
      var response = this.hubget('p');
      var data = response.data;
      var pps = data.map(x => new dbnPlayer(x[0], x[1]));
      pps.sort((a, b) => {
        var aa = a.PlayerName.toLowerCase(); var bb = b.PlayerName.toLowerCase();
        return aa > bb ? 1 : (aa < bb ? -1 : 0);
      });
      this.#players = pps;
    }
    return this.#players;
  }

  GetGamesForPlayers(player1id, player2id = null) {
    var vals = { "p1": player1id };
    if (player2id != null) vals["p2"] = player2id;
    var response = this.hubget("pc", vals);

    if (response == null) return null;

    var games = response.map(x => new dbnGame(x));

    return games;
  }
}
var myHub = new dbnHub();

//#endregion

//#region Player

class dbnPlayer {
  constructor(playerid, playername) { this.PlayerID = parseInt(playerid); this.PlayerName = playername; }
  PlayerID = null;
  PlayerName = null;
  toString() { return "{Player " + this.PlayerID + ": " + this.PlayerName + "}"; }
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
