<?php
// Copyright (c) 2011, DLH
// See LICENSE.txt for license info.
//
// armaauth.php: Utilities for Armagetron Advanced authentication

class ArmaAuth {
    // Returns a bool indicating whether the given username exists at that armaauth authority.
    //
    // Examples:
    //      ArmaAuth::is_valid_global_authenticated_name("dlh@forums")                     => TRUE
    //      ArmaAuth::is_valid_global_authenticated_name("dlh@ct/public")                  => TRUE
    //      ArmaAuth::is_valid_global_authenticated_name("dlh@generalconsumption.org")     => TRUE
    //      ArmaAuth::is_valid_global_authenticated_name("not dlh@generalconsumption.org") => FALSE
    //
    public static function is_valid_global_authenticated_name($authenticated_name, &$suggested_name=NULL, &$message=NULL) {
        $suggested_name = "";
        $message = "";

        $components = self::split_global_authenticated_name($authenticated_name);
        if (!$components)
            return FALSE;

        $user = $components[0];
        $authority = $components[1];
        $raw_authority = $components[2];

        $authority_response = self::fetch_authority_response($user, $authority, $message);
        $expect_exact_resonse = strpos($raw_authority, "/");
        $expected_exact = "PASSWORD_FAIL $authenticated_name";
        $expected_fuzzy = "PASSWORD_FAIL";
        $is_valid = $authority_response == $expected_exact || (!$expect_exact_resonse && $authority_response == $expected_fuzzy);

        if (!$is_valid) {
            preg_match("/PASSWORD_FAIL(?: (.+))?/", $authority_response, $suggested_name_matches);
            $count = count($suggested_name_matches);
            if ($count == 1) {
                $suggested_name = "$user@$authority";
            }
            else if ($count == 2) {
                $suggested_name = $suggested_name_matches[1];
            }
            else if ($message == "") {
                if (strpos($authority_response, "UNKNOWN_USER") !== 0 && strpos($authority_response, "USER_NOT_FOUND") !== 0) {
                    $is_valid = true;
                    $message = "The authority did not return a response that conforms to the armaauth 0.1 specification";
                }
                else {
                    $message = "The Global ID does not exist according to the authority";
                }
            }
        }
        if ($suggested_name !== "")
            $message = "The user exists but the authority suggested a different Global ID";
        return $is_valid;
    }

    // Fully validate a global authenticated name, including any name suggestions
    // received from the authority.
    //
    // Returns an associative array with the keys "names", "valid" and "message".
    public static function validate_global_authenticated_name($authenticated_name) {
        $names = array();
        $message = "";
        $valid = FALSE;

        for ($try = 0; $try < 3; $try++) {
            array_unshift($names, $authenticated_name);
            $valid = self::is_valid_global_authenticated_name($authenticated_name, $suggested_name, $new_message);
            if ($message === "")
                $message = $new_message;

            if ($valid || $suggested_name === "") {
                // Nothing else to check
                break;
            }
            else if (array_key_exists($suggested_name, $names)) {
                $message = "The authority is misconfigured (recursion)";
                break;
            }

            // Check new suggestion
            $authenticated_name = $suggested_name;
        }

        return array("names" => $names, "valid" => $valid, "message" => $message);
    }

    public static function debug_authority_response($authenticated_name) {
        $components = self::split_global_authenticated_name($authenticated_name);
        if (!$components)
            return FALSE;
        return self::make_authority_test_url($components[0], $components[1]);
    }

    private static function split_global_authenticated_name($authenticated_name) {
        preg_match("/(.+)@(.*)/", $authenticated_name, $components);

        if (empty($components))
            return FALSE;

        $user = $components[1];
        $raw_authority = $components[2];
        $authority = self::find_authority_basename($raw_authority);

        // A local username, such as foo@, or an invalid authority name
        if (empty($authority) || preg_match("/[^a-zA-Z0-9.-]/", $authority))
            return FALSE;

        return array($user, $authority, $raw_authority);
    }

    private static function find_authority_basename($authority) {
        $slash_pos = strpos($authority, "/");
        if ($slash_pos)
            return substr($authority, 0, $slash_pos);
        return $authority;
    }

    private static function make_authority_test_url($user, $authority) {
        $full_authority = strpos($authority, ".") ? $authority : "$authority.authentication.armagetronad.net";
        return "http://$full_authority/armaauth/0.1/?query=check&method=md5&salt=&hash=&user=" . urlencode($user);
    }

    private static function fetch_authority_response($user, $authority, &$message) {
        $url = self::make_authority_test_url($user, $authority);
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 4);
        curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP);
        curl_setopt($ch, CURLOPT_REDIR_PROTOCOLS, CURLPROTO_HTTP);
        $data = curl_exec($ch);
        if ($data === FALSE)
            $message = "Fetch error. " . curl_error($ch);
        curl_close($ch);
        $lines = explode("\n", $data, 2); // only interested in first line
        return $lines[0];
    }

    private function  __construct() { }
}

// Allow file to be included for library use
if (__FILE__ == realpath($_SERVER["SCRIPT_FILENAME"])) {
    if ($_GET["action"] == "validate") {
        header("Content-type: application/json");
        echo json_encode(ArmaAuth::validate_global_authenticated_name($_GET["name"]));
    }
    else if ($_GET["action"] == "debug_authority_response") {
        $url = ArmaAuth::debug_authority_response($_GET["name"]);
        if ($url)
            header("Location: $url");
        else
            echo "Something went wrong... not a valid global authenticated name?";
    }
}

?>
