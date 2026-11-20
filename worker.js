const DASHBOARD = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b1e34">
<title>GOLD MASTER AI</title>
<style>
:root{--bg:#0b1018;--panel:#141d29;--box:#101722;--border:#293747;--gold:#e8bd63;--gold2:#f3cb72;--muted:#9ba8b8;--green:#19c784;--red:#ef5350;--blue:rgba(11,30,52,.82)}
*{box-sizing:border-box}
body{margin:0;padding:20px;background:linear-gradient(145deg,rgba(11,30,52,.94),rgba(8,16,29,.96)),var(--bg);background-attachment:fixed;color:#eee;font-family:Arial,sans-serif}
main{max-width:900px;margin:auto}
header{text-align:center;padding:8px 0 17px;border-bottom:1px solid var(--border)}
.signature{font-family:cursive;font-style:italic;font-size:clamp(19px,4vw,25px);letter-spacing:.8px;color:var(--gold);margin-bottom:5px}
h1{font-size:22px;letter-spacing:1.4px;color:var(--gold);margin:0}
.version{display:block;color:var(--muted);font-size:10px;letter-spacing:2px;margin-top:6px}
.panel{background:rgba(20,29,41,.92);border:1px solid var(--border);border-radius:16px;padding:21px;margin-top:20px;backdrop-filter:blur(8px)}
.label{color:var(--muted);font-size:13px}.price{font-size:clamp(36px,9vw,58px);font-weight:bold;color:var(--gold2);margin:13px 0;overflow-wrap:anywhere}.unit{color:var(--muted);font-size:12px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.box{background:var(--box);border:1px solid rgba(53,66,85,.45);border-radius:11px;padding:14px;min-width:0}.value{font-size:22px;margin-top:7px;overflow-wrap:anywhere}.status{color:#70d7a0}.error{color:#ff8585}.muted{color:var(--muted);font-size:12px;line-height:1.6}
button{background:#d6ad59;color:#101010;border:0;border-radius:8px;padding:12px 17px;font-weight:bold;margin-top:15px;font-size:14px;cursor:pointer}button:disabled{opacity:.6;cursor:wait}
.chart-divider{border-top:1px solid var(--border);margin:23px 0 18px}.chart-heading{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:13px}.chart-toolbar{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:13px}.tf-btn{background:#101722;color:var(--muted);border:1px solid #354255;border-radius:7px;padding:10px 12px;margin:0;font-size:12px;min-width:44px}.tf-btn.active{background:#d6ad59;color:#101010;border-color:#d6ad59}.chart-range{background:#101722;color:#eee;border:1px solid #354255;border-radius:7px;padding:10px;font-size:14px}.chart-wrap{width:100%;height:330px;position:relative}.chart-wrap canvas{width:100%;height:100%;display:block}.legend{display:flex;gap:13px;flex-wrap:wrap;margin:8px 0 2px;color:var(--muted);font-size:11px}.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px}.analysis-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:13px}.analysis-box{background:var(--box);border:1px solid rgba(53,66,85,.45);border-radius:10px;padding:12px;min-width:0}.analysis-box .value{font-size:16px;font-weight:bold}.buy{color:var(--green)}.sell{color:var(--red)}.wait{color:var(--gold2)}.signal-note{margin-top:12px;padding:12px;background:rgba(8,13,21,.7);border-radius:9px;color:var(--muted);font-size:12px;line-height:1.6}
footer{color:#718095;font-size:11px;margin:22px 0 8px;text-align:center;line-height:1.8}
@media(max-width:520px){body{padding:13px}.panel{padding:16px}.grid{gap:9px}.box{padding:11px}.chart-wrap{height:290px}.analysis-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.analysis-grid .analysis-box:last-child{grid-column:1/-1}}
</style>
</head>
<body><main>
<header><div class="signature">Saharat Chumjun</div><h1>GOLD MASTER AI</h1><span class="version">TRADING ANALYSIS TERMINAL · VERSION 2.0</span></header>
<section class="panel">
<div class="label">XAUUSD · GOLD SPOT PRICE</div><div class="price" id="price">กำลังโหลด...</div><div class="unit">USD / TROY OUNCE</div>
<p id="status" class="status" aria-live="polite">กำลังเชื่อมต่อข้อมูล...</p>
<div class="grid"><div class="box"><div class="label">ราคาต่อกรัม</div><div class="value" id="gram">--</div><small class="muted">USD / GRAM</small></div><div class="box"><div class="label">Gold / Silver Ratio</div><div class="value" id="ratio">--</div><small class="muted">RATIO</small></div></div>
<p class="muted" id="updated">รอข้อมูลราคา</p><p class="muted" id="checked">ตรวจสอบล่าสุด: กำลังรอข้อมูล</p><button id="refresh" type="button">อัปเดตราคา</button>
<div class="chart-divider"></div>
<div class="chart-heading"><div class="label">GOLD MASTER AI · TECHNICAL CHART</div><span class="muted" id="chartSource">XAUS · OHLC</span></div>
<div class="chart-toolbar"><button type="button" class="tf-btn" data-interval="1m" aria-pressed="false">M1</button><button type="button" class="tf-btn active" data-interval="5m" aria-pressed="true">M5</button><button type="button" class="tf-btn" data-interval="15m" aria-pressed="false">M15</button><button type="button" class="tf-btn" data-interval="30m" aria-pressed="false">M30</button><button type="button" class="tf-btn" data-interval="60m" aria-pressed="false">H1</button></div>
<div style="margin-bottom:12px"><select id="chartRange" class="chart-range" aria-label="ช่วงข้อมูลกราฟ"><option value="1d" selected>1 วัน</option><option value="5d">5 วัน</option><option value="1mo">1 เดือน</option></select></div>
<div class="chart-wrap"><canvas id="candleChart" aria-label="กราฟแท่งเทียน XAUUSD"></canvas></div>
<div class="legend"><span><i class="dot" style="background:#e8bd63"></i>ราคาปัจจุบัน</span><span><i class="dot" style="background:#48a8ff"></i>EMA 21</span><span><i class="dot" style="background:#c084fc"></i>EMA 55</span><span><i class="dot" style="background:#ef5350"></i>แนวต้าน/โซนอุปทาน</span><span><i class="dot" style="background:#19c784"></i>แนวรับ/โซนอุปสงค์</span></div>
<p id="chartStatus" class="muted" aria-live="polite">กำลังเตรียมกราฟ...</p>
<div class="analysis-grid"><div class="analysis-box"><div class="label">สัญญาณทางเทคนิค</div><div class="value wait" id="signal">WAIT</div></div><div class="analysis-box"><div class="label">แนวโน้ม EMA</div><div class="value" id="trend">กำลังวิเคราะห์</div></div><div class="analysis-box"><div class="label">Entry / จุดอ้างอิง</div><div class="value" id="entry">--</div></div><div class="analysis-box"><div class="label">Stop Loss</div><div class="value" id="sl">--</div></div><div class="analysis-box"><div class="label">Take Profit</div><div class="value" id="tp">--</div></div><div class="analysis-box"><div class="label">Risk / Reward</div><div class="value" id="rr">--</div></div></div>
<div class="signal-note" id="signalNote">การวิเคราะห์จะเริ่มเมื่อได้รับข้อมูลแท่งเทียนเพียงพอ สัญญาณเป็นการคำนวณทางเทคนิคจาก OHLC ไม่ใช่การรับประกันทิศทางราคา</div>
</section>
<footer>GOLD MASTER AI · DATA SOURCE: XAUS<br>ข้อมูลเพื่อการศึกษาและประกอบการตัดสินใจ ไม่ใช่คำแนะนำการลงทุน</footer>
</main>
<script>
const $=id=>document.getElementById(id);
const priceEl=$("price"),gramEl=$("gram"),ratioEl=$("ratio"),statusEl=$("status"),updatedEl=$("updated"),checkedEl=$("checked"),refreshBtn=$("refresh");
const chartCanvas=$("candleChart"),chartCtx=chartCanvas.getContext("2d"),timeframeButtons=document.querySelectorAll("[data-interval]"),chartRange=$("chartRange"),chartStatus=$("chartStatus");
let selectedInterval="5m",lastChartPoints=[],livePrice=null,chartController=null,priceBusy=false,chartBusy=false;
function fmt(v,d=2){const n=Number(v);return Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d}):"--"}
function ema(values,period){const out=[];const k=2/(period+1);let prev=null;for(const v of values){prev=prev===null?v:v*k+prev*(1-k);out.push(prev)}return out}
function analyse(points){const valid=points.map(p=>({o:+p.o,c:+p.c,h:+p.h,l:+p.l})).filter(p=>[p.o,p.c,p.h,p.l].every(Number.isFinite));if(valid.length<10)return null;const closes=valid.map(p=>p.c),e21=ema(closes,21),e55=ema(closes,55),last=valid.at(-1),a=e21.at(-1),b=e55.at(-1),prevA=e21.at(-2),prevB=e55.at(-2);const recent=valid.slice(-20),support=Math.min(...recent.map(p=>p.l)),resistance=Math.max(...recent.map(p=>p.h));let signal="WAIT",reason="แนวโน้มยังไม่ชัดเจน รอการยืนยัน";if(a>b&&last.c>a&&a>=prevA){signal="BUY";reason="ราคาอยู่เหนือ EMA 21 และ EMA 21 อยู่เหนือ EMA 55"}else if(a<b&&last.c<a&&a<=prevA){signal="SELL";reason="ราคาอยู่ใต้ EMA 21 และ EMA 21 อยู่ใต้ EMA 55"}const entry=last.c,range=Math.max(last.h-last.l,(resistance-support)*.12,entry*.0008);let sl=null,tp=null,rr="--";if(signal==="BUY"){sl=Math.min(last.l,entry-range);tp=entry+(entry-sl)*2;rr="1 : 2"}else if(signal==="SELL"){sl=Math.max(last.h,entry+range);tp=entry-(sl-entry)*2;rr="1 : 2"}return{valid,e21,e55,signal,reason,entry,sl,tp,rr,support,resistance,trend:a>b?"ขาขึ้น":"ขาลง"}}
function updateAnalysis(a){if(!a){$("signal").textContent="WAIT";$("trend").textContent="ข้อมูลไม่พอ";return}const s=$("signal");s.textContent=a.signal;s.className="value "+(a.signal==="BUY"?"buy":a.signal==="SELL"?"sell":"wait");$("trend").textContent=a.trend;$("entry").textContent=fmt(a.entry);$("sl").textContent=a.sl===null?"--":fmt(a.sl);$("tp").textContent=a.tp===null?"--":fmt(a.tp);$("rr").textContent=a.rr;$("signalNote").textContent=a.reason+" · แนวรับโดยประมาณ "+fmt(a.support)+" · แนวต้านโดยประมาณ "+fmt(a.resistance)+". ระดับ Entry/SL/TP เป็นค่าประมาณจากแท่งล่าสุด ไม่ได้ส่งคำสั่งซื้อขายอัตโนมัติ"}
function drawCandles(points){const canvas=chartCanvas,ctx=chartCtx,w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const dpr=window.devicePixelRatio||1;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle="#080d15";ctx.fillRect(0,0,w,h);const data=points.slice(-80);const vals=data.flatMap(p=>[+p.h,+p.l]).filter(Number.isFinite);if(livePrice!==null&&Number.isFinite(livePrice))vals.push(livePrice);if(!vals.length)return;let min=Math.min(...vals),max=Math.max(...vals),pad=(max-min)*.12||1;min-=pad;max+=pad;const left=9,right=67,top=13,bottom=22,cw=Math.max(1,w-left-right),ch=Math.max(1,h-top-bottom),y=v=>top+(max-v)/(max-min)*ch;ctx.font="10px Arial";ctx.strokeStyle="#263344";ctx.fillStyle="#9ba8b8";ctx.lineWidth=1;for(let i=0;i<=4;i++){const py=top+ch*i/4,price=max-(max-min)*i/4;ctx.beginPath();ctx.moveTo(left,py);ctx.lineTo(w-right,py);ctx.stroke();ctx.fillText(price.toFixed(2),w-right+5,py+3)}const step=cw/data.length,body=Math.max(2,step*.62);const a=analyse(points);
if(a){const zone=Math.max((max-min)*.012,0.15);ctx.fillStyle="rgba(25,199,132,.10)";ctx.fillRect(left,y(a.support+zone),cw,Math.max(2,y(a.support-zone)-y(a.support+zone)));ctx.fillStyle="rgba(239,83,80,.10)";ctx.fillRect(left,y(a.resistance+zone),cw,Math.max(2,y(a.resistance-zone)-y(a.resistance+zone)));}
data.forEach((p,i)=>{const o=+p.o,c=+p.c,hi=+p.h,lo=+p.l;if(![o,c,hi,lo].every(Number.isFinite))return;const x=left+step*(i+.5),color=c>=o?"#19c784":"#ef5350";ctx.strokeStyle=color;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y(hi));ctx.lineTo(x,y(lo));ctx.stroke();ctx.fillRect(x-body/2,Math.min(y(o),y(c)),body,Math.max(1,Math.abs(y(o)-y(c))))});
if(a){const drawLine=(values,color)=>{ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();let started=false;values.forEach((v,i)=>{if(i<points.length-data.length)return;const x=left+step*(i-(points.length-data.length)+.5);if(!started){ctx.moveTo(x,y(v));started=true}else ctx.lineTo(x,y(v))});ctx.stroke()};drawLine(a.e21,"#48a8ff");drawLine(a.e55,"#c084fc");
const offset=points.length-data.length;for(let i=Math.max(1,offset);i<points.length;i++){const crossedUp=a.e21[i]>a.e55[i]&&a.e21[i-1]<=a.e55[i-1];const crossedDown=a.e21[i]<a.e55[i]&&a.e21[i-1]>=a.e55[i-1];if(!crossedUp&&!crossedDown)continue;const j=i-offset;if(j<0||j>=data.length)continue;const x=left+step*(j+.5),py=crossedUp?y(+data[j].l)-8:y(+data[j].h)+8;ctx.fillStyle=crossedUp?"#19c784":"#ef5350";ctx.beginPath();if(crossedUp){ctx.moveTo(x,py-5);ctx.lineTo(x-4,py+3);ctx.lineTo(x+4,py+3)}else{ctx.moveTo(x,py+5);ctx.lineTo(x-4,py-3);ctx.lineTo(x+4,py-3)}ctx.closePath();ctx.fill()}
ctx.setLineDash([4,4]);ctx.strokeStyle="#19c784";ctx.beginPath();ctx.moveTo(left,y(a.support));ctx.lineTo(w-right,y(a.support));ctx.stroke();ctx.strokeStyle="#ef5350";ctx.beginPath();ctx.moveTo(left,y(a.resistance));ctx.lineTo(w-right,y(a.resistance));ctx.stroke();ctx.setLineDash([])}
if(livePrice!==null&&Number.isFinite(livePrice)){const py=y(livePrice);ctx.setLineDash([5,4]);ctx.strokeStyle="#e8bd63";ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(left,py);ctx.lineTo(w-right,py);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="#e8bd63";ctx.fillRect(w-right+1,py-9,64,18);ctx.fillStyle="#101010";ctx.font="bold 10px Arial";ctx.fillText(livePrice.toFixed(2),w-right+4,py+3)}}
async function loadChart(){if(chartBusy)return;chartBusy=true;if(chartController)chartController.abort();chartController=new AbortController();chartStatus.textContent="กำลังโหลดกราฟ...";try{const q=new URLSearchParams({symbol:"xau",range:chartRange.value,interval:selectedInterval});const response=await fetch("/chart?"+q,{cache:"no-store",signal:chartController.signal});if(!response.ok)throw new Error("HTTP "+response.status);const result=await response.json();if(!Array.isArray(result.points)||!result.points.length)throw new Error("ไม่มีข้อมูลแท่งเทียน");lastChartPoints=result.points;drawCandles(lastChartPoints);updateAnalysis(analyse(lastChartPoints));const cache=response.headers.get("X-Chart-Cache")||"LIVE";chartStatus.textContent="กราฟพร้อมใช้งาน · "+(result.interval||selectedInterval)+" · "+result.points.length+" แท่ง · "+(cache==="STALE"?"ใช้ข้อมูลสำรอง":cache==="HIT"?"Cache":"ข้อมูลล่าสุด");}catch(e){if(e.name!=="AbortError"){chartStatus.textContent="โหลดกราฟไม่สำเร็จ: "+e.message+(lastChartPoints.length?" · กำลังแสดงข้อมูลเดิม":"");if(lastChartPoints.length)drawCandles(lastChartPoints)}}finally{chartBusy=false}}
timeframeButtons.forEach(btn=>btn.addEventListener("click",()=>{selectedInterval=btn.dataset.interval;timeframeButtons.forEach(b=>{const active=b===btn;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active))});loadChart()}));chartRange.addEventListener("change",loadChart);let resizeTimer;window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(lastChartPoints.length)drawCandles(lastChartPoints)},120)});
async function loadPrice(){if(priceBusy)return;priceBusy=true;refreshBtn.disabled=true;statusEl.textContent="กำลังเชื่อมต่อข้อมูล...";statusEl.className="status";checkedEl.textContent="ตรวจสอบล่าสุด: "+new Date().toLocaleString("th-TH");try{const response=await fetch("/price",{cache:"no-store"});if(!response.ok)throw new Error("HTTP "+response.status);const result=await response.json();if(result.status!=="success")throw new Error(result.message||"ไม่พบข้อมูลราคา");const d=result.data||{},xau=d.xau||{},price=Number(xau.price??d.spot_usd_oz),gram=Number(d.per_gram_usd),ratio=Number(d.gold_silver_ratio);if(!Number.isFinite(price))throw new Error("ข้อมูลราคาไม่ถูกต้อง");livePrice=price;priceEl.textContent="$"+fmt(price);gramEl.textContent=Number.isFinite(gram)?"$"+fmt(gram):"--";ratioEl.textContent=Number.isFinite(ratio)?fmt(ratio):"--";const state=d.data_state||{},age=Number(state.age_seconds);statusEl.textContent=state.status==="fresh"?"● เชื่อมต่อสำเร็จ · ข้อมูลต้นทางระบุว่าสด":"● ได้รับข้อมูลราคาแล้ว · โปรดตรวจสอบความสดของข้อมูล";const time=d.price_as_of||d.updated_at||result.updated_at;updatedEl.textContent="เวลาข้อมูลต้นทาง: "+(time||"ไม่ระบุ")+(Number.isFinite(age)?" · อายุข้อมูล "+age+" วินาที":"");if(lastChartPoints.length)drawCandles(lastChartPoints)}catch(e){statusEl.textContent="เชื่อมต่อไม่สำเร็จ: "+e.message;statusEl.className="error";updatedEl.textContent="กรุณาลองอัปเดตอีกครั้ง"}finally{priceBusy=false;refreshBtn.disabled=false}}
refreshBtn.addEventListener("click",loadPrice);loadChart();loadPrice();setInterval(loadPrice,15000);
</script></body></html>`;

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    const url = new URL(request.url);
    if (request.method !== "GET") return Response.json({ status: "error", message: "Method not allowed" }, { status: 405, headers: cors });
    if (url.pathname === "/") return new Response(DASHBOARD, { headers: { "Content-Type": "text/html; charset=UTF-8", ...cors } });

    if (url.pathname === "/chart") {
      const symbol = url.searchParams.get("symbol") || "xau";
      const range = url.searchParams.get("range") || "1d";
      const interval = url.searchParams.get("interval") || "5m";
      if (symbol !== "xau" || !["1d", "5d", "1mo"].includes(range) || !["1m", "2m", "5m", "15m", "30m", "60m"].includes(interval)) {
        return Response.json({ status: "error", message: "Invalid chart parameters" }, { status: 400, headers: cors });
      }
      const params = { symbol, range, interval };
      const cacheUrl = new URL(request.url);
      cacheUrl.pathname = "/__gold_master_chart_cache";
      cacheUrl.search = new URLSearchParams({ ...params, kind: "fresh" }).toString();
      const freshKey = new Request(cacheUrl.toString(), { method: "GET" });
      cacheUrl.searchParams.set("kind", "stale");
      const staleKey = new Request(cacheUrl.toString(), { method: "GET" });
      let cache = null;
      try { cache = caches.default; } catch (_) {}
      if (cache) {
        try {
          const hit = await cache.match(freshKey);
          if (hit) {
            const headers = new Headers(hit.headers);
            headers.set("Access-Control-Allow-Origin", "*");
            headers.set("X-Chart-Cache", "HIT");
            headers.set("Cache-Control", "no-store");
            return new Response(hit.body, { status: hit.status, headers });
          }
        } catch (_) {}
      }
      try {
        const api = new URL("https://xaus.com/api/v1/chart");
        api.search = new URLSearchParams(params).toString();
        const upstream = await fetch(api.toString(), { headers: { "Accept": "application/json" } });
        const body = await upstream.text();
        if (!upstream.ok) throw new Error("XAUS HTTP " + upstream.status);
        let parsed;
        try { parsed = JSON.parse(body); } catch (_) { throw new Error("XAUS ส่งข้อมูล JSON ไม่ถูกต้อง"); }
        if (!parsed || !Array.isArray(parsed.points) || parsed.points.length === 0) throw new Error("ไม่มีข้อมูลแท่งเทียนจาก XAUS");
        const headers = new Headers(cors);
        headers.set("Content-Type", "application/json; charset=UTF-8");
        headers.set("Cache-Control", "no-store");
        headers.set("X-Chart-Cache", "MISS");
        if (cache) {
          const freshHeaders = new Headers(cors);
          freshHeaders.set("Content-Type", "application/json; charset=UTF-8");
          freshHeaders.set("Cache-Control", "public, max-age=30");
          const staleHeaders = new Headers(cors);
          staleHeaders.set("Content-Type", "application/json; charset=UTF-8");
          staleHeaders.set("Cache-Control", "public, max-age=86400");
          try { await cache.put(freshKey, new Response(body, { status: 200, headers: freshHeaders })); } catch (_) {}
          try { await cache.put(staleKey, new Response(body, { status: 200, headers: staleHeaders })); } catch (_) {}
        }
        return new Response(body, { status: 200, headers });
      } catch (error) {
        if (cache) {
          try {
            const stale = await cache.match(staleKey);
            if (stale) {
              const headers = new Headers(stale.headers);
              headers.set("Access-Control-Allow-Origin", "*");
              headers.set("Cache-Control", "no-store");
              headers.set("X-Chart-Cache", "STALE");
              return new Response(stale.body, { status: 200, headers });
            }
          } catch (_) {}
        }
        return Response.json({ status: "error", message: error.message, source: "XAUS" }, { status: 502, headers: cors });
      }
    }

    if (url.pathname !== "/price") return Response.json({ status: "error", message: "Endpoint not found" }, { status: 404, headers: cors });
    try {
      const response = await fetch("https://xaus.com/api/v1/spot?compact=1", { headers: { "Accept": "application/json" } });
      if (!response.ok) throw new Error("XAUS HTTP " + response.status);
      const data = await response.json();
      return Response.json({ status: "success", source: "XAUS", updated_at: new Date().toISOString(), data }, { headers: { ...cors, "Cache-Control": "no-store" } });
    } catch (error) {
      return Response.json({ status: "error", message: error.message, source: "XAUS" }, { status: 502, headers: cors });
    }
  }
};
