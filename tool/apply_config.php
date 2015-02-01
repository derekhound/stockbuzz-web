#!/usr/bin/php
<?php

define('ROOT', 			dirname(__FILE__).'/..');

define('FB_REL_APP_ID',	'1463897383848506');
define('FB_DEV_APP_ID',	'1469574093280835');


function usage()
{
   $doc = <<<EOF
    ./apply_config --type rel
    ./apply_config --type dev

EOF;

   echo $doc;
}

function get_opts()
{
	// short
	$shortopts  = '';

	// long
	$longopts  = array(
		'help',
		'type:'
	);

	// getopt
	$opts = getopt($shortopts, $longopts);

	return $opts;
}

function fb_config($type)
{
	$path 	= escapeshellarg(ROOT.'/dist/scripts/application.js');

	// fb app id
	$word	= ($type == 'rel') ? FB_REL_APP_ID : FB_DEV_APP_ID;
	$cmd 	= "sed -i 's/FB_APP_ID/{$word}/g' $path";
	exec($cmd, $output, $ret);
	$status = ($ret == 0) ? 'OK' : 'Not OK';
	echo "[FB_APP_ID] apply config...[{$status}]\n";
}

function main()
{
	// get opts
	$opts = get_opts();

	// usage
	if (empty($opts) || isset($opts['help'])) {
		usage();
		exit(0);
	}

	// type
	$type = $opts['type'];

	// fb config
	fb_config($type);
}

main();
