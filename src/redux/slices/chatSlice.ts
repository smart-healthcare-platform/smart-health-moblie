import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Message } from '../../types/socket.d';
import { getConversations, getMessages } from '../../services/chat.service';
 
interface ConversationMessages {
  data: Message[];
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;
}

interface ChatState {
  conversations: {
    id: string;
    participants: { id: string; fullName: string; role: string }[];
    lastMessage?: {
      content: string;
      createdAt: string;
      senderId: string;
    };
    unreadCount: number;
  }[];
  selectedConversationId: string | null;
  messages: Record<string, ConversationMessages>; // Keyed by conversationId
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  unreadCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  selectedConversationId: null,
  messages: {},
  connectionStatus: 'disconnected',
  unreadCounts: {},
  loading: false,
  error: null,
};
 
// Async Thunk for fetching conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => { // Removed params: GetConversationsParams
    try {
      const response = await getConversations(); // Called without params
      // Ensure response is an array before mapping, default to empty array if null/undefined
      const conversationsData = response || [];
      return conversationsData.map(conv => ({ ...conv, unreadCount: 0, participants: conv.participants || [] })); // Initialize unreadCount and participants
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
 
const MESSAGE_LIMIT = 8;

// Async Thunk for fetching initial messages
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (params: { conversationId: string }, { rejectWithValue }) => {
    try {
      const response = await getMessages({ ...params, limit: MESSAGE_LIMIT, page: 1 });
      return {
        conversationId: params.conversationId,
        messages: response,
        page: 1,
        hasMore: response.length === MESSAGE_LIMIT,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Async Thunk for fetching more messages (pagination)
export const fetchMoreMessages = createAsyncThunk(
  'chat/fetchMoreMessages',
  async (params: { conversationId: string; page: number }, { rejectWithValue }) => {
    try {
      const response = await getMessages({ ...params, limit: MESSAGE_LIMIT });
      return {
        conversationId: params.conversationId,
        messages: response,
        page: params.page,
        hasMore: response.length === MESSAGE_LIMIT,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
 
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<ChatState['conversations']>) => {
      state.conversations = action.payload;
    },
    setSelectedConversationId: (state, action: PayloadAction<string | null>) => {
      state.selectedConversationId = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) => {
      const { conversationId, messages } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = { data: [], page: 1, hasMore: true, isLoadingMore: false };
      }
      state.messages[conversationId].data = messages;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = { data: [], page: 1, hasMore: true, isLoadingMore: false };
      }

      const conversationMessages = state.messages[conversationId].data;
      const existingMessageIndex = conversationMessages.findIndex(
        (msg) => msg.id === message.id
      );

      if (existingMessageIndex !== -1) {
        conversationMessages[existingMessageIndex] = message;
      } else {
        if (!message.id.startsWith('temp-')) {
          const matchingTempMessageIndex = conversationMessages.findIndex(msg =>
            msg.id.startsWith('temp-') &&
            msg.senderId === message.senderId &&
            msg.content === message.content &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 10000
          );

          if (matchingTempMessageIndex !== -1) {
            conversationMessages[matchingTempMessageIndex] = message;
          } else {
            conversationMessages.push(message);
          }
        } else {
          conversationMessages.push(message);
        }
      }

      if (state.selectedConversationId !== conversationId) {
        state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
      }
    },
    setConnectionStatus: (state, action: PayloadAction<ChatState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    },
    incrementUnreadCount: (state, action: PayloadAction<{ conversationId: string }>) => {
      const { conversationId } = action.payload;
      state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
    },
    resetUnreadCount: (state, action: PayloadAction<{ conversationId: string }>) => {
      const { conversationId } = action.payload;
      state.unreadCounts[conversationId] = 0;
    },
    clearError: (state) => { // Add clearError reducer
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, page, hasMore } = action.payload;
        // ✅ Reverse messages: Backend returns newest first, we need oldest first for display
        // ✅ Deduplicate to prevent duplicate keys
        const reversed = messages.reverse();
        const uniqueMessages = reversed.filter((msg, index, self) => 
          index === self.findIndex((m) => m.id === msg.id)
        );
        
        state.messages[conversationId] = {
          data: uniqueMessages,
          page,
          hasMore,
          isLoadingMore: false,
        };
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMoreMessages.pending, (state, action) => {
        const { conversationId } = action.meta.arg;
        if (state.messages[conversationId]) {
          state.messages[conversationId].isLoadingMore = true;
        }
      })
      .addCase(fetchMoreMessages.fulfilled, (state, action) => {
        const { conversationId, messages, page, hasMore } = action.payload;
        if (state.messages[conversationId]) {
          // ✅ Prepend older messages: Reverse them first (backend returns newest first)
          // Then add to start of array (older messages go before current messages)
          const reversed = messages.reverse();
          const combined = [...reversed, ...state.messages[conversationId].data];
          
          // ✅ Deduplicate the combined array
          const uniqueMessages = combined.filter((msg, index, self) => 
            index === self.findIndex((m) => m.id === msg.id)
          );
          
          state.messages[conversationId].data = uniqueMessages;
          state.messages[conversationId].page = page;
          state.messages[conversationId].hasMore = hasMore;
          state.messages[conversationId].isLoadingMore = false;
        }
      })
      .addCase(fetchMoreMessages.rejected, (state, action) => {
        const { conversationId } = action.meta.arg;
        if (state.messages[conversationId]) {
          state.messages[conversationId].isLoadingMore = false;
        }
        state.error = action.payload as string;
      });
  },
});
 
export const {
  setConversations,
  setSelectedConversationId,
  setMessages,
  addMessage,
  setConnectionStatus,
  incrementUnreadCount,
  resetUnreadCount,
  clearError, // Export clearError
} = chatSlice.actions;
 
export default chatSlice.reducer;