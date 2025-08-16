import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true,
    maxlength: 50000 // 50KB limit for text
  },
  customPrompt: {
    type: String,
    required: true,
    maxlength: 1000
  },
  generatedSummary: {
    type: String,
    required: true
  },
  editedSummary: {
    type: String,
    default: null
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    email: {
      type: String,
      required: true
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
summarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for getting the final summary (edited if available, otherwise generated)
summarySchema.virtual('finalSummary').get(function() {
  return this.editedSummary || this.generatedSummary;
});

// Ensure virtual fields are serialized
summarySchema.set('toJSON', { virtuals: true });

export default mongoose.model('Summary', summarySchema);
