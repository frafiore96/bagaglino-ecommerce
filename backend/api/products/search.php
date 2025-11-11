<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = isset($_GET['q']) ? trim($_GET['q']) : '';
    
    if (empty($query)) {
        echo json_encode([]);
        exit();
    }
    
    try {
        $searchQuery = "SELECT * FROM products 
                       WHERE (archived = FALSE OR archived IS NULL) 
                       AND (name LIKE :query 
                       OR description LIKE :query 
                       OR category LIKE :query 
                       OR gender LIKE :query)
                       ORDER BY name";
        $stmt = $db->prepare($searchQuery);
        $searchTerm = "%{$query}%";
        $stmt->bindParam(":query", $searchTerm);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($products);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore ricerca: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>