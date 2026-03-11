const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Task Manager API v2',
    version: '2.0.0',
    description: 'JWT Authentication + Full Task CRUD with MongoDB',
  },
  servers: [
    { url: 'https://day-2-task-1.vercel.app', description: 'Production' },
    { url: 'http://localhost:5000', description: 'Development' },
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
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'secret123' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'jane@example.com' },
          password: { type: 'string', example: 'secret123' },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'Build login page' },
          description: { type: 'string', example: 'Create user auth flow' },
          status: { type: 'string', enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
          dueDate: { type: 'string', format: 'date', example: '2024-12-31' },
        },
      },
      TaskUpdateInput: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Updated title' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Register & Login' },
    { name: 'Tasks', description: 'Task CRUD (JWT required)' },
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
          201: { description: 'Registered successfully' },
          409: { description: 'Email already in use' },
        },
      },
    },
    '/api/users/login': {
      post: {
        summary: 'Login and get JWT token',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
        },
        responses: {
          200: { description: 'Login successful, returns token' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/users/me': {
      get: {
        summary: 'Get my profile',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Profile data' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/tasks': {
      get: {
        summary: 'Get all my tasks',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'in-progress', 'completed'] } },
          { name: 'priority', in: 'query', schema: { type: 'string', enum: ['low', 'medium', 'high'] } },
        ],
        responses: {
          200: { description: 'List of tasks' },
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
          201: { description: 'Task created' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get task by ID',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task data' },
          404: { description: 'Not found' },
        },
      },
      put: {
        summary: 'Update task',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskUpdateInput' } } },
        },
        responses: {
          200: { description: 'Task updated' },
          404: { description: 'Not found' },
        },
      },
      delete: {
        summary: 'Delete task',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Task deleted' },
          404: { description: 'Not found' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;