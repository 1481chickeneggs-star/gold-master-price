const DASHBOARD = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0b1e34">
<title>GOLD MASTER AI V2.2</title>
<style>
:root{
--bg:#0b1018;--panel:#0b1e34;--box:#101722;
--border:#293747;--gold:#e8bd63;--gold2:#f3cb72;
--muted:#9ba8b8;--green:#19c784;--red:#ef5350
}
*{box-sizing:border-box}
body{
margin:0;padding:14px;background:linear-gradient(145deg,#0b1e34,#080d15);
background-attachment:fixed;color:#eee;font-family:Arial,sans-serif
}
main{max-width:1100px;margin:auto}
header{text-align:center;padding:12px;border-bottom:1px solid var(--border)}
h1{font-size:27px;color:var(--gold);letter-spacing:2px;margin:0}
.signature{font-size:13px;color:#c4ad7c;margin-top:6px}
.version{display:block;color:var(--muted);font-size:10px;margin-top:7px;letter-spacing:2px}
.panel{background:rgba(11,30,52,.85);border:1px solid var(--border);border-radius:15px;padding:15px;margin-top:17px}
.label{font-size:12px;color:var(--muted)}
.muted{font-size:12px;color:var(--muted);line-height:1.6}
.chart-heading,.market-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.chart-shell{width:100%;margin-top:12px}
.chart-tools{display:flex;justify-content:flex-end;gap:6px;flex-wrap:wrap;margin-bottom:8px}
button,select{cursor:pointer}
.expand-btn{
background:#17283a;color:var(--gold2);border:1px solid #526071;
border-radius:7px;padding:10px;font-size:12px
}
.chart-wrap{height:430px;background:#080d15;border:1px solid #263344;border-radius:10px;overflow:hidden}
canvas{width:100%;height:100%;display:block;touch-action:none;cursor:grab}
canvas:active{cursor:grabbing}
.chart-shell.expanded{
position:fixed;inset:0;z-index:99999;background:#080d15;
padding:12px;display:flex;flex-direction:column
}
.chart-shell.expanded .chart-wrap{flex:1;height:auto}
.tf-row{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:12px}
.chart-toolbar{display:flex;gap:5px;flex-wrap:wrap}
.tf-btn{
background:#101722;color:var(--muted);border:1px solid #354255;
border-radius:7px;padding:10px;min-width:40px;min-height:40px
}
.tf-btn.active{background:#d6ad59;color:#111}
.chart-range{background:#101722;color:white;border:1px solid #354255;border-radius:7px;padding:10px}
.legend{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0;font-size:11px;color:var(--muted)}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}
.market-info{border-top:1px solid var(--border);margin-top:15px;padding-top:13px}
.status{color:#70d7a0}
.error{color:#ff8585}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}
.box,.analysis-box{
background:var(--box);border:1px solid #354255;border-radius:10px;padding:13px;min-width:0
}
.value{font-size:21px;margin-top:7px;overflow-wrap:anywhere}
.analysis-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:14px}
.analysis-box .value{font-size:16px;font-weight:bold}
.buy{color:var(--green)}.sell{color:var(--red)}.wait{color:var(--gold2)}
.signal-note{margin-top:12px;padding:12px;background:#080d15;border-radius:9px;color:var(--muted);font-size:12px;line-height:1.7}
footer{text-align:center;color:#718095;font-size:11px;margin:22px 0;line-height:1.8}
button:disabled{opacity:.5}
@media(max-width:600px){
body{padding:10px}.panel{padding:11px}
.chart-wrap{height:350px}
.tf-row{align-items:flex-start}
.chart-toolbar{width:100%;justify-content:space-between}
.tf-btn{flex:1;padding:9px 4px;min-width:0}
.chart-range{width:100%}
.analysis-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.analysis-grid .analysis-box:last-child{grid-column:1/-1}
}
</style>
</head>
<body>
<main>
<header>
<h1>GOLD MASTER AI</h1>
<div class="signature">Saharat Chumjun</div>
<span class="version">TRADING ANALYSIS TERMINAL · VERSION 2.2</span>
</header>

<section class="panel">
<div class="chart-heading">
<div class="label">XAUUSD · HISTORICAL TECHNICAL CHART</div>
<span class="muted" id="chartSource">XAUS + D1</span>
</div>

<div class="chart-shell" id="chartShell">
<div class="chart-tools">
<button class="expand-btn" id="latestChart">↪ แท่งล่าสุด</button>
<button class="expand-btn" id="zoomOut">－ ซูมออก</button>
<button class="expand-btn" id="zoomIn">＋ ซูมเข้า</button>
<button class="expand-btn" id="expandChart">⛶ FULL SCREEN</button>
</div>
<div class="chart-wrap">
<canvas id="candleChart"></canvas>
</div>
</div>

<div class="tf-row">
<div class="chart-toolbar">
<button class="tf-btn" data-interval="1m">M1</button>
<button class="tf-btn active" data-interval="5m">M5</button>
<button class="tf-btn" data-interval="15m">M15</button>
<button class="tf-btn" data-interval="30m">M30</button>
<button class="tf-btn" data-interval="60m">H1</button>
<button class="tf-btn" data-interval="240m">H4</button>
<button class="tf-btn" data-interval="1d">D1</button>
</div>
<select id="chartRange" class="chart-range">
<option value="1d">1 วัน</option>
<option value="5d">5 วัน</option>
<option value="1mo" selected>1 เดือน</option>
</select>
</div>

<div class="legend">
<span><i class="dot" style="background:#e8bd63"></i>ราคาปัจจุบัน</span>
<span><i class="dot" style="background:#48a8ff"></i>EMA 21</span>
<span><i class="dot" style="background:#c084fc"></i>EMA 55</span>
<span><i class="dot" style="background:#ef5350"></i>แนวต้าน</span>
<span><i class="dot" style="background:#19c784"></i>แนวรับ</span>
</div>

<p id="chartStatus" class="muted">กำลังเตรียมกราฟ...</p>

<div class="market-info">
<div class="market-top">
<div id="status" class="status">กำลังเชื่อมต่อข้อมูล...</div>
<button id="refresh" class="expand-btn">อัปเดตราคา</button>
</div>
<div class="grid">
<div class="box">
<div class="label">ราคาต่อกรัม</div>
<div class="value" id="gram">--</div>
<small class="muted">USD / GRAM</small>
</div>
<div class="box">
<div class="label">Gold / Silver Ratio</div>
<div class="value" id="ratio">--</div>
<small class="muted">RATIO</small>
</div>
</div>
<p class="muted" id="updated">รอข้อมูลราคา</p>
<p class="muted" id="checked">ตรวจสอบล่าสุด: กำลังรอข้อมูล</p>
</div>

<div class="analysis-grid">
<div class="analysis-box"><div class="label">สัญญาณทางเทคนิค</div><div class="value wait" id="signal">WAIT</div></div>
<div class="analysis-box"><div class="label">แนวโน้ม EMA</div><div class="value" id="trend">กำลังวิเคราะห์</div></div>
<div class="analysis-box"><div class="label">Entry / จุดอ้างอิง</div><div class="value" id="entry">--</div></div>
<div class="analysis-box"><div class="label">Stop Loss</div><div class="value" id="sl">--</div></div>
<div class="analysis-box"><div class="label">Take Profit</div><div class="value" id="tp">--</div></div>
<div class="analysis-box"><div class="label">Risk / Reward</div><div class="value" id="rr">--</div></div>
</div>

<div class="signal-note" id="signalNote">
รอข้อมูลแท่งเทียนอย่างน้อย 55 แท่งก่อนคำนวณสัญญาณ
</div>
</section>

<footer>
GOLD MASTER AI · DATA SOURCE: XAUS + CLOUDFLARE D1<br>
ข้อมูลเพื่อการศึกษาและประกอบการตัดสินใจ ไม่ใช่คำแนะนำการลงทุน
</footer>
</main>

<script>
const $=id=>document.getElementById(id);
const canvas=$("candleChart"),ctx=canvas.getContext("2d");
const tfButtons=document.querySelectorAll("[data-interval]");
const rangeSelect=$("chartRange");
const chartStatus=$("chartStatus");
const chartShell=$("chartShell");

const gramEl=$("gram");
const ratioEl=$("ratio");
const statusEl=$("status");
const updatedEl=$("updated");
const checkedEl=$("checked");

let interval="5m",points=[],livePrice=null;
let visibleCount=90,endIndex=0;
let chartBusy=false,priceBusy=false;
let pointerMap=new Map(),dragStart=null;
let lastPinchDistance=0,historyBusy=false;
let historyExhausted=false;

const fmt=(v,d=2)=>{
 const n=Number(v);
 return Number.isFinite(n)?n.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d}):"--";
};

function ema(values,period){
 const out=[],k=2/(period+1);let prev=null;
 for(const v of values){
  prev=prev===null?v:v*k+prev*(1-k);
  out.push(prev);
 }
 return out;
}

function analyse(data){
 if(data.length<55)return null;
 const e21=ema(data.map(p=>+p.c),21);
 const e55=ema(data.map(p=>+p.c),55);
 const last=data[data.length-1];
 const a=e21[e21.length-1],b=e55[e55.length-1];
 const prev=e21[e21.length-2];
 const recent=data.slice(-20);
 const support=Math.min(...recent.map(p=>+p.l));
 const resistance=Math.max(...recent.map(p=>+p.h));
 let signal="WAIT",reason="แนวโน้มยังไม่ชัดเจน";

 if(a>b&&+last.c>a&&a>=prev){
  signal="BUY";reason="ราคาอยู่เหนือ EMA 21 และ EMA 21 อยู่เหนือ EMA 55";
 }else if(a<b&&+last.c<a&&a<=prev){
  signal="SELL";reason="ราคาอยู่ใต้ EMA 21 และ EMA 21 อยู่ใต้ EMA 55";
 }

 const entry=+last.c;
 const range=Math.max(+last.h-+last.l,(resistance-support)*.12,entry*.0008);
 let sl=null,tp=null;
 if(signal==="BUY"){sl=Math.min(+last.l,entry-range);tp=entry+(entry-sl)*2}
 if(signal==="SELL"){sl=Math.max(+last.h,entry+range);tp=entry-(sl-entry)*2}

 return {e21,e55,signal,reason,entry,sl,tp,support,resistance,trend:a>b?"ขาขึ้น":"ขาลง"};
}

function updateAnalysis(a){
 if(!a){
  $("signal").textContent="WAIT";
  $("signal").className="value wait";
  $("trend").textContent="ข้อมูลไม่พอ";
  $("entry").textContent=$("sl").textContent=$("tp").textContent=$("rr").textContent="--";
  $("signalNote").textContent="ข้อมูลไม่ครบ 55 แท่ง จึงยังไม่แสดงสัญญาณ";
  return;
 }
 const s=$("signal");
 s.textContent=a.signal;
 s.className="value "+(a.signal==="BUY"?"buy":a.signal==="SELL"?"sell":"wait");
 $("trend").textContent=a.trend;
 $("entry").textContent=fmt(a.entry);
 $("sl").textContent=a.sl===null?"--":fmt(a.sl);
 $("tp").textContent=a.tp===null?"--":fmt(a.tp);
 $("rr").textContent=a.sl===null?"--":"1 : 2";
 $("signalNote").textContent=a.reason+" · แนวรับ "+fmt(a.support)+" · แนวต้าน "+fmt(a.resistance);
}

function draw(){
 const w=canvas.clientWidth,h=canvas.clientHeight;
 if(!w||!h||!points.length)return;
 const dpr=window.devicePixelRatio||1;
 canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.fillStyle="#080d15";ctx.fillRect(0,0,w,h);

 visibleCount=Math.max(20,Math.min(visibleCount,points.length));
 endIndex=Math.max(1,Math.min(endIndex,points.length));
 const start=Math.max(0,endIndex-visibleCount);
 const data=points.slice(start,endIndex);
 if(!data.length)return;

 const vals=data.flatMap(p=>[+p.h,+p.l]).filter(Number.isFinite);
 if(livePrice!==null&&endIndex===points.length)vals.push(livePrice);
 let min=Math.min(...vals),max=Math.max(...vals);
 const pad=(max-min)*.12||1;min-=pad;max+=pad;

 const left=10,right=76,top=35,bottom=22;
 const cw=w-left-right,ch=h-top-bottom;
 const y=v=>top+(max-v)/(max-min)*ch;
 ctx.font="10px Arial";ctx.strokeStyle="#263344";ctx.fillStyle="#9ba8b8";

 for(let i=0;i<=4;i++){
  const py=top+ch*i/4;
  ctx.beginPath();ctx.moveTo(left,py);ctx.lineTo(w-right,py);ctx.stroke();
  ctx.fillText((max-(max-min)*i/4).toFixed(2),w-right+5,py+3);
 }

 const step=cw/data.length,body=Math.max(2,step*.62);
 data.forEach((p,i)=>{
  const o=+p.o,c=+p.c,hi=+p.h,lo=+p.l;
  if(![o,c,hi,lo].every(Number.isFinite))return;
  const x=left+step*(i+.5),color=c>=o?"#19c784":"#ef5350";
  ctx.strokeStyle=color;ctx.fillStyle=color;
  ctx.beginPath();ctx.moveTo(x,y(hi));ctx.lineTo(x,y(lo));ctx.stroke();
  ctx.fillRect(x-body/2,Math.min(y(o),y(c)),body,Math.max(1,Math.abs(y(o)-y(c))));
 });

 const a=analyse(points.slice(0,endIndex));
 if(a){
  const drawLine=(values,color)=>{
   ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=1.5;
   let started=false;
   values.forEach((v,i)=>{
    if(i<start||i>=endIndex)return;
    const x=left+step*(i-start+.5);
    if(!started){ctx.moveTo(x,y(v));started=true}else ctx.lineTo(x,y(v));
   });
   ctx.stroke();
  };
  drawLine(a.e21,"#48a8ff");
  drawLine(a.e55,"#c084fc");

  ctx.setLineDash([4,4]);
  ctx.strokeStyle="#19c784";
  ctx.beginPath();ctx.moveTo(left,y(a.support));ctx.lineTo(w-right,y(a.support));ctx.stroke();
  ctx.strokeStyle="#ef5350";
  ctx.beginPath();ctx.moveTo(left,y(a.resistance));ctx.lineTo(w-right,y(a.resistance));ctx.stroke();
  ctx.setLineDash([]);
 }
 if(livePrice!==null&&endIndex===points.length){
  const py=y(livePrice);
  ctx.setLineDash([5,4]);ctx.strokeStyle="#e8bd63";
  ctx.beginPath();ctx.moveTo(left,py);ctx.lineTo(w-right,py);ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle="#e8bd63";
  ctx.fillRect(w-right+1,Math.max(top,Math.min(h-bottom-18,py-9)),70,18);
  ctx.fillStyle="#101010";ctx.font="bold 10px Arial";
  ctx.fillText(fmt(livePrice),w-right+4,Math.max(top+12,Math.min(h-bottom-6,py+3)));
 }
 updateAnalysis(a);
}

async function loadChart(options={}){
 if(chartBusy)return;
 chartBusy=true;

 const resetView=options.resetView===true;
 const wasLatest=endIndex===0||endIndex>=points.length;
 const oldAnchor=points.length
  ?Number(points[Math.max(0,Math.min(points.length-1,endIndex-1))].t)
  :null;

 chartStatus.textContent="กำลังโหลดข้อมูล "+interval+"...";

 try{
  const range=rangeSelect.value;
  const r=await fetch(
   "/chart?interval="+encodeURIComponent(interval)+"&range="+encodeURIComponent(range),
   {cache:"no-store"}
  );
  const j=await r.json();
  if(!r.ok)throw new Error(j.error||"โหลดกราฟไม่สำเร็จ");

  if(!Array.isArray(j.points)||!j.points.length){
   throw new Error("ไม่พบข้อมูลแท่งเทียน");
  }

  const newPoints=j.points
   .filter(p=>[p.t,p.o,p.h,p.l,p.c].every(v=>Number.isFinite(Number(v))))
   .sort((a,b)=>Number(a.t)-Number(b.t));

  const unique=[];
  for(const p of newPoints){
   if(!unique.length||Number(p.t)!==Number(unique[unique.length-1].t)){
    unique.push(p);
   }
  }

  points=unique;

  if(resetView||wasLatest||oldAnchor===null){
   endIndex=points.length;
  }else{
   let found=points.findIndex(p=>Number(p.t)>oldAnchor);
   endIndex=found<0?points.length:Math.max(1,found);
  }

  historyExhausted=false;
  $("chartSource").textContent=j.source||"XAUS + D1";

  chartStatus.textContent=
   "ข้อมูล "+points.length+" แท่ง · "+interval+
   (j.fallback?" · ใช้ข้อมูลสำรอง D1":"");

  draw();
 }catch(e){
  chartStatus.textContent="ผิดพลาด: "+e.message;
  if(!points.length)updateAnalysis(null);
 }finally{
  chartBusy=false;
 }
}

async function loadOlder(){
 if(historyBusy||historyExhausted||!points.length||endIndex>visibleCount+5)return;

 historyBusy=true;
 try{
  const before=Number(points[0].t);
  const r=await fetch(
   "/history?interval="+encodeURIComponent(interval)+
   "&before="+encodeURIComponent(before)+
   "&limit=500",
   {cache:"no-store"}
  );
  const j=await r.json();

  if(!r.ok)throw new Error(j.error||"ไม่สามารถอ่านประวัติ D1 ได้");

  const old=(j.points||[]).filter(p=>
   Number.isFinite(Number(p.t))&&Number(p.t)<before
  );

  if(old.length){
   points=old.concat(points);
   endIndex+=old.length;
   chartStatus.textContent="โหลดข้อมูลย้อนหลังเพิ่ม "+old.length+" แท่ง · D1";
   draw();
  }else{
   historyExhausted=true;
   chartStatus.textContent=
    "ไม่มีข้อมูลย้อนหลังเพิ่มเติมใน D1 · ระบบจะสะสมข้อมูลเมื่อมีการเรียกกราฟ";
  }
 }catch(e){
  chartStatus.textContent="ประวัติย้อนหลัง: "+e.message;
 }finally{
  historyBusy=false;
 }
}

function zoom(factor){
 const old=visibleCount;
 visibleCount=Math.max(20,Math.min(points.length||500,Math.round(visibleCount*factor)));
 if(endIndex===0)endIndex=points.length;
 if(old!==visibleCount)draw();
}

function latest(){
 endIndex=points.length;
 draw();
}

function pointerDown(e){
 canvas.setPointerCapture(e.pointerId);
 pointerMap.set(e.pointerId,{x:e.clientX,y:e.clientY});

 if(pointerMap.size===1){
  dragStart={x:e.clientX,end:endIndex};
 }else if(pointerMap.size===2){
  const p=[...pointerMap.values()];
  lastPinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);
  dragStart=null;
 }
}

function pointerMove(e){
 if(!pointerMap.has(e.pointerId))return;
 pointerMap.set(e.pointerId,{x:e.clientX,y:e.clientY});

 if(pointerMap.size===2){
  const p=[...pointerMap.values()];
  const dist=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);

  if(lastPinchDistance>0){
   const factor=dist>lastPinchDistance?0.94:1.06;
   zoom(factor);
  }

  lastPinchDistance=dist;
  return;
 }

 if(!dragStart)return;

 const dx=e.clientX-dragStart.x;
 const step=canvas.clientWidth/Math.max(1,visibleCount);
 const move=Math.round(dx/step);

 endIndex=Math.max(1,Math.min(points.length,dragStart.end-move));
 draw();

 if(endIndex<=visibleCount+5)loadOlder();
}

function pointerUp(e){
 pointerMap.delete(e.pointerId);
 if(pointerMap.size<2)lastPinchDistance=0;
 if(pointerMap.size===0)dragStart=null;
}

canvas.addEventListener("pointerdown",pointerDown);
canvas.addEventListener("pointermove",pointerMove);
canvas.addEventListener("pointerup",pointerUp);
canvas.addEventListener("pointercancel",pointerUp);

canvas.addEventListener("wheel",e=>{
 e.preventDefault();
 zoom(e.deltaY<0?0.85:1.18);
},{passive:false});

$("zoomIn").onclick=()=>zoom(0.75);
$("zoomOut").onclick=()=>zoom(1.35);
$("latestChart").onclick=latest;

$("expandChart").onclick=()=>{
 chartShell.classList.toggle("expanded");
 $("expandChart").textContent=
  chartShell.classList.contains("expanded")?"✕ CLOSE":"⛶ FULL SCREEN";
 setTimeout(draw,100);
};

tfButtons.forEach(b=>b.onclick=()=>{
 tfButtons.forEach(x=>x.classList.remove("active"));
 b.classList.add("active");
 interval=b.dataset.interval;
 visibleCount=90;
 historyExhausted=false;
 loadChart({resetView:true});
});

rangeSelect.onchange=()=>{
 historyExhausted=false;
 loadChart({resetView:true});
};

window.addEventListener("resize",draw);

function findNumber(obj,keys){
 if(!obj||typeof obj!=="object")return null;

 for(const key of keys){
  if(obj[key]!==undefined&&obj[key]!==null){
   const n=Number(obj[key]);
   if(Number.isFinite(n))return n;
  }
 }

 for(const value of Object.values(obj)){
  if(value&&typeof value==="object"){
   const found=findNumber(value,keys);
   if(found!==null)return found;
  }
 }

 return null;
}

async function loadPrice(){
 if(priceBusy)return;
 priceBusy=true;

 try{
  const r=await fetch("/price",{cache:"no-store"});
  const j=await r.json();

  if(!r.ok)throw new Error(j.error||"Price unavailable");

  const gold=findNumber(j,["xau","gold","gold_price","price","ask","last"]);
  const silver=findNumber(j,["xag","silver","silver_price"]);

  if(gold!==null){
   livePrice=gold;
   gramEl.textContent=fmt(gold/31.1034768,3);
  }

  if(gold!==null&&silver!==null&&silver>0){
   ratioEl.textContent=fmt(gold/silver,2);
  }

  statusEl.textContent=gold===null
   ?"เชื่อมต่อแล้ว แต่ไม่พบฟิลด์ราคาทอง"
   :"เชื่อมต่อข้อมูลราคาแล้ว";

  statusEl.className=gold===null?"error":"status";

  updatedEl.textContent="ราคาทอง: "+(gold===null?"ไม่พบฟิลด์ราคา":fmt(gold));
  checkedEl.textContent="ตรวจสอบล่าสุด: "+new Date().toLocaleString("th-TH");

  draw();
 }catch(e){
  statusEl.textContent="ไม่สามารถเชื่อมต่อราคาได้";
  statusEl.className="error";
  checkedEl.textContent=e.message;
 }finally{
  priceBusy=false;
 }
}

$("refresh").onclick=()=>{
 loadPrice();
 loadChart();
};

loadChart({resetView:true});
loadPrice();

setInterval(loadPrice,15000);

// รีเฟรชกราฟโดยรักษาตำแหน่งที่กำลังดูอยู่
setInterval(()=>loadChart({resetView:false}),60000);
</script>
</body>
</html>`;

const ALLOWED_INTERVALS = new Set([
 "1m","5m","15m","30m","60m","240m","1d"
]);

const ALLOWED_RANGES = new Set(["1d","5d","1mo"]);
const UPSTREAM = "https://xaus.com/api/v1";

function json(data,status=200){
 return new Response(JSON.stringify(data),{
  status,
  headers:{
   "content-type":"application/json; charset=utf-8",
   "access-control-allow-origin":"*",
   "cache-control":"no-store"
  }
 });
}

function validPoints(points){
 if(!Array.isArray(points))return [];

 return points.map(p=>({
  t:Number(p.t),
  o:Number(p.o),
  h:Number(p.h),
  l:Number(p.l),
  c:Number(p.c),
  v:Number(p.v||0)
 })).filter(p=>
  Number.isFinite(p.t)&&
  [p.o,p.h,p.l,p.c].every(Number.isFinite)
 ).sort((a,b)=>a.t-b.t);
}

function aggregateCandles(points,minutes){
 const source=validPoints(points);
 const bucketSeconds=minutes*60;
 const map=new Map();

 for(const p of source){
  const bucket=Math.floor(p.t/bucketSeconds)*bucketSeconds;
  const old=map.get(bucket);

  if(!old){
   map.set(bucket,{
    t:bucket,
    o:p.o,
    h:p.h,
    l:p.l,
    c:p.c,
    v:p.v
   });
  }else{
   old.h=Math.max(old.h,p.h);
   old.l=Math.min(old.l,p.l);
   old.c=p.c;
   old.v+=p.v;
  }
 }

 return [...map.values()].sort((a,b)=>a.t-b.t);
}

async function saveCandles(env,interval,points){
 if(!env.DB||!points.length)return 0;

 const rows=validPoints(points);
 let saved=0;

 for(let i=0;i<rows.length;i+=100){
  const batch=rows.slice(i,i+100);

  const statements=batch.map(p=>
   env.DB.prepare(
    `INSERT INTO candles
    (symbol,timeframe,candle_time,open,high,low,close,volume)
    VALUES(?,?,?,?,?,?,?,?)
    ON CONFLICT(symbol,timeframe,candle_time)
    DO UPDATE SET
    open=excluded.open,
    high=excluded.high,
    low=excluded.low,
    close=excluded.close,
    volume=excluded.volume`
   ).bind(
    "XAUUSD",
    interval,
    p.t,
    p.o,
    p.h,
    p.l,
    p.c,
    p.v
   )
  );

  await env.DB.batch(statements);
  saved+=batch.length;
 }

 await env.DB.prepare(
  `INSERT INTO collection_logs
  (symbol,timeframe,candles_count,status,message)
  VALUES(?,?,?,?,?)`
 ).bind(
  "XAUUSD",
  interval,
  saved,
  "success",
  "Saved from XAUS"
 ).run();

 return saved;
}

async function readHistory(env,interval,limit=500,before=null){
 if(!env.DB)return [];

 limit=Math.max(1,Math.min(1000,Number(limit)||500));

 let result;

 if(before!==null&&Number.isFinite(Number(before))){
  result=await env.DB.prepare(
   `SELECT candle_time AS t,
   open AS o,
   high AS h,
   low AS l,
   close AS c,
   volume AS v
   FROM candles
   WHERE symbol=? AND timeframe=? AND candle_time<?
   ORDER BY candle_time DESC LIMIT ?`
  ).bind(
   "XAUUSD",
   interval,
   Number(before),
   limit
  ).all();
 }else{
  result=await env.DB.prepare(
   `SELECT candle_time AS t,
   open AS o,
   high AS h,
   low AS l,
   close AS c,
   volume AS v
   FROM candles
   WHERE symbol=? AND timeframe=?
   ORDER BY candle_time DESC LIMIT ?`
  ).bind(
   "XAUUSD",
   interval,
   limit
  ).all();
 }

 return validPoints((result.results||[]).reverse());
}

async function fetchUpstream(interval,range){
 const url=new URL(UPSTREAM+"/chart");

 url.searchParams.set("symbol","xau");
 url.searchParams.set("range",range);
 url.searchParams.set("interval",interval);

 const response=await fetch(url.toString(),{
  headers:{"accept":"application/json"},
  signal:AbortSignal.timeout(15000)
 });

 if(!response.ok){
  throw new Error("XAUS HTTP "+response.status);
 }

 const data=await response.json();
 const points=validPoints(data.points);

 if(!points.length){
  throw new Error("XAUS returned no candles");
 }

 return points;
}

async function chartHandler(request,env){
 const url=new URL(request.url);

 const interval=url.searchParams.get("interval")||"5m";
 const range=url.searchParams.get("range")||"1mo";

 if(!ALLOWED_INTERVALS.has(interval)){
  return json({error:"Unsupported interval"},400);
 }

 if(!ALLOWED_RANGES.has(range)){
  return json({error:"Unsupported range"},400);
 }

 try{
  const sourceInterval=
   interval==="240m"||interval==="1d"?"60m":interval;

  let points=await fetchUpstream(sourceInterval,range);

  if(interval==="240m"){
   points=aggregateCandles(points,240);
  }

  if(interval==="1d"){
   points=aggregateCandles(points,1440);
  }

  let saveWarning=null;

  try{
   await saveCandles(env,interval,points);
  }catch(dbError){
   saveWarning=dbError.message;
  }

  let stored=[];

  try{
   stored=await readHistory(env,interval,1000);
  }catch(dbError){
   saveWarning=dbError.message;
  }

  const merged=new Map();

  for(const p of stored){
   merged.set(p.t,p);
  }

  for(const p of points){
   merged.set(p.t,p);
  }

  const combined=[...merged.values()]
   .sort((a,b)=>a.t-b.t);

  return json({
   symbol:"XAUUSD",
   interval,
   range,
   source:env.DB
    ?"XAUS + CLOUDFLARE D1"
    :"XAUS ONLY",
   fallback:false,
   database:!!env.DB,
   saveWarning,
   points:combined
  });

 }catch(error){
  try{
   const stored=await readHistory(env,interval,1000);

   if(stored.length){
    return json({
     symbol:"XAUUSD",
     interval,
     range,
     source:"CLOUDFLARE D1 BACKUP",
     fallback:true,
     points:stored
    });
   }
  }catch(dbError){
   return json({
    error:"XAUS และ D1 ใช้งานไม่ได้",
    detail:dbError.message
   },502);
  }

  return json({
   error:"ไม่สามารถดึงข้อมูลกราฟได้",
   detail:error.message
  },502);
 }
}

async function historyHandler(request,env){
 const url=new URL(request.url);

 const interval=url.searchParams.get("interval")||"5m";
 const limit=url.searchParams.get("limit")||"500";
 const before=url.searchParams.get("before");

 if(!ALLOWED_INTERVALS.has(interval)){
  return json({error:"Unsupported interval"},400);
 }

 if(!env.DB){
  return json({error:"D1 binding DB is missing"},503);
 }

 try{
  const points=await readHistory(env,interval,limit,before);

  return json({
   symbol:"XAUUSD",
   interval,
   count:points.length,
   source:"CLOUDFLARE D1",
   points
  });

 }catch(error){
  return json({
   error:"Database query failed",
   detail:error.message
  },500);
 }
}

async function priceHandler(){
 const response=await fetch(UPSTREAM+"/spot?compact=1",{
  headers:{"accept":"application/json"},
  signal:AbortSignal.timeout(15000)
 });

 if(!response.ok){
  return json({error:"XAUS price HTTP "+response.status},502);
 }

 const data=await response.json();
 return json(data);
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const path=url.pathname;

  if(request.method==="OPTIONS"){
   return new Response(null,{
    headers:{
     "access-control-allow-origin":"*",
     "access-control-allow-methods":"GET, OPTIONS",
     "access-control-allow-headers":"Content-Type"
    }
   });
  }

  try{
   if(path==="/"||path==="/index.html"){
    return new Response(DASHBOARD,{
     headers:{
      "content-type":"text/html; charset=utf-8",
      "cache-control":"no-store"
     }
    });
   }

   if(path==="/chart"){
    return await chartHandler(request,env);
   }

   if(path==="/history"){
    return await historyHandler(request,env);
   }

   if(path==="/price"){
    return await priceHandler();
   }

   if(path==="/health"){
    let databaseStatus="not_configured";

    if(env.DB){
     try{
      await env.DB.prepare("SELECT 1 AS ok").first();
      databaseStatus="connected";
     }catch(error){
      databaseStatus="error: "+error.message;
     }
    }

    return json({
     status:"ok",
     version:"2.2",
     database:!!env.DB,
     databaseStatus,
     routes:[
      "/",
      "/price",
      "/chart",
      "/history",
      "/health"
     ]
    });
   }

   return json({error:"Not found"},404);

  }catch(error){
   return json({
    error:"Worker error",
    detail:error.message
   },500);
  }
 }
};
