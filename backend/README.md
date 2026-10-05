# StockPilot Backend

The Laravel REST API backend for **StockPilot**, an inventory management application.

The backend provides authentication, role-based authorization, category management, product management, and product image storage for the StockPilot frontend.

## Features

* RESTful API
* Authentication with Laravel Sanctum
* Role-based authorization
* Admin and regular user roles
* Category management
* Product management
* Product image uploads
* Product and category validation
* Protected API endpoints
* MySQL database integration
* Automated feature tests
* Database seeding for the initial administrator

## Tech Stack

* **Laravel**
* **PHP**
* **Laravel Sanctum**
* **MySQL**
* **Eloquent ORM**
* **PHPUnit**

## Project Structure

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   └── Middleware/
│   ├── Models/
│   └── Providers/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   ├── console.php
│   └── web.php
├── storage/
├── tests/
├── .env.example
├── artisan
├── composer.json
└── phpunit.xml
```

## API Endpoints

### Health

```text
GET /api/health
```

Returns the current API status.

### Authentication

```text
POST /api/login
GET  /api/me
POST /api/logout
```

Authentication uses Laravel Sanctum personal access tokens.

### Categories

Authenticated users can view categories:

```text
GET /api/categories
GET /api/categories/{category}
```

Administrators can manage categories:

```text
POST   /api/categories
PUT    /api/categories/{category}
DELETE /api/categories/{category}
```

### Products

Authenticated users can view products:

```text
GET /api/products
GET /api/products/{product}
```

Administrators can manage products:

```text
POST   /api/products
PUT    /api/products/{product}
DELETE /api/products/{product}
```

Product creation and updates support image uploads.

## Authorization

StockPilot uses two user roles:

* `admin`
* `user`

Authenticated users can view inventory data.

Only administrators can create, update, and delete products and categories.

Administrative access is enforced on the backend through dedicated middleware, so permissions are not dependent only on frontend controls.

## Getting Started

### 1. Install PHP dependencies

```bash
composer install
```

### 2. Configure the environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Configure the database and administrator credentials in `.env`.

Example:

```env
APP_NAME=StockPilot

DB_DATABASE=StockPilotDB
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
```

Do not commit `.env` or real credentials to the repository.

### 3. Run database migrations

```bash
php artisan migrate
```

### 4. Create the administrator

Run the database seeder:

```bash
php artisan db:seed
```

The administrator account is created using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `.env`.

### 5. Configure product image storage

Create the public storage link:

```bash
php artisan storage:link
```

### 6. Start the development server

```bash
php artisan serve
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

## Testing

Run the complete test suite:

```bash
php artisan test
```

The project includes feature tests covering administrator authorization.

## Security

The API uses Laravel Sanctum for authentication and middleware-based authorization for administrative operations.

Sensitive configuration values are stored in environment variables and should never be committed to the repository.

The application also validates incoming product and category data before storing it in the database.

## Project Status

StockPilot is a portfolio project focused on practical full-stack development, REST API design, authentication, authorization, database management, file storage, and application security.

## Frontend

The React frontend is located in the `frontend/` directory.

It communicates with this Laravel API to provide the StockPilot inventory management interface.

## Author

**Somar Hassn**

IT Engineering — Cybersecurity
