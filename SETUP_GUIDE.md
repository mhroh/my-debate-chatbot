# 토론 챗봇 완벽 설정 가이드

## 📋 목차
1. [빠른 시작 체크리스트](#1-빠른-시작-체크리스트)
2. [중요 정보 백업용](#2-중요-정보-백업용)
3. [상세 설정 단계](#3-상세-설정-단계)
4. [문제 해결 레퍼런스](#4-문제-해결-레퍼런스)
5. [코드 구조 설명](#5-코드-구조-설명)
6. [Claude Code 효율적 사용법](#6-claude-code-효율적-사용법)

---

## 1. 빠른 시작 체크리스트

### 필수 계정 (모두 무료)
- [ ] GitHub 계정 생성 (https://github.com)
- [ ] Supabase 계정 생성 (https://supabase.com)
- [ ] Vercel 계정 생성 (https://vercel.com)

### Supabase 설정
- [ ] 새 프로젝트 생성
- [ ] SQL Editor에서 데이터베이스 스키마 실행
- [ ] Realtime 활성화 확인
- [ ] URL과 Anon Key 복사 저장

### Vercel 배포
- [ ] GitHub 저장소 연결
- [ ] 환경 변수 2개 추가 (`REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`)
- [ ] 배포 완료 대기
- [ ] 사이트 접속 테스트

### 확인 사항
- [ ] 배포된 사이트에 3개 토론방 표시됨
- [ ] 좌측 상단에 "📍 View: room-list | v2.0" 표시됨
- [ ] 브라우저 콘솔 (F12) 에서 에러 없음

---

## 2. 중요 정보 백업용

### 💾 별도 텍스트 파일로 저장할 정보

아래 내용을 `토론챗봇_중요정보.txt` 파일로 저장하세요:

```
=== 토론 챗봇 중요 정보 ===

[Supabase 정보]
프로젝트 URL: https://bjrglqfewtdbsfugcqhr.supabase.co
Anon Key: (여기에 자신의 Supabase Anon Key 붙여넣기)
프로젝트 이름: (자신의 프로젝트 이름)

[Vercel 정보]
배포 URL: (배포 후 생성된 URL)
GitHub 저장소: https://github.com/mhroh/my-debate-chatbot

[환경 변수 - 정확한 이름!]
REACT_APP_SUPABASE_URL=https://bjrglqfewtdbsfugcqhr.supabase.co
REACT_APP_SUPABASE_ANON_KEY=(여기에 자신의 Key)

[Git Branch]
Production Branch: claude/analyze-and-improve-011CUqnwReTiBgtUtaHbZEhm
또는: main (기본값)

[로컬 테스트 명령어]
npm install
npm start
npm run build
```

### 📌 Supabase Anon Key 찾는 방법
1. Supabase 대시보드 접속
2. 프로젝트 선택
3. Settings (왼쪽 메뉴 하단 톱니바퀴 아이콘)
4. API
5. "anon" "public" 옆의 긴 문자열 복사

---

## 3. 상세 설정 단계

### Step 1: Supabase 데이터베이스 설정

#### 1.1 Supabase 프로젝트 생성
1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 이름 입력 (예: debate-chatbot)
4. Database Password 설정 (복잡하게, 메모해두기)
5. Region: Northeast Asia (Seoul) 선택
6. "Create new project" 클릭
7. 약 2분 대기 (프로젝트 생성 중...)

#### 1.2 데이터베이스 스키마 설정
1. 왼쪽 메뉴에서 "SQL Editor" 클릭
2. "New query" 클릭
3. 아래 SQL 전체 복사 → 붙여넣기 → "Run" 클릭

```sql
-- ============================================
-- 토론 챗봇 데이터베이스 스키마
-- ============================================

-- 1. 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS debate_stats CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;

-- 2. 토론방 테이블
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  bot_role TEXT DEFAULT 'moderator' CHECK (bot_role IN ('moderator', 'devils_advocate', 'mediator')),
  debate_phase TEXT DEFAULT 'opening' CHECK (debate_phase IN ('opening', 'argument', 'rebuttal', 'closing')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 참가자 테이블
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  stance TEXT CHECK (stance IN ('agree', 'disagree', 'neutral')),
  is_online BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 메시지 테이블
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT false,
  stance TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 평가 테이블
CREATE TABLE evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  criteria TEXT NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  feedback TEXT,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 통계 테이블
CREATE TABLE debate_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  total_messages INTEGER DEFAULT 0,
  agree_count INTEGER DEFAULT 0,
  disagree_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  most_active_user TEXT,
  keywords JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS 비활성화 (개발 단계)
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE debate_stats DISABLE ROW LEVEL SECURITY;

-- 8. Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE evaluations;
ALTER PUBLICATION supabase_realtime ADD TABLE debate_stats;

-- 9. 샘플 데이터 삽입
INSERT INTO rooms (title, topic, description, bot_role) VALUES
('AI 윤리 토론', 'AI는 인간의 일자리를 대체할 것인가?', 'AI 기술 발전에 따른 고용 시장 변화에 대한 토론', 'moderator'),
('환경 보호 vs 경제 성장', '환경 보호가 경제 성장보다 우선되어야 하는가?', '지속 가능한 발전에 대한 다양한 관점 토론', 'devils_advocate'),
('교육 개혁 토론', '학교에서 코딩을 필수 과목으로 지정해야 하는가?', '미래 교육 방향성에 대한 논의', 'mediator');
```

4. 성공 메시지 확인: "Success. No rows returned"

#### 1.3 Realtime 설정 확인
1. 왼쪽 메뉴 "Database" → "Replication" 클릭
2. 다음 테이블들이 "Realtime enabled" 상태인지 확인:
   - rooms
   - participants
   - messages
   - evaluations
   - debate_stats
3. 활성화 안되어 있다면 각각 토글 ON

#### 1.4 환경 변수 정보 복사
1. 왼쪽 메뉴 하단 "Settings" (톱니바퀴) 클릭
2. "API" 클릭
3. 다음 2가지 복사해서 메모장에 저장:
   - **Project URL**: `https://xxxxxxxx.supabase.co` 형태
   - **anon public**: `eyJh...` 로 시작하는 긴 문자열

---

### Step 2: Vercel 배포

#### 2.1 GitHub 저장소 확인
- 저장소 주소: https://github.com/mhroh/my-debate-chatbot
- 코드가 이미 푸시되어 있는지 확인

#### 2.2 Vercel 프로젝트 생성
1. https://vercel.com 접속 → 로그인
2. "Add New..." → "Project" 클릭
3. "Import Git Repository" → GitHub 연결
4. `my-debate-chatbot` 저장소 선택
5. "Import" 클릭

#### 2.3 환경 변수 설정 (가장 중요!)
**배포 전** 환경 변수 추가 화면에서:

1. 첫 번째 변수:
   - Name: `REACT_APP_SUPABASE_URL`
   - Value: (Step 1.4에서 복사한 Project URL 붙여넣기)
   - Environment: Production, Preview, Development 모두 체크

2. 두 번째 변수:
   - Name: `REACT_APP_SUPABASE_ANON_KEY`
   - Value: (Step 1.4에서 복사한 anon public 키 붙여넣기)
   - Environment: Production, Preview, Development 모두 체크

3. "Deploy" 클릭

#### 2.4 배포 완료 대기
- 약 2-3분 소요
- "Congratulations!" 화면이 나오면 "Visit" 클릭

#### 2.5 배포 확인
1. 사이트 접속 시 3개 토론방 보여야 함:
   - AI 윤리 토론
   - 환경 보호 vs 경제 성장
   - 교육 개혁 토론

2. 좌측 상단에 "📍 View: room-list | v2.0" 표시되어야 함

3. F12 눌러 콘솔 확인:
   ```
   ✅ Supabase client initialized successfully
   📋 RoomList component mounted
   ✅ Rooms fetched successfully: (3) [...]
   ```

---

### Step 3: 로컬 개발 환경 설정 (선택사항)

로컬에서 테스트하고 싶다면:

#### 3.1 환경 변수 파일 생성
프로젝트 루트에 `.env` 파일 생성:
```
REACT_APP_SUPABASE_URL=https://bjrglqfewtdbsfugcqhr.supabase.co
REACT_APP_SUPABASE_ANON_KEY=(자신의 Anon Key)
```

#### 3.2 의존성 설치
```bash
npm install
```

#### 3.3 개발 서버 실행
```bash
npm start
```
브라우저가 자동으로 http://localhost:3000 열림

#### 3.4 빌드 테스트
```bash
npm run build
```
성공 메시지: "The build folder is ready to be deployed."

---

## 4. 문제 해결 레퍼런스

### 문제 1: "메시지를 불러오는데 실패했습니다"

**증상**: 배포된 사이트에서 토론방이 안 보이거나 메시지 로딩 실패

**원인**: 환경 변수가 잘못 설정됨

**해결 방법**:
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수들이 **정확히 이 이름**으로 있는지 확인:
   - `REACT_APP_SUPABASE_URL` (CLIENT_KEY_... 같은 다른 이름이면 삭제!)
   - `REACT_APP_SUPABASE_ANON_KEY`
4. 없거나 잘못되었다면:
   - 잘못된 변수 삭제 (우측 ... 메뉴 → Remove)
   - "Add New" → 위 이름으로 다시 추가
5. Deployments → 최신 배포 → "Redeploy"

**확인**: F12 콘솔에서 다음 확인
```
✅ REACT_APP_SUPABASE_URL: ✅ Set
✅ REACT_APP_SUPABASE_ANON_KEY: ✅ Set
```

---

### 문제 2: 토론방은 보이는데 메시지 안 보임

**증상**: 토론방 목록은 보이지만 입장 후 메시지 로딩 실패

**원인**: Row Level Security (RLS) 활성화됨

**해결 방법**:
1. Supabase 대시보드 → SQL Editor
2. 다음 SQL 실행:
```sql
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations DISABLE ROW LEVEL SECURITY;
ALTER TABLE debate_stats DISABLE ROW LEVEL SECURITY;
```

**확인**: Table Editor에서 데이터 직접 조회 가능해야 함

---

### 문제 3: 코드 변경했는데 사이트에 반영 안됨

**증상**: 코드 수정 후 푸시했지만 배포 사이트가 안 바뀜

**원인 A**: 브라우저 캐시
**해결**: Ctrl + Shift + Delete → 캐시 삭제 또는 Ctrl + Shift + N (시크릿 모드)

**원인 B**: 잘못된 브랜치 배포됨
**해결**:
1. Vercel → Settings → Git
2. Production Branch 확인
3. 또는 Deployments → 원하는 브랜치 배포 → "..." → "Promote to Production"

**원인 C**: 배포가 아직 안됨
**해결**: Vercel → Deployments → "Redeploy" 클릭

---

### 문제 4: npm start 실패 - react-scripts not found

**증상**: 로컬에서 `npm start` 시 명령어를 찾을 수 없음

**원인**: 의존성 패키지 미설치

**해결**:
```bash
npm install
```

약 2-3분 소요, 1353개 패키지 설치됨

---

### 문제 5: 사이트가 계속 로딩만 됨

**증상**: 배포된 사이트 접속 시 흰 화면 또는 무한 로딩

**디버깅 순서**:
1. F12 눌러 콘솔 확인
2. 빨간 에러 메시지 찾기
3. Network 탭에서 실패한 요청 확인

**일반적 원인**:
- 환경 변수 미설정 → "Missing Supabase environment variables" 에러
- RLS 차단 → "permission denied" 에러
- 네트워크 문제 → "Failed to fetch" 에러

**해결**: 위 문제 1, 2 참조

---

### 문제 6: Realtime 업데이트 안됨

**증상**: 다른 사용자 메시지가 실시간으로 안 보임

**원인**: Realtime 활성화 안됨

**해결**:
1. Supabase → Database → Replication
2. 모든 테이블 "Realtime enabled" 체크
3. 또는 SQL 실행:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

---

### 문제 7: 404 Not Found (특정 URL 접속 시)

**증상**: `/room/123` 같은 URL 직접 접속 시 404

**원인**: SPA 라우팅 설정 누락

**확인**: `vercel.json` 파일에 다음 있는지 확인
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**해결**: 파일 수정 후 재배포

---

## 5. 코드 구조 설명

### 디렉토리 구조
```
my-debate-chatbot/
├── public/
│   ├── index.html          # HTML 진입점, 캐시 방지 설정
│   ├── _redirects          # Netlify용 (현재 미사용)
│   └── vercel.json         # Vercel 배포 설정
├── src/
│   ├── components/
│   │   ├── RoomList.js     # 토론방 목록 + 생성
│   │   ├── StanceSelector.js  # 입장 선택 모달
│   │   ├── DebateRoom.js   # 메인 토론 화면
│   │   ├── DebateStats.js  # 실시간 통계
│   │   └── DebateTimer.js  # 타이머
│   ├── App.js              # 메인 라우터
│   ├── App.css             # 스타일
│   ├── ErrorBoundary.js    # 에러 처리
│   └── index.js            # React 진입점
├── .env                    # 환경 변수 (로컬 전용)
├── .env.example            # 환경 변수 템플릿
├── package.json            # 의존성 정보
└── README.md               # 프로젝트 설명
```

---

### 주요 파일 설명

#### `src/App.js` (메인 라우터)
**역할**:
- 3가지 화면 전환 관리 (room-list, stance-selector, debate-room)
- 환경 변수 검증
- Supabase 클라이언트 초기화

**주요 상태**:
```javascript
currentView      // 현재 화면
selectedRoom     // 선택된 토론방
userName         // 사용자 이름
userStance       // 사용자 입장 (agree/disagree/neutral)
```

**중요 로직**:
- 페이지 로드 시 자동으로 홈(room-list)으로 리셋
- URL을 강제로 `/`로 변경
- 환경 변수 누락 시 에러 화면 표시

**위치**: `src/App.js:26-126`

---

#### `src/components/RoomList.js` (토론방 목록)
**역할**:
- Supabase에서 토론방 목록 가져오기
- 실시간 업데이트 구독
- 새 토론방 생성

**주요 기능**:
```javascript
fetchRooms()           // 토론방 목록 불러오기
handleCreateRoom()     // 새 토론방 생성
onSelectRoom(room)     // 토론방 선택 → StanceSelector로 이동
```

**Realtime 구독**:
```javascript
supabase.channel('rooms')
  .on('postgres_changes', { event: '*', table: 'rooms' }, () => {
    fetchRooms();  // 변경 감지 시 자동 새로고침
  })
```

---

#### `src/components/StanceSelector.js` (입장 선택)
**역할**: 토론 입장 선택 모달

**선택지**:
- 찬성 (agree)
- 반대 (disagree)
- 중립 (neutral)

**입력 항목**:
- 닉네임 입력
- 입장 선택 버튼

---

#### `src/components/DebateRoom.js` (토론방)
**역할**: 메인 토론 인터페이스

**주요 기능**:
1. 참가자 등록
2. 메시지 송수신
3. 실시간 참가자 목록
4. 봇 응답 생성
5. 자동 스크롤

**봇 역할별 응답**:
- **moderator**: "토론을 시작하겠습니다..."
- **devils_advocate**: "잠깐만요! 반대 입장에서..."
- **mediator**: "양쪽 의견을 정리해보겠습니다..."

**Realtime 구독**:
```javascript
// 메시지 실시간 업데이트
.on('postgres_changes', { event: 'INSERT', table: 'messages' }, ...)
// 참가자 실시간 업데이트
.on('postgres_changes', { event: '*', table: 'participants' }, ...)
```

---

#### `src/components/DebateStats.js` (통계)
**역할**: 실시간 토론 통계 표시

**계산 항목**:
- 찬성/반대 메시지 수
- 참여 비율 (%)
- 가장 활발한 참가자
- 상위 5개 키워드

---

#### `src/components/DebateTimer.js` (타이머)
**역할**: 토론 단계별 타이머

**단계**:
1. 입론 (opening)
2. 주장 (argument)
3. 반론 (rebuttal)
4. 최종발언 (closing)

**빠른 설정**: 3분, 5분, 10분 버튼

---

#### `public/index.html` (HTML 진입점)
**주요 설정**:
```html
<!-- 캐시 무효화 -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />

<!-- 강제 홈 리디렉트 -->
<script>
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
</script>
```

**위치**: `public/index.html:9-27`

---

#### `vercel.json` (Vercel 설정)
**SPA 라우팅 설정**:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
모든 URL 요청을 index.html로 리디렉트 → React Router가 처리

---

### 데이터 흐름

```
사용자 접속
    ↓
App.js 초기화
    ↓
환경 변수 검증
    ↓
RoomList.js 표시
    ↓
Supabase에서 rooms 가져오기
    ↓
토론방 선택
    ↓
StanceSelector.js 표시
    ↓
입장 선택 + 닉네임 입력
    ↓
DebateRoom.js 표시
    ↓
participants 테이블에 등록
    ↓
messages 실시간 구독 시작
    ↓
메시지 입력 → Supabase INSERT
    ↓
Realtime 이벤트 → 모든 참가자에게 전파
    ↓
DebateStats 자동 업데이트
```

---

## 6. Claude Code 효율적 사용법

### 6.1 대화 기록 관리

**Q: 프로모션 기간 끝나면 대화 기록 삭제되나요?**
**A**: 아니요! 대화 기록은 삭제되지 않습니다. 프로모션 종료 후에도 과거 대화 확인 가능합니다.

**백업 방법**:
1. 중요한 대화는 전체 선택 (Ctrl+A) → 복사 → 텍스트 파일 저장
2. 코드는 GitHub에 자동 저장됨
3. 이 가이드 파일 (`SETUP_GUIDE.md`) 보관

---

### 6.2 효율적인 요청 방법

**좋은 예**:
```
"RoomList.js에서 토론방을 생성할 때 최대 인원 수 제한 기능을 추가해줘.
입력 폼에 숫자 입력란 추가하고, rooms 테이블에 max_participants 컬럼 추가해야 할 것 같아."
```
- 구체적인 파일명
- 원하는 기능 명확히
- 본인 생각도 함께 제시

**나쁜 예**:
```
"토론방에 기능 하나 추가해줘"
```
- 어떤 기능인지 불명확
- 어느 파일인지 모호

---

### 6.3 디버깅 요청 시

**필수 정보 제공**:
1. 에러 메시지 전체 (F12 콘솔 스크린샷)
2. 어떤 동작을 했을 때 발생했는지
3. 로컬인지 배포 사이트인지

**예시**:
```
"배포된 사이트에서 토론방 입장 버튼 클릭 시 다음 에러 발생:
[스크린샷 또는 에러 메시지 복사]
로컬에서는 정상 작동함"
```

---

### 6.4 크레딧 절약 팁

**크레딧 많이 소모하는 작업**:
- 전체 파일 분석
- 긴 대화 세션 유지
- Task tool 사용 (agent 실행)

**절약 방법**:
1. 구체적인 파일명 언급
2. 한 번에 여러 요청보다 단계별 요청
3. 간단한 수정은 직접 시도 후 막히면 질문

**예시**:
- ❌ "전체 코드 다시 분석해서 개선점 찾아줘" (크레딧 많이 소모)
- ✅ "DebateRoom.js:45 에서 참가자 중복 등록 방지하려면 어떻게 해야돼?" (효율적)

---

### 6.5 이 가이드 활용법

**새 대화 시작할 때**:
```
"토론 챗봇 프로젝트 계속 작업하려고 해.
GitHub: https://github.com/mhroh/my-debate-chatbot
이전에 작성한 SETUP_GUIDE.md 파일 참고해줘."
```

**특정 문제 발생 시**:
```
"SETUP_GUIDE.md의 '문제 해결 레퍼런스' 섹션 참고해서
환경 변수 설정 문제 해결해줘"
```

---

### 6.6 추가 기능 개발 요청 예시

**1-on-1 튜터링 기능 추가**:
```
"다음 기능 추가해줘:
1. 튜터링 모드로 전환하는 버튼 (RoomList에)
2. 1:1 대화방 생성 (기존 토론방과 별도)
3. 튜터 봇이 질문하고 학생이 답변하는 형식
4. 튜터 봇 역할: 소크라테스식 질문법 사용

참고: 기존 DebateRoom.js 구조 재사용 가능한지 먼저 검토해줘"
```

**평가 시스템 추가**:
```
"토론 종료 시 평가 화면 추가:
1. DebateRoom에서 '토론 종료' 버튼 클릭 시
2. 평가 모달 표시 (evaluations 테이블 사용)
3. 평가 항목: 논리성, 근거 제시, 태도 (각 1-5점)
4. 피드백 텍스트 입력란
5. Supabase에 저장 후 결과 화면 표시

StanceSelector.js 디자인 참고해서 모달 만들어줘"
```

---

## 7. 자주 묻는 질문 (FAQ)

### Q1: Supabase 무료 플랜 제한은?
**A**:
- 데이터베이스: 500MB
- Realtime connections: 200 concurrent
- Storage: 1GB
- 월간 bandwidth: 5GB
→ 학생 프로젝트 충분함

### Q2: Vercel 무료 플랜 제한은?
**A**:
- 100GB bandwidth/month
- 100 deployments/day
- Serverless function: 100GB-hours
→ 충분히 사용 가능

### Q3: 로컬에서 테스트 꼭 해야 하나요?
**A**:
선택사항. Vercel에 바로 배포해도 됨.
단, 로컬 테스트하면 디버깅 빠름.

### Q4: 데이터베이스 초기화하려면?
**A**:
```sql
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS debate_stats CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
```
그 다음 Step 3.1의 SQL 다시 실행

### Q5: Git 푸시는 어떻게?
**A**:
```bash
git add .
git commit -m "기능 추가"
git push origin claude/analyze-and-improve-011CUqnwReTiBgtUtaHbZEhm
```
Vercel이 자동으로 배포함

---

## 8. 다음 단계 (향후 개발)

### 우선순위 1: 평가 시스템
- [ ] 토론 종료 버튼 추가
- [ ] 평가 모달 UI
- [ ] evaluations 테이블 연동
- [ ] 점수 집계 및 표시

### 우선순위 2: 1-on-1 튜터링
- [ ] 튜터링 모드 전환
- [ ] 소크라테스식 질문 로직
- [ ] 학생 답변 분석
- [ ] 피드백 생성

### 우선순위 3: 통계 고도화
- [ ] 차트 라이브러리 추가 (Chart.js)
- [ ] 시계열 그래프
- [ ] 참여도 히트맵
- [ ] PDF 리포트 생성

### 우선순위 4: 사용자 경험 개선
- [ ] 로그인/회원가입 (Supabase Auth)
- [ ] 프로필 페이지
- [ ] 토론 기록 저장
- [ ] 알림 시스템

---

## 9. 응급 상황 대처법

### 사이트가 완전히 안될 때

1. **환경 변수 재설정**
   - Vercel → Settings → Environment Variables
   - 모두 삭제 후 다시 추가
   - Redeploy

2. **데이터베이스 재설정**
   - Supabase SQL Editor
   - DROP TABLE 실행
   - CREATE TABLE 다시 실행

3. **완전 새로 배포**
   - Vercel 프로젝트 삭제
   - GitHub 저장소는 유지
   - Vercel에서 다시 Import

4. **로컬 테스트로 검증**
   ```bash
   npm install
   npm start
   ```
   로컬에서 작동하면 코드 문제 아님 → 환경 변수 문제

### Claude Code에 도움 요청할 때

```
"토론 챗봇이 작동 안해. 다음 정보 확인해줘:

[배포 정보]
Vercel URL: (URL 붙여넣기)
에러 화면: (스크린샷)

[콘솔 에러]
(F12 콘솔 내용 복사)

[시도한 것]
1. 환경 변수 확인 - 정확히 설정됨
2. RLS 비활성화 - 확인함
3. 캐시 삭제 - 시크릿 모드에서도 같은 증상

SETUP_GUIDE.md의 문제 해결 섹션 다 시도했는데 안됨.
추가로 확인할 사항 알려줘."
```

---

## 마무리

이 가이드를 `토론챗봇_완벽가이드.pdf` 또는 텍스트 파일로 저장해두세요.

**저장 권장 파일**:
1. 이 가이드 전체 (SETUP_GUIDE.md)
2. 중요 정보 백업 (섹션 2 내용)
3. Supabase SQL 스크립트 (섹션 3.1.2)
4. 문제 해결 레퍼런스 (섹션 4)

**언제든 다시 참고 가능**:
- GitHub: https://github.com/mhroh/my-debate-chatbot
- 로컬: `/home/user/my-debate-chatbot/SETUP_GUIDE.md`

**문제 발생 시 체크리스트**:
1. [ ] 섹션 4 (문제 해결) 확인
2. [ ] F12 콘솔 에러 확인
3. [ ] 환경 변수 이름 정확한지 확인
4. [ ] 로컬에서 테스트 (`npm start`)
5. [ ] Claude Code에 구체적 정보 제공하며 질문

**성공 기준**:
- ✅ 3개 토론방 보임
- ✅ 토론방 입장 가능
- ✅ 메시지 실시간 전송/수신
- ✅ 봇 응답 생성
- ✅ 통계 표시
- ✅ 타이머 작동

행운을 빕니다! 🚀
