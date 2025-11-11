<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAdmin($db);
    
    try {
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        $gender = isset($_GET['gender']) ? $_GET['gender'] : '';
        $category = isset($_GET['category']) ? $_GET['category'] : '';
        
        $whereConditions = [];
        $params = [];

        $whereConditions[] = "(archived = FALSE OR archived IS NULL)";
        
        if (!empty($search)) {
            $whereConditions[] = "(name LIKE :search OR product_code LIKE :search)";
            $params[':search'] = "%$search%";
        }
        
        if (!empty($gender)) {
            $whereConditions[] = "gender = :gender";
            $params[':gender'] = $gender;
        }
        
        if (!empty($category)) {
            $whereConditions[] = "category = :category";
            $params[':category'] = $category;
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        $productsQuery = "SELECT * FROM products $whereClause ORDER BY created_at DESC";
        $productsStmt = $db->prepare($productsQuery);
        foreach ($params as $key => $value) {
            $productsStmt->bindValue($key, $value);
        }
        $productsStmt->execute();
        $products = $productsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($products);
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>
