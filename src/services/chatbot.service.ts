import { apiNoAuth } from '../lib/axios';

interface ChatMessageRequest {
  message: string;
}

interface ChatResponse {
  response: string;
}

const CHATBOT_API_BASE = '/chatbot';

export const chatbotService = {
  /**
   * Gửi tin nhắn đến chatbot và nhận phản hồi
   * @param message Nội dung tin nhắn từ người dùng
   * @returns Promise với phản hồi từ chatbot
   */
  sendMessage: async (message: string): Promise<ChatResponse> => {
    try {
      const response = await apiNoAuth.post<ChatResponse>(
        `${CHATBOT_API_BASE}/chat`,
        { message } as ChatMessageRequest
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot API:', error);
      throw error;
    }
  },
};
