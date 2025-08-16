import express from 'express';
import { body, validationResult } from 'express-validator';
import Summary from '../models/Summary.js';
import aiService from '../services/aiService.js';

const router = express.Router();

// Validation middleware
const validateSummaryRequest = [
  body('originalText')
    .notEmpty()
    .withMessage('Original text is required')
    .isLength({ min: 10, max: 50000 })
    .withMessage('Text must be between 10 and 50,000 characters'),
  body('customPrompt')
    .notEmpty()
    .withMessage('Custom prompt is required')
    .isLength({ min: 5, max: 1000 })
    .withMessage('Prompt must be between 5 and 1,000 characters'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

// POST /api/summarize - Generate a new summary
router.post('/', validateSummaryRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { originalText, customPrompt, title, tags = [] } = req.body;

    // Generate summary using AI service
    console.log('🤖 Generating summary with AI...');
    const generatedSummary = await aiService.generateSummary(originalText, customPrompt);

    // Save to database
    const summaryDoc = new Summary({
      originalText,
      customPrompt,
      generatedSummary,
      title,
      tags: tags.filter(tag => tag && tag.trim().length > 0)
    });

    await summaryDoc.save();

    console.log('✅ Summary generated and saved:', summaryDoc._id);

    res.status(201).json({
      success: true,
      data: {
        id: summaryDoc._id,
        title: summaryDoc.title,
        generatedSummary: summaryDoc.generatedSummary,
        finalSummary: summaryDoc.finalSummary,
        tags: summaryDoc.tags,
        createdAt: summaryDoc.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error generating summary:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      message: error.message
    });
  }
});

// GET /api/summarize/:id - Get a specific summary
router.get('/:id', async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);
    
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: summary._id,
        title: summary.title,
        originalText: summary.originalText,
        customPrompt: summary.customPrompt,
        generatedSummary: summary.generatedSummary,
        editedSummary: summary.editedSummary,
        finalSummary: summary.finalSummary,
        tags: summary.tags,
        isShared: summary.isShared,
        sharedWith: summary.sharedWith,
        createdAt: summary.createdAt,
        updatedAt: summary.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error fetching summary:', error);
    res.status(500).json({
      error: 'Failed to fetch summary',
      message: error.message
    });
  }
});

// PUT /api/summarize/:id - Update/edit a summary
router.put('/:id', [
  body('editedSummary')
    .notEmpty()
    .withMessage('Edited summary is required')
    .isLength({ max: 10000 })
    .withMessage('Edited summary must not exceed 10,000 characters'),
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { editedSummary, title, tags } = req.body;
    
    const updateData = { editedSummary };
    if (title) updateData.title = title;
    if (tags) updateData.tags = tags.filter(tag => tag && tag.trim().length > 0);

    const summary = await Summary.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found'
      });
    }

    console.log('✅ Summary updated:', summary._id);

    res.json({
      success: true,
      data: {
        id: summary._id,
        title: summary.title,
        generatedSummary: summary.generatedSummary,
        editedSummary: summary.editedSummary,
        finalSummary: summary.finalSummary,
        tags: summary.tags,
        updatedAt: summary.updatedAt
      }
    });

  } catch (error) {
    console.error('❌ Error updating summary:', error);
    res.status(500).json({
      error: 'Failed to update summary',
      message: error.message
    });
  }
});

// GET /api/summarize - Get all summaries (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const summaries = await Summary.find()
      .select('title tags isShared createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Summary.countDocuments();

    res.json({
      success: true,
      data: summaries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching summaries:', error);
    res.status(500).json({
      error: 'Failed to fetch summaries',
      message: error.message
    });
  }
});

// DELETE /api/summarize/:id - Delete a summary
router.delete('/:id', async (req, res) => {
  try {
    const summary = await Summary.findByIdAndDelete(req.params.id);

    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found'
      });
    }

    console.log('🗑️ Summary deleted:', req.params.id);

    res.json({
      success: true,
      message: 'Summary deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting summary:', error);
    res.status(500).json({
      error: 'Failed to delete summary',
      message: error.message
    });
  }
});

// POST /api/summarize/test-ai - Test AI service connection
router.post('/test-ai', async (req, res) => {
  try {
    const result = await aiService.testConnection();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'AI service is working correctly',
        response: result.response
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'AI service connection failed',
        details: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to test AI service',
      message: error.message
    });
  }
});

export default router;
