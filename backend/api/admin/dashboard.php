<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAdmin($db);
    
    try {
        // Count total products
        $productQuery = "SELECT COUNT(*) as total_products FROM products";
        $productStmt = $db->prepare($productQuery);
        $productStmt->execute();
        $productResult = $productStmt->fetch(PDO::FETCH_ASSOC);
        
        // Count total sales and revenue
        $salesQuery = "SELECT COUNT(*) as total_sales, COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE status = 'completed'";
        $salesStmt = $db->prepare($salesQuery);
        $salesStmt->execute();
        $salesResult = $salesStmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "total_products" => (int)$productResult['total_products'],
            "total_sales" => (int)$salesResult['total_sales'],
            "total_revenue" => (float)$salesResult['total_revenue']
        ]);
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>
