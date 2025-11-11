<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';
include_once '../../includes/validation.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = requireAdmin($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["message" => "Dati non validi"]);
        exit();
    }
    
    $productData = [
        'name' => isset($data->name) ? sanitizeInput($data->name) : '',
        'description' => isset($data->description) ? sanitizeInput($data->description) : '',
        'price' => isset($data->price) ? $data->price : 0,
        'image_url' => isset($data->image_url) ? sanitizeInput($data->image_url) : '',
        'gender' => isset($data->gender) ? $data->gender : '',
        'category' => isset($data->category) ? $data->category : '',
        'stock' => isset($data->stock) ? $data->stock : 0
    ];
    
    $errors = validateProductData($productData);
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(["message" => "Errori di validazione", "errors" => $errors]);
        exit();
    }
    
    try {
        $productCode = generateProductCode();
        
        $query = "INSERT INTO products (product_code, name, description, price, image_url, gender, category, stock) 
                  VALUES (:product_code, :name, :description, :price, :image_url, :gender, :category, :stock)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":product_code", $productCode);
        $stmt->bindParam(":name", $productData['name']);
        $stmt->bindParam(":description", $productData['description']);
        $stmt->bindParam(":price", $productData['price']);
        $stmt->bindParam(":image_url", $productData['image_url']);
        $stmt->bindParam(":gender", $productData['gender']);
        $stmt->bindParam(":category", $productData['category']);
        $stmt->bindParam(":stock", $productData['stock']);
        
        if ($stmt->execute()) {
            $productId = $db->lastInsertId();
            if (isset($data->sizes) && is_object($data->sizes)) {
                foreach ($data->sizes as $size => $stock) {
                    if ($stock > 0) {
                        $sizeQuery = "INSERT INTO product_sizes (product_id, size, stock) VALUES (:product_id, :size, :stock)";
                        $sizeStmt = $db->prepare($sizeQuery);
                        $sizeStmt->bindParam(":product_id", $productId);
                        $sizeStmt->bindParam(":size", $size);
                        $sizeStmt->bindParam(":stock", $stock, PDO::PARAM_INT);
                        $sizeStmt->execute();
                    }
                }
            }
            
            $getQuery = "SELECT * FROM products WHERE id = :id";
            $getStmt = $db->prepare($getQuery);
            $getStmt->bindParam(":id", $productId);
            $getStmt->execute();
            $product = $getStmt->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(201);
            echo json_encode([
                "message" => "Prodotto creato con successo",
                "product" => $product
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Errore durante la creazione del prodotto"]);
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