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
        echo json_encode(["message" => "Nessun file caricato o errore durante upload"]);
        exit();
    }
    
    $file = $_FILES['image'];
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileType = $file['type'];
    
    // Validazione tipo file
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!in_array($fileType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["message" => "Solo file PNG, JPG, JPEG sono permessi"]);
        exit();
    }
    
    // Validazione dimensione (5MB max)
    if ($fileSize > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(["message" => "File troppo grande. Massimo 5MB"]);
        exit();
    }
    
    // Genera nome file unico
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $newFileName = 'product_' . uniqid() . '.' . $fileExtension;
    
    // Directory di destinazione
    $uploadDir = '../../uploads/products/';
    $uploadPath = $uploadDir . $newFileName;
    
    // Crea directory se non esiste
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Sposta file
    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        // URL pubblico dell'immagine
        $imageUrl = 'http://localhost:8000/uploads/products/' . $newFileName;
        
        http_response_code(200);
        echo json_encode([
            "message" => "Upload completato",
            "image_url" => $imageUrl,
            "filename" => $newFileName
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante il salvataggio del file"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>