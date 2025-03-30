import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// Supabase 클라이언트 초기화 - 실제 값으로 변경해야 합니다. 수정
// .env 파일에서 Supabase URL과 Anon Key를 가져옵니다.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;


const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setIsLoading(true);
      setError(null);
      
      // Supabase에서 messages 테이블이 있는지 확인하세요
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (err) {
      console.error('메시지 불러오기 오류:', err);
      setError('메시지를 불러오는 데 실패했습니다. 테이블이 올바르게 설정되었는지 확인하세요.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsLoading(true);
      
      const newMsg = {
        content: newMessage,
        user_id: 'user123', // 사용자 ID를 적절히 설정하세요
        is_bot: false,
        created_at: new Date().toISOString()
      };

      // 메시지 저장
      const { error: insertError } = await supabase
        .from('messages')
        .insert([newMsg]);

      if (insertError) throw insertError;
      
      setNewMessage('');
      await fetchMessages();
      
      // 봇 응답 생성 (여기서는 간단한 에코 응답)
      await generateBotResponse(newMessage);
      
    } catch (err) {
      console.error('메시지 전송 오류:', err);
      setError('메시지를 전송하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  async function generateBotResponse(userMessage) {
    try {
      const botMessage = {
        content: `당신의 메시지에 대한 응답: ${userMessage}`,
        user_id: 'bot',
        is_bot: true,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('messages')
        .insert([botMessage]);

      if (error) throw error;
      
      await fetchMessages();
    } catch (err) {
      console.error('봇 응답 생성 오류:', err);
      setError('봇 응답을 생성하는 데 실패했습니다.');
    }
  }

  return (
    <div className="app-container">
      <h1 className="app-title">디베이트 챗봇</h1>
      
      <div className="chat-container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="messages-container">
          {isLoading && messages.length === 0 ? (
            <div className="loading">메시지 불러오는 중...</div>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.is_bot ? 'bot-message' : 'user-message'}`}
              >
                <div className="message-content">{msg.content}</div>
              </div>
            ))
          ) : (
            <div className="empty-message">대화를 시작해보세요!</div>
          )}
        </div>
        
        <form className="message-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !newMessage.trim()}>
            {isLoading ? '전송 중...' : '전송'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;