-- ========================================
-- 디베이트 챗봇 데이터베이스 스키마
-- 이 SQL을 Supabase SQL Editor에 복사-붙여넣기 하세요
-- ========================================

-- 1. 토론방 테이블
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  bot_role TEXT DEFAULT 'moderator', -- 'moderator', 'devils_advocate', 'mediator'
  debate_phase TEXT DEFAULT 'opening', -- 'opening', 'argument', 'rebuttal', 'closing'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 참여자 테이블
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  stance TEXT CHECK (stance IN ('agree', 'disagree', 'neutral')),
  is_online BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_name)
);

-- 3. 메시지 테이블 (기존 messages 테이블 삭제 후 재생성)
DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT false,
  stance TEXT,
  debate_phase TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS rooms_active_idx ON rooms(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS participants_room_idx ON participants(room_id, is_online);
CREATE INDEX IF NOT EXISTS messages_room_idx ON messages(room_id, created_at DESC);

-- 5. 기본 토론방 생성
INSERT INTO rooms (title, topic, description, bot_role) VALUES
  ('AI 윤리 토론', '인공지능의 윤리적 사용', 'AI 기술의 발전과 윤리적 책임에 대해 토론합니다', 'moderator'),
  ('기본소득 찬반', '기본소득 제도 도입', '전 국민 기본소득 제도의 필요성에 대해 토론합니다', 'devils_advocate'),
  ('원격근무 vs 출근', '원격근무와 사무실 근무', '일의 미래와 근무 방식에 대해 토론합니다', 'mediator');

-- 6. Realtime 활성화 (실시간 업데이트)
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 7. Row Level Security (RLS) 비활성화 (개발용, 나중에 활성화 가능)
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 완료!
-- 이제 React 앱에서 이 테이블들을 사용할 수 있습니다.
