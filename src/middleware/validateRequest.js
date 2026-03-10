const { validationResult, body, param } = require('express-validator');


const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};

// ─── Auth Validation Rules ────────────────────────────────────────────────────

const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),

  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  handleValidationErrors,
];

// ─── Task Validation Rules ────────────────────────────────────────────────────

const validateCreateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date (e.g. 2024-12-31)')
    .toDate(),

  handleValidationErrors,
];

const validateUpdateTask = [
  param('id')
    .isMongoId().withMessage('Invalid task ID format'),

  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be one of: pending, in-progress, completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date')
    .toDate(),

  handleValidationErrors,
];

const validateTaskId = [
  param('id')
    .isMongoId().withMessage('Invalid task ID format'),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
};
