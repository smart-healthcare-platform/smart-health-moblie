import { apiAuth } from '../lib/axios'; // Use the configured Axios instance with auth interceptor
// import { Message } from '@/types/socket'; // Not used directly in this service, only its type definition is used implicitly

// Define the base API endpoint for chat
const CHAT_API_BASE = '/chat'; // This path will be prefixed by the API Gateway

export interface GetConversationsParams {
  userId: string; // The ID of the user whose conversations we want to fetch
  // Add other potential query parameters here if needed by the backend
}

export interface GetMessagesParams {
  conversationId: string;
  limit?: number; // Number of messages to fetch
  page?: number; // Page number for pagination
 // Add other potential query parameters here if needed by the backend
}

export interface CreateConversationParams {
  recipientId: string;
  recipientRole: string; // 'doctor' or 'patient'
}

// Define the response types from the backend API
export interface ConversationResponse {
  id: string;
  participants: { id: string; userId: string; fullName: string; role: string }[]; // Updated to use fullName and userId
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
 content: string;
  contentType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

/**
 * Fetches a list of conversations for a given user.
 * @param params The parameters for the request, including the userId.
 * @returns A promise resolving to an array of conversations.
 */
export const getConversations = async (): Promise<ConversationResponse[]> => { // Removed params: GetConversationsParams
  try {
    const response = await apiAuth.get(`${CHAT_API_BASE}/conversations`); // Removed userId from URL
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};

/**
 * Fetches messages for a specific conversation.
 * @param params The parameters for the request, including the conversationId.
 * @returns A promise resolving to an array of messages.
 */
export const getMessages = async (params: GetMessagesParams): Promise<MessageResponse[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.page !== undefined) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const url = `${CHAT_API_BASE}/conversations/${params.conversationId}/messages${queryString ? `?${queryString}` : ''}`;

    const response = await apiAuth.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * Creates a new conversation between two participants.
 * @param params The parameters for the request, including participant IDs.
 * @returns A promise resolving to the created conversation object.
 */
export const createConversation = async (params: CreateConversationParams): Promise<ConversationResponse> => {
  try {
    console.log('📤 Creating conversation with params:', params);
    const response = await apiAuth.post(`${CHAT_API_BASE}/conversations`, params);
    console.log('📥 Create conversation response:', response.data);
    
    // Handle different response formats:
    // 1. Direct: { id: "...", participants: [...], ... }
    // 2. Nested: { data: { id: "...", participants: [...], ... } }
    // 3. Backend specific: { conversationId: "...", message: "..." }
    let conversationData = response.data;
    
    // If response.data has a 'data' property, use that instead
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log('📦 Using nested data property');
      conversationData = response.data.data;
    }
    
    console.log('📦 Raw conversation data:', conversationData);
    
    // Backend returns { conversationId, message } format
    // We need to transform it to { id, ... } format
    if (conversationData && 'conversationId' in conversationData) {
      console.log('� Transforming conversationId to id format');
      const transformedData: ConversationResponse = {
        id: conversationData.conversationId,
        participants: conversationData.participants || [],
        lastMessage: conversationData.lastMessage,
        createdAt: conversationData.createdAt || new Date().toISOString(),
        updatedAt: conversationData.updatedAt || new Date().toISOString(),
      };
      console.log('✅ Transformed conversation data:', transformedData);
      return transformedData;
    }
    
    console.log('📦 Final conversation data:', conversationData);
    
    if (!conversationData || !conversationData.id) {
      console.error('❌ Invalid conversation data:', conversationData);
      throw new Error('Invalid response: missing conversation data or ID');
    }
    
    return conversationData;
  } catch (error: any) {
    console.error('❌ Error creating conversation:', error);
    console.error('❌ Error response:', error?.response);
    console.error('❌ Error response data:', error?.response?.data);
    throw error;
 }
};

// Add other API functions as needed, e.g., for updating messages, deleting conversations, etc.