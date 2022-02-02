<?

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_shortcode( 'dbnPlayerPage', 'dbnPlayer_MainPage' );


function dbnPlayer_MainPage() {

	$sPlayerID .= $_GET["pid"];
	if ($sPlayerID == null) {$sPlayerID = "None";}
	$ret .= dbn_GetHTML('Player', $sPlayerID);

    return $ret;
}

function dbnVersion(){return 7;}

add_shortcode( 'dbnPlayerVsPlayer', 'dbnPlayerVsPlayer_Create' );
function dbnPlayerVsPlayer_Create() {
    $ret = "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/DBNAnalytics.css?x=" . dbnVersion() . "'>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNUI.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNGames.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PlayerComparison.js?x=" . dbnVersion() . "'></script>";
    return $ret;
}

add_shortcode( 'dbnPowerAuctionDemo', 'dbnPowerAuctionDemo_Create' );
function dbnPowerAuctionDemo_Create() {
    $ret = "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/DBNAnalytics.css?x=" . dbnVersion() . "'>";
    $ret = "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/PowerAuctionDemo.css?x=" . dbnVersion() . "'>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNUI.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PowerAuction.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PowerAuctionDemo.js?x=" . dbnVersion() . "'></script>";
    return $ret;
}

?>