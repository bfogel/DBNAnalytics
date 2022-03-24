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

class dbnResponder
{

    public $Version = 42;

    public $CSS_DBNAnalytics = true;
    public $CSS_PowerAuction = false;

    public $JS_DBNUI = true;
    public $JS_DBNGames = true;

    public $JS_PlayerGameList = false;

    public $JS_PowerAuction = false;
    public $JS_PowerAuctionDemo = false;

    public $JS_PlayerPortal = false;
    public $JS_TDPortal = false;

    public function Generate()
    {

        $mainpath = "/wp-content/plugins/DBNAnalytics/";
        $bNonceRequired = false;

        $css = [];
        if ($this->CSS_DBNAnalytics) array_push($css, "DBNAnalytics");
        if ($this->CSS_PowerAuction) array_push($css, "PowerAuction");

        $js_system = [];
        if ($this->JS_DBNUI) array_push($js_system, "DBNUI");
        if ($this->JS_DBNGames) array_push($js_system, "DBNGames");

        $js_page = [];
        if ($this->JS_PlayerGameList) array_push($js_page, "PlayerGameList");

        if ($this->JS_PowerAuction) array_push($js_page, "PowerAuction");
        if ($this->JS_PowerAuctionDemo) array_push($js_page, "PowerAuctionDemo");

        if ($this->JS_PlayerPortal) array_push($js_page, "PlayerPortal");
        if ($this->JS_TDPortal)  array_push($js_page, "TDPortal");

        $ret = "";
        foreach ($css as $value) {
            $ret .= "<link rel = 'stylesheet' href = '" . $mainpath . "css/" . $value . ".css?x=" . $this->Version . "'>";
        }

        foreach ($js_system as $value) {
            $ret .= "<script src = '" . $mainpath . "js/" . $value . ".js?x=" . $this->Version . "'></script>";
        }

        if ($this->JS_PlayerPortal || $this->JS_TDPortal) {
            $ret .= "<script>myHub.Ticket = '" . wp_create_nonce('wp_rest') . "';</script>";
        }

        foreach ($js_page as $value) {
            $ret .= "<script src = '" . $mainpath . "js/" . $value . ".js?x=" . $this->Version . "'></script>";
        }

        return $ret;
    }
}

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
