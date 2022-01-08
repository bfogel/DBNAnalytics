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

add_shortcode( 'dbnPlayerVsPlayer', 'dbnPlayerVsPlayer_Create' );
function dbnPlayerVsPlayer_Create() {
    $ret = "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/DBNAnalytics.css'>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNAnalytics.js?x=1'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PlayerComparison.js?x=1'></script>";
    return $ret;
}

?>