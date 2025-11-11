<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $user = requireAdmin($db);
    
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    try {
        $checkQuery = "SELECT id, name FROM products WHERE id = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":id", $id);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(["message" => "Prodotto non trovato"]);
            exit();
        }
        
        $product = $checkStmt->fetch(PDO::FETCH_ASSOC);
        
        $orderQuery = "SELECT COUNT(*) as order_count FROM order_items WHERE product_id = :id";
        $orderStmt = $db->prepare($orderQuery);
        $orderStmt->bindParam(":id", $id);
        $orderStmt->execute();
        $orderResult = $orderStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($orderResult['order_count'] > 0) {
            http_response_code(400);
            echo json_encode(["message" => "Impossibile eliminare: prodotto presente in ordini esistenti"]);
            exit();
        }
        
        $deleteQuery = "DELETE FROM products WHERE id = :id";
        $deleteStmt = $db->prepare($deleteQuery);
        $deleteStmt->bindParam(":id", $id);
        
        if ($deleteStmt->execute()) {
            http_response_code(200);
            echo json_encode([
                "message" => "Prodotto eliminato con successo",
                "deleted_product" => $product['name']
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Errore durante l'eliminazione"]);
        }
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore del server: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>