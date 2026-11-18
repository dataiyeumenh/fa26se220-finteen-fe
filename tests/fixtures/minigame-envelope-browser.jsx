import { createRoot } from "react-dom/client";
import { NeedWantMiniGame } from "/src/pages/Kid/Dashboard/components/game/NeedWantMiniGame.jsx";
import { BudgetBuilderMiniGame } from "/src/pages/Kid/Dashboard/components/game/BudgetBuilderMiniGame.jsx";
import { resolveContentImages } from "/src/lib/imageAssets.js";
import ch1 from "./content/CH01.json";
import ch2 from "./content/CH02.json";
import "/src/index.css";

const root = createRoot(document.getElementById("root"));
const output = document.getElementById("envelope-result");
const wait = (ms=45) => new Promise(resolve => setTimeout(resolve,ms));
const assert = (ok, message) => { if(!ok) throw Error(message); };
const errors = [];
window.addEventListener("error", e => errors.push(e.message));
window.addEventListener("unhandledrejection", e => errors.push(String(e.reason)));
const gameOf = (chapter, kind) => structuredClone(resolveContentImages(chapter).scenes.find(s=>s.game?.kind===kind).game);
const game = gameOf(ch2,"BUDGET_BUILDER");
let mountId=0, result;
const render = async view => {
  root.render(<div key={++mountId} style={{height:"100vh",position:"relative",background:"#f8ecd4"}}><div className="vn-minigame-host" style={{top:60}}>{view}</div></div>);
  await wait(150);
};
const budget = async () => render(<BudgetBuilderMiniGame game={game} onComplete={v=>{result=v;}} />);
const button = text => [...document.querySelectorAll("button")].find(b=>b.textContent.trim()===text);
const dragEvent = (target,type,transfer) => target.dispatchEvent(new DragEvent(type,{bubbles:true,cancelable:true,dataTransfer:transfer}));
async function needWrong() {
  const need = gameOf(ch1,"NEED_WANT");
  const wrong=need.items.find(i=>i.category==="WANTS");
  wrong.label="Bộ màu vẽ cao cấp";
  wrong.explanation="Chọn bộ cao cấp là phần nâng cấp thuộc mong Muốn; có thể hoãn để ưu tiên các khoản Cần.";
  await render(<NeedWantMiniGame game={need} immersive />);
  for(const item of need.items){
    const transfer=new DataTransfer();transfer.setData("text/plain",item.id);
    dragEvent(document.querySelector(`.nw-${item.id===wrong.id?"NEEDS":item.category}`),"drop",transfer);
    await wait();
  }
  button("Kiểm tra").click();await wait();
  const target=document.querySelector(".nw-NEEDS .nw-item.is-incorrect");
  const list=target.closest(".nw-items"), box=target.getBoundingClientRect(), listBox=list.getBoundingClientRect();
  assert(target===list.querySelector(".nw-item"),"Wrong item must move to first row");
  assert(document.activeElement===target,"First wrong item must receive focus");
  assert(box.top>=listBox.top-1&&box.bottom<=listBox.bottom+1,"Wrong item feedback remains clipped by basket");
  assert(box.bottom<=innerHeight,"Wrong item is below viewport");
  assert(!target.querySelector(".nw-item-feedback").textContent.includes(wrong.label),"Feedback repeats item name");
}
window.envelopeReview={budget,needWrong};
const view=new URLSearchParams(location.search).get("view");
if(view==="budget") await budget();
else if(view==="needs") await needWrong();
else {
 try {
  const completed=[];
  await needWrong();completed.push("First wrong CH01 item and its explanation are visible after grading");
  await budget();
  const note=document.querySelector(".c2-amount"), envelope=document.querySelector(".c2-envelope");
  assert(!document.querySelector(".c2-envelope-flap"),"Old X flap remains");
  assert(document.querySelectorAll(".c2-envelope.is-open:not(.has-money)").length===6,"Empty envelopes must start open");
  note.click();await wait();
  envelope.dispatchEvent(new PointerEvent("pointerover",{bubbles:true,pointerType:"mouse"}));await wait(350);
  assert(envelope.classList.contains("is-open"),"Holding a selected note over an envelope does not open it");
  assert(getComputedStyle(envelope.querySelector(".c2-envelope-lid")).transform!=="none","Lid has no opening transform");
  envelope.click();await wait(650);
  assert(envelope.classList.contains("has-money")&&!envelope.classList.contains("is-open"),"Envelope does not close after receiving money");
  assert(document.querySelectorAll(".c2-envelope.is-open:not(.has-money)").length===5,"Remaining empty envelopes must stay open");
  envelope.click();await wait();
  assert(!envelope.classList.contains("has-money")&&envelope.classList.contains("is-open"),"Removing money must reopen the envelope");
  envelope.click();await wait(650);
  completed.push("Empty envelopes stay open; deposited envelopes close; removing money reopens them");
  const nextNote=document.querySelector(".c2-amount:not(:disabled)");
  const transfer=new DataTransfer();
  dragEvent(nextNote,"dragstart",transfer);await wait();
  nextNote.dispatchEvent(new PointerEvent("pointercancel",{bubbles:true,pointerType:"mouse"}));await wait();
  dragEvent(envelope,"dragenter",transfer);await wait();
  dragEvent(envelope,"dragover",transfer);await wait();
  assert(envelope.classList.contains("is-receiving")&&envelope.classList.contains("is-open"),"Native pointercancel incorrectly ended the mouse drag before hover");
  assert(document.querySelectorAll(".c2-envelope.has-money").length===1,"Hover deposited money before drop");
  dragEvent(envelope,"dragleave",transfer);await wait();
  assert(!envelope.classList.contains("is-receiving")&&!envelope.classList.contains("is-open"),"Filled envelope must close when the held note leaves");
  dragEvent(envelope,"dragover",transfer);dragEvent(envelope,"drop",transfer);await wait(650);
  assert(envelope.classList.contains("has-money")&&!envelope.classList.contains("is-open"),"Native drop did not assign money and close the envelope");
  completed.push("Native drag reopens a filled envelope before drop, survives pointercancel, and closes on leave/drop");
  button("Làm lại").click();await wait();
  for(const [index,zone] of game.dropZones.entries()){
    const amount=[...document.querySelectorAll(".c2-amount")].find(b=>!b.disabled&&b.textContent.includes(game.draggables.find(a=>a.value===zone.expectedValue).label));
    amount.click();await wait();document.querySelectorAll(".c2-envelope")[index].click();await wait();
  }
  button("Kiểm tra").click();await wait();
  button("Tiếp tục →").click();await wait();
  assert(result?.passed&&result.score===6,"Envelope redesign changed scoring");
  assert(errors.length===0,errors.join("; "));
  assert(document.documentElement.scrollWidth<=innerWidth+1,"Horizontal overflow");
  completed.push("All six envelopes retain correct scoring");
  output.textContent=JSON.stringify({status:"PASS",width:innerWidth,height:innerHeight,completed,errors});
 }catch(error){output.textContent=JSON.stringify({status:"FAIL",error:error.message,errors});}
}
