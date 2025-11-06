import React, { useState, useEffect } from 'react';
import './RoomList.css';

function RoomList({ supabase, onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: '',
    topic: '',
    description: '',
    bot_role: 'moderator'
  });

  useEffect(() => {
    if (!supabase) return;

    fetchRooms();

    // 실시간 구독
    const channel = supabase
      .channel('rooms')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        fetchRooms();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase]);

  const fetchRooms = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('rooms')
      .select('*, participants(count)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRooms(data);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!supabase || !newRoom.title || !newRoom.topic) return;

    const { error } = await supabase
      .from('rooms')
      .insert([newRoom]);

    if (!error) {
      setShowCreateForm(false);
      setNewRoom({ title: '', topic: '', description: '', bot_role: 'moderator' });
    }
  };

  const getBotRoleName = (role) => {
    const roles = {
      'moderator': '사회자',
      'devils_advocate': '악마의 변호인',
      'mediator': '중재자'
    };
    return roles[role] || role;
  };

  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h1>🎯 토론방 목록</h1>
        <button
          className="create-room-btn"
          onClick={() => setShowCreateForm(true)}
        >
          + 새 토론방 만들기
        </button>
      </div>

      {showCreateForm && (
        <div className="create-room-modal">
          <div className="modal-content">
            <h2>새 토론방 만들기</h2>
            <form onSubmit={handleCreateRoom}>
              <input
                type="text"
                placeholder="방 제목 (예: AI 윤리 토론)"
                value={newRoom.title}
                onChange={(e) => setNewRoom({...newRoom, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="토론 주제 (예: 인공지능의 윤리적 사용)"
                value={newRoom.topic}
                onChange={(e) => setNewRoom({...newRoom, topic: e.target.value})}
                required
              />
              <textarea
                placeholder="설명 (선택사항)"
                value={newRoom.description}
                onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
              />
              <select
                value={newRoom.bot_role}
                onChange={(e) => setNewRoom({...newRoom, bot_role: e.target.value})}
              >
                <option value="moderator">🎙️ 사회자 (토론 진행 및 정리)</option>
                <option value="devils_advocate">😈 악마의 변호인 (반대 입장)</option>
                <option value="mediator">⚖️ 중재자 (양쪽 의견 정리)</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">생성</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rooms-grid">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="room-card"
            onClick={() => onSelectRoom(room)}
          >
            <h3>{room.title}</h3>
            <p className="room-topic">{room.topic}</p>
            {room.description && (
              <p className="room-description">{room.description}</p>
            )}
            <div className="room-footer">
              <span className="bot-role">
                🤖 {getBotRoleName(room.bot_role)}
              </span>
              <span className="participant-count">
                👥 {room.participants?.[0]?.count || 0}명 참여중
              </span>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="empty-state">
          <h3>아직 토론방이 없습니다</h3>
          <p>첫 토론방을 만들어보세요!</p>
        </div>
      )}
    </div>
  );
}

export default RoomList;
