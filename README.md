# 콜린 시세판 설치 안내

## 1. GitHub Pages에 올리기 (10분)

1. github.com 로그인 후 오른쪽 위 + 버튼, New repository
2. 이름: ticker (아무거나), Public 선택, Create repository
3. "uploading an existing file" 링크 클릭, index.html 끌어다 놓고 Commit changes
4. 저장소 Settings, 왼쪽 Pages
5. Branch를 main, 폴더 / (root) 로 고르고 Save
6. 1~2분 뒤 같은 화면 위쪽에 주소가 뜸: https://내아이디.github.io/ticker/
7. 태블릿 크롬에서 그 주소 열기, 메뉴(점 3개), 홈 화면에 추가
8. 시세판 오른쪽 위 "화면 켜두기" 누르기

## 2. 국내주식 실시간으로 바꾸기 (선택, 5분, 무료)

안 해도 국내주식은 나옵니다 (20분 늦은 시세). 실시간 시세와 지난 차트를 원할 때만 하세요.

국내주식 차트도 이 중계 서버로 받습니다. 이 부분은 직접 확인을 못 해서, 안 나오면 알려 주세요.

1. dash.cloudflare.com 가입 (무료)
2. 왼쪽 Workers & Pages, Create, Create Worker
3. 이름: naver-proxy, Deploy
4. Edit code 눌러서 기존 코드를 지우고 worker.js 내용을 붙여넣기, Deploy
5. 나온 주소 복사: https://naver-proxy.내아이디.workers.dev
6. 시세판 설정, "국내주식 중계 서버 주소"에 붙여넣고 저장
7. "연결됐습니다"가 뜨면 끝

보안: worker.js 맨 위 ALLOW_ORIGIN 을 "https://내아이디.github.io" 로 바꾸면 내 시세판에서만 쓸 수 있습니다.

## 종목 바꾸기

index.html 안의 ITEMS 목록에서 줄을 추가하거나 지우면 됩니다.
GitHub에서 파일 열고 연필 아이콘으로 바로 수정 가능합니다.

- 국내주식: {g:"kr", src:"naver", sym:"종목코드", name:"이름", sub:"종목코드", dec:0, color:"#색"}
- 미국주식: {g:"us", src:"cnbc", sym:"티커", name:"이름", sub:"티커", dec:2, usd:true, color:"#색"}
- 업비트 코인: {g:"coin", src:"upbit", sym:"KRW-티커", name:"이름", sub:"티커", dec:0, color:"#색"}

## 화면 쓰는 법

- 오른쪽 위 "카드 / 한눈에"로 보기 전환
- 카드를 꾹 누르면 아이폰처럼 흔들리며 편집 상태가 되고, 그대로 끌어서 옮길 수 있음. 빈 곳을 누르면 끝
- 마우스를 올리면 오늘 범위, 시가, 거래량, 김프, 현지 시각 같은 정보 카드가 나옴
- 종목을 누르면 큰 차트: 1일, 1주, 1달, 3달, 1년, 5년 / 선, 봉
- 차트를 길게 누르거나 손가락으로 밀면 그 시점 가격이 위에 나옴
- 코인 차트는 업비트가 브라우저 요청을 10초에 한 번만 받아서, 처음 여는 기간은 10초쯤 걸림. 한 번 받으면 저장해 둬서 다음부터는 바로 나옴

## 데이터 출처와 갱신 주기

- 업비트 코인: 실시간 (웹소켓)
- 바이낸스 (김프 계산): 실시간
- 지수, 해외주식, 환율, 금리, 원자재: CNBC, 5초
- 국내주식: TradingView 공개 시세, 5초마다 (20분 늦음). 중계 서버를 넣으면 네이버 실시간
- 국내·미국 거래대금 상위: TradingView, 1분마다
- 코인 거래대금 상위: 업비트, 30초마다

CNBC와 네이버는 공식 공개 API가 아니라서 언젠가 막히거나 형식이 바뀔 수 있습니다. 그때는 해당 칸만 멈추고 나머지는 계속 돌아갑니다. 지수 시세는 거래소 정책상 몇 분 지연될 수 있습니다.
