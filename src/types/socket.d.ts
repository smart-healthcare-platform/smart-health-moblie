import { Socket as SocketIoClientSocket } from 'socket.io-client';

// Định nghĩa các kiểu dữ liệu cho các sự kiện Socket.IO
export interface ClientToServerEvents {
  sendMessage: (data: { conversationId: string; content: string; contentType: 'text' | 'image' | 'file'; recipientId: string }) => void;
  // Thêm các sự kiện khác mà client gửi lên server
}

export interface ServerToClientEvents {
  receiveMessage: (message: Message) => void;
  // Thêm các sự kiện khác mà server gửi về client
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  contentType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

export type TypedSocket = SocketIoClientSocket<ServerToClientEvents, ClientToServerEvents>;