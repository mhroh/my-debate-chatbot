# 🚀 디베이트 챗봇 설치 가이드 (초보자용)

코딩을 몰라도 괜찮습니다! 복사-붙여넣기만 하면 됩니다.

---

## 📋 목차
1. [Supabase 설정 (5분)](#1-supabase-설정)
2. [Vercel 배포 (3분)](#2-vercel-배포)
3. [링크로 접속하기](#3-접속하기)
4. [대화 기록 보기](#4-대화-기록-보기)
5. [봇 설정 바꾸기](#5-봇-설정-바꾸기)

---

## 1. Supabase 설정

### 1단계: Supabase 로그인
1. 브라우저에서 https://supabase.com 접속
2. 우측 상단 "Sign In" 클릭
3. GitHub 계정으로 로그인

### 2단계: 새 프로젝트 만들기 (이미 있다면 기존 프로젝트 사용)
1. "New Project" 클릭
2. 프로젝트 이름 입력 (예: `debate-chatbot`)
3. Database Password 설정 (기억하기 쉬운 비밀번호)
4. Region 선택: `Northeast Asia (Tokyo)`
5. "Create new project" 클릭
6. 2-3분 기다리기 (프로젝트 생성 중...)

### 3단계: 데이터베이스 테이블 만들기
1. 좌측 메뉴에서 **SQL Editor** 클릭 (⚡ 번개 아이콘)
2. "New query" 버튼 클릭
3. 프로젝트 폴더에 있는 `supabase-setup.sql` 파일 열기
4. **전체 내용 복사** (Ctrl+A → Ctrl+C)
5. Supabase SQL Editor에 **붙여넣기** (Ctrl+V)
6. 우측 하단 **"RUN"** 버튼 클릭
7. 성공 메시지 확인: "Success. No rows returned"

### 4단계: API 키 복사하기
1. 좌측 메뉴에서 **Settings** (⚙️ 톱니바퀴 아이콘) 클릭
2. **API** 메뉴 클릭
3. 아래 두 값을 **메모장에 복사**:
   - `Project URL` (예: https://xxxxx.supabase.co)
   - `anon public` 키 (길고 복잡한 문자열)

> ✅ Supabase 설정 완료!

---

## 2. Vercel 배포

### 1단계: GitHub에 코드 올리기
이 부분은 이미 완료되었습니다! (코드가 GitHub에 있음)

### 2단계: Vercel 로그인
1. 브라우저에서 https://vercel.com 접속
2. "Sign Up" 또는 "Login" 클릭
3. **"Continue with GitHub"** 클릭
4. GitHub 계정으로 로그인

### 3단계: 프로젝트 배포
1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. GitHub 저장소 목록에서 **`my-debate-chatbot`** 찾기
3. **"Import"** 버튼 클릭
4. **"Environment Variables"** 섹션에서:
   - 첫 번째 입력란:
     - NAME: `REACT_APP_SUPABASE_URL`
     - VALUE: (1단계에서 복사한 Project URL 붙여넣기)
   - 두 번째 입력란 추가 (+ 버튼):
     - NAME: `REACT_APP_SUPABASE_ANON_KEY`
     - VALUE: (1단계에서 복사한 anon public 키 붙여넣기)
5. **"Deploy"** 버튼 클릭
6. 2-3분 기다리기 (배포 중...)
7. 🎉 축하 화면이 나오면 성공!

### 4단계: 배포된 링크 복사
1. 화면에 나타난 주소 복사 (예: `https://my-debate-chatbot.vercel.app`)
2. 이 주소를 즐겨찾기에 추가!

> ✅ 배포 완료! 이제 전 세계 어디서나 접속 가능합니다.

---

## 3. 접속하기

### 웹사이트 사용 방법
1. 배포된 링크 클릭 (예: `https://my-debate-chatbot.vercel.app`)
2. **토론방 목록** 화면이 표시됨
3. 토론방 선택 또는 "새 토론방 만들기" 클릭

### 토론방 만들기
1. "새 토론방 만들기" 버튼 클릭
2. 방 제목 입력 (예: "AI 윤리 토론")
3. 토론 주제 입력 (예: "인공지능의 윤리적 사용")
4. 봇 역할 선택:
   - 🎙️ **사회자**: 토론을 진행하고 의견을 정리
   - 😈 **악마의 변호인**: 항상 반대 입장 제시
   - ⚖️ **중재자**: 양쪽 의견을 조율
5. "생성" 버튼 클릭

### 토론 참여하기
1. 토론방 클릭
2. 이름 입력 (예: "홍길동")
3. 입장 선택:
   - 👍 **찬성**: 주제에 동의
   - 👎 **반대**: 주제에 반대
   - 🤔 **중립**: 양쪽 의견 듣고 판단
4. "토론 참여하기" 버튼 클릭
5. 메시지 입력하고 토론 시작!

---

## 4. 대화 기록 보기

### Supabase에서 대화 기록 확인
1. https://supabase.com 접속 → 로그인
2. 프로젝트 선택
3. 좌측 메뉴에서 **Table Editor** (📊 아이콘) 클릭
4. 테이블 선택:
   - **rooms**: 토론방 목록
   - **participants**: 참여자 목록
   - **messages**: 모든 대화 내용
5. 각 행을 클릭하면 상세 내용 확인 가능

### 메시지 검색하기
1. **SQL Editor** 클릭
2. 다음 SQL 입력:
```sql
-- 특정 토론방의 모든 메시지 보기
SELECT * FROM messages
WHERE room_id = '토론방ID'
ORDER BY created_at DESC;

-- 모든 메시지 보기 (최신순)
SELECT
  m.content,
  m.user_name,
  m.created_at,
  r.title as room_title
FROM messages m
JOIN rooms r ON m.room_id = r.id
ORDER BY m.created_at DESC;
```
3. "RUN" 클릭

### 데이터 다운로드 (엑셀로)
1. Table Editor에서 테이블 선택
2. 우측 상단 "..." 메뉴 클릭
3. "Download as CSV" 선택
4. 엑셀에서 CSV 파일 열기

---

## 5. 봇 설정 바꾸기

### 봇 대답 수정하기

봇의 응답을 바꾸려면 코드를 약간 수정해야 합니다. 하지만 걱정하지 마세요!

1. GitHub에서 파일 열기:
   - https://github.com/본인계정/my-debate-chatbot 접속
   - `src/components/DebateRoom.js` 파일 클릭
   - 연필 아이콘 (Edit) 클릭

2. **사회자 봇 응답 수정** (150번째 줄 근처):
```javascript
const getModeratorResponse = (message, lowerMessage) => {
  if (lowerMessage.includes('안녕') || lowerMessage.includes('시작')) {
    return `여기에 원하는 인사말 입력`;
  }

  const responses = [
    `원하는 응답 1`,
    `원하는 응답 2`,
    `원하는 응답 3`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};
```

3. **악마의 변호인 응답 수정** (160번째 줄 근처):
```javascript
const getDevilsAdvocateResponse = (message, userStance) => {
  const oppositeView = userStance === 'agree' ? '반대' : '찬성';

  return `원하는 반론 내용 입력:\n\n` +
         `1. 첫 번째 반론\n` +
         `2. 두 번째 반론\n` +
         `3. 세 번째 반론`;
};
```

4. **중재자 응답 수정** (170번째 줄 근처):
```javascript
const getMediatorResponse = (message, lowerMessage) => {
  return `원하는 중재 메시지:\n\n` +
         `✅ 찬성 측 요약\n` +
         `❌ 반대 측 요약\n\n` +
         `합의점 제안`;
};
```

5. 하단 "Commit changes" 버튼 클릭
6. 2-3분 후 Vercel이 자동으로 재배포 (자동!)

---

## 🎯 주요 기능 정리

### ✅ 구현된 모든 기능
1. ✅ **토론방 시스템** - 여러 주제별 방 생성
2. ✅ **진영 선택** - 찬성/반대/중립 선택
3. ✅ **실시간 다자간 토론** - 여러 명이 동시 참여
4. ✅ **봇 역할 시스템** - 사회자/악마의 변호인/중재자
5. ✅ **토론 통계** - 찬반 비율, 참여자 수, 키워드 분석
6. ✅ **타이머** - 발언 시간 제한
7. ✅ **실시간 업데이트** - 새 메시지 자동 동기화

### 💰 비용
- **Supabase**: 무료 (월 500MB까지)
- **Vercel**: 무료 (무제한 배포)
- **총 비용**: **0원**

---

## ❓ 문제 해결

### 문제: "환경 변수 오류" 메시지가 나옴
**해결**: Vercel 설정에서 환경 변수 확인
1. Vercel 대시보드 → 프로젝트 선택
2. "Settings" → "Environment Variables"
3. 두 변수가 올바르게 설정되었는지 확인
4. 수정 후 "Deployments" → "Redeploy" 클릭

### 문제: 메시지가 전송되지 않음
**해결**: Supabase 테이블 확인
1. Supabase → SQL Editor
2. `SELECT * FROM messages LIMIT 10;` 실행
3. 에러 메시지 확인
4. `supabase-setup.sql` 다시 실행

### 문제: 실시간 업데이트가 안 됨
**해결**: Realtime 활성화 확인
1. Supabase → Database → Replication
2. `messages`, `rooms`, `participants` 테이블이 체크되어 있는지 확인
3. 체크 안 되어 있으면 체크

### 문제: Vercel 배포 실패
**해결**: 로그 확인
1. Vercel → Deployments → 실패한 배포 클릭
2. "Build Logs" 확인
3. 에러 메시지 복사해서 검색

---

## 📱 모바일에서 사용하기

1. 배포된 링크를 모바일 브라우저에서 열기
2. 브라우저 메뉴 → "홈 화면에 추가"
3. 앱처럼 사용 가능!

---

## 🎓 다음 단계

### 고급 기능 추가하려면:
1. **사용자 인증**: Supabase Auth 사용
2. **이미지 공유**: Supabase Storage 사용
3. **AI 봇**: OpenAI API 연결
4. **투표 기능**: 새 테이블 추가

### 도움이 필요하면:
- GitHub Issues에 질문 남기기
- Supabase 문서: https://supabase.com/docs
- Vercel 문서: https://vercel.com/docs

---

## ✨ 축하합니다!

이제 여러분만의 토론 챗봇 웹사이트가 생겼습니다! 🎉
친구들에게 링크를 공유하고 함께 토론해보세요!
