const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API v2',
      version: '2.0.0',
      description: `
## Task Manager REST API

A production-ready backend with:
- 🔐 JWT-based authentication
- 🗄️ MongoDB persistent storage
- ✅ Input validation
- 📄 Full CRUD for tasks

### How to authenticate
1. Register or login to get a JWT token
2. Click **Authorize** and enter: \`Bearer <your_token>\`
3. All protected routes will use this token automatically
      `,
    },
    servers: [
      { url: 'https://day-2-task-1.vercel.app', description: 'Production server' },
      { url: 'http://localhost:5000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful.' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
            title: { type: 'string', example: 'Build login page' },
            description: { type: 'string', example: 'Create the user auth flow with JWT' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], example: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'high' },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            user: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TaskInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Build login page' },
            description: { type: 'string', example: 'Create the user auth flow' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
            dueDate: { type: 'string', format: 'date', example: '2024-12-31', nullable: true },
          },
        },
        TaskUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Updated task title' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred.' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'User registration and authentication' },
      { name: 'Tasks', description: 'Task CRUD operations (all protected)' },
    ],
    paths: {
      '/api/users/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } },
          },
          responses: {
            201: { description: 'User registered successfully' },
            409: { description: 'Email already in use' },
            422: { description: 'Validation error' },
          },
        },
      },
      '/api/users/login': {
        post: {
          summary: 'Login and receive a JWT token',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/users/me': {
        get: {
          summary: 'Get current authenticated user profile',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile retrieved' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/tasks': {
        get: {
          summary: 'Get all tasks',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'in-progress', 'completed'] } },
            { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high'] } },
          ],
          responses: {
            200: { description: 'Tasks retrieved successfully' },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          summary: 'Create a new task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } },
          },
          responses: {
            201: { description: 'Task created successfully' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/api/tasks/{id}': {
        get: {
          summary: 'Get a single task by ID',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Task retrieved' },
            404: { description: 'Task not found' },
          },
        },
        put: {
          summary: 'Update a task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskUpdateInput' } } },
          },
          responses: {
            200: { description: 'Task updated successfully' },
            404: { description: 'Task not found' },
          },
        },
        delete: {
          summary: 'Delete a task',
          tags: ['Tasks'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Task deleted successfully' },
            404: { description: 'Task not found' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;