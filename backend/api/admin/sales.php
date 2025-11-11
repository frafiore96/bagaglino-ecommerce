<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAdmin($db);
    
    try {
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = 20;
        $offset = ($page - 1) * $limit;
        
        $countQuery = "SELECT COUNT(*) as total FROM orders WHERE status = 'completed'";
        $countStmt = $db->prepare($countQuery);
        $countStmt->execute();
        $totalResult = $countStmt->fetch(PDO::FETCH_ASSOC);
        
        $salesQuery = "SELECT 
                        o.id,
                        o.total_amount,
                        o.customer_name,
                        o.customer_surname,
                        o.customer_email,
                        o.customer_phone,
                        o.billing_address,
                        o.shipping_address,
                        o.created_at,
                        GROUP_CONCAT(
                            CONCAT(oi.product_code, ' (', oi.quantity, 'x)')
                            SEPARATOR ', '
                        ) as products
                      FROM orders o
                      JOIN order_items oi ON o.id = oi.order_id
                      WHERE o.status = 'completed'
                      GROUP BY o.id
                      ORDER BY o.created_at DESC
                      LIMIT :limit OFFSET :offset";
        
        $salesStmt = $db->prepare($salesQuery);
        $salesStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $salesStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $salesStmt->execute();
        $sales = $salesStmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "sales" => $sales,
            "total" => (int)$totalResult['total'],
            "page" => $page,
            "total_pages" => ceil($totalResult['total'] / $limit)
        ]);
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore nel caricamento vendite: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>