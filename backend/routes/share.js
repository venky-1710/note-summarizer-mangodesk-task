import express from 'express';
import { body, validationResult } from 'express-validator';
import Summary from '../models/Summary.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Validation middleware
const validateShareRequest = [
  body('summaryId')
    .notEmpty()
    .withMessage('Summary ID is required')
    .isMongoId()
    .withMessage('Invalid summary ID'),
  body('recipients')
    .isArray({ min: 1 })
    .withMessage('At least one recipient email is required'),
  body('recipients.*')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address')
];

// POST /api/share - Share a summary via email
router.post('/', validateShareRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { summaryId, recipients } = req.body;

    // Find the summary
    const summary = await Summary.findById(summaryId);
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found'
      });
    }

    // Validate email addresses
    const { validEmails, invalidEmails } = emailService.validateEmailAddresses(recipients);
    
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        error: 'Invalid email addresses found',
        invalidEmails
      });
    }

    if (validEmails.length === 0) {
      return res.status(400).json({
        error: 'No valid email addresses provided'
      });
    }

    // Send email with the final summary (edited version if available, otherwise generated)
    console.log('📧 Sending summary via email to:', validEmails);
    const emailResult = await emailService.sendSummary(
      validEmails,
      summary.finalSummary,
      summary.title
    );

    // Update summary with sharing information
    const shareInfo = validEmails.map(email => ({
      email,
      sharedAt: new Date()
    }));

    summary.isShared = true;
    summary.sharedWith.push(...shareInfo);
    await summary.save();

    console.log('✅ Summary shared successfully:', summary._id);

    res.json({
      success: true,
      message: 'Summary shared successfully',
      data: {
        summaryId: summary._id,
        recipients: validEmails,
        sharedAt: new Date(),
        messageId: emailResult.messageId
      }
    });

  } catch (error) {
    console.error('❌ Error sharing summary:', error);
    
    if (error.message.includes('Email service not configured')) {
      return res.status(503).json({
        error: 'Email service unavailable',
        message: 'Email sharing is not configured. Please contact the administrator.',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Failed to share summary',
      message: error.message
    });
  }
});

// GET /api/share/history/:summaryId - Get sharing history for a summary
router.get('/history/:summaryId', async (req, res) => {
  try {
    const { summaryId } = req.params;

    if (!summaryId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: 'Invalid summary ID format'
      });
    }

    const summary = await Summary.findById(summaryId).select('sharedWith isShared title');
    
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found'
      });
    }

    res.json({
      success: true,
      data: {
        summaryId: summary._id,
        title: summary.title,
        isShared: summary.isShared,
        shareHistory: summary.sharedWith.map(share => ({
          email: share.email,
          sharedAt: share.sharedAt
        })),
        totalShares: summary.sharedWith.length,
        uniqueRecipients: [...new Set(summary.sharedWith.map(s => s.email))].length
      }
    });

  } catch (error) {
    console.error('❌ Error fetching share history:', error);
    res.status(500).json({
      error: 'Failed to fetch share history',
      message: error.message
    });
  }
});

// POST /api/share/test-email - Test email service configuration
router.post('/test-email', [
  body('testEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid test email is required')
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

    const { testEmail } = req.body;

    // Test email service connection
    const connectionTest = await emailService.testConnection();
    
    if (!connectionTest.success) {
      return res.status(503).json({
        success: false,
        error: 'Email service connection failed',
        details: connectionTest.error
      });
    }

    // Send test email
    const testSummary = `This is a test email from the AI-Powered Meeting Notes Summarizer.

If you received this email, the email sharing functionality is working correctly.

Test Details:
- Sent at: ${new Date().toISOString()}
- Recipient: ${testEmail}
- Service Status: ✅ Operational`;

    const emailResult = await emailService.sendSummary(
      [testEmail],
      testSummary,
      'Test Email - Meeting Notes Summarizer'
    );

    res.json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        recipient: testEmail,
        messageId: emailResult.messageId,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      message: error.message
    });
  }
});

// GET /api/share/stats - Get sharing statistics
router.get('/stats', async (req, res) => {
  try {
    const totalSummaries = await Summary.countDocuments();
    const sharedSummaries = await Summary.countDocuments({ isShared: true });
    
    // Aggregate sharing statistics
    const shareStats = await Summary.aggregate([
      { $match: { isShared: true } },
      { $unwind: '$sharedWith' },
      {
        $group: {
          _id: null,
          totalShares: { $sum: 1 },
          uniqueRecipients: { $addToSet: '$sharedWith.email' }
        }
      },
      {
        $project: {
          totalShares: 1,
          uniqueRecipients: { $size: '$uniqueRecipients' }
        }
      }
    ]);

    const stats = shareStats[0] || { totalShares: 0, uniqueRecipients: 0 };

    res.json({
      success: true,
      data: {
        totalSummaries,
        sharedSummaries,
        unsharedSummaries: totalSummaries - sharedSummaries,
        shareRate: totalSummaries > 0 ? ((sharedSummaries / totalSummaries) * 100).toFixed(1) : 0,
        totalShares: stats.totalShares,
        uniqueRecipients: stats.uniqueRecipients,
        averageSharesPerSummary: sharedSummaries > 0 ? (stats.totalShares / sharedSummaries).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error('❌ Error fetching sharing stats:', error);
    res.status(500).json({
      error: 'Failed to fetch sharing statistics',
      message: error.message
    });
  }
});

export default router;
