import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createServer } from "vite";

const folder = path.resolve("output/minigame-envelope");
mkdirSync(folder, { recursive: true });
const server = await createServer({ server: { host: "127.0.0.1", port: 5199, strictPort: true, hmr: false, watch: null } });
await server.listen();
const browser = spawn(process.env.BROWSER_EXECUTABLE || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--remote-debugging-port=0",
  `--user-data-dir=${path.join(folder, `profile-${process.pid}`)}`, "about:blank",
], { windowsHide: true });
let socket, sequence=0;
const pending = new Map();
const events = [];
const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
const results=[];
try {
  const endpoint = await new Promise((resolve,reject) => {
    const timer=setTimeout(()=>reject(Error("Chrome debugging endpoint timed out")),20000);
    browser.on("error",reject);
    browser.stderr.on("data",chunk=>{const match=String(chunk).match(/DevTools listening on (ws:\/\/\S+)/);if(match){clearTimeout(timer);resolve(match[1]);}});
  });
  socket=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true});});
  socket.addEventListener("message",event=>{const message=JSON.parse(event.data);if(message.method){events.push(message);return;}const task=pending.get(message.id);if(!task)return;pending.delete(message.id);clearTimeout(task.timer);message.error?task.reject(Error(message.error.message)):task.resolve(message.result);});
  const command=(method,params={},sessionId)=>new Promise((resolve,reject)=>{
    const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error(`CDP timeout: ${method}`));},25000);
    pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  const {targetId}=await command("Target.createTarget",{url:"about:blank"});
  const {sessionId}=await command("Target.attachToTarget",{targetId,flatten:true});
  const send=(method,params)=>command(method,params,sessionId);
  const evaluate=async expression=>{
    const response=await send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});
    if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);
    return response.result.value;
  };
  const load=async(view="")=>{
    await send("Page.navigate",{url:`http://127.0.0.1:5199/tests/fixtures/minigame-envelope-browser.html${view?`?view=${view}`:""}`});
    for(let i=0;i<400;i++){
      if(await evaluate(`!!window.envelopeReview && ${view?"!!document.querySelector('.c2-envelope')":"document.getElementById('envelope-result')?.textContent!=='RUNNING'"}`))return;
      await wait(50);
    }
    throw Error("Envelope fixture did not finish loading");
  };
  const capture=async name=>{
    const shot=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
    writeFileSync(path.join(folder,name+".png"),Buffer.from(shot.data,"base64"));
  };
  await send("Emulation.setDeviceMetricsOverride",{width:1366,height:768,deviceScaleFactor:1,mobile:false});
  await load();
  const desktop=JSON.parse(await evaluate("document.getElementById('envelope-result').textContent"));
  assert.equal(desktop.status,"PASS",JSON.stringify(desktop));results.push(desktop);
  await evaluate("window.envelopeReview.needWrong()");await capture("needs-wrong-1366");
  await evaluate("window.envelopeReview.budget()");
  assert.ok(await evaluate("[...document.querySelectorAll('.c2-envelope-label')].every(e=>e.getBoundingClientRect().bottom<=document.querySelector('.c2-budget-main').getBoundingClientRect().bottom+1)"),"Initial envelope labels are clipped at 1366×768");
  await capture("envelopes-empty-open-1366");
  await evaluate("document.querySelector('.c2-amount').click()");await wait(60);
  await evaluate("document.querySelector('.c2-envelope').click()");await wait(650);
  assert.ok(await evaluate("!!document.querySelector('.c2-envelope.has-money:not(.is-open)') && document.querySelectorAll('.c2-envelope.is-open:not(.has-money)').length===5"),"Filled and empty envelopes have indistinguishable states");
  await capture("envelopes-filled-vs-empty-1366");
  await evaluate("window.__mouseCanceled=false;document.querySelector('.c2-amount:not(:disabled)').addEventListener('pointercancel',()=>{window.__mouseCanceled=true},{once:true})");
  const mouse=await evaluate("(() => {const center=e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}};return {note:center(document.querySelector('.c2-amount:not(:disabled)')),envelope:center(document.querySelector('.c2-envelope.has-money'))};})()");
  await send("Input.setInterceptDrags",{enabled:true});
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",...mouse.note});
  await send("Input.dispatchMouseEvent",{type:"mousePressed",...mouse.note,button:"left",buttons:1,clickCount:1});
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",x:mouse.note.x+12,y:mouse.note.y+12,button:"left",buttons:1});
  await send("Input.dispatchMouseEvent",{type:"mouseMoved",...mouse.envelope,button:"left",buttons:1});
  let dragData;
  for(let i=0;i<40&&!dragData;i++){dragData=events.find(e=>e.method==="Input.dragIntercepted")?.params.data;if(!dragData)await wait(50);}
  assert.ok(dragData,"Chrome did not start a real native mouse drag");
  await send("Input.dispatchDragEvent",{type:"dragEnter",...mouse.envelope,data:dragData});
  await send("Input.dispatchDragEvent",{type:"dragOver",...mouse.envelope,data:dragData});await wait(350);
  assert.ok(await evaluate("window.__mouseCanceled && !!document.querySelector('.c2-envelope.has-money.is-receiving.is-open')"),"Real mouse drag must survive pointercancel and open the filled envelope BEFORE drop");
  assert.ok(await evaluate("document.querySelector('.c2-envelope.has-money .c2-envelope-copy strong').textContent==='100.000đ'"),"Mouse hover unexpectedly changed the assigned amount");
  await capture("envelope-native-mouse-hover-before-drop-1366");
  await send("Input.dispatchDragEvent",{type:"drop",...mouse.envelope,data:dragData});
  await send("Input.dispatchMouseEvent",{type:"mouseReleased",...mouse.envelope,button:"left",buttons:0,clickCount:1});
  await send("Input.setInterceptDrags",{enabled:false});await wait(650);
  assert.ok(await evaluate("document.querySelector('.c2-envelope.has-money:not(.is-open) .c2-envelope-copy strong')?.textContent==='200.000đ'"),"Real mouse drop did not replace the amount and close the lid");
  results.push({status:"PASS",completed:["Real native mouse drag opens a filled envelope before drop despite pointercancel", "Drop replaces the amount and closes the lid"]});

  await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send("Emulation.setTouchEmulationEnabled",{enabled:true,maxTouchPoints:1});
  await load("budget");
  const coords=await evaluate("(() => {const center=e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}};return {note:center(document.querySelector('.c2-amount')),envelope:center(document.querySelector('.c2-envelope'))};})()");
  await send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{...coords.note,id:1}]});
  await wait(230);
  await send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{...coords.envelope,id:1}]});
  await wait(350);
  assert.ok(await evaluate("!!document.querySelector('.c2-envelope.is-receiving') && !!document.querySelector('.c2-drag-note')"),"Real touch hold/drag does not open the target envelope");
  await capture("envelope-touch-open-390");
  await send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await wait(650);
  assert.ok(await evaluate("document.querySelectorAll('.c2-envelope.has-money:not(.is-open)').length===1 && document.querySelectorAll('.c2-envelope:not(.has-money).is-open').length===5 && !document.querySelector('.c2-drag-note')"),"Touch drop must close the filled envelope while empty envelopes stay open");
  const cancel=await evaluate("(() => {const e=document.querySelector('.c2-amount:not(:disabled)'),r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()");
  await send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{...cancel,id:2}]});await wait(230);
  await send("Input.dispatchTouchEvent",{type:"touchCancel",touchPoints:[]});await wait(80);
  assert.ok(await evaluate("document.querySelectorAll('.c2-envelope.has-money').length===1 && !document.querySelector('.c2-drag-note') && !document.querySelector('.c2-envelope.is-receiving')"),"Canceled touch drag changed assignments or left a ghost");
  assert.ok(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),"Mobile horizontal overflow");
  await evaluate("document.querySelector('.c2-game').scrollTop=document.querySelector('.c2-game').scrollHeight");
  assert.ok(await evaluate("document.querySelector('.c2-footer').getBoundingClientRect().bottom<=innerHeight+1 && document.querySelector('.c2-footer').getBoundingClientRect().top>=0"),"Mobile cannot scroll to Check/Continue controls");
  results.push({status:"PASS",width:390,height:844,completed:["Real CDP touch hold, move, drop, lid close and cancellation", "Footer controls are reachable by scrolling"]});
  writeFileSync(path.join(folder,"results.json"),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
} catch(error) {
  console.error(error);process.exitCode=1;
} finally {
  for(const task of pending.values())clearTimeout(task.timer);
  socket?.close();browser.kill();
  server.httpServer?.closeAllConnections();
  await server.close();
}
process.exit(process.exitCode??0);
