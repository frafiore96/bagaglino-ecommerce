# 🛍️ Bagaglino - E-commerce Platform

E-commerce moderno con React TypeScript frontend e PHP backend.

## 🚀 Features

- ✅ Autenticazione utenti (User/Admin)
- ✅ Catalogo prodotti con sistema taglie
- ✅ Carrello e checkout completo
- ✅ Dashboard amministrativa
- ✅ Upload immagini
- ✅ Sistema preferiti
- ✅ Search con autocomplete
- ✅ Sistema archiviazione prodotti

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, React Router
- **Backend**: PHP 8+, MySQL
- **Database**: MySQL 8+
- **Styling**: CSS3, Responsive Design

## 📦 Installation

### Backend
```bash
cd backend
# Configure database connection in config/database.php
# Import database/bagaglino.sql
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔧 Environment Setup

1. MySQL database: `bagaglino_db`
2. Backend URL: `http://localhost:8000`
3. Frontend URL: `http://localhost:3000`

## 👤 Default Admin

- Email: admin@bagaglino.com
- Password: admin123

## 📁 Project Structure
```
├── frontend/src/
│   ├── components/    # Shared components
│   ├── pages/         # Route components
│   ├── context/       # React contexts
│   └── services/      # API calls
├── backend/api/
│   ├── admin/         # Admin endpoints
│   ├── user/          # User endpoints
│   └── products/      # Product endpoints
```

Developed by Francesco 🇮🇹