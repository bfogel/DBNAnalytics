
var cardPlayerComparison = null;
var selPlayer1 = null;
var selPlayer2 = null;

var divGames = null;
var divGamesStatus = null;
var tblGames = null;

function MakePlayerComparison() {

    var titlecard = new dbnCard();
    var title = titlecard.createAndAppendElement("h1");
    title.createAndAppendText("Player vs. Player History");
    titlecard.createAndAppendText("DBNI qualifying events and exhibitions covered by DBN");

    cardPlayerComparison = new dbnCard();

    cardPlayerComparison.createAndAppendText("Player 1: ");
    selPlayer1 = new dbnPlayerSelector(cardPlayerComparison);

    cardPlayerComparison.createAndAppendElement("br");

    cardPlayerComparison.createAndAppendText("Player 2: ");
    selPlayer2 = new dbnPlayerSelector(cardPlayerComparison);

    selPlayer1.onchange = LoadComparison;
    selPlayer2.onchange = LoadComparison;

    var style = "width: 300px; margin-bottom: 10px;";
    selPlayer1.element.style = style;
    selPlayer2.element.style = style;

    divGames = new dbnDiv(cardPlayerComparison);

    divGamesStatus = new dbnDiv(cardPlayerComparison);

    // selPlayer1.element.value = 203;
    // selPlayer2.element.value = 222;

    // LoadComparison();
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
        var cellcountries = [];
        var cellurls = [];

        tblGames.Headers = ["Date", "Game", "Length", p1.PlayerName, p2.PlayerName, "Platform", "Others"];

        tblGames.Data = games.map((game, iRow) => {
            var line1 = game.GetResultLineForPlayer(p1.PlayerID);
            var line2 = game.GetResultLineForPlayer(p2.PlayerID);

            cellcountries.push([iRow, 3, line1.Country]);
            cellcountries.push([iRow, 4, line2.Country]);

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

            return [
                game.EndDate, game.Competition.CompetitionName + "<br>" + game.Label
                , game.GameYearsCompleted + 1900
                , fRes(line1), fRes(line2)
                , game.Platform
                , others
            ]
        });
        tblGames.CellUrls = cellurls;
        tblGames.CountryCells = cellcountries;
        tblGames.ClickHeaderToSort = true;
        tblGames.Generate();
    } else {
        divGamesStatus.innerHTML = "None";
    }

}