// Configuration file for environment variables
// This file manages all environment-specific settings

interface Config {
    apiBaseUrl: string;
    frontendUrl: string;
    dbHost: string;
    dbName: string;
    dbUsername: string;
    dbPassword: string;
  }
  
  // Default configuration for development
  const defaultConfig: Config = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
    frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
    dbHost: process.env.DB_HOST || 'localhost',
    dbName: process.env.DB_NAME || 'bagaglino_db',
    dbUsername: process.env.DB_USERNAME || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
  };
  
  // Production configuration
  const productionConfig: Config = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '',
    frontendUrl: process.env.REACT_APP_FRONTEND_URL || '',
    dbHost: process.env.DB_HOST || '',
    dbName: process.env.DB_NAME || 'bagaglino_db',
    dbUsername: process.env.DB_USERNAME || '',
    dbPassword: process.env.DB_PASSWORD || '',
  };
  
  // Select configuration based on environment
  const config: Config = process.env.NODE_ENV === 'production' ? productionConfig : defaultConfig;
  
  export default config;
  export type { Config };