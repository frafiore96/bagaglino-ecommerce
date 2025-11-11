<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAuth($db);
    
    $query = "SELECT 
                p.id,
                p.product_code,
                p.name,
                p.description,
                p.price,
                p.image_url,
                p.gender,
                p.category,
                p.stock,
                f.created_at as favorited_at
              FROM favorites f
              JOIN products p ON f.product_id = p.id
              WHERE f.user_id = :user_id
              ORDER BY f.created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->execute();
    $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($favorites);

} elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = requireAuth($db);
    
    $data = json_decode(file_get_contents("php://input"));
    $product_id = isset($data->product_id) ? (int)$data->product_id : 0;
    
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    // Check if product exists
    $productQuery = "SELECT id FROM products WHERE id = :product_id";
    $productStmt = $db->prepare($productQuery);
    $productStmt->bindParam(":product_id", $product_id);
    $productStmt->execute();
    
    if ($productStmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(["message" => "Prodotto non trovato"]);
        exit();
    }
    
    // Check if already in favorites
    $checkQuery = "SELECT id FROM favorites WHERE user_id = :user_id AND product_id = :product_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":user_id", $user['id']);
    $checkStmt->bindParam(":product_id", $product_id);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Prodotto già tra i preferiti"]);
        exit();
    }
    
    // Add to favorites
    $insertQuery = "INSERT INTO favorites (user_id, product_id) VALUES (:user_id, :product_id)";
    $insertStmt = $db->prepare($insertQuery);
    $insertStmt->bindParam(":user_id", $user['id']);
    $insertStmt->bindParam(":product_id", $product_id);
    
    if ($insertStmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Prodotto aggiunto ai preferiti"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante aggiunta"]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $user = requireAuth($db);
    
    $product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
    
    if ($product_id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
    $query = "DELETE FROM favorites WHERE user_id = :user_id AND product_id = :product_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user['id']);
    $stmt->bindParam(":product_id", $product_id);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Prodotto rimosso dai preferiti"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante rimozione"]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>