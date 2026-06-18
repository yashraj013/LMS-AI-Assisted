import axios from 'axios';

class GrokService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.apiBaseUrl = 'https://api.x.ai/v1';
    this.model = process.env.GROK_MODEL || 'grok-1';
    
    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async askQuestion(question, lessonContext, conversationHistory = []) {
    try {
      const systemPrompt = `You are an educational AI assistant helping students learn. 
You have access to lesson content and should provide clear, educational answers.
Lesson Context: ${lessonContext}
Always cite the lesson content when relevant.`;

      const messages = [
        ...conversationHistory,
        { role: 'user', content: question }
      ];

      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9
      });

      return {
        answer: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: response.data.model
      };
    } catch (error) {
      console.error('Grok API error:', error.response?.data || error.message);
      throw new Error(`Failed to get response from AI assistant: ${error.message}`);
    }
  }

  async getAvailableModels() {
    try {
      const response = await this.client.get('/models');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching models:', error.message);
      throw error;
    }
  }
}

export default new GrokService();