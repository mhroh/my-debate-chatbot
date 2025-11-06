import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

// 환경 변수 검증
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 환경 변수가 설정되지 않았을 때 경고
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 메시지 로드 및 실시간 구독 설정
  useEffect(() => {
    if (!supabase) {
      setError('Supabase가 올바르게 설정되지 않았습니다. 환경 변수를 확인하세요.');
      return;
    }

    fetchMessages();

    // Supabase 실시간 구독 설정
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    if (!supabase) return;

    try {
      setIsLoading(true);
      setError(null);

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
    if (!newMessage.trim() || !supabase) return;

    const userMessageContent = newMessage;
    setNewMessage('');

    try {
      setIsLoading(true);

      const newMsg = {
        content: userMessageContent,
        user_id: 'user123',
        is_bot: false,
        created_at: new Date().toISOString()
      };

      // 실시간 구독으로 자동 업데이트되므로 fetchMessages 불필요
      const { error: insertError } = await supabase
        .from('messages')
        .insert([newMsg]);

      if (insertError) throw insertError;

      // 봇 응답 생성 (약간의 지연으로 자연스럽게)
      setTimeout(() => generateBotResponse(userMessageContent), 800);

    } catch (err) {
      console.error('메시지 전송 오류:', err);
      setError('메시지를 전송하는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  async function generateBotResponse(userMessage) {
    if (!supabase) return;

    try {
      // 향상된 봇 응답 로직
      const response = getBotResponse(userMessage);

      const botMessage = {
        content: response,
        user_id: 'bot',
        is_bot: true,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('messages')
        .insert([botMessage]);

      if (error) throw error;
      // 실시간 구독으로 자동 업데이트됨
    } catch (err) {
      console.error('봇 응답 생성 오류:', err);
      setError('봇 응답을 생성하는 데 실패했습니다.');
    }
  }

  // 향상된 봇 응답 생성 함수
  function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();

    // 인사말
    if (lowerMessage.includes('안녕') || lowerMessage.includes('하이') || lowerMessage.includes('헬로')) {
      return '안녕하세요! 저는 디베이트 챗봇입니다. 어떤 주제에 대해 토론하고 싶으신가요?';
    }

    // 주제 제안
    if (lowerMessage.includes('주제') || lowerMessage.includes('토론') || lowerMessage.includes('무엇')) {
      return '흥미로운 토론 주제를 제안해드리겠습니다:\n\n' +
             '1. 인공지능의 윤리적 사용\n' +
             '2. 원격 근무 vs 사무실 근무\n' +
             '3. 기본소득 제도의 필요성\n' +
             '4. 환경 보호를 위한 개인의 책임\n\n' +
             '어떤 주제에 관심이 있으신가요?';
    }

    // 찬성/반대 의견
    if (lowerMessage.includes('찬성') || lowerMessage.includes('좋') || lowerMessage.includes('동의')) {
      return '흥미로운 관점이네요! 그렇다면 반대 입장에서 생각해볼 수 있는 점은 무엇이 있을까요? ' +
             '다양한 시각에서 바라보는 것이 좋은 토론의 핵심입니다.';
    }

    if (lowerMessage.includes('반대') || lowerMessage.includes('아니') || lowerMessage.includes('싫')) {
      return '그러한 우려도 충분히 이해됩니다. 그렇다면 찬성하는 입장에서는 어떤 근거가 있을지 생각해보시겠어요? ' +
             '양쪽 입장을 모두 고려하면 더 깊이 있는 논의가 가능합니다.';
    }

    // AI 관련
    if (lowerMessage.includes('ai') || lowerMessage.includes('인공지능')) {
      return 'AI는 정말 흥미로운 주제입니다. AI 기술이 가져올 긍정적인 변화와 동시에 ' +
             '우려되는 부분도 있죠. 특히 어떤 측면에 대해 논의하고 싶으신가요?';
    }

    // 기본 응답
    const responses = [
      `"${message}" - 이에 대한 흥미로운 관점이네요. 구체적인 근거나 예시를 들어 설명해주시겠어요?`,
      `좋은 의견입니다! 이 주장의 반대편 입장에서는 어떤 주장이 가능할까요?`,
      `말씀하신 내용에 대해 더 깊이 생각해볼 필요가 있겠네요. 이 주제와 관련된 실제 사례를 알고 계신가요?`,
      `의미 있는 발언입니다. 이 관점이 사회 전체에 미칠 영향은 어떨까요?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 타임스탬프 포맷팅 함수
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app-container">
      <h1 className="app-title">디베이트 챗봇</h1>

      <div className="chat-container">
        {error && <div className="error-message">{error}</div>}

        <div className="messages-container">
          {isLoading && messages.length === 0 ? (
            <div className="loading">메시지 불러오는 중...</div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id || `${msg.created_at}-${msg.content}`}
                  className={`message ${msg.is_bot ? 'bot-message' : 'user-message'}`}
                >
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">{formatTime(msg.created_at)}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
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
            disabled={isLoading || !supabase}
          />
          <button type="submit" disabled={isLoading || !newMessage.trim() || !supabase}>
            {isLoading ? '전송 중...' : '전송'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;