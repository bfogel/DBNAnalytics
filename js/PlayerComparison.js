//2022-03-11 - I believe this file is obsolete

var cardPlayerComparison = null;
var selPlayer1 = null;
var selPlayer2 = null;

/**@type{dbnDiv} */ var divGames = null;
var divGamesStatus = null;
var tblGames = null;

function MakePlayerComparison() {

    var titlecard = dbnHere().addTitleCard("Player vs. Player History");
    titlecard.addText("DBNI qualifying events and exhibitions covered by DBN");

    cardPlayerComparison = dbnHere().addCard();

    var ss = cardPlayerComparison.createAndAppendElement("style");
    ss.addText(".otherPlayers {font-size: 15px !important; line-height: 130%; margin-bottom: 5px;}");

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

        tblGames = divGames.addTable();
        var cellcountries = [];
        var cellurls = [];
        var cellclasses = [];

        tblGames.Headers = ["Date", "Game", "Length", p1.PlayerName, p2.PlayerName, "Others"];

        tblGames.Data = games.map((game, iRow) => {
            var line1 = game.GetResultLineForPlayer(p1.PlayerID);
            var line2 = game.GetResultLineForPlayer(p2.PlayerID);

            cellcountries.push([iRow, 3, line1.Country]);
            cellcountries.push([iRow, 4, line2.Country]);

            // var fRes = (line) => line.CenterCount + "c (" + line.Rank + (line.Rank == line.RankScore ? "" : "T") + ") " + line.Country;
            var fRes = (line) => line.CenterCount + "c " + line.Country + " (" + line.Rank + (line.Rank == line.RankScore ? "" : "T") + ")";

            var dOthers = new dbnDiv();
            dOthers.className = "otherPlayers";

            for (const country in game.ResultLines) {
                var line = game.ResultLines[country];
                if (line != line1 && line != line2) {
                    dOthers.addText(country.substring(0, 1) + " " + line.Player.PlayerName + " (" + line.CenterCount + "c)");
                    dOthers.addLineBreak();
                }
            }

            var dg = new dbnDiv();
            dg.addText(game.Competition.CompetitionName);
            dg.addLineBreak();
            dg.addText(game.Label);
            dg.addLineBreak();

            if (game.URL != null) {
                var link = new dbnLink();
                link.href = game.URL;
                link.addText("View game");
                link.checkForExternal();
                dg.appendChild(link);
            }

            return [
                game.EndDate, dg
                , game.GameYearsCompleted + 1900
                , fRes(line1), fRes(line2)
                , dOthers
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