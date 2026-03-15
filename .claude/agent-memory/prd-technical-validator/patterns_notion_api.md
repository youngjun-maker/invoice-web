---
name: Notion API 연동 PRD 반복 공백 패턴
description: Notion API를 백엔드로 사용하는 PRD에서 반복적으로 발견되는 기술적 누락 사항
type: reference
---

Notion API를 데이터 소스로 사용하는 PRD를 검증할 때 반드시 확인할 항목:

1. **Relation 타입 조회 로직**: Notion Relation 필드는 별도 API 호출 필요. 1개 견적서 조회에 N+1 API 호출 발생 가능. PRD에 이 플로우가 명시되어 있는지 확인.

2. **Rate Limit 처리**: Notion API 평균 3req/s 제한. Relation 포함 시 단일 레코드 조회에도 5+ 호출 필요. 동시 접속 처리 전략 명시 여부 확인.

3. **캐싱 전략**: Next.js App Router 사용 시 "실시간 조회"와 기본 캐싱 동작 충돌. `cache: 'no-store'` 또는 `revalidate` 설정 명시 필요.

4. **데이터베이스 ID vs. 페이지 ID 혼용**: Notion의 Database ID(컬렉션 식별)와 Page ID(레코드 식별)는 다른 개념. URL 파라미터에 사용되는 것은 Page ID.

5. **Integration 공유 설정 누락**: API Key 환경 변수만 명시하고, 해당 Database에 Integration 공유 설정이 필요하다는 온보딩 절차 누락이 빈번.

6. **Notion API 장애 시 Fallback 미정의**: Notion을 단일 데이터 소스로 사용하면 Notion 장애 = 전체 서비스 장애. Fallback 전략 또는 캐시 레이어 필요.

7. **PDF 라이브러리 선택 주의**: Puppeteer는 Vercel Serverless 함수 크기 제한(250MB) 초과 위험. `@react-pdf/renderer` 또는 `puppeteer-core` + `@sparticuz/chromium` 조합 권고.
