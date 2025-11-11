<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';
include_once '../../includes/validation.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user = requireAuth($db);
    
    $query = "SELECT id, email, name, surname, phone, profile_image, billing_address, shipping_address, role FROM users WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $user['id']);
    $stmt->execute();
    
    $userProfile = $stmt->fetch(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode($userProfile);

} elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $user = requireAuth($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["message" => "Dati non validi"]);
        exit();
    }
    
    $name = isset($data->name) ? sanitizeInput($data->name) : '';
    $surname = isset($data->surname) ? sanitizeInput($data->surname) : '';
    $phone = isset($data->phone) ? sanitizeInput($data->phone) : '';
    $billing_address = isset($data->billing_address) ? sanitizeInput($data->billing_address) : '';
    $shipping_address = isset($data->shipping_address) ? sanitizeInput($data->shipping_address) : '';
    $profile_image = isset($data->profile_image) ? sanitizeInput($data->profile_image) : '';
    
    if (!validateRequired($name) || !validateRequired($surname)) {
        http_response_code(400);
        echo json_encode(["message" => "Nome e cognome richiesti"]);
        exit();
    }
    
    $query = "UPDATE users SET 
              name = :name, 
              surname = :surname, 
              phone = :phone, 
              billing_address = :billing_address, 
              shipping_address = :shipping_address, 
              profile_image = :profile_image 
              WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":surname", $surname);
    $stmt->bindParam(":phone", $phone);
    $stmt->bindParam(":billing_address", $billing_address);
    $stmt->bindParam(":shipping_address", $shipping_address);
    $stmt->bindParam(":profile_image", $profile_image);
    $stmt->bindParam(":id", $user['id']);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Profilo aggiornato con successo"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante aggiornamento"]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>
