import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  grokMetadata: {
    requestId: String,
    model: String,
    tokens: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
chatHistorySchema.index({ studentId: 1, createdAt: -1 });
chatHistorySchema.index({ lessonId: 1 });

export default mongoose.model('ChatHistory', chatHistorySchema);