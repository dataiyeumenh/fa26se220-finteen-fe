import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp, readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir=path.dirname(fileURLToPath(import.meta.url));
const titles=['Public','Parent','Teacher','Learner','Studio','Admin'];
const graph=(await readdir(dir)).filter(f=>/^figure-3-\d.*\.mmd$/.test(f)).sort().map((file,i)=>({file:file.replace('.mmd',''),title:titles[i]}));
const server=createServer(async(req,res)=>{
  const file=path.basename(new URL(req.url,'http://localhost').pathname)||'index.html';
  try{const bytes=await readFile(path.join(dir,file));res.setHeader('Content-Type',file.endsWith('.svg')?'image/svg+xml':file.endsWith('.html')?'text/html; charset=utf-8':'text/plain');res.end(bytes);}
  catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const profile=await mkdtemp(path.join(tmpdir(),'rp3-flow-review-'));
const chrome=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',[
  '--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--hide-scrollbars','about:blank'
],{windowsHide:true,stdio:'ignore'});
let launchError;chrome.on('error',error=>{launchError=error;});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let ws;
try{
  let port;
  for(let i=0;i<100;i++){if(launchError)throw launchError;try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(200);}}
  if(!port)throw new Error('Chrome did not start');
  const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  let id=0;const pending=new Map();
  const send=(method,params={})=>new Promise((resolve,reject)=>{const key=++id;const timer=setTimeout(()=>{pending.delete(key);reject(new Error('CDP timeout '+method));},45000);pending.set(key,{resolve,reject,timer});ws.send(JSON.stringify({id:key,method,params}));});
  ws.onmessage=event=>{const msg=JSON.parse(event.data);const item=pending.get(msg.id);if(!item)return;pending.delete(msg.id);clearTimeout(item.timer);msg.error?item.reject(new Error(msg.error.message)):item.resolve(msg.result);};
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result?.value;};
  await send('Page.enable');await send('Runtime.enable');
  const url=`http://127.0.0.1:${server.address().port}/index.html`;
  await send('Page.navigate',{url});
  for(let i=0;i<50;i++){if(await evaluate('document.readyState === "complete"'))break;await delay(100);}
  await evaluate(`(async()=>{
    window.mermaid=(await import('https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs')).default;
    const {default:elkLayouts}=await import('https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0.1.9/dist/mermaid-layout-elk.esm.min.mjs');
    window.mermaid.registerLayoutLoaders(elkLayouts);
    window.mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',layout:'elk',
      themeVariables:{fontFamily:'Arial, sans-serif',fontSize:'22px',primaryColor:'#eff6ff',primaryTextColor:'#172554',primaryBorderColor:'#64748b',lineColor:'#64748b',edgeLabelBackground:'#ffffff',clusterBkg:'#f8fafc',clusterBorder:'#cbd5e1'},
      flowchart:{htmlLabels:true,curve:'basis',nodeSpacing:26,rankSpacing:82,padding:18,useMaxWidth:false}
    });
  })()`);
  const results=[],layouts=[],renders=[];
  for(const figure of graph){
    const mmd=(await readFile(path.join(dir,figure.file+'.mmd'),'utf8'))+`
    classDef screen fill:#eff6ff,stroke:#64748b,stroke-width:1.5px,color:#172554
    classDef action fill:#fff,stroke:#94a3b8,stroke-width:1.5px,color:#334155
`;
    await evaluate(`window.mermaid.parse(${JSON.stringify(mmd)}).then(()=>true)`);
    const render=await evaluate(`(async()=>{
      const {svg}=await window.mermaid.render(${JSON.stringify(figure.file)},${JSON.stringify(mmd)});
      document.body.style.cssText='margin:0;padding:24px;background:white';document.body.innerHTML=svg;
      await document.fonts.ready;
      const element=document.querySelector('svg');element.style.maxWidth='none';
      const box=element.getBoundingClientRect();
      const layoutNodes=[...element.querySelectorAll('g.node')].map(n=>{
        const b=n.getBoundingClientRect();
        const label=n.querySelector('.nodeLabel');
        return {id:n.id.replace(/^flowchart-/,'').replace(/-\\d+$/,''),kind:n.classList.contains('action')?'action':'screen',label:label?.innerText||label?.textContent||'',x:b.x-box.x,y:b.y-box.y,width:b.width,height:b.height};
      });
      const layoutEdges=[...element.querySelectorAll('path.flowchart-link')].map(p=>{
        const ids=p.id.split('_');
        const points=JSON.parse(atob(p.dataset.points)).map(pt=>{
          const local=new DOMPoint(pt.x,pt.y).matrixTransform(p.getScreenCTM());
          return {x:local.x-box.x,y:local.y-box.y};
        });
        return {source:ids[1],target:ids[2],points};
      });
      return {svg:new XMLSerializer().serializeToString(element),width:Math.ceil(box.width),height:Math.ceil(box.height),nodes:layoutNodes.length,edges:layoutEdges.length,layoutNodes,layoutEdges};
    })()`);
    figure.width=render.width;figure.height=render.height;
    const labels=await evaluate(`(()=>{const svg=document.querySelector('svg');const vb=svg.viewBox.baseVal;return [...svg.querySelectorAll('text')].filter(t=>{const b=t.getBBox();return b.x<0||b.y<0||b.x+b.width>vb.width||b.y+b.height>vb.height}).map(t=>t.textContent);})()`);
    if(labels.length)throw new Error('Clipped labels '+figure.file+': '+labels.join(', '));
    const labelsByPair=new Map([...mmd.matchAll(/^\s*(\w+)\s*-->\|([^|]+)\|\s*(\w+)/gm)].map(m=>[m[1]+'|'+m[3],m[2]]));
    for(const edge of render.layoutEdges)edge.label=labelsByPair.get(edge.source+'|'+edge.target)||'';
    layouts.push({file:figure.file,title:figure.title,width:figure.width,height:figure.height,nodes:render.layoutNodes,edges:render.layoutEdges});
    renders.push(render);
    results.push({file:figure.file,mermaidParsed:true,mermaidRendered:true,curve:'basis',nodes:render.nodes,edges:render.edges,width:figure.width,height:figure.height,clippedLabels:labels});
    console.log(figure.file+': Mermaid rendered '+figure.width+'x'+figure.height+', '+render.nodes+' nodes');
  }
  // Trim each graph without scaling its content; move the legend close to it.
  const makeLegend=(legendX,legendY)=>`<g font-family="Arial,sans-serif" font-size="22" text-anchor="middle"><rect x="${legendX}" y="${legendY}" width="280" height="44" fill="#eff6ff" stroke="#64748b" stroke-width="1.5"/><text x="${legendX+140}" y="${legendY+29}" fill="#172554">Screen / tab (SC)</text><rect x="${legendX+330}" y="${legendY}" width="380" height="44" rx="22" fill="white" stroke="#94a3b8" stroke-width="1.5"/><text x="${legendX+520}" y="${legendY+29}" fill="#334155">Action / form / dialog</text></g>`;
  for(const [index,render] of renders.entries()){
    const figure=layouts[index];
    const canvasWidth=Math.ceil(Math.max(render.width,710)+48);
    const canvasHeight=Math.ceil(render.height+116);
    const legendY=Math.ceil(render.height+48),legendX=(canvasWidth-710)/2;
    const legend=makeLegend(legendX,legendY);
    const x=(canvasWidth-render.width)/2,y=24;
    const inner=render.svg.replace('<svg ',`<svg x="${x}" y="${y}" `);
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}"><rect width="100%" height="100%" fill="white"/>${inner}${legend}</svg>`;
    await writeFile(path.join(dir,figure.file+'.svg'),svg);
    await send('Emulation.setDeviceMetricsOverride',{width:canvasWidth,height:canvasHeight,deviceScaleFactor:2,mobile:false});
    await evaluate(`document.body.style.cssText='margin:0;padding:0;line-height:0;background:white';document.body.innerHTML=${JSON.stringify(svg)};document.fonts.ready.then(()=>true)`);
    const proof=await evaluate(`(()=>{
      const root=document.querySelector('svg'),box=root.getBoundingClientRect();
      const nodes=[...root.querySelectorAll('g.node')];
      return {fontSizes:[...new Set(nodes.map(n=>getComputedStyle(n.querySelector('.nodeLabel')).fontSize))],
        bounds:nodes.map(n=>{const b=n.getBoundingClientRect();return {id:n.id,x:b.x-box.x,y:b.y-box.y,width:b.width,height:b.height};}),
        figureTitles:[...root.querySelectorAll('text,.nodeLabel')].filter(n=>/Figure\\s+3-/i.test(n.textContent)).length};
    })()`);
    if(proof.fontSizes.length!==1||proof.fontSizes[0]!=='22px')throw new Error('Inconsistent font in '+figure.file);
    if(proof.figureTitles)throw new Error('Figure title inside '+figure.file);
    if(proof.bounds.some(n=>n.x<0||n.y<0||n.x+n.width>canvasWidth||n.y+n.height>legendY-16))throw new Error('Node clipped or overlapping legend: '+figure.file);
    const png=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await writeFile(path.join(dir,figure.file+'.png'),Buffer.from(png.data,'base64'));
    for(const n of figure.nodes){n.x+=x;n.y+=y;}
    for(const edge of figure.edges)for(const point of edge.points){point.x+=x;point.y+=y;}
    figure.width=canvasWidth;figure.height=canvasHeight;
    figure.legendX=legendX;figure.legendY=legendY;
    Object.assign(results[index],{width:canvasWidth,height:canvasHeight,fontSize:22,measuredFontSizes:proof.fontSizes,graphScale:1,legend:true,titleInsideImage:false,pngWidth:canvasWidth*2,pngHeight:canvasHeight*2});
  }
  const xml=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
  let native='<mxfile host="app.diagrams.net" type="device">';
  for(const f of layouts){
    const {legendX,legendY}=f;
    let page=`<diagram id="${f.file}" name="${f.title}"><mxGraphModel page="1" pageWidth="${f.width}" pageHeight="${f.height}"><root><mxCell id="0"/><mxCell id="1" parent="0"/>`;
    const nodeMap=new Map(f.nodes.map(n=>[n.id,n]));
    for(const n of f.nodes){
      const fill=n.kind==='screen'?'#eff6ff':'#ffffff';
      const shape=n.kind==='action'?'rounded=1;arcSize=50;':'rounded=0;';
      page+=`<mxCell id="${n.id}" value="${xml(n.label).replace(/\n/g,'&lt;br&gt;')}" style="${shape}whiteSpace=wrap;html=1;fontFamily=Arial;fontSize=22;fillColor=${fill};strokeColor=#64748b;fontColor=#172554;" vertex="1" parent="1"><mxGeometry x="${n.x}" y="${n.y}" width="${n.width}" height="${n.height}" as="geometry"/></mxCell>`;
    }
    for(const [i,e] of f.edges.entries()){
      const a=nodeMap.get(e.source),b=nodeMap.get(e.target);if(!a||!b)throw new Error('Unresolved draw.io edge '+e.source+' → '+e.target);
      const first=e.points[0],last=e.points.at(-1);
      const style=`edgeStyle=none;curved=1;rounded=1;endArrow=block;endFill=1;strokeColor=#64748b;fontFamily=Arial;fontSize=19;labelBackgroundColor=#ffffff;exitX=${(first.x-a.x)/a.width};exitY=${(first.y-a.y)/a.height};entryX=${(last.x-b.x)/b.width};entryY=${(last.y-b.y)/b.height};`;
      const points=e.points.slice(1,-1).map(p=>`<mxPoint x="${p.x}" y="${p.y}"/>`).join('');
      page+=`<mxCell id="e${i}" value="${xml(e.label)}" style="${style}" edge="1" source="${e.source}" target="${e.target}" parent="1"><mxGeometry relative="1" as="geometry"><Array as="points">${points}</Array></mxGeometry></mxCell>`;
    }
    for(const item of [{id:'legendScreen',label:'Screen / tab (SC)',x:legendX,width:280,action:false},{id:'legendAction',label:'Action / form / dialog',x:legendX+330,width:380,action:true}]){
      page+=`<mxCell id="${item.id}" value="${xml(item.label)}" style="rounded=${item.action?1:0};arcSize=50;html=1;fontFamily=Arial;fontSize=22;fillColor=${item.action?'#ffffff':'#eff6ff'};strokeColor=#64748b;fontColor=#172554;" vertex="1" parent="1"><mxGeometry x="${item.x}" y="${legendY}" width="${item.width}" height="44" as="geometry"/></mxCell>`;
    }
    page+='</root></mxGraphModel></diagram>';
    native+=page;
    await writeFile(path.join(dir,f.file+'.drawio'),'<mxfile host="app.diagrams.net" type="device">'+page+'</mxfile>');
  }
  native+='</mxfile>';
  await writeFile(path.join(dir,'report3-screen-flows.drawio'),native);
  await writeFile(path.join(dir,'graph.json'),JSON.stringify(layouts,null,2)+'\n');
  await send('Page.navigate',{url});
  for(let i=0;i<100;i++){if(await evaluate('document.readyState === "complete" && [...document.images].every(i=>i.complete && i.naturalWidth>0)'))break;await delay(100);}
  await evaluate('document.fonts.ready.then(()=>true)');
  await evaluate(`(()=>{const style=document.createElement('style');style.textContent='@media print{@page{size:A3 landscape;margin:12mm}section{height:270mm;box-sizing:border-box}h2{display:none!important}img{width:100%;height:260mm;max-height:260mm;object-fit:contain}}';document.head.append(style)})()`);
  const pdf=await send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
  await writeFile(path.join(dir,'report3-screen-flows-review.pdf'),Buffer.from(pdf.data,'base64'));
  // A compact overview is for review navigation; full-resolution files remain separate.
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1900,deviceScaleFactor:1,mobile:false});
  await evaluate(`document.querySelector('h1').remove();document.body.style.padding='16px';document.querySelector('main').style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:16px';for(const s of document.querySelectorAll('section')){s.style.cssText='margin:0;padding:12px;height:580px;overflow:hidden';s.querySelector('h2').style.display='none';s.querySelector('img').style.cssText='width:100%;height:536px;object-fit:contain;object-position:top';}`);
  const overview=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:1440,height:1880,scale:1}});
  await writeFile(path.join(dir,'review-overview.png'),Buffer.from(overview.data,'base64'));
  await writeFile(path.join(dir,'validation.json'),JSON.stringify({draftVersion:4,engine:'Mermaid 11.12.0 / ELK 0.1.9 / basis curves',googleDocsModified:false,symbolTypes:2,trimmed:true,legendGap:24,fontSize:22,graphScale:1,figures:results},null,2)+'\n');
}finally{ws?.close();chrome.kill();await new Promise(resolve=>server.close(resolve));}
