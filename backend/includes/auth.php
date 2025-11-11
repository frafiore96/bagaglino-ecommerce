<?php
function generateToken() {
    return bin2hex(random_bytes(32));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function validateToken($token, $db) {
    $query = "SELECT id, role FROM users WHERE token = :token";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function requireAuth($db) {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(["message" => "Token required"]);
        exit();
    }
    
    $user = validateToken($token, $db);
    if (!$user) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid token"]);
        exit();
    }
    
    return $user;
}

function requireAdmin($db) {
    $user = requireAuth($db);
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["message" => "Admin access required"]);
        exit();
    }
    return $user;
}
?>
