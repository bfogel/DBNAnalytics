<?

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_shortcode( 'dbnCompetitionResults', 'dbnCompetition_GetResults' );

function dbnCompetition_GetResults() {

	$iID = $_GET["compid"];
	if ($iID == null) {$iID = "VDL20224069VDL";}
	$ret = dbn_GetHTML('Competition', $iID);

    return $ret;
}

add_shortcode( 'dbnCompetitionGroup', 'dbnCompetitionGroup_GetResults' );

function dbnCompetitionGroup_GetResults() {

	$iID = $_GET["groupid"];
	if ($iID == null) {$iID = "DBNIQ2022";}
	$ret = dbn_GetHTML('CompGroup', $iID);

    return $ret;
}

add_shortcode( 'dbnCompetitionPage', 'dbnCompetition_GetPage' );
function dbnCompetition_GetPage($atts = [], $content = null, $tag = '')
{
    $responder = new dbnResponder();
    $responder->JS_CompetitionPage = true;
    return $responder->Generate();
}

?>