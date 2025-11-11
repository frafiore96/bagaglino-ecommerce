<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../includes/auth.php';
include_once '../../includes/validation.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user = requireAuth($db);
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["message" => "Dati non validi"]);
        exit();
    }
    
    // Validate customer data
    $customer_name = isset($data->customer_name) ? sanitizeInput($data->customer_name) : '';
    $customer_surname = isset($data->customer_surname) ? sanitizeInput($data->customer_surname) : '';
    $customer_email = isset($data->customer_email) ? sanitizeInput($data->customer_email) : '';
    $customer_phone = isset($data->customer_phone) ? sanitizeInput($data->customer_phone) : '';
    $billing_address = isset($data->billing_address) ? sanitizeInput($data->billing_address) : '';
    $shipping_address = isset($data->shipping_address) ? sanitizeInput($data->shipping_address) : '';
    
    if (!validateRequired($customer_name) || !validateRequired($customer_surname) || 
        !validateEmail($customer_email) || !validateRequired($billing_address) || 
        !validateRequired($shipping_address)) {
        http_response_code(400);
        echo json_encode(["message" => "Tutti i campi obbligatori devono essere compilati"]);
        exit();
    }
    
    try {
        $db->beginTransaction();
        
        // Get cart items with size
        $cartQuery = "SELECT 
                        c.product_id,
                        c.quantity,
                        c.size,
                        p.product_code,
                        p.name,
                        p.price,
                        p.stock
                      FROM cart_items c
                      JOIN products p ON c.product_id = p.id
                      WHERE c.user_id = :user_id";
        $cartStmt = $db->prepare($cartQuery);
        $cartStmt->bindParam(":user_id", $user['id']);
        $cartStmt->execute();
        $cartItems = $cartStmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($cartItems)) {
            http_response_code(400);
            echo json_encode(["message" => "Carrello vuoto"]);
            exit();
        }
        
        // Check stock and calculate total
        $totalAmount = 0;
        foreach ($cartItems as $item) {
            if ($item['quantity'] > $item['stock']) {
                $db->rollback();
                http_response_code(400);
                echo json_encode(["message" => "Stock insufficiente per " . $item['name']]);
                exit();
            }
            $totalAmount += $item['price'] * $item['quantity'];
        }
        
        // Create order
        $orderQuery = "INSERT INTO orders (
                        user_id, 
                        total_amount, 
                        customer_name, 
                        customer_surname, 
                        customer_email, 
                        customer_phone, 
                        billing_address, 
                        shipping_address,
                        status
                      ) VALUES (
                        :user_id, 
                        :total_amount, 
                        :customer_name, 
                        :customer_surname, 
                        :customer_email, 
                        :customer_phone, 
                        :billing_address, 
                        :shipping_address,
                        'completed'
                      )";
        $orderStmt = $db->prepare($orderQuery);
        $orderStmt->bindParam(":user_id", $user['id']);
        $orderStmt->bindParam(":total_amount", $totalAmount);
        $orderStmt->bindParam(":customer_name", $customer_name);
        $orderStmt->bindParam(":customer_surname", $customer_surname);
        $orderStmt->bindParam(":customer_email", $customer_email);
        $orderStmt->bindParam(":customer_phone", $customer_phone);
        $orderStmt->bindParam(":billing_address", $billing_address);
        $orderStmt->bindParam(":shipping_address", $shipping_address);
        $orderStmt->execute();
        
        $orderId = $db->lastInsertId();
        
        // Create order items and update stock
        foreach ($cartItems as $item) {
            // Insert order item with size
            $orderItemQuery = "INSERT INTO order_items (
                                order_id, 
                                product_id, 
                                product_code, 
                                product_name, 
                                price, 
                                quantity,
                                size
                              ) VALUES (
                                :order_id, 
                                :product_id, 
                                :product_code, 
                                :product_name, 
                                :price, 
                                :quantity,
                                :size
                              )";
            $orderItemStmt = $db->prepare($orderItemQuery);
            $orderItemStmt->bindParam(":order_id", $orderId);
            $orderItemStmt->bindParam(":product_id", $item['product_id']);
            $orderItemStmt->bindParam(":product_code", $item['product_code']);
            $orderItemStmt->bindParam(":product_name", $item['name']);
            $orderItemStmt->bindParam(":price", $item['price']);
            $orderItemStmt->bindParam(":quantity", $item['quantity']);
            $orderItemStmt->bindParam(":size", $item['size']);
            $orderItemStmt->execute();

            // Update size stock
            $updateSizeQuery = "UPDATE product_sizes SET stock = stock - :quantity 
                                WHERE product_id = :product_id AND size = :size";
            $updateSizeStmt = $db->prepare($updateSizeQuery);
            $updateSizeStmt->bindParam(":quantity", $item['quantity']);
            $updateSizeStmt->bindParam(":product_id", $item['product_id']);
            $updateSizeStmt->bindParam(":size", $item['size']);
            $updateSizeStmt->execute();
            
            // Update product total stock
            $updateStockQuery = "UPDATE products SET stock = stock - :quantity WHERE id = :product_id";
            $updateStockStmt = $db->prepare($updateStockQuery);
            $updateStockStmt->bindParam(":quantity", $item['quantity']);
            $updateStockStmt->bindParam(":product_id", $item['product_id']);
            $updateStockStmt->execute();
            
            // Remove from favorites if present
            $removeFavQuery = "DELETE FROM favorites WHERE user_id = :user_id AND product_id = :product_id";
            $removeFavStmt = $db->prepare($removeFavQuery);
            $removeFavStmt->bindParam(":user_id", $user['id']);
            $removeFavStmt->bindParam(":product_id", $item['product_id']);
            $removeFavStmt->execute();
        }
        
        // Clear cart
        $clearCartQuery = "DELETE FROM cart_items WHERE user_id = :user_id";
        $clearCartStmt = $db->prepare($clearCartQuery);
        $clearCartStmt->bindParam(":user_id", $user['id']);
        $clearCartStmt->execute();
        
        $db->commit();
        
        http_response_code(200);
        echo json_encode([
            "message" => "Ordine completato con successo",
            "order_id" => $orderId,
            "total_amount" => $totalAmount
        ]);
        
    } catch(Exception $e) {
        $db->rollback();
        http_response_code(500);
        echo json_encode(["message" => "Errore durante l'ordine: " . $e->getMessage()]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metodo non consentito"]);
}
?>