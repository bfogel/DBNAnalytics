<?

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

add_shortcode('dbnPlayerPage', 'dbnPlayer_MainPage');


function dbnPlayer_MainPage()
{

    $sPlayerID = $_GET["pid"];
    if ($sPlayerID == null) {
        $sPlayerID = "None";
    }
    $ret = dbn_GetHTML('Player', $sPlayerID);

    return $ret;
}

function dbnVersion()
{
    return 13;
}

add_shortcode('dbnPlayerVsPlayer', 'dbnPlayerVsPlayer_Create');
function dbnPlayerVsPlayer_Create()
{
    $ret = "";
    $ret .= "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/DBNAnalytics.css?x=" . dbnVersion() . "'>";
    $ret .= "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/PowerAuction.css?x=" . dbnVersion() . "'>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNUI.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNGames.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PlayerComparison.js?x=" . dbnVersion() . "'></script>";
    return $ret;
}

add_shortcode('dbnPowerAuctionDemo', 'dbnPowerAuctionDemo_Create');
function dbnPowerAuctionDemo_Create()
{
    $ret = "";
    $ret .= "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/DBNAnalytics.css?x=" . dbnVersion() . "'>";
    $ret .= "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/PowerAuction.css?x=" . dbnVersion() . "'>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNUI.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PowerAuction.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PowerAuctionDemo.js?x=" . dbnVersion() . "'></script>";
    return $ret;
}

add_shortcode('dbnTDPortal', 'dbnTDPortal_Create');
function dbnTDPortal_Create()
{
    $ret = "";
    $ret .= "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/DBNAnalytics.css?x=" . dbnVersion() . "'>";
    $ret .= "<link rel = 'stylesheet' href = '/wp-content/plugins/DBNAnalytics/css/PowerAuction.css?x=" . dbnVersion() . "'>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNUI.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/DBNGames.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/PowerAuction.js?x=" . dbnVersion() . "'></script>";
    $ret .= "<script src = '/wp-content/plugins/DBNAnalytics/js/TDPortal.js?x=" . dbnVersion() . "'></script>";
    return $ret;
}

add_shortcode('dbnTest', 'dbdTest_Create');
function dbdTest_Create()
{
    $ret = "Hi there<BR>";
    wp_localize_script( 'wp-api', 'wpApiSettings', array(
        'root' => esc_url_raw( rest_url() ),
        'nonce' => wp_create_nonce( 'wp_rest' )
    ) );
    return $ret;
}
