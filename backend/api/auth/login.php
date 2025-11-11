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
    
    if (!validateEmail($email) || !validateRequired($password)) {
        http_response_code(400);
        echo json_encode(["message" => "Email e password richiesti"]);
        exit();
    }
    
    // Trova utente
    $query = "SELECT id, email, password, name, surname, role, token FROM users WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        http_response_code(401);
        echo json_encode(["message" => "Credenziali non valide"]);
        exit();
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!verifyPassword($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(["message" => "Credenziali non valide"]);
        exit();
    }
    
    // Genera nuovo token se non esiste
    if (!$user['token']) {
        $token = generateToken();
        $updateQuery = "UPDATE users SET token = :token WHERE id = :id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(":token", $token);
        $updateStmt->bindParam(":id", $user['id']);
        $updateStmt->execute();
        $user['token'] = $token;
    }
    
    http_response_code(200);
    echo json_encode([
        "message" => "Login effettuato",
        "user" => [
            "id" => $user['id'],
            "email" => $user['email'],
            "name" => $user['name'],
            "surname" => $user['surname'],
            "role" => $user['role']
        ],
        "token" => $user['token']
    ]);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>
