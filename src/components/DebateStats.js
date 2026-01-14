import React, { useState, useEffect } from 'react';
import './DebateStats.css';

function DebateStats({ supabase, roomId, messages, participants }) {
  const [stats, setStats] = useState({
    totalMessages: 0,
    agreeCount: 0,
    disagreeCount: 0,
    mostActiveUser: '',
    keywords: []
  });

  useEffect(() => {
    calculateStats();
  }, [messages, participants]);

  const calculateStats = () => {
    if (!messages || messages.length === 0) {
      setStats({
        totalMessages: 0,
        agreeCount: 0,
        disagreeCount: 0,
        mostActiveUser: '',
        keywords: []
      });
      return;
    }

    // 찬반 메시지 수
    const agreeMessages = messages.filter(m => m.stance === 'agree' && !m.is_bot);
    const disagreeMessages = messages.filter(m => m.stance === 'disagree' && !m.is_bot);

    // 가장 활발한 사용자
    const userMessageCounts = {};
    messages.filter(m => !m.is_bot).forEach(m => {
      userMessageCounts[m.user_name] = (userMessageCounts[m.user_name] || 0) + 1;
    });

    const mostActive = Object.entries(userMessageCounts).sort((a, b) => b[1] - a[1])[0];

    // 키워드 추출 (간단한 버전)
    const allText = messages
      .filter(m => !m.is_bot)
      .map(m => m.content)
      .join(' ');

    const words = allText
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);

    const wordCounts = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    setStats({
      totalMessages: messages.filter(m => !m.is_bot).length,
      agreeCount: agreeMessages.length,
      disagreeCount: disagreeMessages.length,
      mostActiveUser: mostActive ? mostActive[0] : '',
      keywords: topKeywords
    });
  };

  const getAgreePercent = () => {
    const total = stats.agreeCount + stats.disagreeCount;
    if (total === 0) return 50;
    return Math.round((stats.agreeCount / total) * 100);
  };

  return (
    <div className="debate-stats">
      <h3>📊 토론 통계</h3>

      <div className="stat-card">
        <div className="stat-label">전체 발언</div>
        <div className="stat-value">{stats.totalMessages}개</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">참여자</div>
        <div className="stat-value">{participants.length}명</div>
      </div>

      {stats.mostActiveUser && (
        <div className="stat-card">
          <div className="stat-label">가장 활발한 참여자</div>
          <div className="stat-value">🏆 {stats.mostActiveUser}</div>
        </div>
      )}

      <div className="stat-card">
        <div className="stat-label">찬반 비율</div>
        <div className="stance-bar">
          <div
            className="stance-bar-agree"
            style={{ width: `${getAgreePercent()}%` }}
          >
            👍 {stats.agreeCount}
          </div>
          <div
            className="stance-bar-disagree"
            style={{ width: `${100 - getAgreePercent()}%` }}
          >
            👎 {stats.disagreeCount}
          </div>
        </div>
        <div className="stance-percent">
          찬성 {getAgreePercent()}% | 반대 {100 - getAgreePercent()}%
        </div>
      </div>

      {stats.keywords.length > 0 && (
        <div className="stat-card">
          <div className="stat-label">핵심 키워드</div>
          <div className="keywords">
            {stats.keywords.map((kw, idx) => (
              <span key={idx} className="keyword-chip">
                {kw.word} ({kw.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DebateStats;
