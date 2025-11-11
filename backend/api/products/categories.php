<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    try {
        // Get all categories with product counts
        $query = "SELECT 
                    category,
                    gender,
                    COUNT(*) as product_count
                  FROM products 
                  WHERE stock > 0
                  GROUP BY category, gender
                  ORDER BY category ASC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Organize by category and gender
        $categories = [];
        foreach ($results as $result) {
            $category = $result['category'];
            $gender = $result['gender'];
            $count = (int)$result['product_count'];
            
            if (!isset($categories[$category])) {
                $categories[$category] = [
                    'name' => $category,
                    'total_products' => 0,
                    'by_gender' => []
                ];
            }
            
            $categories[$category]['total_products'] += $count;
            $categories[$category]['by_gender'][$gender] = $count;
        }
        
        // Also get gender totals
        $genderQuery = "SELECT 
                          gender,
                          COUNT(*) as product_count
                        FROM products 
                        WHERE stock > 0
                        GROUP BY gender
                        ORDER BY gender ASC";
        $genderStmt = $db->prepare($genderQuery);
        $genderStmt->execute();
        $genderResults = $genderStmt->fetchAll(PDO::FETCH_ASSOC);
        
        $genders = [];
        foreach ($genderResults as $result) {
            $genders[$result['gender']] = (int)$result['product_count'];
        }
        
        http_response_code(200);
        echo json_encode([
            "categories" => array_values($categories),
            "genders" => $genders,
            "available_categories" => array_keys($categories),
            "available_genders" => array_keys($genders)
        ]);
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Errore nel caricamento categorie: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>