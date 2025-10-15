import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Heart,
  Send,
  User as UserIcon,
  Activity,
  Stethoscope,
  MessageCircle,
  ArrowRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import { chatbotService } from '../../src/services/chatbot.service';

// Hook để theo dõi trạng thái mounted của component (tránh memory leak)
const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  showOptions?: boolean;
  showDiagnosisConfirm?: boolean;
  showAppointmentConfirm?: boolean;
  showConsultationConfirm?: boolean;
}

interface ServiceOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function ChatbotScreen() {
  const router = useRouter();
  const isMounted = useIsMounted(); // Thêm hook để theo dõi mounted state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Xin chào! 🏥 Tôi là trợ lý sức khỏe thông minh của HealthSmart. Tôi có thể hỗ trợ bạn điều gì hôm nay?',
      isBot: true,
      timestamp: new Date(),
      showOptions: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const serviceOptions: ServiceOption[] = [
    {
      id: 'diagnosis',
      label: '🔬 Chuẩn đoán qua chỉ số sức khỏe',
      icon: Activity,
      color: '#10b981',
    },
    {
      id: 'appointment',
      label: '📅 Đặt lịch khám bệnh',
      icon: Stethoscope,
      color: '#3b82f6',
    },
    {
      id: 'consultation',
      label: '💬 Tư vấn sức khỏe',
      icon: Heart,
      color: '#ec4899',
    },
    {
      id: 'general',
      label: '❓ Câu hỏi chung',
      icon: MessageCircle,
      color: '#f97316',
    },
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage; // Lưu lại input để tránh race condition
    setInputMessage('');
    setIsTyping(true);

    try {
      const data = await chatbotService.sendMessage(currentInput);
      
      // Kiểm tra component vẫn mounted trước khi cập nhật state
      if (isMounted.current) {
        const botResponse: Message = {
          id: messages.length + 2,
          text: data.response || 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (error) {
      console.error('Error sending message to chatbot API:', error);
      
      if (isMounted.current) {
        const errorMessage: Message = {
          id: messages.length + 2,
          text: 'Có lỗi xảy ra khi kết nối với máy chủ. Vui lòng thử lại sau.',
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      if (isMounted.current) {
        setIsTyping(false);
      }
    }
  };

  const handleDiagnosisConfirm = () => {
    router.push('/(tabs)/diagnosis');
  };

  const handleAppointmentConfirm = () => {
    router.push('/booking');
  };

  const handleConsultationConfirm = () => {
    router.push('/doctors');
  };

  const handleServiceOption = async (optionId: string) => {
    const option = serviceOptions.find((opt) => opt.id === optionId);
    if (!option) return;

    // Hide options and add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: option.label,
      isBot: false,
      timestamp: new Date(),
    };

    const updatedMessages = messages.map((msg) =>
      msg.showOptions ? { ...msg, showOptions: false } : msg
    );

    setMessages([...updatedMessages, userMessage]);
    setIsTyping(true);

    // Bot responds with a confirmation/prompt after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate bot thinking time
    
    // Kiểm tra nếu component vẫn mounted trước khi cập nhật state
    if (isMounted.current) {
      let botResponse: Message | null = null;
      const botMessageId = messages.length + 2;

      switch (optionId) {
        case 'diagnosis':
          botResponse = {
            id: botMessageId,
            text: 'Để chẩn đoán bệnh, chúng tôi cần bạn cung cấp một số chỉ số sức khỏe. Bạn có muốn chuyển đến trang chẩn đoán không?',
            isBot: true,
            timestamp: new Date(),
            showDiagnosisConfirm: true,
          };
          break;
        case 'appointment':
          botResponse = {
            id: botMessageId,
            text: 'Để đặt lịch khám, bạn sẽ được chuyển đến trang đặt lịch. Bạn có đồng ý không?',
            isBot: true,
            timestamp: new Date(),
            showAppointmentConfirm: true,
          };
          break;
        case 'consultation':
          botResponse = {
            id: botMessageId,
            text: 'Để được tư vấn sức khỏe, bạn có thể tìm và chọn một bác sĩ phù hợp. Bạn có muốn xem danh sách bác sĩ không?',
            isBot: true,
            timestamp: new Date(),
            showConsultationConfirm: true,
          };
          break;
        case 'general':
          botResponse = {
            id: botMessageId,
            text: 'Vui lòng nhập câu hỏi chung của bạn vào ô bên dưới. Tôi sẽ cố gắng trả lời.',
            isBot: true,
            timestamp: new Date(),
          };
          break;
      }

      if (botResponse && isMounted.current) {
        setMessages((prev) => [...prev, botResponse!]);
      }
      if (isMounted.current) {
        setIsTyping(false);
      }
    }
  };

  const formatTime = (timestamp: Date) =>
    timestamp.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <LinearGradient colors={['#10b981', '#059669']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Heart color="#fff" size={24} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Trợ lý sức khỏe AI</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Sẵn sàng hỗ trợ</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Messages Container */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((message) => (
          <View key={message.id}>
            {/* Message Bubble */}
            <View
              style={[
                styles.messageRow,
                message.isBot ? styles.botMessageRow : styles.userMessageRow,
              ]}
            >
              {/* Avatar */}
              {message.isBot && (
                <View style={styles.botAvatar}>
                  <Heart color="#fff" size={16} />
                </View>
              )}

              {/* Message Content */}
              <View
                style={[
                  styles.messageBubble,
                  message.isBot ? styles.botMessageBubble : styles.userMessageBubble,
                ]}
              >
                {message.isBot ? (
                  <Markdown
                    style={markdownStyles}
                  >
                    {message.text}
                  </Markdown>
                ) : (
                  <Text style={styles.userMessageText}>
                    {message.text}
                  </Text>
                )}
                <Text
                  style={[
                    styles.messageTime,
                    message.isBot ? styles.botMessageTime : styles.userMessageTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>

              {!message.isBot && (
                <View style={styles.userAvatar}>
                  <UserIcon color="#fff" size={16} />
                </View>
              )}
            </View>

            {/* Service Options */}
            {message.showOptions && (
              <View style={styles.optionsContainer}>
                <Text style={styles.optionsLabel}>
                  Chọn dịch vụ bạn cần hỗ trợ:
                </Text>
                {serviceOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={styles.optionButton}
                      onPress={() => handleServiceOption(option.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                        <IconComponent color="#fff" size={16} />
                      </View>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      <ArrowRight color="#10b981" size={16} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Diagnosis Confirm */}
            {message.showDiagnosisConfirm && (
              <View style={styles.confirmContainer}>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: '#10b981' }]}
                  onPress={handleDiagnosisConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>
                    Đồng ý, đi đến trang chuẩn đoán
                  </Text>
                  <ArrowRight color="#fff" size={16} />
                </TouchableOpacity>
              </View>
            )}

            {/* Appointment Confirm */}
            {message.showAppointmentConfirm && (
              <View style={styles.confirmContainer}>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: '#3b82f6' }]}
                  onPress={handleAppointmentConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Đồng ý, đến trang đặt lịch</Text>
                  <ArrowRight color="#fff" size={16} />
                </TouchableOpacity>
              </View>
            )}

            {/* Consultation Confirm */}
            {message.showConsultationConfirm && (
              <View style={styles.confirmContainer}>
                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: '#ec4899' }]}
                  onPress={handleConsultationConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Xem danh sách bác sĩ</Text>
                  <ArrowRight color="#fff" size={16} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <View style={styles.botAvatar}>
              <Heart color="#fff" size={16} />
            </View>
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, styles.typingDot1]} />
                <View style={[styles.typingDot, styles.typingDot2]} />
                <View style={[styles.typingDot, styles.typingDot3]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Nhập câu hỏi về sức khỏe..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputMessage.trim()}
          activeOpacity={0.7}
        >
          <Send color="#fff" size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#86efac',
  },
  statusText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  botMessageBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  userMessageBubble: {
    backgroundColor: '#10b981',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  botMessageText: {
    color: '#1f2937',
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
  },
  botMessageTime: {
    color: '#9ca3af',
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.8)',
  },
  optionsContainer: {
    marginLeft: 40,
    marginTop: 8,
    marginBottom: 16,
  },
  optionsLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  confirmContainer: {
    marginLeft: 40,
    marginTop: 12,
    marginBottom: 16,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.6,
  },
  typingDot3: {
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.5,
  },
});

// Markdown styles for bot messages
const markdownStyles = StyleSheet.create({
  body: {
    color: '#1f2937',
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 8,
    marginBottom: 6,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 6,
    marginBottom: 4,
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
    marginBottom: 2,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#1f2937',
  },
  strong: {
    fontWeight: '700',
    color: '#111827',
  },
  em: {
    fontStyle: 'italic',
  },
  text: {
    color: '#1f2937',
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  list_item: {
    marginTop: 2,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet_list_icon: {
    fontSize: 15,
    lineHeight: 22,
    color: '#10b981',
    marginLeft: 0,
    marginRight: 8,
  },
  ordered_list_icon: {
    fontSize: 15,
    lineHeight: 22,
    color: '#10b981',
    marginLeft: 0,
    marginRight: 8,
  },
  code_inline: {
    backgroundColor: '#f3f4f6',
    color: '#059669',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
  },
  fence: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  code_block: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    lineHeight: 20,
  },
  blockquote: {
    backgroundColor: '#f0fdf4',
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  link: {
    color: '#10b981',
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: '#d1d5db',
    height: 1,
    marginVertical: 12,
  },
});