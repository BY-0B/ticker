// 국내주식 시세 중계 서버 (Cloudflare Worker, 무료)
// 네이버 실시간 시세는 브라우저에서 직접 못 불러와서, 이 서버가 대신 받아 전달합니다.
// 허용 경로
//   시세: /api/realtime/domestic/stock/<종목코드들>  ->  polling.finance.naver.com
//   차트: /chart/domestic/item/<종목코드>/<minute|day|week|month>?startDateTime=..&endDateTime=..  ->  api.stock.naver.com
// ALLOW_ORIGIN 을 내 GitHub Pages 주소로 바꾸면 남이 이 서버를 못 씁니다.

const ALLOW_ORIGIN = "*"; // 예: "https://내아이디.github.io"

export default {
  async fetch(req, env, ctx) {
    const cors = {
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "no-store",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    const url = new URL(req.url);
    let upstream = null;
    if (/^\/api\/realtime\/domestic\/(stock|index)\/[A-Za-z0-9,]{1,200}$/.test(url.pathname)) {
      upstream = "https://polling.finance.naver.com" + url.pathname;
    } else if (/^\/chart\/domestic\/(item|index)\/[A-Za-z0-9]{1,12}\/(minute|day|week|month)$/.test(url.pathname)
               && /^(\?startDateTime=\d{12}&endDateTime=\d{12})?$/.test(url.search)) {
      upstream = "https://api.stock.naver.com" + url.pathname + url.search;
    }
    if (!upstream) return new Response("not found", { status: 404, headers: cors });

    // 같은 요청은 2초 동안 캐시해서 네이버에 부담을 주지 않음
    const cache = caches.default;
    const ckey = new Request("https://cache.local" + url.pathname + url.search);
    let res = await cache.match(ckey);
    if (!res) {
      const up = await fetch(upstream, {
        headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://finance.naver.com/" },
      });
      res = new Response(up.body, { status: up.status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": url.pathname.startsWith("/chart") ? "max-age=60" : "max-age=2" } });
      if (up.ok) ctx.waitUntil(cache.put(ckey, res.clone()));
    }
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
    return out;
  },
};
