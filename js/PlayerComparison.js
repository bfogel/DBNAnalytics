
var divPlayerComparison = null;
var selPlayer1 = null;
var selPlayer2 = null;

function MakePlayerComparison() {
    var scripttag = document.currentScript;
    divPlayerComparison = document.createElement("div");
    scripttag.parentElement.insertBefore(divPlayerComparison, scripttag);

    selPlayer1 = new dbnPlayerSelector("player1", divPlayerComparison);
    selPlayer2 = new dbnPlayerSelector("player2", divPlayerComparison);
    selPlayer1.onchange = LoadComparison;
    selPlayer2.onchange = LoadComparison;
 
    selPlayer1.element.value = 203;
    selPlayer2.element.value = 222;

    LoadComparison();
}
MakePlayerComparison();


function LoadComparison() {
    var p1 = selPlayer1.SelectedPlayer;
    var p2 = selPlayer2.SelectedPlayer;
    if (p1 == null || p2 == null) return;

    var games = myHub.GetGamesForPlayers(p1.PlayerID, p2.PlayerID);
    
}