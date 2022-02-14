<?php
/**
 * @package DBNAnalytics
 * @version 1.0
 */
/*
Plugin Name: DBN Analytics
Description: This plugin provides access to dynamic content related to DBN broadcasts and analytical tools for use with the game of Diplomacy 
Author: Brandon Fogel, Andrew Zick
Version: 1.0
*/

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

//phuntimes

include("modules/system.php");
include("modules/competition.php");
include("modules/player.php");
include("modules/scoringcalculator.php");
include("hubget.php");

?>