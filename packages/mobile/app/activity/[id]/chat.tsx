import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';

const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001').replace('/api', '');

interface Message {
  id: string;
  messageText: string;
  messageType: 'text' | 'system';
  sentAt: string;
  sender?: { id: string; name: string };
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    api.get('/users/me').then(u => setUserId(u.id)).catch(() => {});
    api.get(`/activities/${id}/chat`).then(setMessages).catch(() => {});
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const socket = io(`${API_URL}/chat`, { auth: { token } });
    socketRef.current = socket;
    socket.emit('join_room', { activityId: id });
    socket.on('new_message', (msg: Message) => setMessages(prev => [...prev, msg]));
    return () => { socket.disconnect(); };
  }, [id]);

  const send = () => {
    if (!input.trim()) return;
    socketRef.current?.emit('send_message', { activityId: id, text: input.trim() });
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m, i) => m.id || String(i)}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) =>
          item.messageType === 'system' ? (
            <Text style={styles.systemMsg}>{item.messageText}</Text>
          ) : (
            <View style={[styles.bubble, item.sender?.id === userId ? styles.myBubble : styles.theirBubble]}>
              {item.sender?.id !== userId && <Text style={styles.senderName}>{item.sender?.name}</Text>}
              <Text style={item.sender?.id === userId ? styles.myText : styles.theirText}>{item.messageText}</Text>
            </View>
          )
        }
      />
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  messageList: { padding: 12, gap: 6 },
  systemMsg: { textAlign: 'center', color: '#9ca3af', fontSize: 11, marginVertical: 4 },
  bubble: { maxWidth: '75%', borderRadius: 14, padding: 10, marginBottom: 4 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: '#16a34a' },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  senderName: { fontSize: 10, color: '#9ca3af', marginBottom: 2 },
  myText: { color: '#fff', fontSize: 14 },
  theirText: { color: '#111827', fontSize: 14 },
  inputRow: { flexDirection: 'row', padding: 8, gap: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14 },
  sendBtn: { backgroundColor: '#16a34a', borderRadius: 20, paddingHorizontal: 16, justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontWeight: '600' },
});
