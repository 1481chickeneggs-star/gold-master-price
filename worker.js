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
<button id="refresh">อัปเดตราคา</button>
</section>

<footer>
GOLD MASTER AI · DATA SOURCE: XAUS<br>
ข้อมูลราคาเพื่อประกอบการศึกษา ไม่ใช่คำแนะนำการลงทุน
</footer>
</main>

<script>
const priceEl=document.getElementById("price");
const gramEl=document.getElementById("gram");
const ratioEl=document.getElementById("ratio");
const statusEl=document.getElementById("status");
const updatedEl=document.getElementById("updated");
const refreshBtn=document.getElementById("refresh");

function fmt(value,digits=2){
  const n=Number(value);
  return Number.isFinite(n)
    ? n.toLocaleString("en-US",{minimumFractionDigits:digits,maximumFractionDigits:digits})
    : "--";
}

async function loadPrice(){
  refreshBtn.disabled=true;
  statusEl.textContent="กำลังเชื่อมต่อข้อมูล...";
  statusEl.className="status";

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
setInterval(loadPrice,15000);
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

    if (url.pathname !== "/price") {
      return Response.json(
        {
          status: "online",
          name: "GOLD MASTER AI",
          endpoint: "/price"
        },
        { headers: cors }
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
