
//#region Common

class dbnElement {

    domelement = null;

    constructor(pDomElement, parent = null) {
        if (typeof pDomElement == "string") pDomElement = document.createElement(pDomElement);
        this.domelement = pDomElement;
        if (parent != null) {
            if (parent instanceof dbnElement) {
                parent.domelement.appendChild(this.domelement);
            } else {
                parent.appendChild(this.domelement);
            }
        }
    }

    get onchange() { return this.domelement.onchange; }
    set onchange(value) { this.domelement.onchange = value; }

    get id() { return this.domelement.id; }
    set id(value) { this.domelement.id = value; }

    get className() { return this.domelement.className; }
    set className(value) { this.domelement.className = value; }

    get style() { return this.domelement.style; }
    set style(value) { this.domelement.style = value; }

    get id() { return this.domelement.id; }
    set id(value) { this.domelement.id = value; }

    get innerHTML() { return this.domelement.innerHTML; }
    set innerHTML(value) { this.domelement.innerHTML = value; }

    appendChild(element) { this.domelement.appendChild(element instanceof dbnElement ? element.domelement : element); }
    createAndAppendElement(tagname) { var ret = new dbnElement(document.createElement(tagname)); this.appendChild(ret); return ret; }

    addDiv() { var ret = new dbnDiv(this); return ret; }
    addCard() { var ret = new dbnCard(this); return ret; }
    addText(text) { var ret = new dbnText(text, this); return ret; }

    addButton(text, onclick = null, className = null) { var ret = new dbnButton(text, onclick, className, this); return ret; }
    addTable() { var ret = new dbnTable(this); return ret; }

    addLineBreak() { var ret = new dbnElement("br", this); return ret; }
    addSpan() { var ret = new dbnSpan(this); return ret; }
}

class dbnScriptParent extends dbnElement {
    constructor() {
        super(document.currentScript.parentElement);
    }
}
function dbnHere() { return new dbnScriptParent(); }

class dbnDiv extends dbnElement {
    constructor(parent = null) {
        super(document.createElement("div"), parent);
    }
}

class dbnSpan extends dbnElement {
    constructor(parent = null) {
        super(document.createElement("span"), parent);
    }
}

class dbnCard extends dbnDiv {
    constructor(parent = null) {
        super(parent);
        this.className = "bfcard";
    }
}

class dbnLink extends dbnElement {
    constructor(parent = null) {
        super(document.createElement("a"), parent);
    }

    get href() { return this.domelement.href; }
    set href(value) { this.domelement.href = value; }

    get openInNewWindow() { return this.domelement.target == "_blank"; }
    set openInNewWindow(value) { this.domelement.target = value ? "_blank" : "_self"; }

    checkForExternal() {
        var isexternal = this.href.substring(0, 4).toLowerCase() == "http" && !this.href.toLowerCase().includes("diplobn.com");

        if (isexternal) {
            var icon = new dbnElement('i');
            icon.className = "fa fa-external-link";
            icon.domelement.setAttribute("aria-hidden", "true");

            this.openInNewWindow = true;
            this.addText(" ");
            this.appendChild(icon);
        }
    }
}

class dbnText extends dbnElement {
    constructor(text, parent = null) {
        super(document.createTextNode(text), parent);
    }

}

class dbnButton extends dbnElement {
    constructor(text, onclick, className, parent = null) {
        super(document.createElement("button"), parent);
        this.addText(text);
        this.onclick = onclick;
        this.className = className;
    }

    get onclick() { return this.domelement.onclick; }
    set onclick(value) { this.domelement.onclick = value; }
}

//#endregion

//#region Tabs

class dbnTabs extends dbnCard {

    divButtons = null;
    divContent = null;

    Tabs = {};
    Buttons = {};

    constructor(parent = null) {
        super(parent);

        this.divButtons = this.addDiv();
        this.divButtons.className = "bftab";

        this.divContent = this.addDiv();
    }

    addTab(key, content) {

        if (content == null) content = "(null)";
        if (content instanceof dbnElement) content = content.domelement;

        var tab;
        if (content instanceof HTMLElement) {
            if (content.tagName != null && content.tagName.toLowerCase() == "div") {
                tab = content;
            } else {
                var tab = document.createElement("div");
                tab.appendChild(content);
            }
        } else {
            var tab = document.createElement("div");
            tab.innerHTML = content;
        }

        //tab will be a div object by this point
        tab.className = "bftabcontent";
        tab.style.display = 'none';
        this.divContent.appendChild(tab);

        var btn = document.createElement("button");
        btn.className = "bftablinks";
        btn.innerHTML = key;
        btn.onclick = (e) => this.SelectTab(key);

        this.Buttons[key] = btn;
        this.divButtons.appendChild(btn);

        this.Tabs[key] = tab;
    }

    addTabs(dict) {
        for (const key in dict) {
            if (Object.hasOwnProperty.call(dict, key)) {
                const element = dict[key];
                this.addTab(key, element);
            }
        }
    }

    SelectTab(clickedkey) {
        for (const key in this.Tabs) {
            const tab = this.Tabs[key];
            const button = this.Buttons[key];
            if (key == clickedkey) {
                tab.style.display = 'block';
                button.className += ' active';
            } else {
                tab.style.display = 'none';
                button.className = button.className.replace(' active', '');
            }
        }
    }

    SelectTabByIndex(index) {
        var i = 0;
        for (const key in this.Tabs) {
            if (i == index) {
                this.SelectTab(key);
                return;
            }
            i++;
        }
    }
}

//#endregion

//#region Tables

class dbnRow {
    Values = null;
    Country = null;
    Url = null;
    Highlighted = false;
    CellCountries = null;
    CellUrls = null;
    CellClasses = null;
}

class dbnTable extends dbnElement {

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

    CellClasses = null;

    #rows = null;
    #lastSortIndex = null;
    #lastSortAscending = false;

    constructor(parent = null) {
        super(document.createElement("table"), typeof parent == "string" ? null : parent); //The string test on parent is necessary for legacy purposes (the old version required a variable name to be passed).  CustomHTML pages might still use it.
        this.domelement.dbnTable = this;
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

            if (this.CellClasses != null) {
                this.CellClasses.forEach(rcc => {
                    if (rcc.length >= 3) {
                        var row = rows[rcc[0]];
                        if (row.CellClasses == null) row.CellClasses = {};
                        row.CellClasses[rcc[1]] = rcc[2];
                    }
                });
            }

            this.#rows = rows;
        }
    }

    Generate() {

        this.EnsureRows();

        var table = this.domelement;
        table.innerHTML = null;
        table.className = "bftable";

        var thead = table.createTHead();
        var tbody = table.createTBody();

        var titleCell = null;
        if (this.Title != null) {
            var row = thead.insertRow();
            row.className = "bftableTitleRow";
            titleCell = document.createElement("th");
            row.appendChild(titleCell);

            if (this.Title instanceof dbnElement) {
                titleCell.appendChild(this.Title.domelement);
            } else {
                titleCell.innerHTML = this.Title;
            }
        }

        var colcount = 0;

        if (this.Headers != null) {
            row = thead.insertRow();
            row.className = "bftableHeaderRow";
            var iCol = 0;
            for (var hh of this.Headers) {
                var cell = document.createElement("th");
                row.appendChild(cell);

                if (hh instanceof dbnElement) {
                    cell.appendChild(hh.domelement);
                } else {
                    cell.innerHTML = hh;
                }

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
                if (cc instanceof dbnElement) {
                    cell.appendChild(cc.domelement);
                } else {
                    cell.innerHTML = cc;
                }
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

            if (rr.CellClasses != null) {
                for (iCol in rr.CellClasses) {
                    if (iCol < row.children.length) row.children[iCol].className += rr.CellClasses[iCol];
                }
            }

            if (rr.Country != null) row.className += " bf" + rr.Country + "Back";

            if (rr.CellUrls != null) {
                for (iCol in rr.CellUrls) {
                    if (iCol < row.children.length) {
                        var url = rr.CellUrls[iCol];
                        var link = new dbnLink();
                        link.href = url;
                        link.innerHTML = row.children[iCol].innerHTML;
                        link.checkForExternal();
                        row.children[iCol].innerHTML = null;
                        row.children[iCol].appendChild(link.domelement);
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
