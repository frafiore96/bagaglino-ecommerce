<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = requireAdmin($db);
    
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["message" => "No file uploaded or error during upload"]);
        exit();
    }
    
    $file = $_FILES['image'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileType = $file['type'];
    
    // File type validation
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!in_array($fileType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["message" => "Only PNG, JPG, JPEG files are allowed"]);
        exit();
    }
    
    // Size validation (5MB max)
    if ($fileSize > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(["message" => "File too large. Maximum 5MB"]);
        exit();
    }
    
    // Generate unique filename
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $newFileName = 'product_' . uniqid() . '.' . $fileExtension;
    
    // Destination directory
    $uploadDir = '../../uploads/products/';
    $uploadPath = $uploadDir . $newFileName;
    
    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Move file
    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        // Public image URL - using config for dynamic URL
        require_once '../../config/config.php';
        $apiConfig = Config::getApiConfig();
        $baseUrl = str_replace('/api', '', $apiConfig['base_url']);
        $imageUrl = $baseUrl . '/uploads/products/' . $newFileName;
        
        http_response_code(200);
        echo json_encode([
            "message" => "Upload completed",
            "image_url" => $imageUrl,
            "filename" => $newFileName
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Error during file save"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
?>