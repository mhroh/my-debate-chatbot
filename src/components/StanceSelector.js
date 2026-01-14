import React, { useState } from 'react';
import './StanceSelector.css';

function StanceSelector({ room, onJoin }) {
  const [userName, setUserName] = useState('');
  const [selectedStance, setSelectedStance] = useState('');

  const handleJoin = () => {
    if (userName.trim() && selectedStance) {
      onJoin(userName, selectedStance);
    }
  };

  return (
    <div className="stance-selector-container">
      <div className="stance-modal">
        <h2>🎯 토론방 입장</h2>
        <h3>{room.title}</h3>
        <p className="topic-text">{room.topic}</p>

        <div className="user-input-section">
          <label>이름을 입력하세요</label>
          <input
            type="text"
            placeholder="예: 홍길동"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            maxLength={20}
          />
        </div>

        <div className="stance-selection-section">
          <label>입장을 선택하세요</label>
          <div className="stance-options">
            <div
              className={`stance-option agree ${selectedStance === 'agree' ? 'selected' : ''}`}
              onClick={() => setSelectedStance('agree')}
            >
              <div className="stance-icon">👍</div>
              <div className="stance-label">찬성</div>
              <p className="stance-description">
                이 주제에 동의하며 긍정적 입장을 취합니다
              </p>
            </div>

            <div
              className={`stance-option disagree ${selectedStance === 'disagree' ? 'selected' : ''}`}
              onClick={() => setSelectedStance('disagree')}
            >
              <div className="stance-icon">👎</div>
              <div className="stance-label">반대</div>
              <p className="stance-description">
                이 주제에 반대하며 부정적 입장을 취합니다
              </p>
            </div>

            <div
              className={`stance-option neutral ${selectedStance === 'neutral' ? 'selected' : ''}`}
              onClick={() => setSelectedStance('neutral')}
            >
              <div className="stance-icon">🤔</div>
              <div className="stance-label">중립</div>
              <p className="stance-description">
                양쪽 의견을 모두 듣고 판단하겠습니다
              </p>
            </div>
          </div>
        </div>

        <button
          className="join-btn"
          onClick={handleJoin}
          disabled={!userName.trim() || !selectedStance}
        >
          토론 참여하기
        </button>
      </div>
    </div>
  );
}

export default StanceSelector;
