<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $user = requireAdmin($db);
    
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    try {
        $query = "UPDATE products SET archived = TRUE WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["message" => "Prodotto archiviato con successo"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Errore durante archiviazione"]);
        }
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>