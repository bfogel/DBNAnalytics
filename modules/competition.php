<?

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

add_shortcode('dbnCompetitionResults', 'dbnCompetition_GetResults');

function dbnCompetition_GetResults()
{

	$iID = $_GET["compid"];
	if ($iID == null) {
		$iID = "VDL20224069VDL";
	}
	$ret = dbn_GetHTML('Competition', $iID);

	return $ret;
}

add_shortcode('dbnCompetitionGroup', 'dbnCompetitionGroup_GetResults');

function dbnCompetitionGroup_GetResults()
{

	$iID = $_GET["groupid"];
	if ($iID == null) {
		$iID = "DBNIQ2022";
	}
	$ret = dbn_GetHTML('CompGroup', $iID);

	return $ret;
}

//The new stuff
add_shortcode('dbnCompetitionPage', 'dbnCompetition_GetPage');
function dbnCompetition_GetPage($atts = [], $content = null, $tag = '')
{
	$responder = new dbnResponder();
	$responder->HubParameters = $atts;
	$responder->JS_MapView = true;
	$responder->JS_CompetitionPage = true;
	return $responder->Generate();
}

add_shortcode('dbnCompetitionGroupPage', 'dbnCompetitionGroup_GetPage');
function dbnCompetitionGroup_GetPage($atts = [], $content = null, $tag = '')
{
	$responder = new dbnResponder();
	$responder->HubParameters = $atts;
	$responder->JS_CompetitionGroupPage = true;
	return $responder->Generate();
}

add_shortcode('dbnCompetitionRootPage', 'dbnCompetitionRoot_GetPage');
function dbnCompetitionRoot_GetPage($atts = [], $content = null, $tag = '')
{
	$responder = new dbnResponder();
	$responder->JS_CompetitionRootPage = true;
	return $responder->Generate();
}

add_shortcode('dbnGamePage', 'dbnGamePage_GetPage');
function dbnGamePage_GetPage($atts = [], $content = null, $tag = '')
{
	$responder = new dbnResponder();
	$responder->JS_MapView = true;
	$responder->JS_GamePage = true;
	return $responder->Generate();
}

add_shortcode('dbnMapView', 'dbnMapView_GetPage');
function dbnMapView_GetPage($atts = [], $content = null, $tag = '')
{
	$responder = new dbnResponder();
	$responder->JS_MapView = true;
	return $responder->Generate();
}
