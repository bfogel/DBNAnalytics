
var divPlayerComparison = null;
var selPlayer1 = null;
var selPlayer2 = null;

var divGames = null;
var divGamesStatus = null;
var tblGames = null;

function MakePlayerComparison() {
    var scripttag = document.currentScript;
    divPlayerComparison = document.createElement("div");
    scripttag.parentElement.insertBefore(divPlayerComparison, scripttag);

    selPlayer1 = new dbnPlayerSelector(divPlayerComparison);
    selPlayer2 = new dbnPlayerSelector(divPlayerComparison);
    selPlayer1.onchange = LoadComparison;
    selPlayer2.onchange = LoadComparison;

    divGames = document.createElement("div");
    divPlayerComparison.appendChild(divGames);

    divGamesStatus = document.createElement("div");
    divGames.appendChild(divGamesStatus);

    selPlayer1.element.value = 203;
    selPlayer2.element.value = 222;

    LoadComparison();
}
MakePlayerComparison();


function LoadComparison() {
    divGamesStatus.innerHTML = "Loading...";
    divGames.innerHTML = "";

    var p1 = selPlayer1.SelectedPlayer;
    var p2 = selPlayer2.SelectedPlayer;

    var games = null;

    if (p1 != null && p2 != null) {
        games = myHub.GetGamesForPlayers(p1.PlayerID, p2.PlayerID);
    }

    if (games != null) {
        divGamesStatus.innerHTML = "";

        tblGames = new dbnTable2(divGames);
        tblGames.Headers = ["Date", "Competition", "Game"];
        tblGames.Data = games.map(x => {return [x.EndDate, x.Competition.CompetitionName, x.Label];});
        tblGames.ClickHeaderToSort = true;
        tblGames.Generate();
    } else {
        divGamesStatus.innerHTML = "None";
    }

}