import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/redux';
import { ClientToServerEvents, ServerToClientEvents } from '@/src/types/socket';
import { Socket as SocketIoClientSocket } from 'socket.io-client';
import { Alert } from 'react-native';

interface UseSocketOptions {
  autoConnect?: boolean;
  path?: string;
}

export const useSocket = (options?: UseSocketOptions) => {
  const { autoConnect = true, path = '/socket.io' } = options || {};
  const socketRef = useRef<SocketIoClientSocket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token, user } = useSelector((state: RootState) => state.auth);

  const connect = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      return;
    }

    if (!token) {
      setError('Authentication token not found. Cannot connect to chat.');
      Alert.alert('Lỗi', 'Không tìm thấy token xác thực. Không thể kết nối chat.');
      return;
    }

    const socketUrl = process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';
    
    const newSocket: SocketIoClientSocket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl, {
      path: path,
      transports: ['websocket'],
      auth: {
        token: token,
      },
      query: {
        userId: user?.id,
      },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Socket connected');
    });

    newSocket.on('disconnect', (reason: string) => {
      setIsConnected(false);
      setError(`Socket disconnected: ${reason}`);
      console.log('Socket disconnected:', reason);
    });

    newSocket.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err);
      setError(`Socket connection error: ${err.message}`);
      Alert.alert('Lỗi kết nối', `Không thể kết nối chat: ${err.message}`);
    });

    socketRef.current = newSocket;
  }, [token, user?.id, path]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      console.log('Socket manually disconnected');
    }
  }, []);

  useEffect(() => {
    if (autoConnect && token && !socketRef.current?.connected) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [autoConnect, token, connect]);

  const sendMessage = useCallback((event: keyof ClientToServerEvents, ...args: Parameters<ClientToServerEvents[typeof event]>) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, ...args);
    } else {
      console.warn('Socket not connected, message not sent:', event, args);
      Alert.alert('Cảnh báo', 'Chat chưa kết nối. Vui lòng thử lại.');
    }
  }, []);

  const onMessage = useCallback((event: keyof ServerToClientEvents, callback: ServerToClientEvents[typeof event]) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const offMessage = useCallback((event: keyof ServerToClientEvents, callback?: ServerToClientEvents[typeof event]) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
    onMessage,
    offMessage,
  };
};
