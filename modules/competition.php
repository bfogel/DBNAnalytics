<?

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_shortcode( 'dbnCompetitionResults', 'dbnCompetition_GetResults' );

function dbnCompetition_GetResults() {

	$iID = $_GET["compid"];
	if ($iID == null) {$iID = "VDL20212041DBNIQ2022";}
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

add_shortcode( 'dbnCompetitionResults2', 'dbnCompetition_GetResults2' );

function dbnCompetition_GetResults2() {

	$data = [[110,111],["hi",113]];

	$ret = "<div id = 'wxyz'></div>";

	$ret .= "<link rel='stylesheet' href='/wp-content/plugins/bfDBN/css/bfDBN.css'>";

	$ret .= "<script src='/wp-content/plugins/bfDBN/js/bfdbn.js'></script>";
	$ret .= "<script>";
	$ret .= "data = " . json_encode($data) . ";\n";
	$ret .= "var x1 = bfMakeTable(data);\n";
	$ret .= "var xyz1 = document.getElementById('wxyz');\n";
	$ret .= "xyz1.appendChild(x1);\n";
	$ret .= "</script>";
	
    return $ret;
}

?>