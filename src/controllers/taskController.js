const Task = require('../models/Task');

/**
 * @desc    Get all tasks for the authenticated user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    
    const filter = { user: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

   
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

  
    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('GetTasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks.',
    });
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id, // Ensures users can only access their own tasks
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error('GetTaskById error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching task.',
    });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: { task },
    });
  } catch (error) {
    console.error('CreateTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating task.',
    });
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update.',
      });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      {
        new: true,           
        runValidators: true, 
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: { task },
    });
  } catch (error) {
    console.error('UpdateTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating task.',
    });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      data: { deletedTask: task },
    });
  } catch (error) {
    console.error('DeleteTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting task.',
    });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
