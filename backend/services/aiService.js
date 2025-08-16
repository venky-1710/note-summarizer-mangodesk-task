import Groq from 'groq-sdk';

class AIService {
  constructor() {
    this.groq = null;
  }

  getGroqClient() {
    if (!this.groq) {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY environment variable is not configured. Please add it to your .env file.');
      }
      this.groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      });
    }
    return this.groq;
  }

  async generateSummary(text, customPrompt) {
    try {
      const groqClient = this.getGroqClient();

      const systemPrompt = `You are an AI assistant specialized in summarizing meeting notes and transcripts. 
      Your task is to create structured, professional summaries based on the user's specific instructions.
      Always maintain accuracy and include important details while following the requested format.`;

      const userPrompt = `Please analyze the following meeting transcript and create a summary based on these specific instructions: "${customPrompt}"

      Meeting Transcript:
      ${text}

      Instructions: ${customPrompt}

      Please provide a well-structured summary that follows the given instructions exactly.`;

      const completion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        model: "mixtral-8x7b-32768", // Using Mixtral model for better performance
        temperature: 0.3, // Lower temperature for more consistent outputs
        max_tokens: 2048,
        top_p: 1,
        stop: null
      });

      return completion.choices[0]?.message?.content || 'Unable to generate summary.';
    } catch (error) {
      console.error('Error generating summary with Groq:', error);
      
      // Fallback to a simple extraction if AI fails
      if (error.message.includes('GROQ_API_KEY')) {
        throw error;
      }
      
      return this.generateFallbackSummary(text, customPrompt);
    }
  }

  generateFallbackSummary(text, customPrompt) {
    // Simple fallback summarization logic
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyPhrases = this.extractKeyPhrases(text);
    
    let summary = `Summary based on: "${customPrompt}"\n\n`;
    
    if (customPrompt.toLowerCase().includes('bullet') || customPrompt.toLowerCase().includes('points')) {
      summary += '• ' + keyPhrases.slice(0, 5).join('\n• ');
    } else if (customPrompt.toLowerCase().includes('action')) {
      const actionItems = sentences.filter(s => 
        s.toLowerCase().includes('will') || 
        s.toLowerCase().includes('should') || 
        s.toLowerCase().includes('must') ||
        s.toLowerCase().includes('need to')
      );
      summary += 'Action Items:\n• ' + actionItems.slice(0, 5).join('\n• ');
    } else {
      summary += sentences.slice(0, 3).join('. ') + '.';
    }
    
    return summary;
  }

  extractKeyPhrases(text) {
    // Simple key phrase extraction
    const words = text.toLowerCase().split(/\W+/);
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    const keyWords = words.filter(word => 
      word.length > 3 && 
      !commonWords.includes(word)
    );
    
    const wordCount = {};
    keyWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  async testConnection() {
    try {
      const groqClient = this.getGroqClient();

      const completion = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: "Hello, respond with 'OK' if you can hear me." }],
        model: "mixtral-8x7b-32768",
        max_tokens: 10
      });

      return { 
        success: true, 
        response: completion.choices[0]?.message?.content 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

export default new AIService();
