
var cardPlayerComparison = null;
var selPlayer1 = null;
var selPlayer2 = null;

var divGames = null;
var divGamesStatus = null;
var tblGames = null;

function MakePlayerComparison() {

    var titlecard = dbnHere().addCard();
    var title = titlecard.createAndAppendElement("h1");
    title.addText("Player vs. Player History");
    titlecard.addText("DBNI qualifying events and exhibitions covered by DBN");

    cardPlayerComparison = dbnHere().addCard();

    var ss = cardPlayerComparison.createAndAppendElement("style");
    ss.addText(".dbnxx {font-size: 14px !important; line-height: 130%; }");

    cardPlayerComparison.addText("Player 1: ");
    selPlayer1 = new dbnPlayerSelector(cardPlayerComparison);

    cardPlayerComparison.createAndAppendElement("br");

    cardPlayerComparison.addText("Player 2: ");
    selPlayer2 = new dbnPlayerSelector(cardPlayerComparison);

    selPlayer1.onchange = LoadComparison;
    selPlayer2.onchange = LoadComparison;

    var style = "width: 300px; margin-bottom: 10px;";
    selPlayer1.domelement.style = style;
    selPlayer2.domelement.style = style;

    divGames = cardPlayerComparison.addDiv();

    divGamesStatus = cardPlayerComparison.addDiv();

    // selPlayer1.domelement.value = 203;
    // selPlayer2.domelement.value = 222;
    // LoadComparison();

}
MakePlayerComparison();

function LoadComparison() {
    divGamesStatus.domelement.innerHTML = "Loading...";
    divGames.domelement.innerHTML = "";

    var p1 = selPlayer1.SelectedPlayer;
    var p2 = selPlayer2.SelectedPlayer;

    var games = null;

    if (p1 != null && p2 != null) {
        games = myHub.GetGamesForPlayers(p1.PlayerID, p2.PlayerID);
    }

    if (games != null) {
        divGamesStatus.domelement.innerHTML = "";

        tblGames = new dbnTable(divGames);
        var cellcountries = [];
        var cellurls = [];
        var cellclasses = [];

        tblGames.Headers = ["Date", "Game", "Length", p1.PlayerName, p2.PlayerName, "Platform", "Others"];

        tblGames.Data = games.map((game, iRow) => {
            var line1 = game.GetResultLineForPlayer(p1.PlayerID);
            var line2 = game.GetResultLineForPlayer(p2.PlayerID);

            cellcountries.push([iRow, 3, line1.Country]);
            cellcountries.push([iRow, 4, line2.Country]);
            cellclasses.push([iRow, 6, "dbnxx"]);

            if (game.URL != null) cellurls.push([iRow, 5, game.URL]);

            // var fRes = (line) => line.CenterCount + "c (" + line.Rank + (line.Rank == line.RankScore ? "" : "T") + ") " + line.Country;
            var fRes = (line) => line.CenterCount + "c " + line.Country + " (" + line.Rank + (line.Rank == line.RankScore ? "" : "T") + ")";

            var others = "";
            for (const country in game.ResultLines) {
                var line = game.ResultLines[country];
                if (line != line1 && line != line2) {
                    others += country.substring(0, 1) + " " + line.Player.PlayerName + " (" + line.CenterCount + "c)" + "<BR>";
                }
            }

            var xx = new dbnDiv();
            xx.domelement.innerHTML = others;

            return [
                game.EndDate, game.Competition.CompetitionName + "<br>" + game.Label
                , game.GameYearsCompleted + 1900
                , fRes(line1), fRes(line2)
                , game.Platform
                , xx
            ]
        });
        tblGames.CellUrls = cellurls;
        tblGames.CountryCells = cellcountries;
        tblGames.CellClasses = cellclasses;
        tblGames.ClickHeaderToSort = true;
        tblGames.Generate();
    } else {
        divGamesStatus.domelement.innerHTML = "None";
    }

}