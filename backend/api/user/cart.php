<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAuth($db);
    
    $query = "SELECT 
                c.id,
                c.quantity,
                c.size,
                p.id as product_id,
                p.product_code,
                p.name,
                p.price,
                p.image_url,
                p.stock
              FROM cart_items c
              JOIN products p ON c.product_id = p.id
              WHERE c.user_id = :user_id
              ORDER BY c.created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->execute();
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($cartItems);

} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = requireAuth($db);
    
    $data = json_decode(file_get_contents("php://input"));
    $product_id = isset($data->product_id) ? (int)$data->product_id : 0;
    $quantity = isset($data->quantity) ? (int)$data->quantity : 1;
    $size = isset($data->size) ? $data->size : null;
    
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    if (!$size) {
        http_response_code(400);
        echo json_encode(["message" => "Taglia richiesta"]);
        exit();
    }
    
    // Check if already in cart with same size
    $checkQuery = "SELECT quantity FROM cart_items WHERE user_id = :user_id AND product_id = :product_id AND size = :size";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":user_id", $user['id']);
    $checkStmt->bindParam(":product_id", $product_id);
    $checkStmt->bindParam(":size", $size);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        // Update quantity
        $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
        $newQuantity = $existing['quantity'] + $quantity;
        
        $updateQuery = "UPDATE cart_items SET quantity = :quantity WHERE user_id = :user_id AND product_id = :product_id AND size = :size";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(":quantity", $newQuantity);
        $updateStmt->bindParam(":user_id", $user['id']);
        $updateStmt->bindParam(":product_id", $product_id);
        $updateStmt->bindParam(":size", $size);
        $updateStmt->execute();
    } else {
        // Add new item
        $insertQuery = "INSERT INTO cart_items (user_id, product_id, quantity, size) VALUES (:user_id, :product_id, :quantity, :size)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(":user_id", $user['id']);
        $insertStmt->bindParam(":product_id", $product_id);
        $insertStmt->bindParam(":quantity", $quantity);
        $insertStmt->bindParam(":size", $size);
        $insertStmt->execute();
    }
    
    http_response_code(200);
    echo json_encode(["message" => "Prodotto aggiunto al carrello"]);

} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $user = requireAuth($db);
    
    $data = json_decode(file_get_contents("php://input"));
    $product_id = isset($data->product_id) ? (int)$data->product_id : 0;
    $quantity = isset($data->quantity) ? (int)$data->quantity : 1;
    
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    $query = "UPDATE cart_items SET quantity = :quantity WHERE user_id = :user_id AND product_id = :product_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":quantity", $quantity);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->bindParam(":product_id", $product_id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Carrello aggiornato"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante aggiornamento"]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $user = requireAuth($db);
    
    $product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
    
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    $query = "DELETE FROM cart_items WHERE user_id = :user_id AND product_id = :product_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->bindParam(":product_id", $product_id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Prodotto rimosso dal carrello"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante rimozione"]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>