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
    createAndAppendElement(tagname) { var ret = new dbnElement(document.createElement(tagname)); this.appendChild(ret); return ret; }
    appendChild(element) {
        if (element instanceof dbnElement) { this.domelement.appendChild(element.domelement); return; }
        if (element instanceof dbnSVGElement) { this.domelement.appendChild(element.domelement); return; }
        if (element instanceof Node) { this.domelement.appendChild(element); return; }
        console.log("CAN'T ADD", element);
        throw "Can't append element";
    }

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
    /**
     * @param {string} caption 
     * @param {string|dbnElement|HTMLElement} textOrElement 
     */
    addWithCaption(caption, textOrElement) {
        var con = this.addDiv();
        con.style.whiteSpace = "nowrap";
        con.addText(caption);
        con.add(textOrElement);
        return con;
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
    addBaseTable() { var ret = new dbnBaseTable(this); return ret; }

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

    AddExternalIcon() {
        var icon = new dbnElement('i');
        icon.className = "fa fa-external-link";
        icon.domelement.setAttribute("aria-hidden", "true");

        this.addText(" ");
        this.appendChild(icon);
    }

    checkForExternal() {
        var isexternal = this.href.substring(0, 4).toLowerCase() == "http" && !this.href.toLowerCase().includes("diplobn.com");
        if (isexternal) {
            this.AddExternalIcon();
            this.openInNewWindow = true;
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

    get type() { return this.domelement.type; }
    set type(value) { this.domelement.type = value; }

    get step() { return this.domelement.step; }
    set step(value) { this.domelement.step = value; }
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


//#region Base table

class dbnBaseTableRow {
    Values = null;
    Url = null;
    Highlighted = false;
    CellUrls = null;
    CellClasses = null;
}

class dbnBaseTable extends dbnElement {

    constructor(parent = null) {
        super("table", parent);
        this.domelement.dbnTable = this;

        this.ColGroup = document.createElement("colgroup");
        this.domelement.append(this.ColGroup);
        this.Head = this.domelement.createTHead();
        this.Body = this.domelement.createTBody();
    }

    /**@type{HTMLTableElement} */
    get domelement() { return this.domelement; }

    /**@type{HTMLTableColElement} */
    ColGroup;
    /**@type{HTMLTableSectionElement} */
    Head;
    /**@type{HTMLTableSectionElement} */
    Body;

    //#region Columns

    GetColumn(index) {
        while (this.ColGroup.childElementCount <= index) this.ColGroup.append(document.createElement("col"));
        /**@type{HTMLTableColElement} */
        var ret = this.ColGroup.childNodes.item(index);
        return ret;
    }

    /**
     * @callback applyStyleCallback
     * @param {CSSStyleDeclaration} style
     */

    /**@type{applyStyleCallback[]} */
    #ColumnStyles = [];
    get ColumnStyles() { return this.#ColumnStyles; }

    /**
     * @param {number} colindex
     * @param {applyStyleCallback} func 
     */
    ApplyStyleToColumn(colindex, func) {
        this.#ColumnStyles[colindex] = func;
        for (let ri = 0; ri < this.domelement.rows.length; ri++) {
            const row = this.domelement.rows[ri];
            if (row.cells.length > colindex) func(row.cells.item(colindex).style);
        }
    }

    // /**@type{number[]} */
    // #NumberColumns;
    // get NumberColumns() { return this.#NumberColumns; }
    // set NumberColumns(value) {
    //     this.#NumberColumns = value;
    //     this.GetBodyCellsForAllRows().forEach(row => {
    //         row.forEach((cell, ci) => {
    //             if (this.#NumberColumns.includes(ci)) this.#SetNumberColumnStyle(cell)
    //         })
    //     });
    // }
    // /**
    //  * @param {HTMLTableCellElement} cell 
    //  */
    // #SetNumberColumnStyle(cell) { cell.style.textAlign = "right"; }

    //#endregion

    GetHeadRow(index) { while (this.Head.rows.length <= index) this.Head.insertRow(); return this.Head.rows.item(index); }
    GetHeadCell(rowindex, colindex) { var row = this.GetHeadRow(rowindex); while (row.cells.length <= colindex) row.appendChild(document.createElement("th")); return row.cells.item(colindex); }
    GetBodyRow(index) { while (this.Body.rows.length <= index) this.Body.insertRow(); return this.Body.rows.item(index); }
    GetBodyCell(rowindex, colindex) {
        var row = this.GetBodyRow(rowindex);
        while (row.cells.length <= colindex) {
            var newcell = row.insertCell();
            if (this.#ColumnStyles[newcell.cellIndex]) this.#ColumnStyles[newcell.cellIndex](newcell.style);
        }
        return row.cells.item(colindex);
    }

    GetBodyCellsForRow(rowindex) {
        var ret = [];
        var cells = this.GetBodyRow(rowindex).cells;
        for (let ci = 0; ci < cells.length; ci++) ret.push(cells[ci]);
        return ret;
    }
    GetBodyCellsForAllRows() {
        var ret = [];
        for (let ri = 0; ri < this.domelement.rows.length; ri++) {
            var row = [];
            var cells = this.domelement.rows[ri].cells;
            for (let ci = 0; ci < cells.length; ci++) row.push(cells[ci]);
            ret.push(row);
        }
        return ret;
    }

    ClearBody() { this.Body.innerHTML = ""; }
    /**
     * 
     * @param {object[]} content 
     */
    LoadHeaders(headers) {
        headers.forEach((colcon, ci) => {
            var cell = this.GetHeadCell(0, ci);
            if (colcon instanceof dbnElement) {
                cell.appendChild(colcon.domelement);
            } else {
                cell.innerHTML = colcon;
            }
        });
    }

    /**
    * 
    * @param {object[][]} content 
    */
    LoadContent(content) {
        content.forEach((rowcon, ri) => {
            rowcon.forEach((colcon, ci) => {
                var cell = this.GetBodyCell(ri, ci);
                if (colcon instanceof dbnElement) {
                    cell.appendChild(colcon.domelement);
                } else {
                    cell.innerHTML = colcon;
                }
            });
        });
    }
}

//#endregion

//#region Formatted table

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

    /** @type {string|dbnElement} */
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

        /**@type{HTMLTableElement} */
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

            if (rr.Country != null) {
                row.style.backgroundColor = myHub.ColorScheme.CountryBackColors[rr.Country].ToRGBString();
                // row.className += " bf" + rr.Country + "Back";
            }

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

//#region Drawing classes

class dbnColor {

    /**@type{number} */ R;
    /**@type{number} */ G;
    /**@type{number} */ B;
    /**@type{number} */ A;

    static get White() { return dbnColor.FromRGB(255, 255, 255); }

    /**
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     */
    static FromRGB(r, g, b) { var ret = new dbnColor(); ret.R = r; ret.G = g; ret.B = b; return ret; }

    /**
     * @param {string} value 
     */
    static FromRGBString(color) {
        var ret = new dbnColor();
        if (color[0] != "#") throw "Color is not a hex value";
        if (color.length < 7) throw "Color is not long enough";
        ret.R = parseInt(color.substring(1, 3), 16);
        ret.G = parseInt(color.substring(3, 5), 16);
        ret.B = parseInt(color.substring(5, 7), 16);
        if (color.length > 7) ret.A = parseInt(color.substring(7, 9), 16);
        return ret;
    }

    ToRGBString() {
        var decColor = 0x1000000 + Math.round(this.B) + 0x100 * Math.round(this.G) + 0x10000 * Math.round(this.R);
        var ret = '#' + decColor.toString(16).substring(1);
        if (this.A) ret += this.A.toString(16).padStart(2, "0");
        return ret;
    }

    ToRGBArray() { return [this.R, this.G, this.B]; }

    /**
     * 
     * @param {dbnColor} color 
     * @param {number} amount
     * @returns 
     */
    MixWith(color, amount) {
        var ret = new dbnColor();
        var mix = (a, b) => { return Math.floor((1 - amount) * a + amount * b); };

        ret.R = mix(this.R, color.R);
        ret.G = mix(this.G, color.G);
        ret.B = mix(this.B, color.B);
        if (this.A && color.A) ret.A = mix(this.A, color.A);
        return ret;
    }

    ToHSVArray(asInt = false) {
        var rp = this.R / 255;
        var gp = this.G / 255;
        var bp = this.B / 255;
        var cmax = Math.max(rp, gp, bp);
        var cmin = Math.min(rp, gp, bp);
        var delta = cmax - cmin;

        var h = 0;
        if (delta != 0) {
            if (cmax == rp) {
                h = 60 * (((gp - bp) / delta) % 6);
                if (h < 0) h += 360;
            } else if (cmax == gp) {
                h = 60 * (((bp - rp) / delta) + 2);
            } else {
                h = 60 * (((rp - gp) / delta) + 4);
            }
        }

        var s = (cmax == 0) ? 0 : delta / cmax;

        var ret = [h, 100 * s, 100 * cmax];
        if (asInt) ret = ret.map(x => Math.round(x));
        return ret; x
    }

    /**
     * @param {number} h 
     * @param {number} s 
     * @param {number} v 
     */
    static FromHSV(h, s, v) {
        var c = (v / 100) * (s / 100);
        var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        var m = (v / 100) - c;

        //console.log(c, x, m);

        var rgbp;

        if (0 <= h && h < 60) {
            rgbp = [c, x, 0];
        } else if (60 <= h && h < 120) {
            rgbp = [x, c, 0];
        } else if (120 <= h && h < 180) {
            rgbp = [0, c, x];
        } else if (180 <= h && h < 240) {
            rgbp = [0, x, c];
        } else if (240 <= h && h < 300) {
            rgbp = [x, 0, c];
        } else if (300 <= h && h < 360) {
            rgbp = [c, 0, x];
        } else {
            throw "invalid value of h (" + h + ")";
        }

        rgbp = rgbp.map(x => (x + m) * 255);

        return dbnColor.FromRGB(...rgbp);
    }

}

class dbnPoint {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }

    static FromNumberArray(value) {
        if (!Array.isArray(value) || value.length != 2) throw "value must be an array of length 2";
        return new dbnPoint(value[0], value[1]);
    }

    /**@type{number} */
    X;

    /**@type{number} */
    Y;

    ToArray() { return [this.X, this.Y]; }

    /**
     * 
     * @param {number} dx 
     * @param {number} dy 
     * @returns 
     */
    WithOffset(dx, dy) { return new dbnPoint(this.X + dx, this.Y + dy); }

    ToPath(command) { return command + " " + this.X + " " + this.Y + " "; }

    /**
     * 
     * @param {number} c 
     * @returns 
     */
    MultiplyBy(c) { return new dbnPoint(this.X * c, this.Y * c) };

    /**
     * 
     * @param {dbnPoint} point 
     * @returns 
     */
    AddTo(point) { return this.WithOffset(point.X, point.Y) };
}

class dbnSize {
    /**
     * 
     * @param {number} width 
     * @param {number} height
     */
    constructor(width, height) {
        this.Height = height;
        this.Width = width;
    }

    /**@type{number} */
    Height;

    /**@type{number} */
    Width;

    /**
     * 
     * @param {number} dwidth
     * @param {number} dheight
     * @returns 
     */
    WithAdjustment(dwidth, dheight) { return new dbnSize(this.width + dwidth, this.height + dheight); }

    /**
     * 
     * @param {number} c 
     * @returns 
     */
    MultiplyBy(c) { return new dbnSize(this.Width * c, this.Height * c) };

    /**
     * 
     * @param {dbnSize} size
     * @returns 
     */
    AddTo(size) { return this.WithAdjustment(size.Width, size.Height) };
}

class dbnRect {
    /**
     * 
     * @param {dbnPoint} location 
     * @param {dbnSize} size
     */
    constructor(location, size) {
        this.Location = location;
        this.Size = size;
    }

    /**@type{dbnPoint} */ Location;
    /**@type{dbnSize} */ Size;

    get UpperLeft() {
        if (this.Size.Width >= 0 && this.Size.Height >= 0) return this.Location;
        if (this.Size.Width >= 0 && this.Size.Height < 0) return new this.Location.WithOffset(0, this.Size.Height);
        if (this.Size.Width < 0 && this.Size.Height >= 0) return new this.Location.WithOffset(this.Size.Width, 0);
        return this.Location.WithOffset(this.Size.Width, this.Size.Height);
    }
    get UpperRight() {
        if (this.Size.Width >= 0 && this.Size.Height >= 0) return this.Location.WithOffset(this.Size.Width, 0);
        if (this.Size.Width >= 0 && this.Size.Height < 0) return this.Location.WithOffset(this.Size.Width, this.Size.Height);
        if (this.Size.Width < 0 && this.Size.Height >= 0) return this.Location;
        return this.Location.WithOffset(0, this.Size.Height);
    }
    get LowerLeft() {
        if (this.Size.Width >= 0 && this.Size.Height >= 0) return this.Location.WithOffset(0, this.Size.Height);
        if (this.Size.Width >= 0 && this.Size.Height < 0) return this.Location;
        if (this.Size.Width < 0 && this.Size.Height >= 0) return this.Location.WithOffset(this.Size.Width, this.Size.Height);
        return this.Location.WithOffset(this.Size.Width, 0);
    }
    get LowerRight() {
        if (this.Size.Width >= 0 && this.Size.Height >= 0) return this.Location.WithOffset(this.Size.Width, this.Size.Height);
        if (this.Size.Width >= 0 && this.Size.Height < 0) return this.Location.WithOffset(this.Size.Width, 0);
        if (this.Size.Width < 0 && this.Size.Height >= 0) return this.Location.WithOffset(0, this.Size.Height);
        return this.Location;
    }
}

class dbnLineSegment {
    /**
     * 
     * @param {number[]|dbnPoint} from 
     * @param {number[]|dbnPoint} to 
     */
    constructor(from, to) {
        this.FromPoint = Array.isArray(from) ? new dbnPoint(from[0], from[1]) : from;
        this.ToPoint = Array.isArray(to) ? new dbnPoint(to[0], to[1]) : to;
    }

    /**@type{dbnPoint} */ FromPoint;
    /**@type{dbnPoint} */ ToPoint;

    //public override string ToString() => FromPoint.ToString() + " --> " + ToPoint.ToString();

    get DeltaX() { return this.ToPoint.X - this.FromPoint.X };
    get DeltaY() { return this.ToPoint.Y - this.FromPoint.Y };
    get Length() { return Math.sqrt(Math.pow(this.DeltaX, 2) + Math.pow(this.DeltaY, 2)) };

    get MiddlePoint() { return new dbnPoint((this.FromPoint.X + this.ToPoint.X) / 2, (this.FromPoint.Y + this.ToPoint.Y) / 2); };

    /**
     * 
     * @param {number} frac Fraction from the FromPoint to the ToPoint (can be <0 or >1)
     * @returns 
     */
    GetInterimPoint(frac) { return new dbnPoint((1 - frac) * this.FromPoint.X + frac * this.ToPoint.X, (1 - frac) * this.FromPoint.Y + frac * this.ToPoint.Y); };

    /// <summary>
    /// From -180 to 180, oriented clockwise (neg x-axis is 180)
    /// </summary>
    get AngleToHorizontal() {
        return this.AngleToHorizontalInRadians * 180 / Math.PI;
    }
    get AngleToHorizontalInRadians() {
        if (this.DeltaX == 0) {
            if (this.DeltaY == 0) throw "LineSegment has no length";
            return Math.PI / 2 * (this.DeltaY > 0 ? 1 : -1);
        }
        else {
            var angle = Math.atan(this.DeltaY / this.DeltaX);
            if (this.DeltaX < 0) angle += (this.DeltaY >= 0 ? 1 : -1) * Math.PI;
            return angle;
        }
    }

    /**
     * 
     * @param {number} pAddFrom 
     * @param {number} pAddTo 
     * @returns 
     */
    WithNewLength(pAddFrom, pAddTo) {
        var l = this.Length;
        if (l == 0) return this;

        var dy = (this.ToPoint.Y - this.FromPoint.Y) / l;
        var dx = (this.ToPoint.X - this.FromPoint.X) / l;

        return new dbnLineSegment(this.FromPoint.WithOffset(-dx * pAddFrom, -dy * pAddFrom), this.ToPoint.WithOffset(dx * pAddTo, dy * pAddTo));
    }

    /**
     * Positive amount is to the right
     * @param {number} amount 
     * @returns 
     */
    WithParallelShift(amount) {
        if (this.FromPoint.X == this.ToPoint.X) return new dbnLineSegment(this.FromPoint.WithOffset(amount, 0), this.ToPoint.WithOffset(amount, 0));

        let l = this.Length;
        let dx = amount * (this.ToPoint.Y - this.FromPoint.Y) / l;
        let dy = -amount * (this.ToPoint.X - this.FromPoint.X) / l;

        return new dbnLineSegment(this.FromPoint.WithOffset(dx, dy), this.ToPoint.WithOffset(dx, dy));
    }

    /**
     * Positive distance is on the right, negative is on the left
     * @param {dbnPoint} point 
     * @returns 
     */
    ParallelDistanceFrom(point) {
        let lineAC = new dbnLineSegment(this.FromPoint, point);
        let angleCAB = lineAC.AngleToHorizontalInRadians - this.AngleToHorizontalInRadians;
        return -lineAC.Length * Math.sin(angleCAB);
    }

}

class dbnPointSet {
    /**
     * 
     * @param {float} firstx 
     * @param {float} firsty 
     */
    constructor(firstx, firsty) {
        this.Add(new dbnPoint(firstx, firsty));
    }

    /**@type{dbnPoint[]} */
    Points = [];

    get First() { return this.Points[0]; }
    get Last() { return this.Points[this.Points.length - 1]; }

    Add(point) { this.Points.push(point); }

    /**
     * 
     * @param {float} offsetx 
     * @param {float} offsety 
     */
    AddFromLast(offsetx, offsety) { this.Add(this.Points[this.Points.length - 1].WithOffset(offsetx, offsety)); }

    /**
     * 
     * @param {dbnPoint[]} points 
     */
    AddRange(points) { points.forEach(x => this.Add(x)) };

    /**
     * 
     * @param {dbnPoint} offset 
     */
    Translate(offset) { this.Translate(offset.X, offset.Y); }
    /**
     * 
     * @param {float} dx 
     * @param {float} dy 
     */
    Translate(dx, dy) {
        var newpoints = this.Points.map(pt => pt.WithOffset(dx, dy));
        newpoints.forEach((x, i) => this.Points[i] = x);
    }

    /**
     * 
     * @param {float} angleInRadians 
     */
    Rotate(angleInRadians) {
        if (angleInRadians == 0) return;

        var cos = Math.cos(angleInRadians);
        var sin = Math.sin(angleInRadians);

        var newpoints = this.Points.map(pt => new dbnPoint(cos * pt.X - sin * pt.Y, sin * pt.X + cos * pt.Y));
        newpoints.forEach((x, i) => this.Points[i] = x);
    }
}

//#endregion

//#region SVG

class dbnSVGElement {

    /** @type {SVGElement} */
    domelement = null;

    /**
     * @param {string | SVGElement} pSVGElement 
     * @param {dbnSVGElement | null} parent 
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

    get id() { return this.domelement.id; }
    set id(value) { this.domelement.setAttribute("id", value); }
    get style() { return this.domelement.style; }
    set style(value) { this.domelement.setAttribute("style", value); }

    appendChild(element) { this.domelement.appendChild(element instanceof dbnSVGElement ? element.domelement : element); }
    createAndAppendElement(tagname) { var ret = new dbnSVGElement(tagname); this.appendChild(ret); return ret; }

    /**
     * 
     * @returns {SVGRect}
     */
    getBBox() { return this.domelement.getBBox(); }

    get fill() { return this.domelement.fill; }
    set fill(value) { this.domelement.setAttribute("fill", value); }

    get onclick() { return this.domelement.onclick; }
    set onclick(value) { this.domelement.onclick = value; }
    get onmouseenter() { return this.domelement.onmouseenter; }
    set onmouseenter(value) { this.domelement.onmouseenter = value; }
    get onmouseleave() { return this.domelement.onmouseleave; }
    set onmouseleave(value) { this.domelement.onmouseleave = value; }
    get onmousemove() { return this.domelement.onmousemove; }
    set onmousemove(value) { this.domelement.onmousemove = value; }
    get onmouseout() { return this.domelement.onmouseout; }
    set onmouseout(value) { this.domelement.onmouseout = value; }

    SetPointerEventsNone() { this.domelement.style.pointerEvents = "none"; }
    SetPointerEventsAll() { this.domelement.style.pointerEvents = "all"; }

    //#region Container functions

    /**
     * 
     * @param {dbnPoint} point 
     */
    MoveTo(point) { dbnSVGElement.MoveDOMTo(this.domelement, point); }

    /**
     * 
     * @param {SVGElement} elm 
     * @param {dbnPoint} point 
     */
    static MoveDOMTo(elm, point) {
        if (!elm.tagName) return;

        try {
            /**@type{SVGRect} */ var rect = elm.getBBox();
            var dx = point.X - rect.x, dy = point.Y - rect.y;

            switch (elm.tagName) {
                case "circle":
                    elm.setAttribute("cx", point.X);
                    elm.setAttribute("cy", point.Y);
                    break;
                case "path":
                    var d = elm.getAttribute("d");
                    var pb = dbnSVGPathBuilder.FromD(d);
                    pb.Translate(dx, dy);
                    elm.setAttribute("d", pb.ToD());
                    break;
                // case "text":
                //     node.setAttribute("x", dx + rect.x);
                //     node.setAttribute("y", dy + rect.y + rect.height);
                //     break;
                case "button":
                case "a":
                    break;
                default:
                    elm.setAttribute("x", point.X);
                    elm.setAttribute("y", point.Y);
                    break;
            }

        } catch (error) {
            throw "dbnSVGElement.MoveDOMTo (" + elm.tagName + "): " + error;
        }

        elm.childNodes.forEach(node => {
            if (node.tagName) {
                try {
                    var noderect = node.getBBox();
                    dbnSVGElement.MoveDOMTo(node, new dbnPoint(noderect.x, noderect.y).WithOffset(dx, dy));
                } catch (error) {
                    throw "dbnSVGElement.MoveDOMTo.node (" + node.tagName + "): " + error;
                }
            }
        });

    }

    //#endregion

    /**@type{dbnDiv} */
    static #ToolTip = dbnHere().addDiv();

    //#region tooltip
    static ShowTooltip(event, content) {
        if (!dbnSVGElement.#ToolTip.id) {
            var tt = dbnSVGElement.#ToolTip;
            tt.style = "position: absolute; display: none;";
            tt.id = "svgToolTip";
            tt.domelement.style.background = "cornsilk";
            tt.domelement.style.border = "4px solid black";
            tt.domelement.style.borderRadius = "4px";
            tt.domelement.style.borderStyle = "double   ";
            //tt.domelement.style.padding = "2px 4px";
        }

        let element = event.target;
        let tooltipElement = dbnSVGElement.#ToolTip;

        if (typeof content == "string") {
            tooltipElement.innerHTML = content;
        } else if (content instanceof dbnElement) {
            tooltipElement.innerHTML = "";
            tooltipElement.appendChild(content);
        } else {
            throw "dbnSVGElement.ShowTooltip: unrecognized content type";
        }

        tooltipElement.style.display = 'block';
        tooltipElement.style.left = event.layerX + 10 + 'px';
        tooltipElement.style.top = event.layerY + 10 + 'px';
    }

    static HideTooltip() {
        dbnSVGElement.#ToolTip.style.display = 'none';
    }

    //#endregion

    //#region Add functions

    AddLink() { return new dbnSVGLink(this) }

    /**
     * 
     * @param {string} text
     * @param {string} x
     * @param {string} y
     * @param {string} fill 
     * @param {string} style 
     */
    AddText(text, x, y, fill = "black", style = null) {
        var ret = new dbnSVGText(this);
        ret.textContent = text;
        ret.x = x; ret.y = y;
        if (style) ret.style = style;
        if (fill) ret.fill = fill;
        return ret;
    }

    /**
     * 
     * @param {string} x1
     * @param {string} y1
     * @param {string} x2
     * @param {string} y2
     * @param {string} stroke 
     * @param {string} strokewidth 
     */
    AddLine(x1, y1, x2, y2, stroke = "black", strokewidth = null, markerend = null) {
        var ret = new dbnSVGLine(this);
        ret.x1 = x1; ret.x2 = x2; ret.y1 = y1; ret.y2 = y2;
        if (stroke) ret.stroke = stroke;
        if (strokewidth) ret.strokeWidth = strokewidth;
        if (markerend) ret.markerEnd = markerend;
        return ret;
    }
    /**
     * 
     * @param {dbnLineSegment} segment
     * @param {string} stroke 
     * @param {string} strokewidth 
     */
    AddLineFromSegment(segment, stroke = "black", strokewidth = null, markerend = null) {
        return this.AddLine(segment.FromPoint.X, segment.FromPoint.Y, segment.ToPoint.X, segment.ToPoint.Y, stroke, strokewidth, markerend);
    }

    /**
     * 
     * @param {string} d 
     * @param {string} stroke 
     * @param {string} strokewidth 
     * @param {string} fill 
     */
    AddPath(d, stroke = null, strokewidth = null, fill = null) {
        var ret = new dbnSVGPath(this);
        ret.d = d;
        if (stroke) ret.stroke = stroke;
        if (strokewidth) ret.strokeWidth = strokewidth;
        if (fill) ret.fill = fill;
        return ret;
    }

    /**
     * 
     * @param {string} cx
     * @param {string} cy 
     * @param {string} r 
     * @param {string} stroke 
     * @param {string} strokewidth 
     * @param {string} fill 
     */
    AddCircle(cx, cy, r, stroke = null, strokewidth = null, fill = null) {
        var ret = new dbnSVGCircle(this);
        ret.cx = cx; ret.cy = cy; ret.r = r;
        if (stroke) ret.stroke = stroke;
        if (strokewidth) ret.strokeWidth = strokewidth;
        if (fill) ret.fill = fill;
        return ret;
    }

    /**
         * 
         * @param {string} x
         * @param {string} y
         * @param {string} width
         * @param {string} height
         * @param {string} stroke 
         * @param {string} strokewidth 
         * @param {string} fill 
         */
    AddRectangle(x, y, width, height, stroke = null, strokewidth = null, fill = null) {
        var ret = new dbnSVGRectangle(this);
        ret.x = x; ret.y = y; ret.height = height; ret.width = width;
        if (stroke) ret.stroke = stroke;
        if (strokewidth) ret.strokeWidth = strokewidth;
        if (fill) ret.fill = fill;
        return ret;
    }

    /**
         * 
         * @param {string} x
         * @param {string} y
         * @param {number[][]} points
         * @param {string} stroke 
         * @param {string} strokewidth 
         * @param {string} fill 
         */
    AddPolygon(x, y, points, stroke = null, strokewidth = null, fill = null) {
        var ret = this.createAndAppendElement("polygon");
        var spoints = "";
        points.forEach(pt => spoints += (pt[0] + x) + "," + (pt[1] + y) + " ");
        ret.domelement.setAttribute("points", spoints);
        if (stroke) ret.domelement.style.stroke = stroke;
        if (strokewidth) ret.domelement.style.strokeWidth = strokewidth;
        if (fill) ret.domelement.style.fill = fill;
        return ret;
    }

    //#endregion

}

//#region Strokable elements

class dbnSVGStrokableElement extends dbnSVGElement {
    constructor(pSVGElement, parent = null) { super(pSVGElement, parent); }

    get stroke() { return this.domelement.stroke; }
    set stroke(value) { this.domelement.setAttribute("stroke", value); }

    get strokeWidth() { return this.domelement.domelement.getAttribute("stroke-width"); }
    set strokeWidth(value) { this.domelement.setAttribute("stroke-width", value); }

    get rx() { return this.domelement.domelement.getAttribute("rx"); }
    set rx(value) { this.domelement.setAttribute("rx", value); }

    get strokeDashArray() { return this.domelement.domelement.getAttribute("stroke-dasharray"); }
    set strokeDashArray(value) { this.domelement.setAttribute("stroke-dasharray", value); }

    get markerEnd() { return this.domelement.getAttribute("marker-end"); }
    set markerEnd(value) { this.domelement.setAttribute("marker-end", "url(#" + value + ")"); }

}

class dbnSVGLine extends dbnSVGStrokableElement {
    constructor(parent = null) { super("line", parent); }

    get x1() { return this.domelement.getAttribute("x1"); }
    set x1(value) { this.domelement.setAttribute("x1", value); }
    get y1() { return this.domelement.getAttribute("y1"); }
    set y1(value) { this.domelement.setAttribute("y1", value); }
    get x2() { return this.domelement.getAttribute("x2"); }
    set x2(value) { this.domelement.setAttribute("x2", value); }
    get y2() { return this.domelement.getAttribute("y2"); }
    set y2(value) { this.domelement.setAttribute("y2", value); }
}

class dbnSVGPath extends dbnSVGStrokableElement {
    constructor(parent = null) { super("path", parent); }

    get d() { return this.domelement.getAttribute("d"); }
    set d(value) { this.domelement.setAttribute("d", value); }
}

class dbnSVGCircle extends dbnSVGStrokableElement {
    constructor(parent = null) { super("circle", parent); }
    get cx() { return this.domelement.getAttribute("cx"); }
    set cx(value) { this.domelement.setAttribute("cx", value); }
    get cy() { return this.domelement.getAttribute("cy"); }
    set cy(value) { this.domelement.setAttribute("cy", value); }
    get r() { return this.domelement.getAttribute("r"); }
    set r(value) { this.domelement.setAttribute("r", value); }
}

class dbnSVGRectangle extends dbnSVGStrokableElement {
    constructor(parent = null) { super("rect", parent); }
    get x() { return this.domelement.getAttribute("x"); }
    set x(value) { this.domelement.setAttribute("x", value); }
    get y() { return this.domelement.getAttribute("y"); }
    set y(value) { this.domelement.setAttribute("y", value); }
    get height() { return this.domelement.getAttribute("height"); }
    set height(value) { this.domelement.setAttribute("height", value); }
    get width() { return this.domelement.getAttribute("width"); }
    set width(value) { this.domelement.setAttribute("width", value); }
}

class dbnSVGArrowPath extends dbnSVGPath {
    constructor(parent) {
        super(parent);
        this.stroke = "black";
        this.fill = "black";
        this.strokeWidth = 1;
        this.#DrawPath();
    }

    /**@type{dbnLineSegment} */ #LineSegment;
    get LineSegment() { return this.#LineSegment; } set LineSegment(value) { this.#LineSegment = value; this.#DrawPath(); }

    #LineWidth = 2; get LineWidth() { return this.#LineWidth; } set LineWidth(value) { this.#LineWidth = value; this.#DrawPath(); }
    #ArrowSize = 1; get ArrowSize() { return this.#ArrowSize; } set ArrowSize(value) { this.#ArrowSize = value; this.#DrawPath(); }

    static GetDefaultEndCapDimension(linewidth, arrowsize) { return 2 * linewidth * arrowsize; }

    #DrawPath() {
        if (!this.#LineSegment) return;
        var length = this.#LineSegment.Length;
        if (length == 0) return;

        var startcapsize = new dbnSize(0, 0);
        var endcapsize = new dbnSize(1, 1).MultiplyBy(Math.min(length, dbnSVGArrowPath.GetDefaultEndCapDimension(this.#LineWidth, this.#ArrowSize)));

        var middlerect = new dbnRect(new dbnPoint(0, - this.#LineWidth / 2), new dbnSize(length - startcapsize.Width - endcapsize.Width, this.#LineWidth));
        var endcaprect = new dbnRect(new dbnPoint(middlerect.Size.Width, -endcapsize.Height / 2), endcapsize);

        /**@type{dbnPoint[]} */
        var pts = [];

        if (length > 0) {
            pts.push(middlerect.UpperRight, middlerect.UpperLeft, middlerect.LowerLeft, middlerect.LowerRight);
        }

        pts.push(endcaprect.LowerLeft,
            endcaprect.LowerRight.WithOffset(0, -endcapsize.Height / 2),
            endcaprect.LowerLeft.WithOffset(0, -endcapsize.Height)
        );

        var sb = dbnSVGPathBuilder.FromPoints(pts);
        sb.Rotate(this.LineSegment.AngleToHorizontalInRadians);
        sb.Translate(this.#LineSegment.FromPoint.X, this.#LineSegment.FromPoint.Y);
        this.d = sb.ToD();

    }
}

//#endregion

//#region PathBuilder

class dbnSVGPathElement {
    /**
     * 
     * @param {string} marker 
     * @param {number[]} numbers 
     */
    constructor(marker, numbers) { this.Marker = marker; this.Numbers = numbers; }
    /**@type{string} */ Marker;
    /**@type{number[]} */ Numbers;
}

class dbnSVGPathBuilder {

    /**@type{dbnSVGPathElement[]} */ Elements = [];

    /**
     * 
     * @param {string} marker 
     * @param {number[]} numbers 
     */
    Add(marker, numbers) { var ret = new dbnSVGPathElement(marker, numbers); this.Elements.push(ret); return ret; }

    ToD() {
        var d = "";
        this.Elements.forEach(x => { d += x.Marker; x.Numbers.forEach(n => d += Math.round(100 * n) / 100 + " "); });
        return d;
    }

    /**
     * 
     * @param {string} d 
     */
    static FromD(d) {
        var ret = new dbnSVGPathBuilder();

        /**@type{dbnSVGPathElement} */
        var curElement = null;
        var curNumber = "";

        var aCheckCloseNumber = () => {
            if (curNumber != "" && curElement) {
                curElement.Numbers.push(parseFloat(curNumber));
                curNumber = "";
            }
        };

        for (let char of d) {
            if (/^[a-zA-Z]+$/.test(char)) {
                aCheckCloseNumber();
                curElement = ret.Add(char, []);
            } else if (/^[0-9.-]+$/.test(char)) {
                curNumber += char;
            } else {
                aCheckCloseNumber();
            }
        }
        aCheckCloseNumber();

        return ret;
    }

    /**
     * 
     * @param {dbnPoint[]} points 
     * @param {boolean} closed 
     */
    static FromPoints(points, closed) {
        var ret = new dbnSVGPathBuilder();
        points.forEach((x, i) => ret.Add(i == 0 ? "M" : "L", [x.X, x.Y]));
        ret.Add("Z", []);
        return ret;
    }

    /**
     * 
     * @param {dbnPoint|number} dx 
     * @param {number} dy 
     */
    Translate(dx, dy) {
        var dxx = dx;
        var dyy = dy;

        if (dx instanceof dbnPoint) {
            dxx = dx.X;
            dyy = dx.Y;
        }

        this.Elements.forEach(x => {
            switch (x.Marker) {
                case "M":
                case "L":
                    x.Numbers[0] += dxx; x.Numbers[1] += dyy;
                    break;

                case "Z":
                    break;
                default:
                    throw "Path marker not recognized";
                    break;
            }

        });
    }

    /**
     * 
     * @param {number} angle in radians 
     */
    Rotate(angle) {
        if (angle == 0) return;

        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        this.Elements.forEach(x => {
            switch (x.Marker) {
                case "M":
                case "L":
                    x.Numbers = [cos * x.Numbers[0] - sin * x.Numbers[1], sin * x.Numbers[0] + cos * x.Numbers[1]];
                    break;

                case "Z":
                    break;
                default:
                    throw "Path marker not recognized";
                    break;
            }

        });
    }
}

//#endregion

//#region Link and Button

class dbnSVGLink extends dbnSVGElement {
    constructor(parent = null) { super("a", parent); }

    get href() { return this.domelement.getAttribute("href"); }
    set href(value) { this.domelement.setAttribute("href", value); }
}

class dbnSVGButton extends dbnSVGLink {
    constructor(parent) {
        super(parent);

        this.Border = this.AddRectangle(0, 0, 40, 10, "black", 2, this.#BackColor);
        this.Border.rx = 2;

        this.onmouseenter = this.#MouseEnter.bind(this);
        this.onmouseleave = this.#MouseLeave.bind(this);
    }

    /**@type{dbnSVGRectangle} */ Border;

    /**@type{string} */ #BackColor = "green";
    get BackColor() { return this.#BackColor };
    set BackColor(value) { this.#BackColor = value; if (!this.#IsHovering) this.Border.style.fill = this.#BackColor; }

    /**@type{string} */ #BackColorHover = "red";
    get BackColorHover() { return this.#BackColorHover };
    set BackColorHover(value) { this.#BackColorHover = value; if (this.#IsHovering) this.Border.style.fill = this.#BackColorHover; }

    #IsHovering = false;

    #MouseEnter() {
        this.#IsHovering = true;
        this.Border.style.fill = this.BackColorHover;
        this.domelement.childNodes.forEach(node => node.style.cursor = "pointer");
    }
    #MouseLeave() {
        this.#IsHovering = false;
        this.Border.style.fill = this.BackColor;
        this.domelement.childNodes.forEach(node => node.style.cursor = "default");
    }

    // /**
    //  * 
    //  * @param {dbnPoint} point 
    //  */
    // MoveTo(point) {
    // /**@type{SVGRect} */ var rect = this.Border.getBBox();
    //     var dx = point.X - rect.x, dy = point.Y - rect.y;
    //     this.domelement.childNodes.forEach(node => {
    //         rect = node.getBBox();

    //         switch (node.tagName) {
    //             case "circle":
    //                 node.setAttribute("cx", dx + rect.x);
    //                 node.setAttribute("cy", dy + rect.y);
    //                 break;
    //             case "path":
    //                 var d = node.getAttribute("d");
    //                 var pb = dbnSVGPathBuilder.FromD(d);
    //                 pb.Translate(dx, dy);
    //                 node.setAttribute("d", pb.ToD());
    //                 break;
    //             // case "text":
    //             //     node.setAttribute("x", dx + rect.x);
    //             //     node.setAttribute("y", dy + rect.y + rect.height);
    //             //     break;
    //             default:
    //                 node.setAttribute("x", dx + rect.x);
    //                 node.setAttribute("y", dy + rect.y);
    //                 break;
    //         }
    //     });
    // }

    FitToContents(topmargin = 0, rightmargin = 0, bottommargin = 0, leftmargin = 0) {
        var x, y, r, b;
        var bFirst = true;

        this.domelement.childNodes.forEach(node => {
            if (node != this.Border.domelement) {

                /**@type{SVGRect} */
                var rect = node.getBBox();
                if (bFirst || x > rect.x) x = rect.x;
                if (bFirst || y > rect.y) y = rect.y;
                if (bFirst || r < rect.x + rect.width) r = rect.x + rect.width;
                if (bFirst || b < rect.y + rect.height) b = rect.y + rect.height;
                bFirst = false;
            }

        });
        this.Border.x = x - leftmargin; this.Border.y = y - topmargin; this.Border.height = b - y + topmargin + bottommargin; this.Border.width = r - x + leftmargin + rightmargin;
    }
}

//#endregion

class dbnSVGText extends dbnSVGStrokableElement {
    constructor(parent) {
        super("text", parent);
        this.SetVerticalAlignHanging();
    }
    get x() { return this.domelement.getAttribute("x"); }
    set x(value) { this.domelement.setAttribute("x", value); }
    get y() { return this.domelement.getAttribute("y"); }
    set y(value) { this.domelement.setAttribute("y", value); }
    get textContent() { return this.domelement.textContent; }
    set textContent(value) { this.domelement.textContent = value; }

    get dominantBaseline() { return this.domelement.getAttribute("dominant-baseline"); }
    set dominantBaseline(value) { this.domelement.setAttribute("dominant-baseline", value); }
    get textAnchor() { return this.domelement.getAttribute("text-anchor"); }
    set textAnchor(value) { this.domelement.setAttribute("text-anchor", value); }

    SetHorizontalAlignStart() { this.textAnchor = "start"; }
    SetHorizontalAlignMiddle() { this.textAnchor = "middle"; }
    SetHorizontalAlignEnd() { this.textAnchor = "end"; }

    SetVerticalAlignMiddle() { this.dominantBaseline = "middle"; }
    SetVerticalAlignHanging() { this.dominantBaseline = "hanging"; }
    SetVerticalAlignAuto() { this.dominantBaseline = "auto"; }
}


class dbnSVGGroup extends dbnSVGElement {
    constructor(parent) { super("g", parent); }
}

class dbnSVG extends dbnSVGElement {
    constructor(parent = null) {
        super("svg", parent);
    }

    Clear() {
        this.domelement.innerHTML = "";
        this.#defs = null;
    }

    /**@type{dbnSVGElement} */
    #defs;

    /**
     * 
     * @param {dbnSVGElement} def 
     */
    AddDef(def) {
        if (!this.#defs) this.#defs = this.createAndAppendElement("defs");
        this.#defs.appendChild(def);
    }

    SetSize(width, height) {
        this.domelement.setAttribute("width", width);
        this.domelement.setAttribute("height", height);
    }

}

class dbnSVGPattern extends dbnSVGElement {
    constructor(parent = null) {
        super("pattern", parent);
    }
}

class dbnSVGMarker extends dbnSVGElement {
    constructor(parent = null) {
        super("marker", parent);
        this.Orient = "auto";
    }

    get MarkerWidth() { return this.domelement.getAttribute("markerWidth"); }
    set MarkerWidth(value) { this.domelement.setAttribute("markerWidth", value); }
    get MarkerHeight() { return this.domelement.getAttribute("markerHeight"); }
    set MarkerHeight(value) { this.domelement.setAttribute("markerHeight", value); }

    get RefX() { return this.domelement.getAttribute("refX"); }
    set RefX(value) { this.domelement.setAttribute("refX", value); }
    get RefY() { return this.domelement.getAttribute("refY"); }
    set RefY(value) { this.domelement.setAttribute("refY", value); }

    get Orient() { return this.domelement.getAttribute("orient"); }
    set Orient(value) { this.domelement.setAttribute("orient", value); }
}
//#endregion