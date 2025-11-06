import React, { useState, useEffect } from 'react';
import './DebateTimer.css';

function DebateTimer({ roomId, phase }) {
  const [timeLeft, setTimeLeft] = useState(300); // 5분
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (minutes) => {
    setTimeLeft(minutes * 60);
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(300);
  };

  const getPhaseInfo = (phaseName) => {
    const phases = {
      opening: { name: '입론', icon: '🎤', time: 5 },
      argument: { name: '주장', icon: '💡', time: 10 },
      rebuttal: { name: '반론', icon: '⚔️', time: 5 },
      closing: { name: '최종발언', icon: '🎯', time: 3 }
    };
    return phases[phaseName] || phases.opening;
  };

  const currentPhase = getPhaseInfo(phase);

  return (
    <div className="debate-timer">
      <div className="timer-header">
        <span className="phase-badge">
          {currentPhase.icon} {currentPhase.name}
        </span>
        <div className="timer-display">
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="timer-controls">
        <button
          className="timer-btn start"
          onClick={() => startTimer(currentPhase.time)}
          disabled={isRunning}
        >
          시작
        </button>
        <button
          className="timer-btn pause"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '일시정지' : '재개'}
        </button>
        <button
          className="timer-btn reset"
          onClick={resetTimer}
        >
          초기화
        </button>
      </div>

      <div className="quick-timers">
        <button onClick={() => startTimer(3)}>3분</button>
        <button onClick={() => startTimer(5)}>5분</button>
        <button onClick={() => startTimer(10)}>10분</button>
      </div>
    </div>
  );
}

export default DebateTimer;
