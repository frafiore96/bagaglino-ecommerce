<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';
include_once '../../includes/validation.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $user = requireAdmin($db);
    
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "ID prodotto richiesto"]);
        exit();
    }
    
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
        $checkQuery = "SELECT id FROM products WHERE id = :id";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":id", $id);
        $checkStmt->execute();
        
        if ($checkStmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(["message" => "Prodotto non trovato"]);
            exit();
        }
        
        $query = "UPDATE products SET 
                  name = :name, 
                  description = :description, 
                  price = :price, 
                  image_url = :image_url, 
                  gender = :gender, 
                  category = :category, 
                  stock = :stock 
                  WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":name", $productData['name']);
        $stmt->bindParam(":description", $productData['description']);
        $stmt->bindParam(":price", $productData['price']);
        $stmt->bindParam(":image_url", $productData['image_url']);
        $stmt->bindParam(":gender", $productData['gender']);
        $stmt->bindParam(":category", $productData['category']);
        $stmt->bindParam(":stock", $productData['stock']);
        
        if ($stmt->execute()) {
            // SPOSTA QUI IL CODICE DELLE TAGLIE
            if (isset($data->sizes)) {
                // Prima cancella le taglie esistenti
                $deleteQuery = "DELETE FROM product_sizes WHERE product_id = :product_id";
                $deleteStmt = $db->prepare($deleteQuery);
                $deleteStmt->bindParam(":product_id", $id);
                $deleteStmt->execute();
                
                // Poi inserisci le nuove
                foreach ($data->sizes as $size => $stock) {
                    if ($stock > 0) {
                        $sizeQuery = "INSERT INTO product_sizes (product_id, size, stock) VALUES (:product_id, :size, :stock)";
                        $sizeStmt = $db->prepare($sizeQuery);
                        $sizeStmt->bindParam(":product_id", $id);
                        $sizeStmt->bindParam(":size", $size);
                        $sizeStmt->bindParam(":stock", $stock);
                        $sizeStmt->execute();
                    }
                }
            }
            
            $getQuery = "SELECT * FROM products WHERE id = :id";
            $getStmt = $db->prepare($getQuery);
            $getStmt->bindParam(":id", $id);
            $getStmt->execute();
            $product = $getStmt->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(200);
            echo json_encode([
                "message" => "Prodotto aggiornato con successo",
                "product" => $product
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Errore durante l'aggiornamento"]);
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