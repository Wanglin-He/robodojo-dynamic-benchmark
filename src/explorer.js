const bases={
 A:{name:'分类放篮子',key:'classify_objects',video:'media/A.mp4',poster:'media/A.jpg'},
 B:{name:'扔瓶子',key:'put_bottles_into_dustbin',video:'media/B.mp4',poster:'media/B.jpg'},
 C:{name:'倒水',key:'pour_liquid_into_cup',video:'media/C.mp4',poster:'media/C.jpg'},
 D:{name:'叠积木',key:'stack_blocks',video:'media/D.mp4',poster:'media/D.jpg'}
};
// Historical IDs remain explicit so the old category 2 is never confused with new category 2.
const legacyFamilies=[
 {id:1,name:'尚未交互的任务对象发生变化',short:'对象先变，动作要更新',summary:'机器人开始行动或接近目标时，尚未操作的物体改变位置或姿态。',tasks:[
  {id:'1A',base:'A',title:'首个物体入篮后，其余物体换位',text:'第一个物体被放进篮子的那一刻，桌上其余等待被抓的物体全部瞬间换位，尽量换到别类物体原来的位置。',trigger:'第一个物体放进篮子并放稳时',change:'桌上其余待抓物体瞬间互换位置',observe:'是否更新抓取位置并保持分类目标。'},
  {id:'1B',base:'B',title:'每个站立瓶子被抓前放倒',text:'开始时，瓶子全部站立在桌面；每当张开的夹爪正要抓一个站立的瓶子时，这个瓶子被放倒（每个瓶子最多一次）。',trigger:'张开的夹爪正要抓某个站立瓶子时',change:'该瓶子朝远离夹爪的方向倒下',observe:'是否重新定位目标并调整抓取姿态。',note:'初始全站立是本任务的前置条件；视频展示原始扔瓶基线。'},
  {id:'1C',base:'C',title:'拿起瓶子后，接收杯远离 10 cm',text:'瓶子被拿起（离桌约 5 cm）以后，杯子朝着远离机械臂的方向移动 10 cm。',trigger:'瓶子被拿起后',change:'杯子沿远离机械臂方向移动 10 cm',observe:'是否更新接收杯位置并重新对准。'},
  {id:'1D',base:'D',title:'拿起第一块后，其余木块挪开',text:'第一块木块被拿起后，其余还没被碰过的木块各自平移 8–10 cm 到新的空位。',trigger:'第一块木块被拿起时',change:'未被碰过的木块各自移到新位置',observe:'是否重新定位木块并继续堆叠。'}]},
 {id:2,name:'期间出现多余物体干扰',short:'额外物体进入执行过程',summary:'原任务继续进行，但路径、操作空间或视觉场景出现额外物体。',tasks:[
  {id:'2A',base:'A',title:'运输中，麦片盒挡住或靠近',text:'机械臂运输中，麦片盒挡住或者靠近机械臂。',trigger:'机械臂运输物体过程中',change:'麦片盒挡住或靠近机械臂',observe:'是否应对新增障碍并继续分类放置。'},
  {id:'2B',base:'B',title:'垃圾桶口被遮挡 50%',text:'垃圾桶口被一个物体遮挡 50%。',trigger:'具体施加时刻待实现时细化',change:'额外物体遮挡垃圾桶口的 50%',observe:'是否利用剩余开口完成投放。'},
  {id:'2C',base:'C',title:'三个异色移动杯子出现',text:'倒水的过程中，桌面上出现三个不同颜色的移动的杯子。',trigger:'倒水过程中',change:'桌面出现三个不同颜色的移动杯子',observe:'是否保持正确接收杯目标，不被额外杯子干扰。'},
  {id:'2D',base:'D',title:'积木被 cover 遮住 3 s',text:'当机械臂打算抓取第二块积木时，用一个 cover 盖住一块积木，停止 3 s 后 cover 消失；第三块也适用。',trigger:'准备抓取第二块积木；第三块同样适用',change:'cover 盖住一块积木，停留 3 s 后消失',observe:'是否处理临时遮挡，并在 cover 消失后继续堆叠。'}]},
 {id:3,name:'正在交互物体出现状况',short:'当前操作需要重新调整',summary:'正在搬运、交接、倾倒或放置的过程中，物体姿态或目标关系发生变化。',tasks:[
  {id:'3A',base:'A',title:'夹持物体倾斜但未掉落',text:'物体在夹爪中倾斜，但没掉下来，模型需要调整放置。',trigger:'物体处于夹爪中时',change:'夹持物体倾斜但不掉落',observe:'是否根据新的物体姿态调整放置。'},
  {id:'3B',base:'B',title:'瓶子偏斜，接收手重新对准',text:'机械臂手里的瓶子突然偏斜，接收手必须重新对准。',trigger:'持瓶并准备双臂交接时',change:'手中的瓶子突然偏斜',observe:'接收手是否重新对准并完成交接。'},
  {id:'3C',base:'C',title:'倒水时，接收杯缓慢移动',text:'正在倒水时，杯子缓慢移动，看机械臂是否跟随。',trigger:'正在倒水时',change:'接收杯缓慢移动',observe:'机械臂是否跟随接收杯并继续倒水。'},
  {id:'3D',base:'D',title:'放置前姿态扰动，重新对齐',text:'积木在准备被放置时，姿态扰动，需重新对齐。',trigger:'积木准备被放置时',change:'待放置积木受到姿态扰动',observe:'是否重新对齐并完成稳定堆叠。'}]},
 {id:4,name:'已完成步骤被破坏',short:'发现进度回退，补做步骤',summary:'已经取得的中间成果被外部事件撤销，模型需要重新检查并恢复任务状态。',tasks:[
  {id:'4A',base:'A',title:'已分类物体被放入错误篮子',text:'把已分类物体放入另一个已有不同类别物体的篮子，使分类结果混杂。',trigger:'物体已经被分类后',change:'将物体放入已有其他类别物体的篮子',observe:'是否发现分类混杂并纠正归属。'},
  {id:'4B',base:'B',title:'已丢弃瓶子被放回桌面',text:'一个已被丢弃的瓶子，被放回桌面。',trigger:'瓶子已经被丢弃后',change:'将一个已丢弃瓶子放回桌面',observe:'是否重新处理返回桌面的瓶子。'},
  {id:'4C',base:'C',title:'两杯倒水，第一杯成果撤销',text:'桌上有两个杯子，指令要求给两个杯子都倒水；第一杯倒好后，杯里的液体被清空，等瓶子立起来后回到瓶中，可以重新倒。',trigger:'第一杯装到全部液体的 25%，且 0.5 秒内不再增加时',change:'清空第一杯，液体回到瓶中；成功条件为两个杯子各装有至少 40% 倒出的液体',observe:'是否检查第一杯并补做已失效的步骤。',note:'第二个杯子放在原杯子背向瓶子的一侧，中心距 15 cm。25% 和 40% 为暂定值。当前视频只演示原始 C 倒水任务；两杯版本需另测无干扰对照。'},
  {id:'4D',base:'D',title:'取第三块时，上面那块被推落',text:'两块积木叠好后，机械臂去取第三块时，上面那块被推落，下面那块基本留在原位。',trigger:'两块已叠好、机械臂去取第三块时',change:'上面那块被推落，叠好的结构被破坏',observe:'是否返回修复已有结构，而非继续原放置动作。'}]}
];
const extraModules=Object.fromEntries(legacyFamilies[1].tasks.map(t=>[t.base,t]));
const extraLabels={A:'麦片盒干扰',B:'桶口遮挡 50%',C:'三个异色移动杯子',D:'cover 遮盖 3 s'};
const families=[legacyFamilies[0],legacyFamilies[2],legacyFamilies[3]].map((legacy,index)=>{
 const id=index+1;
 const singles=legacy.tasks.map(t=>({...t,id:`${id}${t.base}`,legacyId:t.id,kind:'single'}));
 const combined=singles.map(t=>{
  const extra=extraModules[t.base];
  return {...t,id:`${id}.1${t.base}`,kind:'combined',parentId:t.id,extraLegacyId:extra.id,
   title:`${t.title} ＋ ${extraLabels[t.base]}`,
   text:`同一回合保留原事件：${t.text} 另叠加额外物体干扰：${extra.text}`,
   trigger:`原事件：${t.trigger}。额外干扰：${extra.trigger}。两者的相对时序待细化，不默认同时触发。`,
   change:`${t.change}；另加：${extra.change}`,
   observe:`${t.observe} ${extra.observe}`,
   note:[t.note,'这是独立新增的组合任务，不替代原任务；具体组合时序与强度尚未验证。',t.base==='C'?'三个新杯子是干扰物，不替换原接收杯，也不增加倒水目标。':'',t.base==='D'?'重试或修复过程中是否再次触发 cover 尚待定义，不默认无限重复。':''].filter(Boolean).join(' ')};
 });
 return {...legacy,id,legacyId:legacy.id,tasks:singles.flatMap((t,i)=>[t,combined[i]])};
});
const modelData=[
 ['InternW0-Δ','世界动作模型 · 记忆',[8,98,68,75]],['Simate-beta','带记忆策略',[54,100,57,69]],
 ['Awomo-0.5','世界动作模型',[21,91,64,75]],['Rex-M1 Preview','VLA',[42,91,73,48]],
 ['Liber-0 Preview','世界动作模型',[9,97,57,72]],['G0.5','VLA',[4,94,55,43]],
 ['π0.5','VLA 基线',[13,69,28,13]],['X-VLA','小型 VLA 基线',[1,62,27,15]]
];

const simateVideos=Object.fromEntries([1,2,3].flatMap(f=>Array.from('ABCD',base=>{
 const id=`${f}${base}`;return [id,{video:`media/simate/grid_dyn${id}.mp4`,poster:`media/simate/${id}.jpg`}];
})));
// Filenames use underscores; site IDs use periods. Only supplied combinations are listed.
const combinedVideoIds=['1.1A','1.1B','1.1C','1.1D','2.1A','2.1B','2.1C','2.1D','3.1A','3.1B','3.1C','3.1D'];
for(const id of combinedVideoIds)simateVideos[id]={video:`media/simate/grid_dyn${id.replace('.','_')}.mp4`,poster:`media/simate/${id}.jpg`};
function taskMedia(t){
 const dynamic=simateVideos[t.id];
 return dynamic?{...dynamic,dynamic:true,label:'Simate 动态实验视频',playLabel:'▶ 播放实验视频',preview:`${t.id} Simate 动态实验视频`,caption:`▶ ${t.id} · Simate`,kicker:`SIMATE · TASK ${t.id}`,status:`点击播放 ${t.id} 的 Simate 动态实验录像。视频由项目提供，单段展示不代表统计成功率。`}:{...bases[t.base],dynamic:false,label:'无干扰基线视频',playLabel:'▶ 播放基线',preview:`${t.base} ${bases[t.base].name}基线视频`,caption:`▶ ${t.base} ${bases[t.base].name} · 基线`,kicker:`BASE TASK · ${t.base}`,status:`点击视频播放。此视频用于理解基础任务，不展示 ${t.id} 的动态干扰。`};
}
function taskDisplayNote(t){
 if(!simateVideos[t.id])return t.note;
 return t.note?.replace('视频展示原始扔瓶基线。','视频展示 Simate 在本动态任务中的实验。').replace('当前视频只演示原始 C 倒水任务；','当前视频展示 Simate 的本动态任务实验；');
}

const $=s=>document.querySelector(s);
const allTasks=families.flatMap(f=>f.tasks);
let state={level:'overview',family:null,task:null};
let lastFocus=null;
const dialog=$('#focus-panel');
function img(t,cls=''){const m=taskMedia(t);return `<img class="${cls}" src="${m.poster}" alt="${m.preview}预览" loading="lazy">`;}
function taskPairs(f){return f.tasks.filter(t=>t.kind==='single').map(parent=>({parent,child:f.tasks.find(t=>t.parentId===parent.id)}));}
function overviewTask(t,f){return `<div class="leaf-row ${t.kind}"><button class="leaf-node" data-node="t${t.id}" data-parent="${t.kind==='combined'?`t${t.parentId}`:`f${f.id}`}" data-task="${t.id}" aria-label="放大任务 ${t.id} ${t.title}" title="${t.title}"><b>${t.id}</b><span>${t.kind==='combined'?`新增：＋ ${extraLabels[t.base]}`:t.title}</span></button><span class="mini-connector" aria-hidden="true"></span><button class="thumb-node" data-task="${t.id}" aria-label="${simateVideos[t.id]?`查看 ${t.id} 的 Simate 动态实验视频`:`查看 ${t.id} 的 ${t.base} 基线视频`}">${img(t)}<span>▶ ${simateVideos[t.id]?t.id:t.base}</span></button></div>`;}
function branchTask(t){return `<div class="branch-row ${t.kind}"><button class="branch-task" data-node="${t.id}" data-parent="${t.kind==='combined'?t.parentId:'family'}" data-task="${t.id}"><span class="task-id">${t.id}</span><div><h3>${t.kind==='combined'?`新增：＋ ${extraLabels[t.base]}`:t.title}</h3><p>${t.kind==='combined'?`属于 ${t.parentId}：保留原事件，再叠加${extraModules[t.base].text}`:t.text}</p></div><span class="zoom-mark">↗</span></button><span class="branch-to-video" aria-hidden="true">→</span><button class="branch-video" data-task="${t.id}" aria-label="${simateVideos[t.id]?`打开 ${t.id} 的 Simate 动态实验视频`:`打开 ${t.id} 和 ${t.base} 基线视频`}">${img(t)}<span>${taskMedia(t).caption}</span></button></div>`;}
function taskOrigin(t){return t.kind==='combined'?`新增组合 · ${t.parentId} ＋ ${t.base} 额外干扰模块（旧 ${t.extraLegacyId}）`:`保留原任务 · ${t.legacyId===t.id?'编号不变':`旧 ${t.legacyId} → 新 ${t.id}`}`;}
function renderOverview(){
 $('#overview-tree').innerHTML=`<svg class="connectors" aria-hidden="true"></svg><div class="root-node" data-node="root"><span>BENCHMARK</span><strong>RoboDojo<br>动态干扰 Benchmark</strong><p>3 类核心事件<br>本页：A–D · 24 项任务<br>12 项保留 ＋ 12 项新增</p></div>${families.map(f=>`<button class="family-node" data-node="f${f.id}" data-parent="root" data-family="${f.id}" style="grid-row:${f.id}"><span class="family-number">0${f.id}</span><strong>${f.name}</strong><small>4 项原任务 · 各含 1 项新增 <span>点击放大 ↗</span></small></button><div class="leaf-group" style="grid-row:${f.id}">${taskPairs(f).map(({parent,child})=>`<div class="task-pair" role="group" aria-label="${parent.id} 及其新增任务">${overviewTask(parent,f)}${overviewTask(child,f)}</div>`).join('')}</div>`).join('')}`;
 $('#extra-modules').innerHTML=Object.values(extraModules).map(t=>`<article><span>${t.base} 模块 · 来自旧 ${t.id}</span><h3>${extraLabels[t.base]}</h3><p>${t.text}</p></article>`).join('');
 requestAnimationFrame(()=>drawLines($('#overview-tree')));
}
function drawLines(container){
 const svg=container.querySelector('.connectors');if(!svg)return;
 const box=container.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
 const paths=[];container.querySelectorAll('[data-parent]').forEach(node=>{
  const source=container.querySelector(`[data-node="${node.dataset.parent}"]`);if(!source)return;
  const a=source.getBoundingClientRect(),b=node.getBoundingClientRect();
  if(node.closest('.combined')){
   const start=source.classList.contains('leaf-node')?source.closest('.leaf-row').getBoundingClientRect():a;
   const x=start.right-box.left,y=a.top+a.height/2-box.top,childX=b.left-box.left,childY=b.top+b.height/2-box.top;
   paths.push(`<path d="M ${x} ${y} L ${childX} ${childY}"/>`);return;
  }
  const x1=a.right-box.left,y1=a.top+a.height/2-box.top,x2=b.left-box.left,y2=b.top+b.height/2-box.top,mid=(x1+x2)/2;
  paths.push(`<path d="M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}"/>`);
 });svg.innerHTML=paths.join('');
}
function stopVideo(){dialog.querySelectorAll('video').forEach(v=>v.pause());}
function openFocus(){if(!dialog.open){lastFocus=document.activeElement;dialog.showModal();document.body.classList.add('focus-open');}}
function crumb(f,t){$('#breadcrumbs').innerHTML=`<button data-overview>Benchmark</button><span>/</span><button data-family="${f.id}">第 ${f.id} 类</button>${t?.parentId?`<span>/</span><button data-task="${t.parentId}">${t.parentId}</button>`:''}${t?`<span>/</span><span aria-current="page">${t.id}</span>`:''}`;}
function showFamily(id){
 const f=families.find(x=>x.id===Number(id));if(!f)return;stopVideo();state={level:'family',family:f.id,task:null};openFocus();crumb(f);
 $('#focus-content').innerHTML=`<div class="family-focus"><p class="focus-eyebrow">类别 → 原任务 → 所属新增任务 · 共 8 项</p><div class="family-canvas"><svg class="connectors" aria-hidden="true"></svg><div class="branch-parent" data-node="family"><span class="large-number">0${f.id}</span><h2 id="focus-title" tabindex="-1">${f.name}</h2><p>${f.summary}</p><p class="small-note">每行左侧是原任务，右侧是其 .1 新增任务，水平连线一一对应；窄屏可横向滚动。</p><div class="family-switch">${families.map(g=>`<button data-family="${g.id}" aria-label="查看第 ${g.id} 类" aria-pressed="${g.id===f.id}">${g.id}</button>`).join('')}</div></div><div class="branch-list">${taskPairs(f).map(({parent,child})=>`<div class="task-pair" role="group" aria-label="${parent.id} 及其新增任务">${branchTask(parent)}${branchTask(child)}</div>`).join('')}</div></div></div>`;
 dialog.scrollTop=0;$('#focus-help').textContent=`第 ${f.id} 类 / 共 ${families.length} 类 · 本类 ${f.tasks.length} 项任务`;
 requestAnimationFrame(()=>{drawLines(dialog.querySelector('.family-canvas'));$('#focus-title').focus({preventScroll:true});});
}
function showTask(id){
 const t=allTasks.find(t=>t.id===id);if(!t)return;const f=families.find(f=>f.tasks.includes(t)),b=bases[t.base],m=taskMedia(t),note=taskDisplayNote(t);
 stopVideo();state={level:'task',family:f.id,task:id};openFocus();crumb(f,t);
 $('#focus-content').innerHTML=`<div class="task-focus"><div class="task-detail"><button class="parent-link" data-family="${f.id}">← 第 ${f.id} 类 · ${f.name}</button><div class="detail-id">${t.id}</div><h2 id="focus-title" tabindex="-1">${t.title}</h2><p class="task-definition">${t.text}</p><dl><div><dt>触发</dt><dd>${t.trigger}</dd></div><div><dt>变化</dt><dd>${t.change}</dd></div><div><dt>观察</dt><dd>${t.observe}</dd></div></dl>${note?`<p class="task-note">${note}</p>`:''}<div class="sibling-nav" aria-label="同类别的任务">${f.tasks.map(s=>`<button data-task="${s.id}" aria-pressed="${s.id===t.id}">${s.id}</button>`).join('')}</div></div><div class="detail-arrow" aria-hidden="true">→</div><figure class="video-detail"><figcaption><div><span class="video-kicker">${m.kicker}</span><h3>${b.name}</h3><code>${b.key}</code></div><span class="baseline-tag">${m.label}</span></figcaption><video id="baseline-video" controls playsinline preload="metadata" poster="${m.poster}" aria-label="${m.dynamic?m.preview:`${t.base} ${b.name}原始基础任务视频`}"><source src="${m.video}" type="video/mp4">浏览器不支持视频，请使用下方链接打开。</video><p class="video-status" id="video-status" role="status">${m.status}</p><div class="video-tools"><button id="video-play" class="plain-button">${m.playLabel}</button><a href="${m.video}" target="_blank" rel="noreferrer">单独打开视频 ↗</a></div></figure></div>`;
 const video=$('#baseline-video');video.addEventListener('error',()=>{$('#video-status').textContent='视频加载失败，请确认 index.html 与 media 文件夹保存在一起。';});video.addEventListener('play',()=>{$('#video-play').textContent='Ⅱ 暂停';});video.addEventListener('pause',()=>{$('#video-play').textContent=m.playLabel;});
 $('#video-play').addEventListener('click',async()=>{if(!video.paused){video.pause();return;}try{await video.play();}catch{$('#video-status').textContent='请点击视频自带的播放按钮，或单独打开视频。';}});
 const detail=dialog.querySelector('.task-detail');
 if(t.kind==='combined')detail.querySelector('.parent-link').outerHTML=`<button class="parent-link" data-task="${t.parentId}">← 所属原任务 ${t.parentId}</button>`;
 detail.insertAdjacentHTML('afterbegin',`<p class="task-origin">${taskOrigin(t)}</p>`);
 const counterpart=t.kind==='combined'?t.parentId:`${f.id}.1${t.base}`;
 detail.querySelector('.sibling-nav').insertAdjacentHTML('beforebegin',`<button class="plain-button pair-link" data-task="${counterpart}">${t.kind==='combined'?'查看保留任务':'查看新增组合'} ${counterpart} ↗</button>`);
 dialog.scrollTop=0;$('#focus-help').textContent=`${t.id} / 本页 ${allTasks.length} 项任务 · ← → 切换同类任务`;
 requestAnimationFrame(()=>$('#focus-title').focus({preventScroll:true}));
}
function closeFocus(){stopVideo();dialog.close();document.body.classList.remove('focus-open');state={level:'overview',family:null,task:null};lastFocus?.focus({preventScroll:true});}
function back(){if(state.level!=='task'){closeFocus();return;}const t=allTasks.find(t=>t.id===state.task);t?.parentId?showTask(t.parentId):showFamily(state.family);}
document.addEventListener('click',e=>{const task=e.target.closest('[data-task]'),family=e.target.closest('[data-family]'),overview=e.target.closest('[data-overview]');if(task)showTask(task.dataset.task);else if(family)showFamily(family.dataset.family);else if(overview)closeFocus();});
$('#expand-first').addEventListener('click',()=>showFamily(1));$('#back-button').addEventListener('click',back);$('#close-button').addEventListener('click',closeFocus);dialog.addEventListener('cancel',e=>{e.preventDefault();back();});
dialog.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key)||e.target.closest('video')||e.altKey||e.metaKey||e.ctrlKey)return;const delta=e.key==='ArrowRight'?1:-1;e.preventDefault();if(state.level==='task'){const f=families.find(x=>x.id===state.family),i=f.tasks.findIndex(t=>t.id===state.task);showTask(f.tasks[(i+delta+f.tasks.length)%f.tasks.length].id);}else if(state.level==='family'){showFamily((state.family-1+delta+families.length)%families.length+1);}});
const means=modelData.map(m=>m[2].reduce((a,b)=>a+b,0)/4),maxima=[0,1,2,3].map(i=>Math.max(...modelData.map(m=>m[2][i]))),bestMean=Math.max(...means);
$('#model-table').innerHTML=`<caption>8 个模型在 A–D 原始基础任务上的成功率</caption><thead><tr><th scope="col">模型</th><th scope="col">类型</th>${Object.entries(bases).map(([key,b])=>`<th scope="col">${key}<span>${b.name}</span></th>`).join('')}<th scope="col">A–D 均值</th></tr></thead><tbody>${modelData.map(([name,type,scores],i)=>`<tr><th scope="row">${name}</th><td class="model-type">${type}</td>${scores.map((n,k)=>`<td><div class="bar-cell ${n===maxima[k]?'best':''}"><span class="bar-track" aria-hidden="true"><i style="width:${n}%"></i></span><span>${n}</span></div></td>`).join('')}<td class="mean ${means[i]===bestMean?'best':''}">${means[i].toFixed(1)}</td></tr>`).join('')}</tbody>`;
if(allTasks.length!==24||new Set(allTasks.map(t=>t.id)).size!==24||families.some(f=>f.tasks.length!==8))throw new Error('Task data mismatch');
renderOverview();new ResizeObserver(()=>{drawLines($('#overview-tree'));const c=dialog.querySelector('.family-canvas');if(c)drawLines(c);}).observe(document.body);
window.addEventListener('resize',()=>{drawLines($('#overview-tree'));const c=dialog.querySelector('.family-canvas');if(c)drawLines(c);});
