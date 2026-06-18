import Progress from '../models/progressModel.js';
import Lesson from '../models/lessonModel.js';
import Module from '../models/moduleModel.js';

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    const progress = await Progress.find({ studentId: userId })
      .populate('lessonId')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const getUserModuleProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id || req.user?.id;
    const { moduleId } = req.params;

    if (!userId || !moduleId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId and moduleId are required' },
      });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: { message: 'Module not found' },
      });
    }

    const lessons = await Lesson.find({ moduleId }).select('_id');
    const lessonIds = lessons.map((lesson) => lesson._id);

    const progress = await Progress.find({
      studentId: userId,
      lessonId: { $in: lessonIds },
    }).populate('lessonId');

    const completedLessons = progress.filter((item) => item.completed).length;
    const totalLessons = lessonIds.length;
    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      success: true,
      data: {
        module,
        totalLessons,
        completedLessons,
        completionPercentage,
        progress,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const markComplete = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id || req.body.studentId;
    const { lessonId } = req.body;

    if (!studentId || !lessonId) {
      return res.status(400).json({
        success: false,
        error: { message: 'studentId and lessonId are required' },
      });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' },
      });
    }

    const progress = await Progress.findOneAndUpdate(
      { studentId, lessonId },
      {
        studentId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        lastAccessed: new Date(),
        updatedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { completed, completedAt, lastAccessed } = req.body;

    const progress = await Progress.findByIdAndUpdate(
      progressId,
      {
        ...(completed !== undefined && { completed }),
        ...(completedAt !== undefined && { completedAt }),
        ...(lastAccessed !== undefined && { lastAccessed }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: { message: 'Progress record not found' },
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const getProgressStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'userId is required' },
      });
    }

    const progress = await Progress.find({ studentId: userId });
    const total = progress.length;
    const completed = progress.filter((item) => item.completed).length;

    res.json({
      success: true,
      data: {
        totalLessonsTracked: total,
        completedLessons: completed,
        completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};