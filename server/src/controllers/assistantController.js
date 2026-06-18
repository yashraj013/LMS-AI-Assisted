import grokService from '../config/groqConfig.js';
import Lesson from '../models/lessonModel.js';
import ChatHistory from '../models/chatHistory.js';

export const askQuestion = async (req, res) => {
  try {
    const { lessonId, question, messageHistory } = req.body;
    const userId = req.user?._id;

    // Validate input
    if (!lessonId || !question) {
      return res.status(400).json({
        success: false,
        error: { message: 'lessonId and question are required' }
      });
    }

    // Fetch lesson content for context
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: { message: 'Lesson not found' }
      });
    }

    // Get answer from Grok
    const grokResponse = await grokService.askQuestion(
      question,
      lesson.markdownContent,
      messageHistory || []
    );

    // Save to chat history
    const chatEntry = new ChatHistory({
      studentId: userId,
      lessonId: lessonId,
      question: question,
      answer: grokResponse.answer,
      grokMetadata: {
        model: grokResponse.model,
        tokens: grokResponse.usage.total_tokens
      }
    });
    await chatEntry.save();

    // Return response
    res.json({
      success: true,
      data: {
        answer: grokResponse.answer,
        sources: [`lesson:${lessonId}`],
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Assistant error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { lessonId } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
    }

    const query = { studentId: userId };
    if (lessonId) query.lessonId = lessonId;

    const history = await ChatHistory.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
};