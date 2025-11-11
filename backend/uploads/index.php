<?php
// Serve static files
$requestUri = $_SERVER['REQUEST_URI'];
$file = __DIR__ . parse_url($requestUri, PHP_URL_PATH);

if (file_exists($file) && !is_dir($file)) {
    // Set appropriate content type
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        default:
            header('Content-Type: application/octet-stream');
    }
    
    readfile($file);
} else {
    http_response_code(404);
    echo "File not found";
}
?>