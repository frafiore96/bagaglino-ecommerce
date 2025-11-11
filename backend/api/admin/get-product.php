<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAdmin($db);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    $query = "SELECT * FROM products WHERE id = :id"; // Nessun filtro stock
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(["message" => "Prodotto non trovato"]);
        exit();
    }
    
    echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>