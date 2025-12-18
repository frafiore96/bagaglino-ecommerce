<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Get product ID from query parameters
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    // Validate product ID
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "Product ID required"]);
        exit();
    }
    
    try {
        // Query to get product details excluding archived products
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
                  WHERE id = :id 
                  AND (archived = FALSE OR archived IS NULL)"; // Exclude archived products
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        
        // Check if product exists and is not archived
        if ($stmt->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(["message" => "Product not found or not available"]);
            exit();
        }
        
        // Get product data
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Return product details
        http_response_code(200);
        echo json_encode($product);
        
    } catch(Exception $e) {
        // Handle database errors
        http_response_code(500);
        echo json_encode(["message" => "Error loading product: " . $e->getMessage()]);
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
?>