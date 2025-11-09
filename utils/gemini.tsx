import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get the Gemini model (using current stable model name)
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }
});

// Helper function to generate content with JSON response
export async function generateGeminiResponse(prompt: string, userMessage: string) {
  try {
    const fullPrompt = `${prompt}\n\nUser: ${userMessage}`;
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

// Helper function for chat-style conversations
export async function generateGeminiChat(messages: any[], systemPrompt: string) {
  try {
    // Convert OpenAI-style messages to Gemini format
    const geminiMessages = messages.map(msg => {
      if (msg.role === 'user') {
        return `User: ${msg.content}`;
      } else if (msg.role === 'assistant') {
        return `Assistant: ${msg.content}`;
      }
      return '';
    }).filter(msg => msg !== '').join('\n');

    const fullPrompt = `${systemPrompt}\n\n${geminiMessages}`;
    
    const result = await geminiModel.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ Gemini API call successful');
    return text;
  } catch (error) {
    console.error('Gemini Chat API Error:', error);
    // Provide a fallback response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Gemini API Error: ${errorMessage}`);
  }
}