<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';
include_once '../../includes/validation.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = requireAuth($db);
    
    // Rimuovi token
    $query = "UPDATE users SET token = NULL WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $user['id']);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Logout effettuato"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante logout"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>
