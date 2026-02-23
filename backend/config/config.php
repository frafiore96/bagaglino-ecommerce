<?php
/**
 * Configuration file for backend environment settings
 * This file manages all environment-specific settings for the backend
 */

class Config {
    // Database configuration
    public static function getDatabaseConfig() {
        return [
            'host' => self::getEnv('DB_HOST', 'localhost'),
            'port' => self::getEnv('DB_PORT', '3306'),
            'dbname' => self::getEnv('DB_NAME', 'bagaglino_db'),
            'username' => self::getEnv('DB_USERNAME', 'root'),
            'password' => self::getEnv('DB_PASSWORD', ''),
            'charset' => 'utf8'
        ];
    }

    // CORS configuration
    public static function getCorsConfig() {
        return [
            'allowed_origins' => [
                self::getEnv('FRONTEND_URL', 'http://localhost:3000'),
                self::getEnv('FRONTEND_URL_ALT', 'https://yourdomain.com')
            ],
            'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
            'max_age' => 3600
        ];
    }

    // API configuration
    public static function getApiConfig() {
        return [
            'base_url' => self::getEnv('API_BASE_URL', 'http://localhost:8000/api'),
            'upload_path' => self::getEnv('UPLOAD_PATH', __DIR__ . '/../uploads/'),
            'max_file_size' => self::getEnv('MAX_FILE_SIZE', 5242880), // 5MB
            'jwt_secret' => self::getEnv('JWT_SECRET', 'your-secret-key-change-in-production')
        ];
    }

    /**
     * Get environment variable with fallback
     */
    private static function getEnv($key, $default = null) {
        $value = getenv($key);
        if ($value === false) {
            $value = $_ENV[$key] ?? $default;
        }
        return $value;
    }

    /**
     * Check if we are in production environment
     */
    public static function isProduction() {
        return self::getEnv('ENVIRONMENT', 'development') === 'production';
    }

    /**
     * Check if we are in development environment
     */
    public static function isDevelopment() {
        return !self::isProduction();
    }
}
