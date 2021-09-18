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

?>