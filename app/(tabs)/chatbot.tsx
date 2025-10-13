import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Bot, Send, User as UserIcon } from 'lucide-react-native';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là trợ lý AI của HealthSmart. Bạn cần hỗ trợ gì về sức khỏe?' },
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Cảm ơn bạn đã hỏi! (Demo) AI sẽ trả lời ở đây.' }]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Trò chuyện với AI</Text>
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={{ paddingVertical: 12 }}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={msg.sender === 'user' ? styles.userMsgWrap : styles.botMsgWrap}
            >
              {msg.sender === 'bot' ? (
                <Bot color="#059669" size={20} style={{ marginRight: 6 }} />
              ) : (
                <UserIcon color="#2563eb" size={20} style={{ marginRight: 6 }} />
              )}
              <Text style={msg.sender === 'user' ? styles.userMsg : styles.botMsg}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu hỏi..."
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Send color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  chatArea: {
    flex: 1,
    marginBottom: 12,
  },
  botMsgWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-start',
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  userMsgWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  botMsg: {
    color: '#374151',
    fontSize: 15,
  },
  userMsg: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: '#111827',
  },
  sendBtn: {
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 8,
    marginLeft: 6,
  },
});