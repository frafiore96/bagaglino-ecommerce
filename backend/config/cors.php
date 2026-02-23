<?php
require_once __DIR__ . '/config.php';

$corsConfig = Config::getCorsConfig();

// Set CORS headers
foreach ($corsConfig['allowed_origins'] as $origin) {
    if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $origin) {
        header("Access-Control-Allow-Origin: " . $origin);
        break;
    }
}

// If no specific origin matched and we're in development, allow the first origin
if (!headers_sent() && Config::isDevelopment()) {
    header("Access-Control-Allow-Origin: " . $corsConfig['allowed_origins'][0]);
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: " . implode(", ", $corsConfig['allowed_methods']));
header("Access-Control-Max-Age: " . $corsConfig['max_age']);
header("Access-Control-Allow-Headers: " . implode(", ", $corsConfig['allowed_headers']));

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}
?>
