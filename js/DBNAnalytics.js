
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

//var myHub = new dbnHub();

class dbnHub {

  _players = null;
  get Players() {
    if (this._players == null) {

    }
    return this._players;
  }
}

class dbnPlayer {
  PlayerID = null;
  PlayerName = null;
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

//#endregion