function bfMakeTable(body, headers, title){ 
  
   table = document.createElement("table");
   table.className = "bftable";

    var thead = table.createTHead();
    var tbody = table.createTBody();

    var titleCell = null;
    if(title != null){
      var row = thead.insertRow();
      row.className = "bftableTitleRow";
      titleCell = document.createElement("th");
      titleCell.innerHTML = title;
      row.appendChild(titleCell);
    }

    var colcount = 0;

    if(headers!=null){
      row = thead.insertRow();
      row.className = "bftableHeaderRow";
      for (var hh of headers) {  
        var cell = document.createElement("th");
        row.appendChild(cell);
        cell.innerHTML = hh;
      }
      if(row.childElementCount > colcount) colcount = row.childElementCount;
    }

    for (var rr of body) {  
  	  row = tbody.insertRow();

      for (var cc of rr) {  
        var cell = row.insertCell();
        cell.innerHTML = cc;
      }
      if(row.childElementCount > colcount) colcount = row.childElementCount;
    }

    if(titleCell != null) titleCell.colSpan = colcount;

    return table;
}

function bfStyleTableNumberColumns(table, columns){ 
  for (const row of table.tBodies[0].rows){
    for(const i of columns){
      if(i < row.children.length) row.children[i].className += " bfnumcolumn";
    }
  }
}

function bfStyleTableCountryRows(table, countries){ 
  var tbody = table.tBodies[0];
  for( var i = 0; i < countries.length; i++){
    if(i < tbody.rows.length) tbody.rows[i].className += " bf" + countries[i] + "Back";
   }
}

function bfMakeTableClickable(table, urls){
  var tbody = table.tBodies[0];
  tbody.className = "bfTableClickable"; 
  for( var i = 0; i < urls.length; i++){
    if(i < tbody.rows.length) tbody.rows[i].setAttribute("onclick", " document.location = '" + urls[i] + "'");
   }
}

function bfTabsSetup(divcase, tabs) {
  var divbtns = document.createElement("div");
  divcase.appendChild(divbtns);
  divbtns.className = "bftab";

  var i = 0;
  for (var key in tabs) {
      var content = tabs[key];
      if(content == null) content = "(null)";
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
    for (i = 0; i < tabcontent.length; i++)
    {
        tabcontent[i].style.display = 'none';
    }
    tablinks = divcase.getElementsByClassName('bftablinks');
    for (i = 0; i < tablinks.length; i++)
    {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(divname).style.display = 'block';
    evt.currentTarget.className += ' active';
}

function bfTabsOpenContentByIndex(divcasename, index) {
    document.getElementById(divcasename + 'Button' + index).click();
}