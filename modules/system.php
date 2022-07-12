<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

include("dataaccess.php");

function dbn_GetHTML($category, $id) {
	return dbn_GetHTMLWithConn(dbn_GetConnection(), $category, $id);
}

function dbn_GetHTMLWithConn($conn, $category, $id) {

	$sql = 'SELECT HTML as sHTML
		FROM CustomHTML
		WHERE Category = "' . $category . '" AND ID = "' . $id . '"';
	
	$result = $conn -> query($sql);
	
	if (!$result) {
		return null;
	} elseif ($result -> num_rows == 0) {
		return null;
	} else {
		$row = $result -> fetch_assoc();
		return $row["sHTML"];
	}

}

class dbnResponder
{

    public $Version = 54;

    public $CSS_DBNAnalytics = true;
    public $CSS_PowerAuction = false;

    public $JS_DBNUI = true;
    public $JS_DBNGames = true;

    public $JS_PlayerGameList = false;

    public $JS_GameModel = false;
    public $JS_MapView = false;

    public $JS_PowerAuction = false;
    public $JS_PowerAuctionDemo = false;

    public $JS_PlayerPortal = false;
    public $JS_TDPortal = false;

    public $JS_CompetitionPage = false;
    public $JS_CompetitionGroupPage = false;

    public function Generate()
    {

        $mainpath = "/wp-content/plugins/DBNAnalytics/";
        $bNonceRequired = false;

        $css = [];
        if ($this->CSS_DBNAnalytics) array_push($css, "DBNAnalytics");
        if ($this->CSS_PowerAuction) array_push($css, "PowerAuction");

        $js_system = [];
        if ($this->JS_DBNUI) array_push($js_system, "DBNUI");
        if ($this->JS_DBNGames) array_push($js_system, "DBNGames");

        $js_page = [];
        if ($this->JS_PlayerGameList) array_push($js_page, "PlayerGameList");

        if ($this->JS_GameModel) array_push($js_page, "GameModel");
        if ($this->JS_MapView) array_push($js_page, "MapView");

        if ($this->JS_PowerAuction) array_push($js_page, "PowerAuction");
        if ($this->JS_PowerAuctionDemo) array_push($js_page, "PowerAuctionDemo");

        if ($this->JS_PlayerPortal) array_push($js_page, "PlayerPortal");
        if ($this->JS_TDPortal)  array_push($js_page, "TDPortal");

        if ($this->JS_CompetitionPage) array_push($js_page, "CompetitionPage");
        if ($this->JS_CompetitionGroupPage) array_push($js_page, "CompetitionGroupPage");

        $ret = "";
        foreach ($css as $value) {
            $ret .= "<link rel = 'stylesheet' href = '" . $mainpath . "css/" . $value . ".css?x=" . $this->Version . "'>";
        }

        foreach ($js_system as $value) {
            $ret .= "<script src = '" . $mainpath . "js/" . $value . ".js?x=" . $this->Version . "'></script>";
        }

        if ($this->JS_PlayerPortal || $this->JS_TDPortal) {
            $ret .= "<script>myHub.Ticket = '" . wp_create_nonce('wp_rest') . "';</script>";
        }

        foreach ($js_page as $value) {
            $ret .= "<script src = '" . $mainpath . "js/" . $value . ".js?x=" . $this->Version . "'></script>";
        }

        return $ret;
    }
}
