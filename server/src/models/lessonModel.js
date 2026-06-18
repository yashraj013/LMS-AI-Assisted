import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  markdownContent: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Lesson', lessonSchema);