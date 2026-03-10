# Task Manager API v2 🚀

A **production-ready** REST API with MongoDB persistence, JWT authentication, input validation, and full Swagger documentation.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Validation | `express-validator` |
| Docs | `swagger-ui-express` + `swagger-jsdoc` |
| Config | `dotenv` |

---

## Project Structure

```
src/
├── config/
│   └── db.js                # MongoDB connection with Mongoose
├── controllers/
│   ├── authController.js    # Register, Login, GetMe
│   └── taskController.js    # Full CRUD with pagination & filters
├── docs/
│   └── swagger.js           # OpenAPI 3.0 spec + reusable schemas
├── middleware/
│   ├── auth.js              # JWT protect middleware
│   └── validateRequest.js   # express-validator rule sets
├── models/
│   ├── User.js              # User schema + bcrypt pre-save hook
│   └── Task.js              # Task schema with compound indexes
├── routes/
│   ├── authRoutes.js        # /api/users/* with Swagger JSDoc
│   └── taskRoutes.js        # /api/tasks/* with Swagger JSDoc
└── server.js                # Entry point + global error handling
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/atlas))

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

### 4. Start the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 5. Open Swagger Docs
Visit: **http://localhost:5000/api/docs**

---

## API Endpoints

### 🔐 Auth Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/api/users/register` | Create a new account | ❌ |
| `POST` | `/api/users/login` | Login and receive JWT | ❌ |
| `GET` | `/api/users/me` | Get current user profile | ✅ |

### ✅ Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/api/tasks` | Get all your tasks | ✅ |
| `GET` | `/api/tasks/:id` | Get a specific task | ✅ |
| `POST` | `/api/tasks` | Create a new task | ✅ |
| `PUT` | `/api/tasks/:id` | Update a task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete a task | ✅ |

---

## Query Parameters (GET /api/tasks)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `pending \| in-progress \| completed` | — | Filter by status |
| `priority` | `low \| medium \| high` | — | Filter by priority |
| `page` | `integer` | `1` | Page number |
| `limit` | `integer` | `10` | Results per page (max 50) |
| `sortBy` | `string` | `createdAt` | Sort field |
| `order` | `asc \| desc` | `desc` | Sort direction |

---

## Authentication

All protected routes require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Validation Rules

### Register
- `name`: Required, 2–50 characters
- `email`: Required, valid email format
- `password`: Required, min 6 chars, must contain a number

### Login
- `email`: Required, valid email
- `password`: Required

### Create/Update Task
- `title`: Required (on create), 1–100 characters
- `description`: Optional, max 500 characters
- `status`: Optional, must be `pending | in-progress | completed`
- `priority`: Optional, must be `low | medium | high`
- `dueDate`: Optional, valid ISO 8601 date

---

## Postman Testing Checklist

1. **Register** → `POST /api/users/register` with name, email, password
2. **Login** → `POST /api/users/login` → copy the `token` from response
3. **Set Auth** → Add `Authorization: Bearer <token>` header
4. **Create Task** → `POST /api/tasks` with title (required)
5. **Get All Tasks** → `GET /api/tasks` (try with `?status=pending`)
6. **Update Task** → `PUT /api/tasks/:id` with new status
7. **Delete Task** → `DELETE /api/tasks/:id`
8. **Test Validation** → Send empty body to register or invalid status to create task

---

## Response Format

All responses follow a consistent structure:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... }
}
```

Validation errors include field-level details:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email address", "value": "bad-email" }
  ]
}
```

---

## Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens expire (configurable via `JWT_EXPIRES_IN`)
- Passwords excluded from all DB queries by default (`select: false`)
- Users can only access **their own tasks** (user-scoped queries)
- Request body size limited to **10kb**
- Basic security headers (XSS, clickjacking protection)

---

## License

MIT
