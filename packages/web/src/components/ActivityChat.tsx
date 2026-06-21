'use client';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  messageText: string;
  messageType: 'text' | 'system';
  sentAt: string;
  sender?: { id: string; name: string };
}

interface Props {
  activityId: string;
  token: string;
  currentUserId: string;
}

export default function ActivityChat({ activityId, token, currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    const socket = io(`${apiUrl}/chat`, { auth: { token } });
    socketRef.current = socket;
    socket.emit('join_room', { activityId });
    socket.on('new_message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => { socket.disconnect(); };
  }, [activityId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    socketRef.current?.emit('send_message', { activityId, text: input.trim() });
    setInput('');
  };

  return (
    <div className="flex flex-col h-96 border rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-2 border-b font-medium text-sm bg-gray-50">Group Chat</div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map(m => (
          m.messageType === 'system' ? (
            <p key={m.id} className="text-xs text-center text-gray-400">{m.messageText}</p>
          ) : (
            <div key={m.id} className={`flex ${m.sender?.id === currentUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${m.sender?.id === currentUserId ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                {m.sender?.id !== currentUserId && <p className="text-xs font-medium mb-0.5 opacity-70">{m.sender?.name}</p>}
                {m.messageText}
              </div>
            </div>
          )
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-2 border-t flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button onClick={send} className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium">Send</button>
      </div>
    </div>
  );
}
