# 디베이트 챗봇

React와 Supabase를 활용한 실시간 토론 챗봇 애플리케이션입니다.

## 주요 기능

- 실시간 메시지 송수신 (Supabase Realtime 사용)
- 지능형 토론 봇 응답
- 타임스탬프가 포함된 메시지 표시
- 자동 스크롤
- 반응형 디자인
- 에러 바운더리를 통한 안정적인 에러 처리

## 기술 스택

- **Frontend**: React 19.1.0
- **Backend**: Supabase (PostgreSQL + Realtime)
- **스타일링**: CSS3

## 시작하기

### 1. 환경 설정

프로젝트를 클론한 후, `.env` 파일을 생성하세요:

```bash
cp .env.example .env
```

`.env` 파일을 열고 Supabase 자격 증명을 입력하세요:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase 자격 증명은 [Supabase 대시보드](https://app.supabase.com) > Project Settings > API에서 확인할 수 있습니다.

### 2. 데이터베이스 설정

Supabase 대시보드의 SQL Editor에서 다음 쿼리를 실행하여 테이블을 생성하세요:

```sql
-- messages 테이블 생성
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- created_at 기준으로 인덱스 생성 (성능 최적화)
CREATE INDEX messages_created_at_idx ON messages(created_at DESC);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### 3. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 프로젝트 구조

```
my-debate-chatbot/
├── src/
│   ├── App.js              # 메인 애플리케이션 컴포넌트
│   ├── App.css             # 애플리케이션 스타일
│   ├── ErrorBoundary.js    # 에러 바운더리 컴포넌트
│   ├── index.js            # 엔트리 포인트
│   └── index.css           # 글로벌 스타일
├── public/
├── .env.example            # 환경 변수 템플릿
├── package.json
└── README.md
```

## 봇 응답 기능

봇은 다양한 토론 주제에 대해 응답합니다:

- **인사말**: "안녕하세요" 등의 인사에 응답
- **주제 제안**: "주제", "토론" 등의 키워드에 토론 주제 제안
- **찬반 의견**: 찬성/반대 의견에 대한 균형잡힌 반론 제시
- **AI 관련 질문**: 인공지능 관련 토론 유도
- **일반 응답**: 사용자의 주장에 대한 심화 질문

## 주요 개선사항

1. **실시간 구독**: Supabase Realtime을 통한 즉각적인 메시지 동기화
2. **환경 변수 검증**: 앱 실행 전 필수 설정 확인
3. **자동 스크롤**: 새 메시지 도착 시 자동으로 최하단 스크롤
4. **타임스탬프**: 각 메시지에 시간 표시
5. **에러 처리**: 에러 바운더리를 통한 안정적인 앱 운영
6. **향상된 UI**: 그라디언트 배경과 개선된 메시지 스타일

## 스크립트

```bash
# 개발 서버 시작
npm start

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

## 문제 해결

### Supabase 연결 오류

- `.env` 파일이 올바르게 설정되었는지 확인하세요
- Supabase 프로젝트가 활성화되어 있는지 확인하세요
- API 키가 유효한지 확인하세요

### Realtime이 작동하지 않는 경우

- Supabase 대시보드에서 Database > Replication을 확인하세요
- `messages` 테이블이 Realtime publication에 추가되었는지 확인하세요

## 라이선스

MIT

## 기여

이슈와 풀 리퀘스트를 환영합니다!
