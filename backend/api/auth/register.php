<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';
include_once '../../includes/validation.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["message" => "Dati non validi"]);
        exit();
    }
    
    $email = sanitizeInput($data->email);
    $password = $data->password;
    $name = sanitizeInput($data->name);
    $surname = sanitizeInput($data->surname);
    $phone = isset($data->phone) ? sanitizeInput($data->phone) : '';
    
    // Validazione
    if (!validateEmail($email)) {
        http_response_code(400);
        echo json_encode(["message" => "Email non valida"]);
        exit();
    }
    
    if (!validatePassword($password)) {
        http_response_code(400);
        echo json_encode(["message" => "Password deve essere almeno 6 caratteri"]);
        exit();
    }
    
    if (!validateRequired($name) || !validateRequired($surname)) {
        http_response_code(400);
        echo json_encode(["message" => "Nome e cognome richiesti"]);
        exit();
    }
    
    // Controlla se email esiste già
    $query = "SELECT id FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(["message" => "Email già registrata"]);
        exit();
    }
    
    // Crea utente
    $hashedPassword = hashPassword($password);
    $token = generateToken();
    
    $query = "INSERT INTO users (email, password, name, surname, phone, token) VALUES (:email, :password, :name, :surname, :phone, :token)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":surname", $surname);
    $stmt->bindParam(":phone", $phone);
    $stmt->bindParam(":token", $token);
    
    if ($stmt->execute()) {
        $userId = $db->lastInsertId();
        http_response_code(201);
        echo json_encode([
            "message" => "Registrazione completata",
            "user" => [
                "id" => $userId,
                "email" => $email,
                "name" => $name,
                "surname" => $surname,
                "role" => "user"
            ],
            "token" => $token
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Errore durante registrazione"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>
