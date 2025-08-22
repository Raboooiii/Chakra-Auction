// ---------------------- State ----------------------

const state = {

  settings: { timerSeconds: 15, step50: 500, step100: 1000 },

  teams: [],

  players: [],

  selectedTeamId: null,

  selectedPlayerId: null, // table selection

  activePlayerId: null, // nominated

  currentBid: 0,

  leadingTeamId: null,

  timer: { interval: null, endAt: 0 },

  history: [] // stack of {type:'sale', playerId, teamId, price}

};


// Demo data (can be replaced via import)

function seedDemo(){

  state.teams = [

    mkTeam('Falcons', 30000, 12, 5),

    mkTeam('Titans', 30000, 12, 5),

    mkTeam('Warriors', 30000, 12, 5),

    mkTeam('Spartans', 30000, 12, 5)

  ];

  state.players = [

    mkPlayer('Arjun Kumar', 'B.Tech', '3', 'Male', 'Cricket', 500),

    mkPlayer('Riya Nair', 'B.Arch', '2', 'Female', 'Basketball', 500),

    mkPlayer('Meera Iyer', 'PhD', '1', 'Female', 'Volleyball', 500),

    mkPlayer('Vikram Patel', 'B.Tech', '4', 'Male', 'Football', 500),

    mkPlayer('Sameer Khan', 'M.Tech', '1', 'Male', 'Cricket', 500),

    mkPlayer('Ananya Rao', 'B.Tech', '2', 'Female', 'Football', 500)

  ];

  renderAll();

}


function mkTeam(name, initialBudget, maleSlots, femaleSlots){

  return { id: cid(), name, initialBudget, remainingBudget: initialBudget, maleSlots, femaleSlots };

}

function mkPlayer(name, course, year, gender, sports, baseValue){

  return { id: cid(), name, course, year, gender, sports, baseValue, status: 'Available', soldPrice: 0, soldTo: null };

}

const cid = (()=>{ let i=1; return ()=>"id"+(i++); })();


// ---------------------- Rendering ----------------------

function renderAll(){ renderTeams(); renderPlayers(); renderAuction(); }


function renderTeams(){

  const wrap = document.getElementById('teams');

  wrap.innerHTML = '';

  state.teams.forEach(t=>{

    const used = t.initialBudget - t.remainingBudget;

    const budgetPct = Math.min(100, (used / t.initialBudget) * 100 || 0);

    const el = document.createElement('div');

    el.className = 'team' + (state.selectedTeamId===t.id ? ' active' : '');

    el.innerHTML = `

      <div class="name">${escapeHtml(t.name)}</div>

      <div class="stat"><span>Remaining</span><b>₹${fmt(t.remainingBudget)}</b></div>

      <div class="bar" aria-label="Budget used"><span style="width:${budgetPct}%"></span></div>

      <div class="stat"><span>Male Slots</span><b>${t.maleSlots}</b></div>

      <div class="stat"><span>Female Slots</span><b>${t.femaleSlots}</b></div>

    `;

    el.onclick = ()=>{

      if(state.activePlayerId){

        // If there's a nominated player, clicking a team = bid

        state.selectedTeamId = t.id;

        placeBid(state.settings.step50); // Default bid increment

      } else {

        // No active player, just select the team

        state.selectedTeamId = t.id;

      }

      renderTeams();

      renderAuction();

    };


    wrap.appendChild(el);

  });

}


function renderPlayers(){

  const body = document.getElementById('playerBody');

  body.innerHTML = '';

 

  filteredPlayers().forEach(p=>{

    const tr = document.createElement('tr');

    tr.className = (state.activePlayerId===p.id)?'active-player':'';

    tr.tabIndex = 0;

    tr.onclick = ()=>{ state.selectedPlayerId = p.id; highlightSelection(tr); };

    tr.innerHTML = `

      <td>${escapeHtml(p.name)}</td>

      <td>${p.course}</td>

      <td>${p.year}</td>

      <td>${p.gender}</td>

      <td>${p.sports}</td>

      <td>₹${fmt(p.baseValue)}</td>

      <td>${renderStatus(p)}</td>

    `;

    body.appendChild(tr);

  });


  function filteredPlayers(){

    const q = document.getElementById('search').value.trim().toLowerCase();

    const course = document.getElementById('filterCourse').value;

    const year = document.getElementById('filterYear').value;

    const gender = document.getElementById('filterGender').value;

    const sports = document.getElementById('filterSports').value;

    const status = document.getElementById('filterStatus').value;


    return state.players.filter(p=>{

      if(q && !p.name.toLowerCase().includes(q)) return false;

      if(course && p.course !== course) return false;

      if(year && p.year !== year) return false;

      if(gender && p.gender !== gender) return false;

      if(sports && p.sports !== sports) return false;

      if(status){

        if(status==='Sold' && p.status!=='Sold') return false;

        if(status==='Available' && p.status!=='Available') return false;

        if(status==='Nominated' && p.status!=='Nominated') return false;

      }

      return true;

    });

  }

}


function renderStatus(p){

  if(p.status==='Sold'){

    return `<span class="chip">Sold: ${escapeHtml(getTeam(p.soldTo)?.name||'')}</span> <span class="chip">₹${fmt(p.soldPrice)}</span>`;

  }

  if(p.status==='Nominated'){

    return `<span class="chip">Nominated</span>`;

  }

  return `<span class="chip">Available</span>`;

}


function highlightSelection(tr){

  // remove old focus style

  document.querySelectorAll('#playerBody tr').forEach(x=>x.style.outline='none');

  tr.style.outline = '2px solid rgba(90,194,255,.8)';

}


function renderAuction(){

  const ap = state.players.find(p=>p.id===state.activePlayerId);

  document.getElementById('activePlayerLabel').textContent = ap ? `${ap.name} — ${ap.course} - ${ap.year} · ${ap.sports}` : 'No player nominated';

  document.getElementById('currentBid').textContent = '₹'+fmt(state.currentBid||0);

  const leadWrap = document.getElementById('leadingTeam');

  leadWrap.innerHTML='';

  if(state.leadingTeamId){

    const t = getTeam(state.leadingTeamId);

    const chip = document.createElement('div');

    chip.className='chip';

    chip.textContent = `Leading: ${t.name}`;

    leadWrap.appendChild(chip);

  }

  // Timer rendering

  const secLeft = Math.max(0, Math.ceil((state.timer.endAt - Date.now())/1000));

  document.getElementById('timeLeft').textContent = ap? secLeft: '--';

  const total = state.settings.timerSeconds || 1;

  const pct = ap? Math.max(0, Math.min(1, (secLeft/total))) : 0;

  document.getElementById('timer').style.background = `conic-gradient(var(--accent) ${pct*360}deg, #1e2a47 0deg)`;

}


// ---------------------- Auction Mechanics ----------------------

function nominateSelected(){

  const pid = state.selectedPlayerId;

  if(!pid) return alert('Select a player row first.');

  const p = state.players.find(p=>p.id===pid);

  if(!p || p.status!=='Available') return alert('Player must be Available.');

  state.activePlayerId = pid;

  p.status = 'Nominated';

  state.currentBid = p.baseValue;

  state.leadingTeamId = null;

  startTimer();

  renderAll();

}


function placeBid(increment){

  const p = getActivePlayer();

  if(!p) return alert('Nominate a player first.');

  if(!state.selectedTeamId) return alert('Select a team to bid.');

  const team = getTeam(state.selectedTeamId);

  const nextBid = (state.currentBid||0) + Math.max(0, Number(increment)||0);

  // pre-check capacity: budget and gender slot

  if(nextBid > team.remainingBudget){

    flash('Team over budget for this bid.'); return;

  }

  if(p.gender==='Male' && team.maleSlots<=0){ flash('No male slots left for this team.'); return; }

  if(p.gender==='Female' && team.femaleSlots<=0){ flash('No female slots left for this team.'); return; }

  state.currentBid = nextBid;

  state.leadingTeamId = team.id;

  restartTimer();

  renderAuction();

}


function sellToLeading(){

  const p = getActivePlayer();

  if(!p) return alert('No active player.');

  if(!state.leadingTeamId) return alert('No leading team.');

  const team = getTeam(state.leadingTeamId);

  const price = state.currentBid||0;

  // Final validation

  if(price>team.remainingBudget) return alert('Team cannot afford this player.');

  if(p.gender==='Male' && team.maleSlots<=0) return alert('No male slots left.');

  if(p.gender==='Female' && team.femaleSlots<=0) return alert('No female slots left.');

  // Apply sale

  team.remainingBudget -= price;

  if(p.gender==='Male') team.maleSlots -= 1; else team.femaleSlots -= 1;

  p.status = 'Sold'; p.soldPrice = price; p.soldTo = team.id;

  // history

  state.history.push({type:'sale', playerId:p.id, teamId:team.id, price});

  // Clear auction state

  stopTimer();

  state.activePlayerId = null; state.currentBid = 0; state.leadingTeamId = null;

  renderAll();

}


function undoLast(){

  const last = state.history.pop();

  if(!last) return alert('Nothing to undo.');

  if(last.type==='sale'){

    const p = getPlayer(last.playerId); const t = getTeam(last.teamId);

    if(!p||!t) return;

    // revert

    t.remainingBudget += last.price;

    const gender = p.gender==='Male' ? 'maleSlots':'femaleSlots';

    t[gender] += 1;

    p.status = 'Available'; p.soldPrice=0; p.soldTo=null;

    renderAll();

  }

}


function resetBid(){

  const p = getActivePlayer(); if(!p) return;

  state.currentBid = p.baseValue; state.leadingTeamId = null; restartTimer(); renderAuction();

}


function startTimer(){

  stopTimer();

  state.timer.endAt = Date.now() + state.settings.timerSeconds*1000;

  state.timer.interval = setInterval(()=>{

    const remaining = state.timer.endAt - Date.now();

    if(remaining<=0){

      stopTimer();

      // Auto-sell if there is a leading team, else just expire nomination

      if(state.leadingTeamId){ sellToLeading(); } else { clearNomination(); }

    } else { renderAuction(); }

  }, 200);

}

function restartTimer(){

  state.timer.endAt = Date.now() + state.settings.timerSeconds*1000; renderAuction();

}

function stopTimer(){ if(state.timer.interval){ clearInterval(state.timer.interval); state.timer.interval=null; } }

function clearNomination(){

  const p = getActivePlayer(); if(p){ p.status='Available'; }

  state.activePlayerId=null; state.currentBid=0; state.leadingTeamId=null; renderAll();

}


// ---------------------- Import / Export ----------------------

function openModal(id){ document.getElementById(id).style.display='flex'; }

function closeModal(id){ document.getElementById(id).style.display='none'; }


async function importPlayers(file){

  if(!file) return alert('Choose a file.');

  const text = await file.text();

  let imported = [];

  if(file.name.endsWith('.json')){

    const arr = JSON.parse(text);

    imported = arr.map(r=> mkPlayer(r.name||r.Name, r.course||r.Course, r.year||r.Year, r.gender||r.Gender, r.sports||r.Sports, Number(r.baseValue||r.BaseValue)||0));

  } else {

    imported = parseCSV(text).map(r=> mkPlayer(r.Name, r.Course, r.Year, r.Gender, r.Sports, Number(r.BaseValue)||0));

  }

  // Replace players (keep teams)

  state.players = imported.filter(Boolean);

  state.activePlayerId=null; state.currentBid=0; state.leadingTeamId=null;

  renderAll();

  flash('Players imported.');

}


async function importTeams(file){

  if(!file) return alert('Choose a file.');

  const text = await file.text();

  const arr = JSON.parse(text);

  state.teams = arr.map(r=>({

    id: cid(),

    name: r.name,

    initialBudget: Number(r.initialBudget),

    remainingBudget: Number(r.remainingBudget ?? r.initialBudget),

    maleSlots: Number(r.maleSlots),

    femaleSlots: Number(r.femaleSlots)

  }));

  renderAll();

  flash('Teams imported.');

}


function exportJSON(){

  const data = {

    settings: state.settings,

    teams: state.teams,

    players: state.players,

    history: state.history,

    exportedAt: new Date().toISOString()

  };

  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href=url; a.download='auction-export.json'; a.click();

  URL.revokeObjectURL(url);

}


function parseCSV(text){
  // basic CSV. Expects headers Name,Course,Year,Gender,Sports,BaseValue
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0);
  if(lines.length===0) return [];
  
  // Use a case-insensitive trim to get clean headers
  const headers = lines[0].split(',').map(h=>h.trim());
  
  // FIX 1: Make header matching flexible. It will find 'Sports' OR 'Interested Sports', etc.
  const idx = {
    Name: headers.indexOf('Name'),
    Course: headers.indexOf('Course'),
    Year: headers.indexOf('Year'),
    Gender: headers.indexOf('Gender'),
    Sports: Math.max(headers.indexOf('Sports'), headers.indexOf('Interested Sports')),
    BaseValue: Math.max(headers.indexOf('BaseValue'), headers.indexOf('Base Value'))
  };

  // Ensure critical headers were found
  if (idx.Name === -1 || idx.BaseValue === -1 || idx.Sports === -1) {
      alert("CSV parsing error: Could not find required headers (Name, Sports/Interested Sports, BaseValue/Base Value). Please check the file.");
      return [];
  }

  return lines.slice(1).map(line=>{
    const parts = line.split(',');
    if (parts.length < 6) return null; // Skip malformed lines

    // FIX 2: Handle multiple items in the sports column.
    // We assume the first 4 columns and the last column are always single values.
    // Everything in between is joined to form the 'Sports' string.
    const name      = (parts[0] || '').trim();
    const course    = (parts[1] || '').trim();
    const year      = (parts[2] || '').trim();
    const gender    = (parts[3] || '').trim();
    const baseValue = (parts[parts.length - 1] || '').trim(); // Base value is always the last part
    const sports    = (parts.slice(4, parts.length - 1).join(', ') || '').trim(); // Sports are everything in the middle

    // Reconstruct the object based on the expected headers from the import function
    return {
      Name: name,
      Course: course,
      Year: year,
      Gender: gender,
      Sports: sports,
      BaseValue: baseValue
    };
  }).filter(r=>r && r.Name); // Filter out any null or nameless rows
}


// ---------------------- Helpers ----------------------

function getTeam(id){ return state.teams.find(t=>t.id===id); }

function getPlayer(id){ return state.players.find(p=>p.id===id); }

function getActivePlayer(){ return state.players.find(p=>p.id===state.activePlayerId); }

function fmt(n){

  return (n||0).toLocaleString('en-IN');

}

function nominateRandom(){

  const available = state.players.filter(p=>p.status==='Available');

  if(available.length===0) return alert('No available players left.');

  const randomPlayer = available[Math.floor(Math.random()*available.length)];

  state.selectedPlayerId = randomPlayer.id;

  nominateSelected();

}


function escapeHtml(str){ return (str+'').replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }

function flash(msg){

  const b = document.createElement('div');

  b.textContent = msg; b.style.position='fixed'; b.style.bottom='16px'; b.style.left='50%'; b.style.transform='translateX(-50%)';

  b.style.background='rgba(0,0,0,.75)'; b.style.color='white'; b.style.padding='10px 14px'; b.style.borderRadius='10px'; b.style.zIndex='9999';

  document.body.appendChild(b); setTimeout(()=>{ b.style.transition='opacity .4s'; b.style.opacity='0'; setTimeout(()=>b.remove(),400); }, 1200);

}


// ---------------------- Events ----------------------

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('nominateBtn').onclick = nominateSelected;

    document.getElementById('randomNominateBtn').onclick = nominateRandom;


    document.getElementById('bid50').onclick = ()=> placeBid(state.settings.step50);

    document.getElementById('bid100').onclick = ()=> placeBid(state.settings.step100);

    document.getElementById('bidCustom').onclick = ()=>{

      const inc = Number(document.getElementById('customBid').value||0); if(inc<=0) return;

      placeBid(inc);

    };

    document.getElementById('sellBtn').onclick = sellToLeading;

    document.getElementById('resetBid').onclick = resetBid;

    document.getElementById('btnUndo').onclick = undoLast;


    ['search','filterCourse','filterYear','filterGender','filterSports','filterStatus'].forEach(id=>{

      document.getElementById(id).addEventListener('input', renderPlayers);

      document.getElementById(id).addEventListener('change', renderPlayers);

    });


    document.getElementById('btnImport').onclick = ()=> openModal('importModal');

    document.getElementById('btnExport').onclick = exportJSON;

    document.getElementById('btnSettings').onclick = ()=> openModal('settingsModal');


    document.getElementById('importPlayersBtn').onclick = ()=>{

      const f = document.getElementById('playersFile').files[0]; importPlayers(f);

    };

    document.getElementById('importTeamsBtn').onclick = ()=>{
      const f = document.getElementById('teamsFile').files[0]; importTeams(f);
    };

    document.getElementById('saveSettings').onclick = ()=>{
      state.settings.timerSeconds = Math.max(5, Number(document.getElementById('settingTimer').value)||15);
      state.settings.step50 = Math.max(500, Number(document.getElementById('settingStep50').value)||500);
      state.settings.step100 = Math.max(1000, Number(document.getElementById('settingStep100').value)||1000);
      closeModal('settingsModal');
      renderAuction();

    };


    // Keyboard helpers

    window.addEventListener('keydown', (e)=>{

      if(e.key==='Escape'){ closeModal('importModal'); closeModal('settingsModal'); }
      if(e.key==='Enter' && document.activeElement && document.activeElement.closest('#playerBody')){ nominateSelected(); }
      if(e.key==='ArrowRight'){ placeBid(state.settings.step50); }

    });

    seedDemo();
});
