import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import RoomList from './components/RoomList';
import StanceSelector from './components/StanceSelector';
import DebateRoom from './components/DebateRoom';
import './App.css';

// 환경 변수 검증
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Environment Variables Check:');
console.log('REACT_APP_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('REACT_APP_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
} else {
  console.log('✅ Supabase client initialized successfully');
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function App() {
  const [currentView, setCurrentView] = useState('room-list');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userName, setUserName] = useState('');
  const [userStance, setUserStance] = useState('');

  // 앱 시작 시 항상 홈으로 강제 리셋
  useEffect(() => {
    console.log('🏠 App initialized - Starting at home (room-list)');
    setCurrentView('room-list');
    setSelectedRoom(null);
    setUserName('');
    setUserStance('');
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setCurrentView('stance-selector');
  };

  const handleJoinRoom = (name, stance) => {
    setUserName(name);
    setUserStance(stance);
    setCurrentView('debate-room');
  };

  const handleLeaveRoom = () => {
    setCurrentView('room-list');
    setSelectedRoom(null);
    setUserName('');
    setUserStance('');
  };

  if (!supabase) {
    return (
      <div className="error-container">
        <h1>⚠️ 설정 오류</h1>
        <p>Supabase 환경 변수가 설정되지 않았습니다.</p>
        <p>
          <code>.env</code> 파일을 생성하고 다음 변수를 설정하세요:
        </p>
        <pre>
          REACT_APP_SUPABASE_URL=your_supabase_url{'\n'}
          REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
        </pre>
      </div>
    );
  }

  return (
    <div className="app">
      {currentView === 'room-list' && (
        <RoomList
          supabase={supabase}
          onSelectRoom={handleSelectRoom}
        />
      )}

      {currentView === 'stance-selector' && selectedRoom && (
        <StanceSelector
          room={selectedRoom}
          onJoin={handleJoinRoom}
        />
      )}

      {currentView === 'debate-room' && selectedRoom && (
        <DebateRoom
          supabase={supabase}
          room={selectedRoom}
          userName={userName}
          stance={userStance}
          onLeave={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;
