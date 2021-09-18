<?

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_shortcode( 'dbnScoringCalculator', 'dbnScoringCalculator_Create' );

function dbnScoringCalculator_Create() {
    $ret = "<div id = 'ScoringCalculator'></div>";
    $ret .= "<script>CreateCalculator('ScoringCalculator')</script>";

    return $ret;
}

?>
