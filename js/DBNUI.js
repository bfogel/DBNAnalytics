"use strict";

/* to do: 
    - dbnTable: Replace style properties with registration functions.  Current requires too much insider knowledge
*/

//#region Common

class dbnElement {

    /** @type {HTMLElement} */
    domelement = null;

    /**
     * @param {string | HTMLElement} pDomElement 
     * @param {dbnElement | HTMLElement | null} parent 
     */
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
    get onclick() { return this.domelement.onclick; }
    set onclick(value) { this.domelement.onclick = value; }
    get onfocus() { return this.domelement.onfocus; }
    set onfocus(value) { this.domelement.onfocus = value; }
    get onblur() { return this.domelement.onblur; }
    set onblur(value) { this.domelement.onblur = value; }

    get id() { return this.domelement.id; }
    set id(value) { this.domelement.id = value; }

    get className() { return this.domelement.className; }
    set className(value) { this.domelement.className = value ?? ""; }

    get style() { return this.domelement.style; }
    set style(value) { this.domelement.style = value; }

    get innerHTML() { return this.domelement.innerHTML; }
    set innerHTML(value) { this.domelement.innerHTML = value; }

    addRange(elements) { elements.forEach(x => this.add(x)); }
    appendChild(element) { this.domelement.appendChild(element instanceof dbnElement ? element.domelement : element); }
    createAndAppendElement(tagname) { var ret = new dbnElement(document.createElement(tagname)); this.appendChild(ret); return ret; }

    addText(text) { var ret = new dbnText(text, this); return ret; }

    /**
     * 
     * @param {string|dbnElement|HTMLElement} textOrElement 
     */
    add(textOrElement) {
        if (typeof textOrElement == "string") {
            this.addText(textOrElement);
        } else {
            this.appendChild(textOrElement);
        }
    }

    addDiv() { var ret = new dbnDiv(this); return ret; }
    addCard() { var ret = new dbnCard(this); return ret; }
    addTitleCard(title) { var ret = new dbnCard(this); var x = ret.createAndAppendElement("h1"); x.addText(title); return ret; }
    addSpan() { var ret = new dbnSpan(this); return ret; }

    addTabs() { var ret = new dbnTabs(this); return ret; }

    addLink() { var ret = new dbnLink(this); return ret; }

    addButton(text, onclick = null, className = null) { var ret = new dbnButton(text, onclick, className, this); return ret; }
    addButtonBar() { var ret = new dbnButtonBar(this); return ret; }
    addTable() { var ret = new dbnTable(this); return ret; }

    /**
     * @param {boolean} ordered 
     * @returns 
     */
    addList(ordered) { var ret = new dbnList(ordered, this); return ret; }
    addNavList() { var ret = new dbnList(false, this); ret.className = "dbnNavList"; return ret; }
    addSelect() { var ret = new dbnSelect(this); return ret; }

    addLineBreak() { var ret = new dbnElement("br", this); return ret; }
    addHardRule() { var ret = new dbnElement("hr", this); return ret; }

    addParagraph() { var ret = new dbnElement("p", this); return ret; }
    addBoldText(text) { var ret = new dbnElement("b", this); ret.addText(text); return ret; }
    addItalicText(text) { var ret = new dbnElement("i", this); ret.addText(text); return ret; }

    /**
     * adds an <H_> element
     * @param {number} level 
     * @param {string} text 
     * @returns 
     */
    addHeading(level, text) { var ret = new dbnElement("h" + level, this); ret.addText(text); return ret; }
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

    /** @type{Text} */
    get #DOMElementAsText() { return document.domelement; }

    get Text() { return this.#DOMElementAsText.textContent; }
    set Text(value) { this.#DOMElementAsText.textContent = value; }
}

//#endregion

//#region Icons

class dbnIcon_TimesCircle extends dbnElement {
    constructor() {
        super("i");
        this.className = "fa fa-times-circle";
    }
}
//#endregion

//#region dbnUIHub

class dbnUIHub {

    constructor() {
        document.addEventListener("click", (function (e) {
            this.CloseAllPopUps(e.target);
        }).bind(this));

    }

    /** @type{HTMLElement[]} */
    #RegisteredPopUps = [];

    /**
     * @param {dbnElement} element 
     */
    RegisterPopUp(element) {
        this.#RegisteredPopUps.push(element.domelement);
    }

    /**
     * @param {HTMLElement} except 
     */
    CloseAllPopUps(except) {
        var popups = this.#RegisteredPopUps.filter(x => {
            if (x == except || (except != null && x.parentNode == except.parentNode)) {
                return true;
            } else {
                x.parentNode.removeChild(x);
                return false;
            }
        });
        this.#RegisteredPopUps = popups;
    }
}

var myUIHub = new dbnUIHub();

//#endregion

//#region Buttons

class dbnButton extends dbnElement {
    constructor(textOrElement, onclick = null, className = null, parent = null) {
        super(document.createElement("button"), parent);
        this.add(textOrElement);
        this.onclick = onclick;
        this.className = className;
    }

    /** @type {function} */
    get onclick() { return this.domelement.onclick; }
    set onclick(value) { this.domelement.onclick = value; }

    /** @type {boolean} */
    get disabled() { return this.domelement.disabled; }
    set disabled(value) {
        this.domelement.disabled = value;
        if (this.className == null) this.className = "";
        this.className = this.className.replace(" dbnDisabled", "");
        if (value) this.className += " dbnDisabled";
    }
}

class dbnFlatButton extends dbnButton {
    constructor(textOrElement, onclick = null, parent = null) { super(textOrElement, onclick, "dbnFlatButton", parent); }
}

class dbnButtonBar extends dbnDiv {
    constructor(parent = null) {
        super(parent);
        this.className = "dbnButtonBar";
    }

    get Compact() { return this.className.includes("dbnButtonBarCompact"); }
    set Compact(value) {
        if (this.Compact & !value) {
            this.className = this.className.replace("dbnButtonBarCompact", "");
        } else if (!this.Compact & value) {
            this.className += " dbnButtonBarCompact";
        }
    }

    AddButton(text, onclick) {
        return this.addButton(text, onclick);
    }
}

//#endregion

//#region Lists

class dbnListItem {
    /**@type{string} */
    Display;
    Value;

    /**
     * @param {string} display 
     * @param {any} value 
     */
    constructor(display, value) { this.Display = display; this.Value = value; }
}

class dbnList extends dbnElement {
    constructor(ordered = true, parent = null) {
        super(ordered ? "ol" : "ul", parent);
    }

    /**
     * 
     * @param {string|dbnElement|HTMLElement} textOrElement 
     * @returns 
     */
    AddItem(textOrElement) {
        var ret = this.createAndAppendElement("li");
        ret.add(textOrElement);
        return ret;
    }
}

//#endregion

//#region Inputs

class dbnInput extends dbnElement {
    constructor() {
        super("input");
    }

    get oninput() { return this.domelement.oninput; }
    set oninput(value) { this.domelement.oninput = value; }

    get value() { return this.domelement.value; }
    set value(value) { this.domelement.value = value; }

    get placeholder() { return this.domelement.placeholder; }
    set placeholder(value) { this.domelement.placeholder = value; }
}

class dbnDropdownWithDataList extends dbnDiv {

    static NextID = 1;

    constructor() {
        super();

        this.#myID = dbnDropdownWithDataList.NextID;
        dbnDropdownWithDataList.NextID++;

        this.add(this.#input);
        this.#datalist = this.createAndAppendElement("datalist");
        this.#datalist.id = "DropdownDataList" + this.#myID;

        this.#input.domelement.setAttribute("list", this.#datalist.id);

        this.#input.oninput = this.#OnInput.bind(this);
        // this.#input.onfocus = this.#OnFocus.bind(this);
        // this.#input.onblur = this.#OnBlur.bind(this);
    }

    #myID = 0;

    bLeft = true;

    OnItemSelected = new dbnEvent();

    get placeholder() { return this.#input.placeholder; }
    set placeholder(value) { this.#input.placeholder = value; }

    /** @type{dbnListItem} */
    #SelectedItem;
    get SelectedItem() { return this.#SelectedItem; }
    set SelectedItem(value) {
        this.#SelectedItem = value;
        this.#input.value = value?.Display;
        this.OnItemSelected.Raise();
    }

    /** @type{dbnElement} */
    #datalist;
    #input = new dbnInput();

    /** @type{dbnListItem[]} */
    Items = [];

    /**
     * @param {string} display 
     * @param {string} value 
     */
    AddItem(display, value) {
        this.Items.push(new dbnListItem(display, value));
        var option = this.#datalist.createAndAppendElement("option");
        option.value = value;
        option.addText(display);
    }

    #OnInput() {
        var val = this.#input.value;

        for (const x of this.Items) {
            if (x.Value == val) {
                this.SelectedItem = x;
                return;
            }

        }
        // this.Items.forEach(x => {
        //     if (x.Value == val) {
        //         this.SelectedItem = x;
        //         return;
        //     }
        // });

        //this.SelectedItem = null;
    }

    #OnBlur() {
        var inp = document.getElementById("browser");

        inp.value = myOption == null ? null : inp.value;
        bLeft = true;
    }

    #OnFocus() {
        var inp = document.getElementById("browser");
        //inp.select();
    }


    #OnClick() {
        var inp = document.getElementById("browser");
        console.log("Selection: " + inp.selectionStart + " to " + inp.selectionEnd);
        if (bLeft && inp.selectionStart == inp.selectionEnd) inp.select();
        bLeft = false;
    }
}

class dbnDropdownWithSearch extends dbnDiv {

    constructor() {
        super();
        this.className += " DropdownWithSearchList";
        this.add(this.#input);
        this.#input.oninput = this.#OnInput.bind(this);
        this.#input.domelement.addEventListener("keydown", this.#OnKeyDown.bind(this));
        this.#input.onclick = this.#OnClick.bind(this);
        this.#input.onblur = this.#OnBlur.bind(this);
    }

    OnItemSelected = new dbnEvent();

    get placeholder() { return this.#input.placeholder; }
    set placeholder(value) { this.#input.placeholder = value; }

    /** @type{dbnListItem} */
    #SelectedItem;
    get SelectedItem() { return this.#SelectedItem; }
    set SelectedItem(value) {
        this.#SelectedItem = value;
        this.#input.value = value?.Display ?? "";
        this.OnItemSelected.Raise();
        this.#LeftInput = true;
    }

    /** @type{dbnDiv} */
    #divList;
    #input = new dbnInput();
    #LeftInput = true;

    /** @type{dbnListItem[]} */
    Items = [];
    /** @type{dbnListItem[]} */
    #ListedItems = [];

    /**
     * @param {string} display 
     * @param {any} value 
     */
    AddItem(display, value) {
        this.Items.push(new dbnListItem(display, value));
    }

    #OnBlur() {
        this.#input.value = this.#SelectedItem ? this.#SelectedItem.Display : null;
        this.#LeftInput = true;
    }
    #OnClick() {
        if (this.#LeftInput && this.#input.domelement.selectionStart == this.#input.domelement.selectionEnd) this.#input.domelement.select();
        this.#LeftInput = false;
        this.#OnInput();
    }

    #OnInput() {
        myUIHub.CloseAllPopUps();

        var disp = this.#input.value.toLowerCase();
        this.#ListedItems = !disp ? this.Items.slice() : this.Items.filter(x => x.Display.toLowerCase().includes(disp));

        if (this.#ListedItems.length == 0) return;

        disp = disp.toLowerCase();

        this.#divList = new dbnDiv();
        this.#divList.className = "DropdownWithSearchList-items";
        this.add(this.#divList);
        myUIHub.RegisterPopUp(this.#divList);

        this.#ListedItems.forEach(x => {
            var item = new dbnDiv();

            var iStart = x.Display.toLowerCase().search(disp);
            var iEnd = iStart + disp.length - 1;
            if (iStart > 0) item.addText(x.Display.substring(0, iStart));
            item.addBoldText(x.Display.substring(iStart, iEnd + 1));
            if (iEnd < x.Display.length - 1) item.addText(x.Display.substring(iEnd + 1));

            item.domelement.addEventListener("click", (function (e) {
                this.SelectedItem = e;
            }).bind(this, x))
            this.#divList.appendChild(item);
        });

        this.#SelectedListIndex = 0;
        this.#UpdateSelected();
    }

    #SelectedListIndex = -1;

    #OnKeyDown(e) {
        if (e.keyCode == 40) {//Down key
            this.#SelectedListIndex++;
            this.#UpdateSelected();
        } else if (e.keyCode == 38) { //Up
            this.#SelectedListIndex--;
            this.#UpdateSelected();
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (this.#SelectedListIndex > -1) {
                this.SelectedItem = this.#ListedItems[this.#SelectedListIndex];
                myUIHub.CloseAllPopUps();
            } else {
                this.SelectedItem = null;
            }
        }
    }

    #UpdateSelected() {
        if (this.#ListedItems.length == 0) {
            this.#SelectedListIndex = -1;
            return;
        }
        if (this.#SelectedListIndex < 0) this.#SelectedListIndex = 0;
        if (this.#SelectedListIndex >= this.#ListedItems.length) this.#SelectedListIndex = this.#ListedItems.length - 1;

        const active = "DropdownWithSearchList-active";

        this.#divList.domelement.childNodes.forEach(x => x.className = x.className.replace(active, ""));
        if (this.#SelectedListIndex < this.#divList.domelement.childNodes.length) this.#divList.domelement.childNodes[this.#SelectedListIndex].className += " " + active;
    }

}

//#endregion

//#region Select

class dbnSelect extends dbnElement {

    constructor(parent = null) {
        super(document.createElement("select"), parent);
    }

    get SelectedPlayer() {
        var i = this.domelement.value;
        if (i == null) return null;
        return myHub.Players.find(x => x.PlayerID == i);
    }

    AddOption(text, value) {
        var option = document.createElement("option");
        option.text = text;
        option.value = value;
        this.domelement.add(option);
    }

    get SelectedValue() {
        return this.domelement.value;
    }

    // get SelectedText(){
    //   return this.domelement.value;
    // }

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

    constructor(parent = null) {
        super(document.createElement("table"), typeof parent == "string" ? null : parent); //The string test on parent is necessary for legacy purposes (the old version required a variable name to be passed).  CustomHTML pages might still use it.
        this.domelement.dbnTable = this;
        this.className = "bftable";
    }

    /** @type {object[][]} */
    Data = null;

    /** @type {string[]} */
    Headers = null;

    /** @type {string} */
    Title = null;
    ClickHeaderToSort = false;

    NumberColumns = null;
    HighlightedRows = null;

    /** @type {Object.<number,string>} */
    CountryColumns = {};
    /**
     * Style a column for a particular country
     * @param {number} column 
     * @param {string} country 
     */
    SetCountryForColumn(column, country) { this.CountryColumns[column] = country; }

    CountryRows = null;

    /** @type {[[number,number,string]]} */
    CountryCells = [];
    SetCountryForCell(row, column, country) { this.CountryCells.push([row, column, country]); }

    RowUrls = null;
    CellUrls = null;


    /** @type {[[number,number,string]]} */
    CellClasses = [];
    SetCellClass(row, column, className) { this.CellClasses.push([row, column, className]); }

    #rows = null;
    #lastSortIndex = null;
    #lastSortAscending = false;

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

//#region Events

class dbnEvent {

    /** @type {Object.<number,function>} */
    #Listeners = new Object();

    #LastID = 0;

    /**
     * @param {function} fn 
     * @returns {number}
     */
    AddListener(fn) {
        this.#LastID++;
        var ret = this.#LastID;
        this.#Listeners[ret] = fn;
        return ret;
    }

    RemoveListener(id) {
        if (this.#Listeners.hasOwnProperty(id)) delete this.#Listeners[id];
    }

    Raise(args) {
        Object.values(this.#Listeners).forEach(x => x(args));
    }
}

//Event Sample

// class A {

//     OnTest = new dbnEvent("Test");

//     RaiseTestEvent() {
//         this.OnTest.Raise(null);
//     }
// }

// class B {

//     constructor(name) { this.Name = name; }
//     Name = "";

//     /** @type {A} */
//     #aa;
//     #SinkID_aaTest;
//     get A() { return this.#aa; }
//     set A(value) {
//         if (this.#aa) this.#aa.OnTest.RemoveListener(this.#SinkID_aaTest);
//         this.#aa = value;
//         if (this.#aa) this.#SinkID_aaTest = this.#aa.OnTest.AddListener((e) => { console.log(this.Name + "Here") });
//     }
// }


// var aa = new A();
// var bb = new B("Pooky");
// bb.A = aa;
// var cc = new B("Kooky");
// cc.A = aa;

// aa.RaiseTestEvent();

// cc.A = null;
// aa.RaiseTestEvent();


//#endregion

//#region DrillDownPage

class dbnDrilldownPage {

    /**
     * @param {string} homekey 
     */
    constructor(homekey) {
        this.HomeKey = homekey;

        var urlparams = new URLSearchParams(window.location.search);

        this.CurrentKeys = [];
        if (urlparams.has("keys")) {
            var keys = JSON.parse(urlparams.get("keys"));
            if (Array.isArray(keys)) this.CurrentKeys = keys;
        }

        window.onpopstate = this.#OnPopState.bind(this);

        this.Title = homekey;
    }

    /** @type{string} */
    HomeKey;

    /** @type{string[]} */
    CurrentKeys;

    #TitleCard = dbnHere().addCard();
    #TitleHeading = this.#TitleCard.addHeading(1, "");
    get Title() { return this.#TitleHeading.innerHTML; }
    set Title(value) { this.#TitleHeading.innerHTML = value; this.#TitleCard.style.display = value == "" ? "none" : "block"; }

    BreadcrumbDiv = this.#TitleCard.addDiv();

    ContentDiv = dbnHere().addDiv();

    /** @callback MakeContentCallback
     * @param {string[]} keys - A list of keys identifying this point in the drilldown
     * @param {dbnDiv} div - The div where the content goes
     */

    /** @type{MakeContentCallback} */
    #OnMakeContent;
    get OnMakeContent() { return this.#OnMakeContent; }
    set OnMakeContent(value) { this.#OnMakeContent = value; this.DrilldownTo(this.CurrentKeys); }

    /**
     * @param {string | string[]} key 
     * @param {dbnElement|HTMLElement|string} elementOrText 
     */
    MakeDrilldownLink(key, elementOrText, relativeToCurrent = true) {
        var ret = new dbnLink();
        ret.addText(elementOrText);
        var newkeys = relativeToCurrent ? this.CurrentKeys.slice() : [];
        if (Array.isArray(key)) {
            newkeys.push(...key);
        } else {
            newkeys.push(key);
        }
        // ret.onclick = () => { this.DrilldownTo.bind(this, newkeys); return false; }
        ret.onclick = this.DrilldownTo.bind(this, newkeys);
        ret.href = "nowhere.com";
        return ret;
    }

    /**
     * @param {string[]} keys 
     */
    DrilldownTo(keys) {

        var bAddToHistory = !this.#StatePopped && JSON.stringify(keys) != JSON.stringify(this.CurrentKeys);
        this.CurrentKeys = keys;

        var doctitle = this.Title;

        this.BreadcrumbDiv.innerHTML = "";
        var breadkeys = [];
        if (keys.length > 0) {
            var list = this.BreadcrumbDiv.addList(false);
            list.className = "breadcrumb";
            list.AddItem(this.MakeDrilldownLink(breadkeys, this.HomeKey, false));
            keys.forEach((x, i) => {
                breadkeys.push(x);
                list.AddItem(i == keys.length - 1 ? x : this.MakeDrilldownLink(breadkeys, x, false));
                doctitle += " / " + x;
            });
        }

        window.document.title = doctitle;

        this.ContentDiv.innerHTML = "";
        this.#OnMakeContent(keys, this.ContentDiv);

        if (bAddToHistory) {
            var url = window.location.href;
            if (url.includes("?")) url = url.substring(0, url.search("\\?"));
            var urlparams = new URLSearchParams(window.location.search);

            if (keys.length > 0) {
                urlparams.set("keys", JSON.stringify(keys));
            } else {
                urlparams.delete("keys");
            }
            url = url + "?" + urlparams.toString();

            window.history.pushState(keys, "", url);
        }
        return false;
    }

    #StatePopped = false;
    /**
     * @param {PopStateEvent} e 
     */
    #OnPopState(e) {
        this.#StatePopped = true;
        this.DrilldownTo(e.state ?? []);
        this.#StatePopped = false;
    }
}

//#endregion


//#region SVG

class dbnSVGElement {

    /** @type {SVGElement} */
    domelement = null;

    /**
     * @param {string | SVGElement} pSVGElement 
     * @param {dbnElement | null} parent 
     */
    constructor(pSVGElement, parent = null) {
        if (typeof pSVGElement == "string") pSVGElement = document.createElementNS("http://www.w3.org/2000/svg", pSVGElement);
        this.domelement = pSVGElement;
        if (parent != null) {
            if (parent instanceof dbnElement) {
                parent.domelement.appendChild(this.domelement);
            } else {
                parent.appendChild(this.domelement);
            }
        }
    }

    get style() { return this.domelement.style; }
    set style(value) { this.domelement.style = value; }

    appendChild(element) { this.domelement.appendChild(element instanceof dbnSVGElement ? element.domelement : element); }
    createAndAppendElement(tagname) { var ret = new dbnSVGElement(tagname); this.appendChild(ret); return ret; }

}

class dbnSVG extends dbnSVGElement {
    constructor(parent = null) {
        super("svg", parent);
    }

    SetSize(width, height) {
        this.domelement.setAttribute("width", width);
        this.domelement.setAttribute("height", height);
    }

    /**
     * 
     * @param {string} d 
     * @param {string} stroke 
     * @param {string} strokewidth 
     * @param {string} fill 
     */
    AddPath(d, stroke = null, strokewidth = null, fill = null) {
        var ret = this.createAndAppendElement("path");
        ret.domelement.setAttribute("d", d);
        if (stroke) ret.domelement.setAttribute("stroke", stroke);
        if (strokewidth) ret.domelement.setAttribute("stroke-width", strokewidth);
        if (fill) ret.domelement.setAttribute("fill", fill);
        return ret;
    }
}
//#endregion