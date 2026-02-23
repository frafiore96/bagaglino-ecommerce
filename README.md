# Bagaglino — E-commerce Platform

Piattaforma e-commerce per abbigliamento con frontend React/TypeScript e backend PHP/MySQL.

---

## Indice

- [Stack Tecnologico](#stack-tecnologico)
- [Architettura](#architettura)
- [Struttura del Progetto](#struttura-del-progetto)
- [Setup Locale](#setup-locale)
- [Variabili d'Ambiente](#variabili-dambiente)
- [Deploy su Netlify](#deploy-su-netlify)
- [API Reference](#api-reference)
- [Database](#database)
- [Autenticazione](#autenticazione)
- [Funzionalità](#funzionalità)

---

## Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | React 18, TypeScript, React Router v7 |
| HTTP Client | Axios |
| Backend | PHP 8+ |
| Database | MySQL 8+ |
| Styling | CSS3 puro, responsive design |
| Build | Create React App (react-scripts 5) |
| Deploy Frontend | Netlify |

---

## Architettura

```
Browser (React SPA)
       │
       │ HTTPS / REST API
       ▼
PHP Backend (hosting separato, es. Railway / Render / VPS)
       │
       │ PDO
       ▼
MySQL Database
```

> **Nota**: Netlify supporta solo siti statici e serverless functions. Il **backend PHP deve essere ospitato separatamente** (Railway, Render, DigitalOcean, hosting shared con PHP, ecc.).

---

## Struttura del Progetto

```
bagaglino-project/
├── netlify.toml              # Configurazione deploy Netlify
├── frontend/
│   ├── public/
│   │   ├── _redirects        # Regole SPA routing per Netlify
│   │   └── index.html
│   └── src/
│       ├── App.tsx
│       ├── App.css           # Tutti gli stili (responsive)
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Header.tsx        # Selettore header (guest/user/admin)
│       │   │   ├── HeaderGuest.tsx
│       │   │   ├── HeaderUser.tsx
│       │   │   ├── HeaderAdmin.tsx
│       │   │   ├── HamburgerMenu.tsx # Menu mobile
│       │   │   ├── SearchBar.tsx
│       │   │   ├── Banner.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── LanguageSelector.tsx
│       │   └── Common/
│       │       └── WelcomePopup.tsx
│       ├── context/
│       │   ├── AuthContext.tsx       # Stato autenticazione globale
│       │   ├── CartContext.tsx       # Stato carrello globale
│       │   └── LanguageContext.tsx   # i18n (IT/EN)
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── CategoryPage.tsx
│       │   ├── ProductPage.tsx
│       │   ├── CartPage.tsx
│       │   ├── CheckoutPage.tsx
│       │   ├── FavoritesPage.tsx
│       │   ├── PersonalAreaPage.tsx
│       │   ├── MyPurchasesPage.tsx
│       │   ├── SearchPage.tsx
│       │   ├── AdminDashboardPage.tsx
│       │   ├── AdminProductsPage.tsx
│       │   ├── AdminCreateProductPage.tsx
│       │   ├── AdminEditProductPage.tsx
│       │   └── AdminSalesPage.tsx
│       ├── routes/
│       │   └── AppRoutes.tsx         # Definizione routes + protezione
│       ├── services/
│       │   └── api.ts                # Client Axios + tutti gli endpoint
│       └── config/
│           └── config.ts             # Configurazione ambiente
└── backend/
    ├── api/
    │   ├── auth/
    │   │   ├── login.php
    │   │   ├── register.php
    │   │   └── logout.php
    │   ├── products/
    │   │   ├── list.php
    │   │   ├── detail.php
    │   │   ├── search.php
    │   │   ├── categories.php
    │   │   └── sizes.php
    │   ├── user/
    │   │   ├── profile.php
    │   │   ├── cart.php
    │   │   ├── favorites.php
    │   │   ├── checkout.php
    │   │   └── purchases.php
    │   └── admin/
    │       ├── dashboard.php
    │       ├── products.php
    │       ├── create-product.php
    │       ├── update-product.php
    │       ├── delete-product.php
    │       └── sales.php
    ├── config/
    │   ├── config.php          # Lettura variabili d'ambiente
    │   ├── database.php        # Connessione PDO
    │   └── cors.php            # Middleware CORS
    ├── includes/               # Helper PHP condivisi
    ├── uploads/                # Immagini prodotti uploadate
    └── database.sql            # Schema + seed del database
```

---

## Setup Locale

### Prerequisiti

- Node.js 18+
- PHP 8+
- MySQL 8+
- Un server PHP locale (es. MAMP, XAMPP, `php -S`)

### 1. Database

```bash
mysql -u root -p -e "CREATE DATABASE bagaglino_db CHARACTER SET utf8 COLLATE utf8_general_ci;"
mysql -u root -p bagaglino_db < backend/database.sql
```

### 2. Backend

```bash
cd backend

# Copia e configura le variabili d'ambiente
cp .env.example .env
# Modifica .env con i tuoi valori DB

# Avvia server PHP sulla porta 8000
php -S localhost:8000
```

### 3. Frontend

```bash
cd frontend

# Copia e configura le variabili d'ambiente
cp .env.example .env
# REACT_APP_API_BASE_URL=http://localhost:8000/api

npm install
npm start
# → http://localhost:3000
```

---

## Variabili d'Ambiente

### Frontend (`frontend/.env`)

| Variabile | Descrizione | Esempio |
|---|---|---|
| `REACT_APP_API_BASE_URL` | URL base del backend | `http://localhost:8000/api` |
| `REACT_APP_FRONTEND_URL` | URL del frontend | `http://localhost:3000` |

### Backend (`backend/.env`)

| Variabile | Descrizione | Esempio |
|---|---|---|
| `DB_HOST` | Host MySQL | `localhost` |
| `DB_NAME` | Nome database | `bagaglino_db` |
| `DB_USERNAME` | Utente MySQL | `root` |
| `DB_PASSWORD` | Password MySQL | `` |
| `FRONTEND_URL` | URL frontend (CORS) | `http://localhost:3000` |
| `FRONTEND_URL_ALT` | URL frontend alternativo (CORS) | `https://tuo-sito.netlify.app` |
| `JWT_SECRET` | Chiave segreta per JWT | `cambia-in-produzione` |
| `ENVIRONMENT` | Ambiente (`development`/`production`) | `development` |

---

## Deploy su Netlify

### Prerequisiti

1. Il backend PHP deve già essere deployato e raggiungibile via HTTPS (es. Railway, Render, Heroku, shared hosting)
2. Il database MySQL deve essere configurato sul backend

### Passaggi

#### 1. Configura il backend in produzione

Sul tuo hosting PHP, imposta queste variabili d'ambiente:

```
ENVIRONMENT=production
DB_HOST=<host-db-produzione>
DB_NAME=bagaglino_db
DB_USERNAME=<utente-db>
DB_PASSWORD=<password-db>
FRONTEND_URL=https://<tuo-sito>.netlify.app
JWT_SECRET=<chiave-sicura-casuale>
```

#### 2. Deploy su Netlify

**Opzione A — Via Netlify UI (consigliata)**

1. Vai su [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project"
2. Collega il tuo repository GitHub/GitLab
3. Netlify legge automaticamente `netlify.toml` alla root — le impostazioni di build sono già configurate:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
4. Vai su **Site configuration → Environment variables** e aggiungi:
   ```
   REACT_APP_API_BASE_URL = https://<url-del-tuo-backend>/api
   ```
5. Clicca **Deploy site**

**Opzione B — Via Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify init   # segui il wizard
netlify env:set REACT_APP_API_BASE_URL https://<url-del-tuo-backend>/api
netlify deploy --prod
```

#### 3. Verifica il routing

Il file `frontend/public/_redirects` e la configurazione in `netlify.toml` gestiscono il routing SPA: tutte le richieste vengono reindirizzate a `index.html` affinché React Router le gestisca lato client.

#### 4. Aggiorna CORS backend

Nel file `backend/.env` (o nelle variabili d'ambiente del tuo hosting), aggiorna:

```
FRONTEND_URL=https://<tuo-sito>.netlify.app
```

---

## API Reference

Tutte le chiamate richiedono `Content-Type: application/json`. Le rotte protette richiedono l'header:

```
Authorization: Bearer <token>
```

### Autenticazione

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `POST` | `/auth/login.php` | Login utente → ritorna `{ user, token }` |
| `POST` | `/auth/register.php` | Registrazione → ritorna `{ user, token }` |
| `POST` | `/auth/logout.php` | Logout (richiede token) |

### Prodotti (pubblici)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/products/list.php` | Lista prodotti (filtri: `gender`, `category`, `search`) |
| `GET` | `/products/detail.php?id=:id` | Dettaglio prodotto |
| `GET` | `/products/search.php?q=:query` | Ricerca autocomplete |
| `GET` | `/products/categories.php` | Lista categorie disponibili |
| `GET` | `/products/sizes.php?product_id=:id` | Taglie disponibili per prodotto |

### Utente (autenticato)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET/PUT` | `/user/profile.php` | Lettura/aggiornamento profilo |
| `GET` | `/user/cart.php` | Contenuto carrello |
| `POST` | `/user/cart.php` | Aggiungi al carrello (`product_id`, `quantity`, `size`) |
| `PUT` | `/user/cart.php` | Aggiorna quantità |
| `DELETE` | `/user/cart.php?product_id=:id` | Rimuovi dal carrello |
| `GET` | `/user/favorites.php` | Lista preferiti |
| `POST` | `/user/favorites.php` | Aggiungi ai preferiti |
| `DELETE` | `/user/favorites.php?product_id=:id` | Rimuovi dai preferiti |
| `POST` | `/user/checkout.php` | Completa ordine |
| `GET` | `/user/purchases.php` | Storico acquisti |

### Admin (solo ruolo admin)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/admin/dashboard.php` | Statistiche dashboard |
| `GET` | `/admin/products.php` | Lista tutti i prodotti |
| `POST` | `/admin/create-product.php` | Crea nuovo prodotto |
| `PUT` | `/admin/update-product.php?id=:id` | Modifica prodotto |
| `DELETE` | `/admin/delete-product.php?id=:id` | Elimina prodotto |
| `GET` | `/admin/sales.php` | Report vendite |

---

## Database

Schema MySQL importabile da `backend/database.sql`.

**Tabelle principali:**

| Tabella | Descrizione |
|---|---|
| `users` | Utenti e admin (`role`: `user`/`admin`) |
| `products` | Catalogo prodotti con categoria, genere, prezzo |
| `product_sizes` | Stock per taglia per prodotto |
| `cart_items` | Carrello utente (persistente) |
| `favorites` | Prodotti preferiti per utente |
| `orders` | Ordini completati |
| `order_items` | Righe d'ordine |

**Credenziali admin di default:**

```
Email:    admin@bagaglino.com
Password: password
```

> Cambia la password admin immediatamente in produzione.

---

## Autenticazione

Il sistema usa **JWT (JSON Web Token)**:

1. Al login/registrazione il backend genera un token firmato con `JWT_SECRET`
2. Il frontend lo salva in `localStorage`
3. L'interceptor Axios (`services/api.ts`) lo aggiunge automaticamente a ogni richiesta come `Authorization: Bearer <token>`
4. Il backend verifica il token su ogni endpoint protetto

I ruoli supportati sono `user` e `admin`. Le route admin sono protette sia lato frontend (`ProtectedRoute adminOnly`) che lato backend.

---

## Funzionalità

- **Autenticazione**: registrazione, login, logout con JWT
- **Catalogo**: browsing per genere (uomo/donna/unisex) e categoria, con dropdown nav
- **Ricerca**: autocomplete in tempo reale
- **Pagina prodotto**: dettaglio, selezione taglia, aggiunta al carrello
- **Carrello**: gestione quantità, rimozione, persistenza DB
- **Checkout**: form con dati di spedizione e fatturazione
- **Preferiti**: salvataggio prodotti preferiti
- **Area personale**: gestione profilo, storico ordini
- **Dashboard admin**: statistiche vendite, gestione prodotti (CRUD), upload immagini
- **Internazionalizzazione**: IT/EN tramite `LanguageContext`
- **Responsive**: breakpoint a 1024px, 768px, 480px, 380px; hamburger menu mobile

---

Developed by Francesco 🇮🇹
