<?php
/* Simple Proxy service written in PHP to use CURL and POST data cross-domain */
/* Author: Matt Yao */

$curl  = curl_init();
$reply = 'Empty Object.';

if($_POST)
{

    $url = $_POST['csurl'];
    unset($_POST['csurl']);

    $params = $_POST;

    $headers = array();
    $headers[] = 'Content-Type: application/json';

    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_URL => $url,
        CURLOPT_POSTFIELDS => json_encode($params)
    ));

    // Send the request & save response to $resp
    $resp = curl_exec($curl);
    echo $resp;

    // Close request to clear up some resources
    curl_close($curl);
}



