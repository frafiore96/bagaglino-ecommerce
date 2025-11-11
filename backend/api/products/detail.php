<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    try {
        $query = "SELECT 
                    id,
                    product_code,
                    name,
                    description,
                    price,
                    image_url,
                    gender,
                    category,
                    stock,
                    created_at
                  FROM products 
                  WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(["message" => "Prodotto non trovato o non disponibile"]);
            exit();
        }
        
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($product);
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore nel caricamento prodotto: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>