//To Do:
//Replace dbnTable with dbnTable2 
//Move tabs to a class

//#region Common

class dbnElement {

  element = null;

  constructor(pElement, parent = null) {
    this.element = pElement;
    if (parent == null) {
      var scripttag = document.currentScript;
      scripttag.parentElement.insertBefore(this.element, scripttag);
    } else {
      if (parent instanceof dbnElement) {
        parent.element.appendChild(this.element);
      } else {
        parent.appendChild(this.element);
      }
    }
  }

  get onchange() { return this.element.onchange; }
  set onchange(value) { this.element.onchange = value; }

  get class() { return this.element.class; }
  set class(value) { this.element.class = value; }

  get style() { return this.element.style; }
  set style(value) { this.element.style = value; }

  appendChild(element) { this.element.appendChild(element instanceof dbnElement ? element.element : element); }
  createAndAppendElement(tagname) { var ret = new dbnElement(document.createElement(tagname)); this.appendChild(ret); return ret; }
  createAndAppendText(text) { var ret = new dbnText(text, this); return ret; }
}

class dbnDiv extends dbnElement {
  constructor(parent = null) {
    super(document.createElement("div"), parent);
  }
}

class dbnCard extends dbnDiv {
  constructor(parent = null) {
    super(parent);
    this.element.className = "bfcard";
  }
}

class dbnText extends dbnElement {
  constructor(text, parent = null) {
    super(document.createTextNode(text), parent);
  }

}

//#endregion

//#region Data hub

class dbnHub {

  hubget(src, vals = null) {
    // let responsex = await fetch("https://diplobn.com/wp-content/plugins/DBNAnalytics/hubget.php?src=" + src);
    // //console.log("I'm coming");
    // //responsex.then(response => response.json()).then(data => console.log(data));
    // let data = await responsex.text();

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
    var i = this.element.value;
    if (i == null) return null;
    return myHub.Players.find(x => x.PlayerID == i);
  }

  LoadPlayers() {
    var optionNull = document.createElement("option");
    optionNull.text = "(none)";
    optionNull.value = null;
    this.element.add(optionNull);

    myHub.Players.forEach(x => {
      var option = document.createElement("option");
      option.text = x.PlayerName;
      option.value = x.PlayerID;
      this.element.add(option);
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

//#region Tabs

function bfTabsSetup(divcase, tabs) {
  var divbtns = document.createElement("div");
  divcase.appendChild(divbtns);
  divbtns.className = "bftab";

  var i = 0;
  for (var key in tabs) {
    var content = tabs[key];
    if (content == null) content = "(null)";
    var tab;
    if (content.tagName != null && content.tagName.toLowerCase() == "div") {
      tab = content;
    } else {
      var tab = document.createElement("div");
      tab.innerHTML = content;
      tab.id = "bfcontent" + i;
    }
    tab.className = "bftabcontent";
    divcase.appendChild(tab);

    var btn = document.createElement("button");
    btn.className = "bftablinks";
    btn.innerHTML = key;
    btn.id = divcase.id + "Button" + i;
    btn.setAttribute("onclick", "bfTabsOpenContent(event, '" + divcase.id + "','" + tab.id + "')");
    divbtns.appendChild(btn);

    i++;
  }
}

function bfTabsOpenContent(evt, divcasename, divname) {
  var i,
    tabcontent,
    tablinks;
  var divcase = document.getElementById(divcasename);

  tabcontent = divcase.getElementsByClassName('bftabcontent');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  tablinks = divcase.getElementsByClassName('bftablinks');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(divname).style.display = 'block';
  evt.currentTarget.className += ' active';
}

function bfTabsOpenContentByIndex(divcasename, index) {
  document.getElementById(divcasename + 'Button' + index).click();
}

//#endregion

//#region Tables

class dbnRow {
  Values = null;
  Country = null;
  Url = null;
  Highlighted = false;
  CellCountries = null;
}

class dbnTable {

  Data = null;
  Headers = null;
  Title = null;
  ClickHeaderToSort = false;

  NumberColumns = null;
  HighlightedRows = null;

  CountryColumns = null;
  CountryRows = null;
  CountryCells = null;

  RowUrls = null;

  #tag = null;
  #rows = null;
  #variableName = null;
  #lastSortIndex = null;
  #lastSortAscending = false;

  constructor(variablename) {
    this.#variableName = variablename;
    var scripttag = document.currentScript;
    this.#tag = scripttag.parentElement.insertBefore(document.createElement("table"), scripttag);
  }

  EnsureRows() {
    if (this.#rows == null) {
      var rows = [];
      var iRow = 0;
      for (var rr of this.Data) {
        var row = new dbnRow();
        row.Values = rr;

        if (this.CountryRows != null && this.CountryRows[iRow] != null) row.Country = this.CountryRows[iRow];
        if (this.RowUrls != null && this.RowUrls[iRow] != null) row.Url = this.RowUrls[iRow];
        if (this.HighlightedRows != null && this.HighlightedRows.includes(iRow)) row.Highlighted = true;

        iRow++;
        rows.push(row);
      }

      if (this.CountryCells != null) {
        this.CountryCells.forEach(rcc => {
          if (rcc.length >= 3) {
            var row = rows[rcc[0]];
            if (row.CellCountries == null) row.CellCountries = {};
            row.CellCountries[rcc[1]] = rcc[2];
            console.log(JSON.stringify(row.CellCountries));
          }
        });
      }

      this.#rows = rows;
    }
  }

  Generate() {

    this.EnsureRows();

    var table = this.#tag;
    table.innerHTML = null;
    table.className = "bftable";

    var thead = table.createTHead();
    var tbody = table.createTBody();

    var titleCell = null;
    if (this.Title != null) {
      var row = thead.insertRow();
      row.className = "bftableTitleRow";
      titleCell = document.createElement("th");
      titleCell.innerHTML = this.Title;
      row.appendChild(titleCell);
    }

    var colcount = 0;

    if (this.Headers != null) {
      row = thead.insertRow();
      row.className = "bftableHeaderRow";
      var iCol = 0;
      for (var hh of this.Headers) {
        var cell = document.createElement("th");
        row.appendChild(cell);
        cell.innerHTML = hh;
        if (this.ClickHeaderToSort) {
          cell.setAttribute("onclick", this.#variableName + ".SortAndGenerate(" + iCol + ")");
          cell.className += " clickable";
          if (iCol == (this.#lastSortIndex ?? -1)) {
            //cell.innerHTML += this.#lastSortAscending ? "&uarr;" : "&darr;";
            cell.innerHTML += this.#lastSortAscending ? "&#9650;" : "&#9660;";
          }
        }
        iCol++;
      }
      if (row.childElementCount > colcount) colcount = row.childElementCount;
    }

    for (var rr of this.#rows) {
      row = tbody.insertRow();

      for (var cc of rr.Values) {
        var cell = row.insertCell();
        cell.innerHTML = cc;
      }
      if (row.childElementCount > colcount) colcount = row.childElementCount;

      if (this.NumberColumns != null) {
        for (const i of this.NumberColumns) {
          if (i < row.children.length) row.children[i].className += " bfnumcolumn";
        }
      }

      if (this.CountryColumns != null) {
        for (var i in this.CountryColumns) {
          if (i < row.children.length) row.children[i].className += " bf" + this.CountryColumns[i] + "Back";
        }
      }

      if (rr.CellCountries != null) {
        for (iCol in rr.CellCountries) {
          if (iCol < row.children.length) row.children[iCol].className += " bf" + rr.CellCountries[iCol] + "Back";
        }
      }

      if (rr.Country != null) row.className += " bf" + rr.Country + "Back";

      if (rr.Url != null) {
        row.className += " bfTest";
        row.setAttribute("onclick", " document.location = '" + rr.Url + "'");
      }

      if (rr.Highlighted) {
        row.className += " bftableRowHighlight";
      }

    }

    if (titleCell != null) titleCell.colSpan = colcount;

  }

  Sort(bycolumnindex) {
    this.EnsureRows();

    if ((this.#lastSortIndex ?? -1) == bycolumnindex) {
      this.#lastSortAscending = !this.#lastSortAscending;
    } else {
      this.#lastSortIndex = bycolumnindex;
      this.#lastSortAscending = true;
    }

    var sgn = this.#lastSortAscending ? 1 : -1;

    this.#rows.sort(function (a, b) {
      var va = a.Values[bycolumnindex] ?? "";
      var vb = b.Values[bycolumnindex] ?? "";

      if (isNaN(va) || isNaN(vb)) {

        if (va.substring(va.length - 1, va.length) == "%") {
          var aa = va.substring(0, va.length - 1);
          var bb = vb.substring(0, vb.length - 1);
          return sgn * (Number(aa) - Number(bb));
        }
        let x = va.toLowerCase();
        let y = vb.toLowerCase();
        if (x < y) return sgn * -1;
        if (x > y) return sgn * 1;
        return 0;
      } else {
        return sgn * (va - vb);
      }
    });
  }

  SortAndGenerate(bycolumnindex) {
    this.Sort(bycolumnindex);
    this.Generate();
  }

}

class dbnTable2 extends dbnElement {

  Data = null;
  Headers = null;
  Title = null;
  ClickHeaderToSort = false;

  NumberColumns = null;
  HighlightedRows = null;

  CountryColumns = null;
  CountryRows = null;
  CountryCells = null;

  RowUrls = null;
  CellUrls = null;

  #rows = null;
  #lastSortIndex = null;
  #lastSortAscending = false;

  constructor(parent = null) {
    super(document.createElement("table"), parent);
    this.element.dbnTable = this;
  }

  EnsureRows() {
    if (this.#rows == null) {
      var rows = [];
      var iRow = 0;
      for (var rr of this.Data) {
        var row = new dbnRow();
        row.Values = rr;

        if (this.CountryRows != null && this.CountryRows[iRow] != null) row.Country = this.CountryRows[iRow];
        if (this.RowUrls != null && this.RowUrls[iRow] != null) row.Url = this.RowUrls[iRow];
        if (this.HighlightedRows != null && this.HighlightedRows.includes(iRow)) row.Highlighted = true;

        iRow++;
        rows.push(row);
      }

      if (this.CountryCells != null) {
        this.CountryCells.forEach(rcc => {
          if (rcc.length >= 3) {
            var row = rows[rcc[0]];
            if (row.CellCountries == null) row.CellCountries = {};
            row.CellCountries[rcc[1]] = rcc[2];
          }
        });
      }

      if (this.CellUrls != null) {
        this.CellUrls.forEach(rcc => {
          if (rcc.length >= 3) {
            var row = rows[rcc[0]];
            if (row.CellUrls == null) row.CellUrls = {};
            row.CellUrls[rcc[1]] = rcc[2];
          }
        });
      }

      this.#rows = rows;
    }
  }

  Generate() {

    this.EnsureRows();

    var table = this.element;
    table.innerHTML = null;
    table.className = "bftable";

    var thead = table.createTHead();
    var tbody = table.createTBody();

    var titleCell = null;
    if (this.Title != null) {
      var row = thead.insertRow();
      row.className = "bftableTitleRow";
      titleCell = document.createElement("th");
      titleCell.innerHTML = this.Title;
      row.appendChild(titleCell);
    }

    var colcount = 0;

    if (this.Headers != null) {
      row = thead.insertRow();
      row.className = "bftableHeaderRow";
      var iCol = 0;
      for (var hh of this.Headers) {
        var cell = document.createElement("th");
        row.appendChild(cell);
        cell.innerHTML = hh;
        if (this.ClickHeaderToSort) {
          cell.ColumnIndex = iCol;
          cell.onclick = (ee) => ee.currentTarget.parentElement.parentElement.parentElement.dbnTable.SortAndGenerate(ee.currentTarget.ColumnIndex);
          //cell.setAttribute("onclick", this.#variableName + ".SortAndGenerate(" + iCol + ")");
          cell.className += " clickable";
          if (iCol == (this.#lastSortIndex ?? -1)) {
            //cell.innerHTML += this.#lastSortAscending ? "&uarr;" : "&darr;";
            cell.innerHTML += this.#lastSortAscending ? "&#9650;" : "&#9660;";
          }
        }
        iCol++;
      }
      if (row.childElementCount > colcount) colcount = row.childElementCount;
    }

    for (var rr of this.#rows) {
      row = tbody.insertRow();

      for (var cc of rr.Values) {
        var cell = row.insertCell();
        cell.innerHTML = cc;
      }
      if (row.childElementCount > colcount) colcount = row.childElementCount;

      if (this.NumberColumns != null) {
        for (const i of this.NumberColumns) {
          if (i < row.children.length) row.children[i].className += " bfnumcolumn";
        }
      }

      if (this.CountryColumns != null) {
        for (var i in this.CountryColumns) {
          if (i < row.children.length) row.children[i].className += " bf" + this.CountryColumns[i] + "Back";
        }
      }

      if (rr.CellCountries != null) {
        for (iCol in rr.CellCountries) {
          if (iCol < row.children.length) row.children[iCol].className += " bf" + rr.CellCountries[iCol] + "Back";
        }
      }

      if (rr.Country != null) row.className += " bf" + rr.Country + "Back";

      if (rr.CellUrls != null) {
        for (iCol in rr.CellUrls) {
          if (iCol < row.children.length) {
            var url = rr.CellUrls[iCol];
            var launch = url.substring(0, 4).toLowerCase() == "http" && !url.toLowerCase().includes("diplobn.com");
            var ss = "<a href='" + url + "'" + (launch ? " target ='_blank'" : "") + ">" + row.children[iCol].innerHTML;
            ss += launch ? ' <i class="fa fa-external-link" aria-hidden="true"></i>' : '';
            ss += "</a>";
            row.children[iCol].innerHTML = ss;
          }
        }
      }

      if (rr.Url != null) {
        row.className += " bfTest";
        row.setAttribute("onclick", " document.location = '" + rr.Url + "'");
      }

      if (rr.Highlighted) {
        row.className += " bftableRowHighlight";
      }

    }

    if (titleCell != null) titleCell.colSpan = colcount;

  }

  Sort(bycolumnindex) {
    this.EnsureRows();

    if ((this.#lastSortIndex ?? -1) == bycolumnindex) {
      this.#lastSortAscending = !this.#lastSortAscending;
    } else {
      this.#lastSortIndex = bycolumnindex;
      this.#lastSortAscending = true;
    }

    var sgn = this.#lastSortAscending ? 1 : -1;

    this.#rows.sort(function (a, b) {
      var va = a.Values[bycolumnindex] ?? "";
      var vb = b.Values[bycolumnindex] ?? "";

      if (isNaN(va) || isNaN(vb)) {

        if (va.substring(va.length - 1, va.length) == "%") {
          var aa = va.substring(0, va.length - 1);
          var bb = vb.substring(0, vb.length - 1);
          return sgn * (Number(aa) - Number(bb));
        }
        let x = va.toLowerCase();
        let y = vb.toLowerCase();
        if (x < y) return sgn * -1;
        if (x > y) return sgn * 1;
        return 0;
      } else {
        return sgn * (va - vb);
      }
    });
  }

  SortAndGenerate(bycolumnindex) {
    this.Sort(bycolumnindex);
    this.Generate();
  }

}

//#endregion