<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        // Get query parameters
        $gender = isset($_GET['gender']) ? $_GET['gender'] : '';
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $offset = ($page - 1) * $limit;
        
        // Base conditions: only products in stock and not archived
        $whereConditions = [
            "stock > 0",                              // Only products with stock
            "(archived = FALSE OR archived IS NULL)"  // Exclude archived products for regular users
        ];
        $params = [];
        
        // Add gender filter if specified
        if (!empty($gender) && $gender !== 'all') {
            $whereConditions[] = "gender = :gender";
            $params[':gender'] = $gender;
        }
        
        // Add category filter if specified
        if (!empty($category) && $category !== 'all') {
            $whereConditions[] = "category = :category";
            $params[':category'] = $category;
        }
        
        // Add search filter if specified
        if (!empty($search)) {
            $whereConditions[] = "(name LIKE :search OR description LIKE :search)";
            $params[':search'] = "%$search%";
        }
        
        // Build WHERE clause
        $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
        
        // Get total count for pagination
        $countQuery = "SELECT COUNT(*) as total FROM products $whereClause";
        $countStmt = $db->prepare($countQuery);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $totalResult = $countStmt->fetch(PDO::FETCH_ASSOC);
        
        // Get products with pagination
        $productsQuery = "SELECT 
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
                          $whereClause 
                          ORDER BY created_at DESC 
                          LIMIT :limit OFFSET :offset";
        $productsStmt = $db->prepare($productsQuery);
        foreach ($params as $key => $value) {
            $productsStmt->bindValue($key, $value);
        }
        $productsStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $productsStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $productsStmt->execute();
        $products = $productsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Return response with products and pagination info
        http_response_code(200);
        echo json_encode([
            "products" => $products,
            "total" => (int)$totalResult['total'],
            "page" => $page,
            "total_pages" => ceil($totalResult['total'] / $limit)
        ]);
        
    } catch(Exception $e) {
        // Handle database errors
        http_response_code(500);
        echo json_encode(["message" => "Error loading products: " . $e->getMessage()]);
    }
} else {
    // Method not allowed
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
?>