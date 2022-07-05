<?

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

//Remove this once you've converted the player page to full dynamic
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
//-----------------

add_shortcode('dbnPlayerVsPlayer', 'dbnPlayerVsPlayer_Create');
function dbnPlayerVsPlayer_Create()
{
    $responder = new dbnResponder();
    $responder->CSS_PowerAuction = true; //Is this really needed?
    $responder->JS_PlayerGameList = true;
    return $responder->Generate();
}

add_shortcode('dbnPowerAuctionDemo', 'dbnPowerAuctionDemo_Create');
function dbnPowerAuctionDemo_Create()
{
    $responder = new dbnResponder();
    $responder->CSS_PowerAuction = true;
    $responder->JS_PowerAuction = true;
    $responder->JS_PowerAuctionDemo = true;
    return $responder->Generate();
}

add_shortcode('dbnTDPortal', 'dbnTDPortal_Create');
function dbnTDPortal_Create()
{
    $responder = new dbnResponder();
    $responder->CSS_PowerAuction = true;
    $responder->JS_PowerAuction = true;
    $responder->JS_TDPortal = true;
    return $responder->Generate();
}

add_shortcode('dbnPlayerPortal', 'dbnPlayerPortal_Create');
function dbnPlayerPortal_Create()
{
    $responder = new dbnResponder();
    $responder->CSS_PowerAuction = true;
    $responder->JS_PowerAuction = true;
    $responder->JS_PlayerPortal = true;
    return $responder->Generate();
}

add_shortcode('dbnTest', 'dbdTest_Create');
function dbdTest_Create()
{
    $ret = "Hi there<BR>";

    // $nonce = wp_create_nonce('wp_rest');
    // $ret .= "Nonce: " . $nonce . "<br>";

    // $ret .= "<script>var mWPNonce2 = '" . $nonce . "';</script>";


    return $ret;
}
