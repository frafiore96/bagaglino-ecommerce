<?php
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validateRequired($value) {
    return !empty(trim($value));
}

function validatePassword($password) {
    return strlen($password) >= 6;
}

function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function generateProductCode() {
    return 'BAG' . strtoupper(uniqid());
}

function validateProductData($data) {
    $errors = [];
    
    if (!validateRequired($data['name'])) {
        $errors[] = "Nome prodotto richiesto";
    }
    
    if (!validateRequired($data['price']) || !is_numeric($data['price']) || $data['price'] <= 0) {
        $errors[] = "Prezzo valido richiesto";
    }
    
    if (!validateRequired($data['gender']) || !in_array($data['gender'], ['uomo', 'donna', 'unisex'])) {
        $errors[] = "Genere valido richiesto";
    }
    
    $validCategories = ['t-shirt', 'maglioni', 'giacche', 'pantaloni', 'scarpe', 'camicie', 'felpe', 'giubbotti', 'accessori'];
    if (!validateRequired($data['category']) || !in_array($data['category'], $validCategories)) {
        $errors[] = "Categoria valida richiesta";
    }
    
    if (!validateRequired($data['stock']) || !is_numeric($data['stock']) || $data['stock'] < 0) {
        $errors[] = "Quantità valida richiesta";
    }
    
    return $errors;
}
?>
