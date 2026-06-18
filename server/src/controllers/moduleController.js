import Module from '../models/moduleModel.js';
import Lesson from '../models/lessonModel.js';
import Progress from '../models/progressModel.js';
import ChatHistory from '../models/chatHistory.js';

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });

    res.json({
      success: true,
      data: modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: { message: 'Module not found' },
      });
    }

    const lessons = await Lesson.find({ moduleId: module._id }).sort({ order: 1 });

    res.json({
      success: true,
      data: {
        module,
        lessons,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const createModule = async (req, res) => {
  try {
    const { title, description, order, totalLessons } = req.body;

    if (!title || !description || order === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: 'title, description, and order are required' },
      });
    }

    const module = await Module.create({
      title,
      description,
      order,
      totalLessons: totalLessons ?? 0,
    });

    res.status(201).json({
      success: true,
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { title, description, order, totalLessons } = req.body;

    const module = await Module.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(totalLessons !== undefined && { totalLessons }),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        error: { message: 'Module not found' },
      });
    }

    res.json({
      success: true,
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: { message: 'Module not found' },
      });
    }

    const lessons = await Lesson.find({ moduleId: module._id });
    const lessonIds = lessons.map((lesson) => lesson._id);

    await ChatHistory.deleteMany({ lessonId: { $in: lessonIds } });
    await Progress.deleteMany({ lessonId: { $in: lessonIds } });
    await Lesson.deleteMany({ moduleId: module._id });
    await Module.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      data: { message: 'Module deleted successfully' },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const getModuleLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ moduleId: req.params.id }).sort({ order: 1 });

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