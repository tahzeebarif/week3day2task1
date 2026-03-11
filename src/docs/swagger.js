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
      contact: {
        name: 'API Support',
        email: 'support@taskmanager.dev',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'https://day-2-task-1.vercel.app',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token. Example: Bearer eyJhbGci...',
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
            name: { type: 'string', minLength: 2, maxLength: 50, example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', minLength: 6, example: 'secret123', description: 'Must contain at least one number' },
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
            status: {
              type: 'string',
              enum: ['pending', 'in-progress', 'completed'],
              example: 'pending',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'high',
            },
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
            title: { type: 'string', maxLength: 100, example: 'Build login page' },
            description: { type: 'string', maxLength: 500, example: 'Create the user auth flow' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
            dueDate: { type: 'string', format: 'date', example: '2024-12-31', nullable: true },
          },
        },
        TaskUpdateInput: {
          type: 'object',
          properties: {
            title: { type: 'string', maxLength: 100, example: 'Updated task title' },
            description: { type: 'string', maxLength: 500 },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate: { type: 'string', format: 'date', nullable: true },
          },
        },
        TaskListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                pagination: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer', example: 42 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    totalPages: { type: 'integer', example: 5 },
                    hasNextPage: { type: 'boolean', example: true },
                    hasPrevPage: { type: 'boolean', example: false },
                  },
                },
              },
            },
          },
        },
        SingleTaskResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                task: { $ref: '#/components/schemas/Task' },
              },
            },
          },
        },
       
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred.' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Please provide a valid email address' },
                  value: { type: 'string', example: 'not-an-email' },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'User registration and authentication' },
      { name: 'Tasks', description: 'Task CRUD operations (all protected)' },
    ],
  },
  
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;