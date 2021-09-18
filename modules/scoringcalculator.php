<?

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_shortcode( 'dbnScoringCalculator', 'dbnScoringCalculator_Create' );

function dbnScoringCalculator_Create() {
    $ret = "<link rel = 'stylesheet' href = 'https://diplobn.com/wp-content/plugins/DBNAnalytics/css/ScoringCalculator.css'>";
    $ret .= "<script src = 'https://diplobn.com/wp-content/plugins/DBNAnalytics/js/ScoringFunctions.js'></script>";
    $ret .= "<script src = 'https://diplobn.com/wp-content/plugins/DBNAnalytics/js/ScoringCalculator.js'></script>";
    $ret .= "<div id = 'ScoringCalculator'></div>";
    $ret .= "<script>CreateCalculator('ScoringCalculator');</script>";

    return $ret;
}

?>
