
//#region Common

class dbnElement {

  element = null;

  constructor(pElement, parent = null) {
    this.element = pElement;
    if (parent == null) {
      var scripttag = document.currentScript;
      scripttag.parentElement.insertBefore(this.element, scripttag);
    } else {
      parent.appendChild(this.element);
    }
  }

  get onchange() { return this.element.onchange; }
  set onchange(value) { this.element.onchange = value; }
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

    if (response == null || response.success == false) return null;

    var games = response.data.map(x => {
      var game = new dbnGame(x[0]);
      game.Label = x[1];
      game.EndDate = x[2];
      game.CompetitionName = x[3];
      return game;
    });

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
  constructor(gameid) { this.GameID = parseInt(gameid); }
  GameID = null;
  Label = null;
  EndDate = null;
  CompetitionName = null;
  toString() { return "{Game " + this.GameID + ": " + this.Label + "}"; }
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
            //console.log(JSON.stringify(row.CellCountries));
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