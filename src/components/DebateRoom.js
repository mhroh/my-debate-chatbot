import React, { useState, useEffect, useRef } from 'react';
import DebateStats from './DebateStats';
import DebateTimer from './DebateTimer';
import './DebateRoom.css';

function DebateRoom({ supabase, room, userName, stance, onLeave }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!supabase || !room) return;

    // 참여자 등록
    registerParticipant();

    // 메시지 로드
    fetchMessages();
    fetchParticipants();

    // 실시간 구독
    const messagesChannel = supabase
      .channel(`messages:${room.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    const participantsChannel = supabase
      .channel(`participants:${room.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants', filter: `room_id=eq.${room.id}` },
        () => {
          fetchParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [supabase, room]);

  const registerParticipant = async () => {
    if (!supabase) return;

    await supabase
      .from('participants')
      .upsert([{
        room_id: room.id,
        user_name: userName,
        stance: stance,
        is_online: true,
        last_seen: new Date().toISOString()
      }]);
  };

  const fetchMessages = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const fetchParticipants = async () => {
    if (!supabase) return;

    const { data } = await supabase
      .from('participants')
      .select('*')
      .eq('room_id', room.id)
      .eq('is_online', true);

    if (data) setParticipants(data);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !supabase) return;

    const userMessageContent = newMessage;
    setNewMessage('');
    setIsLoading(true);

    try {
      await supabase.from('messages').insert([{
        room_id: room.id,
        user_name: userName,
        content: userMessageContent,
        is_bot: false,
        stance: stance,
        debate_phase: room.debate_phase,
        created_at: new Date().toISOString()
      }]);

      // 봇 응답 생성
      setTimeout(() => generateBotResponse(userMessageContent), 1000);
    } catch (err) {
      console.error('메시지 전송 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBotResponse = async (userMessage) => {
    if (!supabase) return;

    const response = getBotResponse(userMessage, room.bot_role, stance);

    await supabase.from('messages').insert([{
      room_id: room.id,
      user_name: 'AI 봇',
      content: response,
      is_bot: true,
      stance: stance === 'agree' ? 'disagree' : 'agree',
      debate_phase: room.debate_phase,
      created_at: new Date().toISOString()
    }]);
  };

  const getBotResponse = (message, botRole, userStance) => {
    const lowerMessage = message.toLowerCase();

    // 봇 역할별 응답
    if (botRole === 'moderator') {
      return getModeratorResponse(message, lowerMessage);
    } else if (botRole === 'devils_advocate') {
      return getDevilsAdvocateResponse(message, userStance);
    } else if (botRole === 'mediator') {
      return getMediatorResponse(message, lowerMessage);
    }

    return '흥미로운 관점입니다. 더 자세히 설명해주시겠어요?';
  };

  const getModeratorResponse = (message, lowerMessage) => {
    if (lowerMessage.includes('안녕') || lowerMessage.includes('시작')) {
      return `토론을 시작하겠습니다. 주제는 "${room.topic}"입니다. 각자의 입장을 차례대로 발표해주세요.`;
    }

    const responses = [
      `좋은 의견 감사합니다. 다른 분들의 의견도 들어볼까요?`,
      `"${message.substring(0, 30)}..." - 이 부분에 대해 구체적인 근거를 제시해주실 수 있나요?`,
      `흥미로운 관점이네요. 반대 입장에서는 어떻게 생각하실까요?`,
      `시간 관계상 다음 단계로 넘어가겠습니다. 현재까지의 논의를 정리하면...`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getDevilsAdvocateResponse = (message, userStance) => {
    const oppositeView = userStance === 'agree' ? '반대' : '찬성';

    return `잠깐만요! ${oppositeView} 입장에서 본다면, 다음과 같은 문제가 있습니다:\n\n` +
           `1. 실현 가능성의 문제\n` +
           `2. 예상치 못한 부작용\n` +
           `3. 대안적 접근의 필요성\n\n` +
           `이러한 반론에 대해 어떻게 생각하시나요?`;
  };

  const getMediatorResponse = (message, lowerMessage) => {
    return `양쪽 의견을 정리해보겠습니다:\n\n` +
           `✅ 찬성 측: 실용성과 효율성 강조\n` +
           `❌ 반대 측: 리스크와 윤리적 문제 지적\n\n` +
           `두 입장의 공통점을 찾아 합의점을 도출해봅시다. 어떤 부분에서 타협이 가능할까요?`;
  };

  const getStanceIcon = (messageStance) => {
    if (messageStance === 'agree') return '👍';
    if (messageStance === 'disagree') return '👎';
    return '🤖';
  };

  const getStanceColor = (messageStance) => {
    if (messageStance === 'agree') return '#4CAF50';
    if (messageStance === 'disagree') return '#F44336';
    return '#9C27B0';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="debate-room-container">
      <div className="debate-header">
        <div className="header-left">
          <button className="back-btn" onClick={onLeave}>← 나가기</button>
          <div className="room-info">
            <h2>{room.title}</h2>
            <p>{room.topic}</p>
          </div>
        </div>
        <div className="header-right">
          <button
            className={`stats-btn ${showStats ? 'active' : ''}`}
            onClick={() => setShowStats(!showStats)}
          >
            📊 통계
          </button>
          <div className="participants-badge">
            👥 {participants.length}
          </div>
        </div>
      </div>

      <div className="debate-content">
        {showStats && (
          <div className="stats-panel">
            <DebateStats
              supabase={supabase}
              roomId={room.id}
              messages={messages}
              participants={participants}
            />
          </div>
        )}

        <div className="debate-main">
          <DebateTimer roomId={room.id} phase={room.debate_phase} />

          <div className="participants-list">
            {participants.map((p) => (
              <span key={p.id} className="participant-chip" style={{
                backgroundColor: getStanceColor(p.stance),
                opacity: p.user_name === userName ? 1 : 0.7
              }}>
                {getStanceIcon(p.stance)} {p.user_name}
                {p.user_name === userName && ' (나)'}
              </span>
            ))}
          </div>

          <div className="messages-container">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`debate-message ${msg.is_bot ? 'bot' : 'user'} ${
                  msg.user_name === userName ? 'own' : ''
                }`}
                style={{
                  borderLeft: `4px solid ${getStanceColor(msg.stance)}`
                }}
              >
                <div className="message-header">
                  <span className="message-author">
                    {getStanceIcon(msg.stance)} {msg.user_name}
                  </span>
                  <span className="message-time">{formatTime(msg.created_at)}</span>
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="의견을 입력하세요..."
              disabled={isLoading || !supabase}
            />
            <button type="submit" disabled={isLoading || !newMessage.trim()}>
              {isLoading ? '전송 중...' : '전송'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;
