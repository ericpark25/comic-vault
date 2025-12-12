# Comic Vault - Inventory Management System

A full-stack inventory management application for tracking comic books across multiple storage vaults.

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.5.8
- PostgreSQL
- Spring Data JPA

**Frontend:**
- React 19.2
- Vite
- Mantine UI
- TanStack Query (React Query)

## Features

- **Comic Management**: Create, read, update, and delete comics with SKU, name, description, and price
- **Vault Management**: Manage storage locations with configurable capacity limits
- **Inventory Tracking**: Add comics to vaults, update quantities, and remove items
- **Transfer System**: Move comics between vaults
- **Capacity Monitoring**: Real-time capacity tracking with visual indicators
- **Dashboard**: Overview of all vaults with capacity warnings

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Maven 3.6+

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE comic_vault;
```

2. Create `backend/src/main/resources/secrets.yml`:
```yaml
db:
  url: jdbc:postgresql://localhost:5432/your_database_name
  username: your_username
  password: your_password
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build and run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Comics
- `GET /api/comics` - List all comics
- `GET /api/comics/{id}` - Get comic by ID
- `POST /api/comics` - Create new comic
- `PUT /api/comics/{id}` - Update comic
- `DELETE /api/comics/{id}` - Delete comic

### Vaults
- `GET /api/vaults` - List all vaults
- `GET /api/vaults/{id}` - Get vault by ID
- `POST /api/vaults` - Create new vault
- `PUT /api/vaults/{id}` - Update vault
- `DELETE /api/vaults/{id}` - Delete vault

### Inventory
- `GET /api/vaults/{vaultId}/inventory` - Get vault inventory
- `POST /api/vaults/{vaultId}/inventory` - Add comic to vault
- `PUT /api/vaults/{vaultId}/inventory/{comicId}` - Update quantity
- `DELETE /api/vaults/{vaultId}/inventory/{comicId}` - Remove comic from vault
- `POST /api/inventory/transfer` - Transfer comics between vaults

## Edge Cases Handled

- **Capacity Limits**: Prevents adding comics when vault capacity is exceeded
- **Duplicate Prevention**: Increments quantity instead of creating duplicate entries
- **Transfer Validation**: Ensures source has sufficient quantity and destination has capacity
- **Delete Protection**: Prevents deletion of comics/vaults that are in use

## Project Structure

```
comic-vault/
├── backend/
│   └── src/main/java/com/skillstorm/comic_vault/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/
│       ├── dto/
│       └── exception/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── api/
        └── utils/
```
