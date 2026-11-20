const DASHBOARD = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GOLD MASTER AI</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:22px;background:#0b1018;color:#eee;font-family:Arial,sans-serif}
main{max-width:760px;margin:auto}
header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #293342;padding-bottom:18px}
h1{font-size:22px;color:#e8bd63;margin:0}
small,.muted{color:#9ba8b8}
.panel{background:#141d29;border:1px solid #293747;border-radius:16px;padding:22px;margin-top:22px}
.label{color:#9ba8b8;font-size:14px}
.price{font-size:clamp(36px,9vw,58px);font-weight:bold;color:#f3cb72;margin:14px 0;overflow-wrap:anywhere}
.unit{color:#9ba8b8}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}
.box{background:#101722;border-radius:12px;padding:16px;min-width:0}
.value{font-size:22px;margin-top:8px;overflow-wrap:anywhere}
.status{color:#70d7a0}
.error{color:#ff8585}
button{background:#d6ad59;color:#101010;border:0;border-radius:8px;padding:13px 18px;font-weight:bold;margin-top:18px;font-size:15px}
button:disabled{opacity:.6}
.chart-divider{
  border-top:1px solid #293747;
  margin:24px 0 20px;
}

.chart-heading{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
  margin-bottom:14px;
}

.chart-toolbar{
  display:flex;
  align-items:center;
  gap:7px;
  flex-wrap:wrap;
  margin-bottom:14px;
}

.tf-btn{
  background:#101722;
  color:#9ba8b8;
  border:1px solid #354255;
  border-radius:7px;
  padding:10px 13px;
  margin:0;
  font-size:13px;
  min-width:45px;
  cursor:pointer;
}

.tf-btn.active{
  background:#d6ad59;
  color:#101010;
  border-color:#d6ad59;
}

.chart-range{
  background:#101722;
  color:#eee;
  border:1px solid #354255;
  border-radius:7px;
  padding:10px;
  font-size:14px;
}

.chart-wrap{
  width:100%;
  height:300px;
  position:relative;
}

.chart-wrap canvas{
  width:100%;
  height:100%;
  display:block;
}
footer{color:#718095;font-size:12px;margin-top:24px;text-align:center;line-height:1.8}
@media(max-width:420px){body{padding:14px}.panel{padding:17px}.grid{gap:9px}.box{padding:12px}}
</style>
</head>
<body>
<main>
<header>
<h1>GOLD MASTER AI</h1>
<small>VERSION 1.0</small>
</header>

<section class="panel">
<div class="label">XAUUSD · GOLD SPOT PRICE</div>
<div class="price" id="price">กำลังโหลด...</div>
<div class="unit">USD / TROY OUNCE</div>

<p id="status" class="status">กำลังเชื่อมต่อข้อมูล...</p>

<div class="grid">
<div class="box">
<div class="label">ราคาต่อกรัม</div>
<div class="value" id="gram">--</div>
<small>USD / GRAM</small>
</div>
<div class="box">
<div class="label">Gold / Silver Ratio</div>
<div class="value" id="ratio">--</div>
<small>RATIO</small>
</div>
</div>

<p class="muted" id="updated">รอข้อมูลราคา</p>
<p class="muted" id="checked">ตรวจสอบล่าสุด: กำลังรอข้อมูล</p>
<button id="refresh">อัปเดตราคา</button>

<div class="chart-divider"></div>

<div id="chartPanel">

  <div class="chart-heading">
    <div class="label">GOLD MASTER AI · CANDLESTICK CHART</div>
  </div>

  <div class="chart-toolbar">

    <button type="button" class="tf-btn"
      data-interval="1m">M1</button>

    <button type="button" class="tf-btn active"
      data-interval="5m" aria-pressed="true">M5</button>

    <button type="button" class="tf-btn"
      data-interval="15m">M15</button>

    <button type="button" class="tf-btn"
      data-interval="30m">M30</button>

    <button type="button" class="tf-btn"
      data-interval="60m">H1</button>

  </div>

  <div style="margin-bottom:14px;">
    <select id="chartRange" class="chart-range">
      <option value="1d" selected>1 วัน</option>
      <option value="5d">5 วัน</option>
      <option value="1mo">1 เดือน</option>
    </select>
  </div>

  <div class="chart-wrap">
    <canvas id="candleChart"></canvas>
  </div>

  <p id="chartStatus" class="muted">
    กำลังเตรียมกราฟ...
  </p>

</div>
</section>
<footer>
  GOLD MASTER AI · DATA SOURCE: XAUS<br>
  ข้อมูลราคาเพื่อประกอบการศึกษา ไม่ใช่คำแนะนำการลงทุน

  <div style="margin-top:30px;padding-top:20px;border-top:1px solid #293342;">
    <div style="font-size:10px;letter-spacing:4px;color:#9ba8b8;">
      CREATED BY
    </div>

    <svg viewBox="0 0 340 95"
         style="width:100%;max-width:340px;height:auto;margin:8px auto 0;display:block;"
         role="img" aria-label="Signature Saharat Chumjun">
      <text x="170" y="52"
            text-anchor="middle"
            fill="#e8bd63"
            font-size="31"
            font-family="cursive"
            font-style="italic"
            letter-spacing="1">
        Saharat Chumjun
      </text>
      <path d="M38 68 Q120 91 205 69 T302 66"
            fill="none"
            stroke="#e8bd63"
            stroke-width="1.6"
            stroke-linecap="round"/>
      <path d="M245 76 Q275 88 310 70"
            fill="none"
            stroke="#e8bd63"
            stroke-width="1"
            stroke-linecap="round"/>
    </svg>

    <div style="font-size:10px;letter-spacing:3px;color:#9ba8b8;">
      GOLD MASTER AI
    </div>
  </div>
</footer>
</main>

<script>
const priceEl=document.getElementById("price");
const gramEl=document.getElementById("gram");
const ratioEl=document.getElementById("ratio");
const statusEl=document.getElementById("status");
const updatedEl=document.getElementById("updated");
const checkedEl=document.getElementById("checked");
const refreshBtn=document.getElementById("refresh");

function fmt(value,digits=2){
  const n=Number(value);
  return Number.isFinite(n)
    ? n.toLocaleString("en-US",{minimumFractionDigits:digits,maximumFractionDigits:digits})
    : "--";
}
const chartCanvas=document.getElementById("candleChart");
const chartCtx=chartCanvas.getContext("2d");
const timeframeButtons=document.querySelectorAll("[data-interval]");
let selectedInterval="5m";
const chartRange=document.getElementById("chartRange");
const chartStatus=document.getElementById("chartStatus");

async function loadChart(){
  chartStatus.textContent="กำลังโหลดกราฟ...";

  try{
    const url="/chart?symbol=xau&range="+chartRange.value+
      "&interval="+selectedInterval;

    const response=await fetch(url,{cache:"no-store"});

    if(!response.ok)
      throw new Error("HTTP "+response.status);

    const result=await response.json();

    if(!Array.isArray(result.points)||!result.points.length)
      throw new Error("ไม่มีข้อมูลแท่งเทียน");

    drawCandles(result.points);

    chartStatus.textContent="กราฟพร้อมใช้งาน · "+
      result.interval+" · "+result.points.length+" แท่ง";

  }catch(error){
    chartStatus.textContent=
      "โหลดกราฟไม่สำเร็จ: "+error.message;
  }
}
function drawCandles(points){
  const canvas=chartCanvas;
  const ctx=chartCtx;
  const w=canvas.clientWidth;
  const h=canvas.clientHeight;
  if(!w||!h)return;

  const dpr=window.devicePixelRatio||1;
  canvas.width=w*dpr;
  canvas.height=h*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);

  ctx.fillStyle="#080d15";
  ctx.fillRect(0,0,w,h);

  const data=points.slice(-80);
  const prices=data.flatMap(p=>[Number(p.h),Number(p.l)])
    .filter(Number.isFinite);
  if(!prices.length)return;

  let min=Math.min(...prices);
  let max=Math.max(...prices);
  const pad=(max-min)*0.12||1;
  min-=pad;
  max+=pad;

  const left=10,right=65,top=15,bottom=25;
  const cw=w-left-right,ch=h-top-bottom;
  const y=v=>top+(max-v)/(max-min)*ch;

  ctx.font="10px Arial";
  ctx.strokeStyle="#263344";
  ctx.fillStyle="#9ba8b8";
  ctx.lineWidth=1;

  for(let i=0;i<=4;i++){
    const py=top+ch*i/4;
    const price=max-(max-min)*i/4;
    ctx.beginPath();
    ctx.moveTo(left,py);
    ctx.lineTo(w-right,py);
    ctx.stroke();
    ctx.fillText(price.toFixed(2),w-right+5,py+3);
  }

  const step=cw/data.length;
  const body=Math.max(2,step*0.65);

  data.forEach((p,i)=>{
    const o=Number(p.o),c=Number(p.c);
    const hi=Number(p.h),lo=Number(p.l);
    if(![o,c,hi,lo].every(Number.isFinite))return;

    const x=left+step*(i+0.5);
    const up=c>=o;
    const color=up?"#19c784":"#ef5350";

    ctx.strokeStyle=color;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(x,y(hi));
    ctx.lineTo(x,y(lo));
    ctx.stroke();

    const topBody=Math.min(y(o),y(c));
    const bodyHeight=Math.max(1,Math.abs(y(o)-y(c)));
    ctx.fillRect(x-body/2,topBody,body,bodyHeight);
  });
}

timeframeButtons.forEach(button=>{
  button.addEventListener("click",()=>{
    selectedInterval=button.dataset.interval;

    timeframeButtons.forEach(item=>{
      const active=item===button;
      item.classList.toggle("active",active);
      item.setAttribute("aria-pressed",String(active));
    });

    loadChart();
  });
});

chartRange.addEventListener("change",loadChart);

window.addEventListener("resize",loadChart);

loadChart();
async function loadPrice(){
  refreshBtn.disabled=true;
  statusEl.textContent="กำลังเชื่อมต่อข้อมูล...";
  statusEl.className="status";
  checkedEl.textContent="ตรวจสอบล่าสุด: "+new Date().toLocaleString("th-TH");

  try{
    const response=await fetch("/price",{cache:"no-store"});
    if(!response.ok) throw new Error("HTTP "+response.status);

    const result=await response.json();
    if(result.status!=="success") throw new Error(result.message||"ไม่พบข้อมูลราคา");

    const d=result.data||{};
    const xau=d.xau||{};
    const price=Number(xau.price??d.spot_usd_oz);
    const gram=Number(d.per_gram_usd);
    const ratio=Number(d.gold_silver_ratio);

    if(!Number.isFinite(price)) throw new Error("ข้อมูลราคาไม่ถูกต้อง");

    priceEl.textContent="$"+fmt(price,2);
    gramEl.textContent=Number.isFinite(gram)?"$"+fmt(gram,2):"--";
    ratioEl.textContent=Number.isFinite(ratio)?fmt(ratio,2):"--";

    const state=d.data_state||{};
    const age=Number(state.age_seconds);
    if(state.status==="fresh"){
      statusEl.textContent="● เชื่อมต่อสำเร็จ · ข้อมูลต้นทางระบุว่าสด";
    }else{
      statusEl.textContent="● ได้รับข้อมูลราคาแล้ว · โปรดตรวจสอบความสดของข้อมูล";
    }

    const time=d.price_as_of||d.updated_at||result.updated_at;
    updatedEl.textContent="เวลาข้อมูลต้นทาง: "+(time||"ไม่ระบุ")+
      (Number.isFinite(age)?" · อายุข้อมูล "+age+" วินาที":"");

  }catch(error){
    statusEl.textContent="เชื่อมต่อไม่สำเร็จ: "+error.message;
    statusEl.className="error";
    updatedEl.textContent="กรุณาลองอัปเดตอีกครั้ง";
  }finally{
    refreshBtn.disabled=false;
  }
}

refreshBtn.addEventListener("click",loadPrice);
loadPrice();
setInterval(loadPrice,5000);
</script>
</body>
</html>`;

export default {
  async fetch(request) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

    if (request.method !== "GET") {
      return Response.json(
        { status: "error", message: "Method not allowed" },
        { status: 405, headers: cors }
      );
    }

    if (url.pathname === "/") {
      return new Response(DASHBOARD, {
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          ...cors
        }
      });
    }
if (url.pathname === "/chart") {
  const symbol = url.searchParams.get("symbol") || "xau";
  const range = url.searchParams.get("range") || "1d";
  const interval = url.searchParams.get("interval") || "5m";

  if (
    symbol !== "xau" ||
    !["1d", "5d", "1mo"].includes(range) ||
    !["1m", "2m", "5m", "15m", "30m", "60m"].includes(interval)
  ) {
    return Response.json(
      { status: "error", message: "Invalid chart parameters" },
      { status: 400, headers: cors }
    );
  }

  try {
    const api = new URL("https://xaus.com/api/v1/chart");
    api.search = new URLSearchParams({ symbol, range, interval });

    const res = await fetch(api.toString());
    const body = await res.text();

    return new Response(body, {
      status: res.status,
      headers: {
        ...cors,
        "Content-Type": "application/json; charset=UTF-8",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    return Response.json(
      { status: "error", message: error.message },
      { status: 502, headers: cors }
    );
  }
}
    if (url.pathname !== "/price") {
  return Response.json(
    {
      status: "error",
      message: "Endpoint not found"
    },
    {
      status: 404,
      headers: cors
    }
  );
}

try {
      const response = await fetch(
        "https://xaus.com/api/v1/spot?compact=1",
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("XAUS HTTP " + response.status);
      }

      const data = await response.json();

      return Response.json(
        {
          status: "success",
          source: "XAUS",
          updated_at: new Date().toISOString(),
          data
        },
        {
          headers: {
            ...cors,
            "Cache-Control": "no-store"
          }
        }
      );
    } catch (error) {
      return Response.json(
        {
          status: "error",
          message: error.message,
          source: "XAUS"
        },
        {
          status: 502,
          headers: cors
        }
      );
    }
  }
};
