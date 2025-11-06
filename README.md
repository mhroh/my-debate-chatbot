# 🎯 디베이트 챗봇 - 실시간 토론 플랫폼

React와 Supabase를 활용한 **실시간 다자간 토론 웹 애플리케이션**입니다.

Streamlit 기반 앱과 차별화된 **완전한 토론 플랫폼**으로, 여러 명이 동시에 참여하여 실시간으로 토론할 수 있습니다.

🌐 **[라이브 데모 보기](#)** (배포 후 링크 추가)

---

## ✨ 주요 기능

### 🏠 토론방 시스템
- ✅ 주제별 토론방 생성 및 관리
- ✅ 여러 토론방 동시 운영
- ✅ 토론방별 독립적인 대화 기록
- ✅ 실시간 참여자 수 표시

### 👥 진영 선택 & 다자간 토론
- ✅ 찬성/반대/중립 입장 선택
- ✅ 여러 사용자 실시간 동시 참여
- ✅ 진영별 메시지 색상 구분
- ✅ 참여자 실시간 현황 표시

### 🤖 3가지 봇 역할 시스템
1. **🎙️ 사회자 봇**
   - 토론 진행 및 의견 정리
   - 발언 순서 조정
   - 핵심 내용 요약

2. **😈 악마의 변호인 봇**
   - 항상 반대 입장 제시
   - 비판적 사고 촉진
   - 논리적 반론 생성

3. **⚖️ 중재자 봇**
   - 양쪽 의견 균형있게 정리
   - 합의점 도출 지원
   - 객관적 관점 제시

### 📊 실시간 토론 통계 대시보드
- ✅ 찬성/반대 비율 시각화
- ✅ 전체 발언 수 집계
- ✅ 가장 활발한 참여자 표시
- ✅ 핵심 키워드 자동 추출
- ✅ 실시간 업데이트

### ⏱️ 토론 타이머
- ✅ 발언 시간 제한 기능
- ✅ 토론 단계별 타이머 (입론/주장/반론/최종발언)
- ✅ 3분/5분/10분 빠른 설정
- ✅ 일시정지 및 재개 기능

### 🔄 실시간 동기화
- ✅ Supabase Realtime 기반 즉각 업데이트
- ✅ 새 메시지 자동 알림
- ✅ 참여자 입장/퇴장 실시간 반영
- ✅ 자동 스크롤

---

## 🆚 Streamlit 앱과의 차이점

| 기능 | Streamlit 앱 | 이 프로젝트 |
|------|-------------|------------|
| 다자간 토론 | ❌ | ✅ 실시간 다중 사용자 |
| 토론방 시스템 | ❌ | ✅ 주제별 방 생성 |
| 진영 선택 | ❌ | ✅ 찬성/반대/중립 |
| 봇 역할 | 단일 | ✅ 3가지 역할 |
| 통계 대시보드 | ❌ | ✅ 실시간 분석 |
| 타이머 | ❌ | ✅ 단계별 타이머 |
| 데이터 지속성 | 제한적 | ✅ Supabase DB |
| 실시간 동기화 | ❌ | ✅ 완전 실시간 |
| 모바일 최적화 | 제한적 | ✅ 반응형 디자인 |

---

## 🚀 빠른 시작 (초보자용)

**코딩을 몰라도 괜찮습니다!** 복사-붙여넣기만 하면 됩니다.

### 📘 상세 가이드 보기
👉 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - 단계별 설치 가이드 (스크린샷 포함)

### 요약 (3단계, 10분 소요)

#### 1️⃣ Supabase 설정 (5분)
```bash
1. https://supabase.com 접속 → 로그인
2. 새 프로젝트 생성
3. SQL Editor에서 supabase-setup.sql 실행
4. API 키 복사 (Project URL + anon key)
```

#### 2️⃣ Vercel 배포 (3분)
```bash
1. https://vercel.com 접속 → 로그인
2. GitHub 저장소 import
3. 환경 변수 2개 입력:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_ANON_KEY
4. Deploy 클릭!
```

#### 3️⃣ 완료! 🎉
```
배포된 링크로 접속 → 토론방 생성 → 친구 초대!
```

---

## 🛠️ 기술 스택

### Frontend
- **React 19.1.0** - 최신 React
- **CSS3** - 현대적인 그라디언트 디자인
- **반응형 디자인** - 모바일/태블릿/데스크톱

### Backend
- **Supabase** - PostgreSQL + Realtime + Storage
- **Realtime 구독** - WebSocket 기반 실시간 통신

### 배포
- **Vercel** - 자동 배포 + CDN
- **무료 호스팅** - 비용 0원

---

## 📂 프로젝트 구조

```
my-debate-chatbot/
├── src/
│   ├── components/
│   │   ├── RoomList.js          # 토론방 목록
│   │   ├── RoomList.css
│   │   ├── StanceSelector.js    # 진영 선택
│   │   ├── StanceSelector.css
│   │   ├── DebateRoom.js        # 토론방 화면
│   │   ├── DebateRoom.css
│   │   ├── DebateStats.js       # 통계 대시보드
│   │   ├── DebateStats.css
│   │   ├── DebateTimer.js       # 타이머
│   │   └── DebateTimer.css
│   ├── App.js                   # 메인 앱
│   ├── App.css
│   ├── ErrorBoundary.js         # 에러 처리
│   └── index.js
├── public/
├── supabase-setup.sql           # DB 스키마
├── SETUP_GUIDE.md               # 초보자용 가이드
├── vercel.json                  # Vercel 설정
├── .env.example                 # 환경 변수 템플릿
└── README.md

```

---

## 🎮 사용 방법

### 1. 토론방 만들기
1. 메인 화면에서 "+ 새 토론방 만들기" 클릭
2. 방 제목, 주제, 설명 입력
3. 봇 역할 선택 (사회자/악마의 변호인/중재자)
4. 생성 버튼 클릭

### 2. 토론 참여하기
1. 원하는 토론방 클릭
2. 이름 입력
3. 입장 선택 (찬성/반대/중립)
4. 토론 시작!

### 3. 통계 보기
1. 토론방 내 "📊 통계" 버튼 클릭
2. 실시간 통계 확인:
   - 참여자 수
   - 찬반 비율
   - 핵심 키워드
   - 가장 활발한 참여자

### 4. 타이머 사용
1. 토론방 상단 타이머 영역
2. "시작" 버튼 또는 빠른 설정 (3분/5분/10분)
3. 발언 시간 관리

---

## 🗄️ 데이터베이스 스키마

### rooms (토론방)
```sql
- id: UUID (기본키)
- title: TEXT (방 제목)
- topic: TEXT (토론 주제)
- description: TEXT (설명)
- bot_role: TEXT (봇 역할)
- debate_phase: TEXT (토론 단계)
- is_active: BOOLEAN
- created_at: TIMESTAMP
```

### participants (참여자)
```sql
- id: UUID
- room_id: UUID (외래키)
- user_name: TEXT
- stance: TEXT (찬성/반대/중립)
- is_online: BOOLEAN
- joined_at: TIMESTAMP
```

### messages (메시지)
```sql
- id: UUID
- room_id: UUID
- user_name: TEXT
- content: TEXT
- is_bot: BOOLEAN
- stance: TEXT
- debate_phase: TEXT
- created_at: TIMESTAMP
```

---

## 🔧 커스터마이징

### 봇 응답 수정하기
`src/components/DebateRoom.js` 파일에서:

```javascript
// 사회자 봇 (150번째 줄)
const getModeratorResponse = (message, lowerMessage) => {
  // 여기에 원하는 응답 로직 추가
};

// 악마의 변호인 (160번째 줄)
const getDevilsAdvocateResponse = (message, userStance) => {
  // 반론 로직 수정
};

// 중재자 (170번째 줄)
const getMediatorResponse = (message, lowerMessage) => {
  // 중재 로직 수정
};
```

### 색상 테마 변경
`src/App.css` 파일에서:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* 원하는 색상으로 변경 */
```

---

## 📊 대화 기록 확인

### Supabase에서 확인
1. Supabase 대시보드 → Table Editor
2. `messages` 테이블 선택
3. 모든 대화 내용 확인

### SQL 쿼리로 검색
```sql
-- 특정 토론방의 메시지
SELECT * FROM messages
WHERE room_id = '방ID'
ORDER BY created_at DESC;

-- 모든 메시지 (방 제목 포함)
SELECT m.*, r.title
FROM messages m
JOIN rooms r ON m.room_id = r.id
ORDER BY m.created_at DESC;

-- 통계
SELECT
  r.title,
  COUNT(*) as message_count,
  COUNT(DISTINCT m.user_name) as participant_count
FROM messages m
JOIN rooms r ON m.room_id = r.id
GROUP BY r.id, r.title;
```

### CSV로 다운로드
1. Table Editor → 테이블 선택
2. 우측 "..." 메뉴 → "Download as CSV"
3. 엑셀에서 열기

---

## 💰 비용

| 서비스 | 무료 제공량 | 충분한가? |
|--------|----------|----------|
| Supabase | 500MB DB, 2GB 파일 저장, 무제한 API 요청 | ✅ 수천 명 사용 가능 |
| Vercel | 무제한 배포, 100GB 대역폭 | ✅ 월 수십만 방문자 가능 |
| **총 비용** | **0원** | ✅ |

---

## 🐛 문제 해결

### 환경 변수 오류
```bash
# Vercel 대시보드 → Settings → Environment Variables
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJxxx...
```

### 실시간 업데이트 안 됨
```sql
-- Supabase SQL Editor에서 실행
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE participants;
```

### 메시지 전송 실패
- Supabase → Database → Replication 확인
- 테이블이 Realtime에 활성화되어 있는지 확인

---

## 📱 모바일 지원

완전한 반응형 디자인으로 모든 기기에서 사용 가능:
- 📱 **스마트폰** - 터치 최적화
- 📱 **태블릿** - 중간 화면 레이아웃
- 💻 **데스크톱** - 전체 기능 활용

### PWA 설치 (앱처럼 사용)
1. 모바일 브라우저에서 접속
2. 브라우저 메뉴 → "홈 화면에 추가"
3. 아이콘 클릭으로 바로 실행!

---

## 🎓 향후 개발 계획

- [ ] OpenAI API 연동으로 AI 봇 업그레이드
- [ ] 사용자 인증 (Supabase Auth)
- [ ] 프로필 사진 업로드
- [ ] 이미지/파일 공유
- [ ] 투표 기능
- [ ] 토론 결과 자동 요약 (AI)
- [ ] 다국어 지원
- [ ] 음성 채팅 (WebRTC)

---

## 🤝 기여하기

Pull Request는 언제나 환영입니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

## 📞 지원

- 📧 이메일: [이메일 주소]
- 🐛 버그 리포트: [GitHub Issues](https://github.com/본인계정/my-debate-chatbot/issues)
- 💬 질문: [GitHub Discussions](https://github.com/본인계정/my-debate-chatbot/discussions)

---

## ⭐ Star History

이 프로젝트가 도움이 되었다면 ⭐️를 눌러주세요!

---

**만든 이**: [Your Name]
**최종 업데이트**: 2025년 11월 6일
