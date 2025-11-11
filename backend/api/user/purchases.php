<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAuth($db);
    
    $query = "SELECT 
                o.id,
                o.total_amount,
                o.customer_name,
                o.customer_surname,
                o.customer_email,
                o.customer_phone,
                o.billing_address,
                o.shipping_address,
                o.status,
                o.created_at,
                GROUP_CONCAT(
                    CONCAT(oi.product_name, ' (', oi.quantity, 'x)')
                    SEPARATOR ', '
                ) as products
              FROM orders o
              JOIN order_items oi ON o.id = oi.order_id
              WHERE o.user_id = :user_id
              GROUP BY o.id
              ORDER BY o.created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->execute();
    $purchases = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($purchases);
    
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>