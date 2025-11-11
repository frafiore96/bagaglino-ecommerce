<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
    
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    try {
        $query = "SELECT size, stock FROM product_sizes WHERE product_id = :product_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();
        $sizes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $result = [];
        foreach ($sizes as $size) {
            $result[$size['size']] = (int)$size['stock'];
        }
        
        http_response_code(200);
        echo json_encode($result);
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>