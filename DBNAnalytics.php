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


function disable_elementor_overview_widget() {
	remove_meta_box( 'e-dashboard-overview', 'dashboard', 'normal');
}
add_action('wp_dashboard_setup', 'disable_elementor_overview_widget', 40);

function disable_owp_dashboard_news_widget() {
	remove_meta_box( 'owp_dashboard_news', 'dashboard', 'normal');
}
add_action('wp_dashboard_setup', 'disable_owp_dashboard_news_widget', 40);

function redirect_admin( $redirect_to, $request, $user ){

    //is there a user to check?

    if ( isset( $user->roles ) && is_array( $user->roles ) ) {

		$redirect_to = '/player-portal/'; // Your redirect URL
		
		//check for admins
        // if ( in_array( 'administrator', $user->roles ) ) {

        //     $redirect_to = '/player-portal/'; // Your redirect URL
        // }
    }

    return $redirect_to;
}

add_filter( 'login_redirect', 'redirect_admin', 10, 3 );
