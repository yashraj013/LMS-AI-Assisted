import Lesson from '../models/lessonModel.js';
import Module from '../models/moduleModel.js';
import Progress from '../models/progressModel.js';
import ChatHistory from '../models/chatHistory.js';

const syncModuleLessonCount = async (moduleId) => {
  if (!moduleId) return;
  const totalLessons = await Lesson.countDocuments({ moduleId });
  await Module.findByIdAndUpdate(moduleId, { totalLessons, updatedAt: new Date() });
};

export const getLessons = async (req, res) => {
  try {
    const { moduleId } = req.query;
    const filter = {};

    if (moduleId) filter.moduleId = moduleId;

    const lessons = await Lesson.find(filter).sort({ order: 1 });

    res.json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('moduleId');
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' },
      });
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const getLessonContent = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).select(
      'title description markdownContent videoUrl moduleId order estimatedDuration'
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' },
      });
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    const {
      moduleId,
      title,
      description,
      markdownContent,
      videoUrl,
      order,
      estimatedDuration,
    } = req.body;

    if (!moduleId || !title || !description || !markdownContent || order === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'moduleId, title, description, markdownContent, and order are required',
        },
      });
    }

    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: { message: 'Module not found' },
      });
    }

    const lesson = await Lesson.create({
      moduleId,
      title,
      description,
      markdownContent,
      videoUrl: videoUrl || null,
      order,
      estimatedDuration: estimatedDuration || 0,
    });

    await syncModuleLessonCount(moduleId);

    res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const existingLesson = await Lesson.findById(req.params.id);
    if (!existingLesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' },
      });
    }

    const previousModuleId = existingLesson.moduleId?.toString();

    const {
      moduleId,
      title,
      description,
      markdownContent,
      videoUrl,
      order,
      estimatedDuration,
    } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        ...(moduleId !== undefined && { moduleId }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(markdownContent !== undefined && { markdownContent }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(order !== undefined && { order }),
        ...(estimatedDuration !== undefined && { estimatedDuration }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (moduleId && moduleId !== previousModuleId) {
      await syncModuleLessonCount(previousModuleId);
      await syncModuleLessonCount(moduleId);
    } else {
      await syncModuleLessonCount(previousModuleId);
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' },
      });
    }

    await ChatHistory.deleteMany({ lessonId: lesson._id });
    await Progress.deleteMany({ lessonId: lesson._id });
    await Lesson.findByIdAndDelete(req.params.id);

    await syncModuleLessonCount(lesson.moduleId);

    res.json({
      success: true,
      data: { message: 'Lesson deleted successfully' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};