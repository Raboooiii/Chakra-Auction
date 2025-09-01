// ---------------------- State ----------------------
const state = {
  settings: { timerSeconds: 15, step50: 1, step100: 10 },
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

// =================== LATEST PLAYER DATA INSERTED HERE ===================
function seedDemo(){
  state.teams = [
    mkTeam('Falcons', 400, 12, 5),
    mkTeam('Titans', 400, 12, 5),
    mkTeam('Warriors', 400, 12, 5),
    mkTeam('Spartans', 400, 12, 5)
  ];
  state.players = [
    mkPlayer('Ziyana Ahammed S A P', 'IMSc', '2', 'Female', 'Football, Badminton, Basket Ball, Volleyball, Handball, Table Tennis, Athletics', 'Participated in college levels', 1),
    mkPlayer('Tony George', 'MTech', '1', 'Male', 'Football, Badminton, Volleyball, Cricket', 'Nil', 1),
    mkPlayer('Thejus s', 'IMSc', '3', 'Male', 'Football, Badminton, Basket Ball, Kho-Kho, Handball, Cricket, Athletics', 'Speed-99 Ball control-99 Finishing-99', 1),
    mkPlayer('Theja R', 'IMSc', '2', 'Female', 'Basket Ball, Kho-Kho, Table Tennis', 'Nil', 1),
    mkPlayer('Sreenanda Sunil', 'IMSc', '1', 'Female', 'Badminton, Chess, Kho-Kho', 'I have participated international chess competition in 2018 conducted in St Alberts college Ernakulam', 1),
    mkPlayer('SNEHAL', 'IMSc', '3', 'Male', 'Football, Badminton, Volleyball, Kho-Kho, Table Tennis, Cricket, Athletics', 'NJN KORACH ADHIGAM SCN AAHN.. IPRAVSHYAM ONNUDE MOOD AAVM 🔥', 1),
    mkPlayer('Sivakanth J', 'IMSc', '1', 'Male', 'Football, Badminton, Basket Ball, Cricket', 'Football : school team Cricket : sub district team x2', 1),
    mkPlayer('Shreyas R', 'MTech', '2', 'Male', 'Football', '.......', 1),
    mkPlayer('Shiyas', 'IMSc', '4', 'Male', 'Football, Badminton, Volleyball, Kho-Kho, Table Tennis, Cricket', 'Nil', 1),
    mkPlayer('Salman Faris', 'IMSc', '4', 'Male', 'Badminton, Handball, Cricket', 'Nothing', 1),
    mkPlayer('Saahil sl', 'MTech', '1', 'Male', 'Football, Badminton, Volleyball', 'None', 1),
    mkPlayer('Rabeah Basheer', 'IMSc', '3', 'Male', 'Football, Badminton, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Athletics', 'Nothing', 1),
    mkPlayer('Pranav M P', 'IMSc', '2', 'Male', 'Badminton', 'Njn pande scn aanu alo nink onnum ariyathe aal aan 🥱🥱', 1),
    mkPlayer('Prajul P', 'IMSc', '2', 'Male', 'Football, Badminton, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Cricket, Athletics, Special games', 'Used to play Badminton', 1),
    mkPlayer('Nysa Shajan Babu', 'IMSc', '1', 'Female', 'Badminton, Table Tennis, Athletics', 'Nil', 1),
    mkPlayer('Nitin Joseph', 'IMSc', '1', 'Male', 'Football', 'Salesia Interschool competition', 1),
    mkPlayer('Nidal Naaz', 'IMSc', '3', 'Male', 'Volleyball, None', 'Volleyball, winner', 1),
    mkPlayer('Nazal', 'IMSc', '4', 'Male', 'Football, Basket Ball, Volleyball, Kho-Kho, Handball, Athletics', 'Nil', 1),
    mkPlayer('Nandana', 'IMSc', '2', 'Female', 'Badminton, Volleyball', 'Nil', 1),
    mkPlayer('Nabeel Nazeer', 'IMSc', '4', 'Male', 'Volleyball, Kho-Kho, Athletics', 'Participated in athletics last year', 1),
    mkPlayer('Muhammed Afshan', 'IMSc', '1', 'Male', 'Football, Badminton, Athletics', 'I used to play football in school team, Badminton in local', 1),
    mkPlayer('MINHAJ ALI', 'IMSc', '2', 'Male', 'Football, Badminton, Chess, Kho-Kho, Handball, Table Tennis, Cricket, Athletics', 'Rabeah Memorial 🏆', 1),
    mkPlayer('Midhun Madhav PM', 'IMSc', '1', 'Male', 'Football, Badminton, Cricket', 'Played school team', 1),
    mkPlayer('Manu M J', 'MTech', '1', 'Male', 'Badminton', 'No much achievements. I just play.', 1),
    mkPlayer('Maleeha Fathima', 'IMSc', '1', 'Female', 'Badminton, Athletics', 'Has won prizes in athletics in school and also were part of a badminton coaching.', 1),
    mkPlayer('LAKSHMI G BABU', 'MTech', '1', 'Female', 'Chess', 'Nil', 1),
    mkPlayer('Keerthana K S', 'IMSc', '2', 'Female', 'Badminton, Kho-Kho, Athletics', '100 m ,kho-kho school level achievements', 1),
    mkPlayer('Joseph Varghese', 'IMSc', '3', 'Male', 'Football, Volleyball, Athletics', 'So much is there to mention', 1),
    mkPlayer('Hena Fathima', 'IMSc', '1', 'Female', 'Kho-Kho, Athletics', 'I\'ve participated in district level athletics', 1),
    mkPlayer('Hannath C Shabeer', 'IMSc', '2', 'Female', 'Basket Ball, Volleyball, Kho-Kho, Handball, Athletics', 'Nil', 1),
    mkPlayer('Gouri M R', 'IMSc', '1', 'Female', 'Kho-Kho', 'nil', 1),
    mkPlayer('Gokul G', 'IMSc', '1', 'Male', 'Football, Badminton, Cricket', 'Got gold medal in school tournament', 1),
    mkPlayer('Ganga Kailas', 'IMSc', '4', 'Female', 'Basket Ball', 'I have won in various badminton basketball competition.', 1),
    mkPlayer('Ganesh', 'IMSc', '4', 'Male', 'Badminton, Volleyball, Kho-Kho, Table Tennis', 'nil', 1),
    mkPlayer('Feona Varghese', 'IMSc', '2', 'Female', 'Kho-Kho', 'Inter college football tournament winner', 1),
    mkPlayer('Feby Mathew Joseph', 'MTech', '1', 'Male', 'Football, Badminton', 'N/A', 1),
    mkPlayer('Fayaz Azeem', 'MTech', '1', 'Male', 'Table Tennis', 'onnoolya', 1),
    mkPlayer('Fathima Rida P S', 'IMSc', '2', 'Female', 'Kho-Kho, Table Tennis', 'District sahadaya Runner up', 1),
    mkPlayer('Fahad Abdulla', 'IMSc', '1', 'Male', 'Football', 'Nah', 1),
    mkPlayer('Fadil Rahman', 'IMSc', '2', 'Male', 'Badminton, Athletics', 'Onn poyedaa', 1),
    mkPlayer('Dinil kk', 'IMSc', '4', 'Male', 'Basket Ball, Volleyball, Handball', 'Nothing', 1),
    mkPlayer('Devipriya P.R', 'IMSc', '2', 'Female', 'Football, Badminton, Volleyball, Kho-Kho, Table Tennis', 'Don\'t have an achievement but I am ready to try my best...', 1),
    mkPlayer('Deva Nandanan R', 'IMSc', '1', 'Male', 'Football, Badminton, Basket Ball, Volleyball, Kho-Kho, Cricket', 'Participated in Sahodya, KTU B.Tech District Level Competitions', 1),
    mkPlayer('Daniel Suresh', 'MTech', '2', 'Male', 'Football', 'Badminton third prize - btech dept', 1),
    mkPlayer('Bilal Ahammed', 'MTech', '1', 'Male', 'Badminton', 'State player (martial art)', 1),
    mkPlayer('Basil', 'IMSc', '2', 'Male', 'Basket Ball, Volleyball, Kho-Kho', 'Nothing', 1),
    mkPlayer('Athulkrishna K', 'IMSc', '2', 'Male', 'Badminton, Kho-Kho, Table Tennis, Athletics', 'Nil', 1),
    mkPlayer('Aswin', 'IMSc', '3', 'Male', 'Football, Kho-Kho, Cricket, Athletics', 'Mini-Marathon second in highschool.', 1),
    mkPlayer('Ashiq Ali N K', 'IMSc', '2', 'Male', 'Football, Badminton, Basket Ball, Volleyball, Kho-Kho, Handball, Cricket, Athletics, Aalu illathe ethu sportsinum vilicho', 'NIL🌝', 1),
    mkPlayer('Ashfaq Hussain M S', 'IMSc', '4', 'Male', 'Football, Badminton, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Cricket, Athletics', '..', 1),
    mkPlayer('Anujith p p', 'IMSc', '3', 'Male', 'Volleyball, Kho-Kho, Handball, Cricket, Athletics', 'Javelin 2nd,200m 3rd', 1),
    mkPlayer('ANKITHA T', 'IMSc', '1', 'Female', 'Badminton', '..', 1),
    mkPlayer('Anaswara', 'IMSc', '2', 'Female', 'Badminton', 'Njammal koodiya ellaththilum jayichchukkinu', 1),
    mkPlayer('Anand ES', 'IMSc', '1', 'Male', 'Football, Badminton, Chess, Cricket, Athletics', 'Only available after 6pm on working days. Sat & sun full free', 1),
    mkPlayer('Amjad K P', 'IMSc', '4', 'Male', 'Football, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Cricket, Athletics', 'Null', 1),
    mkPlayer('Amal Mehabin P', 'IMSc', '3', 'Male', 'Football, Chess, Volleyball', 'Nil', 1),
    mkPlayer('Akshay K S', 'IMSc', '5', 'Male', 'Football, Badminton, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Cricket, Athletics', 'Nothing', 1),
    mkPlayer('Ajay S', 'IMSc', '2', 'Male', 'Football, Chess, Table Tennis', 'Volleyball', 1),
    mkPlayer('Ahmed Sultan', 'IMSc', '2', 'Male', 'Football, Basket Ball, Cricket', 'Nothing specific, just have won a few team matches and some iconic individual performances and trials.', 1),
    mkPlayer('Adithyan M P', 'IMSc', '4', 'Male', 'Badminton, Volleyball, Cricket', '..', 1),
    mkPlayer('ABHIN S KRISHNA', 'MTech', '1', 'Male', 'Football, Badminton, Chess, Volleyball, Table Tennis, Athletics', '..', 1),
    mkPlayer('Abhijith Shaji', 'IMSc', '1', 'Male', 'Football, Badminton, Chess, Volleyball, Kho-Kho, Cricket, Athletics', '..', 1),
    mkPlayer('Aadithya Sankar', 'MTech', '2', 'Male', 'Football', '..', 1),
    mkPlayer('Vishnu B L', 'MTech', '1', 'Male', 'Badminton, Volleyball, Cricket', 'Only available after 6pm on working days. Sat & sun full free', 1)
  ];
  renderAll();
}
// ===================================================================

function mkTeam(name, initialBudget, maleSlots, femaleSlots){
  return { id: cid(), name, initialBudget, remainingBudget: initialBudget, maleSlots, femaleSlots };
}
function mkPlayer(name, course, year, gender, sports, achievements, baseValue){
  return { id: cid(), name, course, year, gender, sports, achievements, baseValue, status: 'Available', soldPrice: 0, soldTo: null };
}
const cid = (()=>{ let i=1; return ()=>"id"+(i++); })();

// ... (All rendering and auction logic is unchanged and goes here) ...

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
      <div class="stat"><span>Remaining</span><b>$${fmt(t.remainingBudget)}M</b></div>
      <div class="bar" aria-label="Budget used"><span style="width:${budgetPct}%"></span></div>
      <div class="stat"><span>Male Slots</span><b>${t.maleSlots}</b></div>
      <div class="stat"><span>Female Slots</span><b>${t.femaleSlots}</b></div>
    `;
    el.onclick = ()=>{
      if(state.activePlayerId){
        state.selectedTeamId = t.id;
        placeBid(state.settings.step50);
      } else {
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
      <td>${p.achievements}</td>
      <td>$${fmt(p.baseValue)}</td>
      <td>${renderStatus(p)}</td>
    `;
    body.appendChild(tr);
  });
  function filteredPlayers(){
    const q = document.getElementById('search').value.trim().toLowerCase();
    const course = document.getElementById('filterCourse').value;
    const year = document.getElementById('filterYear').value;
    const gender = document.getElementById('filterGender').value;
    const sportsFilter = document.getElementById('filterSports').value;
    const achievementsFilter = document.getElementById('filterAchievements').value;
    const status = document.getElementById('filterStatus').value;
    return state.players.filter(p=>{
      if(q && !p.name.toLowerCase().includes(q)) return false;
      if(course && p.course !== course) return false;
      if(year && p.year !== year) return false;
      if(gender && p.gender !== gender) return false;
      if (sportsFilter) {
          const playerSports = p.sports.split(',').map(s => s.trim().toLowerCase());
          if (!playerSports.includes(sportsFilter.toLowerCase())) return false;
      }
      if(achievementsFilter && p.achievements && !p.achievements.toLowerCase().includes(achievementsFilter.toLowerCase())) return false;
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
    return `<span class="chip">Sold: ${escapeHtml(getTeam(p.soldTo)?.name||'')}</span> <span class="chip">$${fmt(p.soldPrice)}M</span>`;
  }
  if(p.status==='Nominated'){
    return `<span class="chip">Nominated</span>`;
  }
  return `<span class="chip">Available</span>`;
}
function highlightSelection(tr){
  document.querySelectorAll('#playerBody tr').forEach(x=>x.style.outline='none');
  tr.style.outline = '2px solid rgba(90,194,255,.8)';
}
function renderAuction(){
  const ap = state.players.find(p => p.id === state.activePlayerId);

  // Update active player details in their respective sections
  if(ap){
    document.getElementById('activePlayerLabel').textContent = `${ap.name} — ${ap.course}-${ap.year}`;
    document.getElementById('activePlayerSports').textContent = ap.sports || '—';
    document.getElementById('activePlayerAchievements').textContent = ap.achievements || '—';
  } else {
    document.getElementById('activePlayerLabel').textContent = 'No player nominated';
    document.getElementById('activePlayerSports').textContent = '';
    document.getElementById('activePlayerAchievements').textContent = '';
  }

  // Bidding info
  document.getElementById('currentBid').textContent = '$' + fmt(state.currentBid || 0) + 'M';

  // Leading team
  const leadWrap = document.getElementById('leadingTeam');
  leadWrap.innerHTML = '';
  if(state.leadingTeamId){
    const t = getTeam(state.leadingTeamId);
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = `Leading: ${t.name}`;
    leadWrap.appendChild(chip);
  }

  // Timer
  const secLeft = Math.max(0, Math.ceil((state.timer.endAt - Date.now())/1000));
  document.getElementById('timeLeft').textContent = ap ? secLeft : '--';
  const total = state.settings.timerSeconds || 1;
  const pct = ap ? Math.max(0, Math.min(1, (secLeft/total))) : 0;
  document.getElementById('timer').style.background =
    `conic-gradient(var(--accent) ${pct*360}deg, #1e2a47 0deg)`;
}

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
  if(price>team.remainingBudget) return alert('Team cannot afford this player.');
  if(p.gender==='Male' && team.maleSlots<=0) return alert('No male slots left.');
  if(p.gender==='Female' && team.femaleSlots<=0) return alert('No female slots left.');
  team.remainingBudget -= price;
  if(p.gender==='Male') team.maleSlots -= 1; else team.femaleSlots -= 1;
  p.status = 'Sold'; p.soldPrice = price; p.soldTo = team.id;
  state.history.push({type:'sale', playerId:p.id, teamId:team.id, price});
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
  state.timer.endAt = Date.now() + state.settings.timerSeconds * 1000;
  state.timer.interval = setInterval(()=>{
    const remaining = state.timer.endAt - Date.now();
    if(remaining <= 0){
      stopTimer();
      if(state.leadingTeamId){ sellToLeading(); }
      else { clearNomination(); }
    } else { renderAuction(); }
  }, 200);
}
function restartTimer(){
  state.timer.endAt = Date.now() + state.settings.timerSeconds * 1000;
  renderAuction();
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
    imported = arr.map(r=> mkPlayer(r.name||r.Name, r.course||r.Course, r.year||r.Year, r.gender||r.Gender, r.sports||r.Sports, r.achievements||r.Achievements, Number(r.baseValue||r.BaseValue)||0));
  } else {
    imported = parseCSV(text).map(r=> mkPlayer(r.Name, r.Course, r.Year, r.Gender, r.Sports, r.Achievements, Number(r.BaseValue)||1));
  }
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
function exportCSV() {
  const soldPlayers = state.players.filter(p => p.status === 'Sold');
  if (soldPlayers.length === 0) {
    alert('No players have been sold yet. Nothing to export.');
    return;
  }
  const headers = ['Player Name', 'Team Name', 'Sold Price (M)', 'Course', 'Year', 'Gender', 'Interested Sports'];
  const sanitizeField = (field) => {
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  let csvContent = headers.join(',') + '\n';
  soldPlayers.forEach(p => {
    const team = getTeam(p.soldTo);
    const teamName = team ? team.name : 'Unknown';
    const row = [ p.name, teamName, p.soldPrice, p.course, p.year, p.gender, p.sports ].map(sanitizeField);
    csvContent += row.join(',') + '\n';
  });
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'auction_summary.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// =================== NEW "RESUME FROM CSV" FUNCTIONALITY ===================

// This helper function resets the state to its original condition before applying progress
function resetAuctionState() {
    // Reset teams to their initial budget and slots
    state.teams.forEach(t => {
        t.remainingBudget = t.initialBudget;
        // This is a simple reset; a more complex system would be needed
        // if initial slot counts were different per team and not hardcoded.
        const malePlayers = state.players.filter(p => p.soldTo === t.id && p.gender === 'Male').length;
        const femalePlayers = state.players.filter(p => p.soldTo === t.id && p.gender === 'Female').length;
        t.maleSlots += malePlayers;
        t.femaleSlots += femalePlayers;
    });

    // Reset all players to 'Available'
    state.players.forEach(p => {
        p.status = 'Available';
        p.soldPrice = 0;
        p.soldTo = null;
    });
    
    // Clear history and any active auction
    state.history = [];
    state.activePlayerId = null;
    state.currentBid = 0;
    state.leadingTeamId = null;
    stopTimer();
}

async function resumeFromCSV(file) {
    if (!file) return alert('Please select a file to resume from.');
    if (state.players.length === 0) {
        alert('You must load a master player list before you can resume progress.');
        return;
    }

    const text = await file.text();
    const lines = text.trim().split(/\r?\n/).slice(1); // Read lines, skip header

    // Before applying the loaded progress, reset the current state
    resetAuctionState();

    lines.forEach(line => {
        // Basic CSV parsing that is not robust to quotes in fields
        const parts = line.split(','); 
        const playerName = parts[0].trim();
        const teamName = parts[1].trim();
        const soldPrice = parseFloat(parts[2]);

        const player = state.players.find(p => p.name === playerName);
        const team = state.teams.find(t => t.name === teamName);

        // If we find the player and team, and the player is available, apply the sale
        if (player && team && player.status === 'Available') {
            if (team.remainingBudget >= soldPrice) {
                player.status = 'Sold';
                player.soldPrice = soldPrice;
                player.soldTo = team.id;

                team.remainingBudget -= soldPrice;
                if (player.gender === 'Male' && team.maleSlots > 0) {
                    team.maleSlots--;
                } else if (player.gender === 'Female' && team.femaleSlots > 0) {
                    team.femaleSlots--;
                }
                // Add to history for undo functionality
                state.history.push({type:'sale', playerId:player.id, teamId:team.id, price:soldPrice});
            }
        }
    });

    renderAll();
    closeModal('importModal');
    flash('Auction progress has been restored.');
}
// =========================================================================

function parseCSV(text){
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0);
  if(lines.length===0) return [];
  const headers = lines[0].split('\t').map(h=>h.trim());
  const idx = {
    Name: headers.indexOf('Name'),
    Course: headers.indexOf('Course'),
    Year: headers.indexOf('Year'),
    Gender: headers.indexOf('Gender'),
    Sports: headers.indexOf('Interested Sports') !== -1 ? headers.indexOf('Interested Sports') : headers.indexOf('Sports'),
    Achievements: headers.indexOf('Achievements'),
    BaseValue: headers.indexOf('Base Value') !== -1 ? headers.indexOf('Base Value') : headers.indexOf('BaseValue')
  };
  return lines.slice(1).map(line=>{
    const parts = line.split('\t');
    return {
      Name: (parts[idx.Name]||'').trim(),
      Course: (parts[idx.Course]||'').trim(),
      Year: (parts[idx.Year]||'').trim(),
      Gender: (parts[idx.Gender]||'').trim(),
      Sports: (parts[idx.Sports]||'').trim(),
      Achievements: (parts[idx.Achievements]||'').trim(),
      BaseValue: (parts[idx.BaseValue]||'').trim()
    };
  }).filter(r=>r.Name);
}

// ---------------------- Helpers ----------------------
function getTeam(id){ return state.teams.find(t=>t.id===id); }
function getPlayer(id){ return state.players.find(p=>p.id===id); }
function getActivePlayer(){ return state.players.find(p=>p.id===state.activePlayerId); }
function fmt(n){ return (n||0).toLocaleString('en-IN'); }
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

    ['search','filterCourse','filterYear','filterGender','filterSports', 'filterAchievements', 'filterStatus'].forEach(id=>{
      document.getElementById(id).addEventListener('input', renderPlayers);
      document.getElementById(id).addEventListener('change', renderPlayers);
    });

    document.getElementById('btnImport').onclick = ()=> openModal('importModal');
    document.getElementById('btnExport').onclick = exportCSV; 
    document.getElementById('btnSettings').onclick = ()=> openModal('settingsModal');

    document.getElementById('importPlayersBtn').onclick = ()=>{
      const f = document.getElementById('playersFile').files[0]; importPlayers(f);
    };
    document.getElementById('importTeamsBtn').onclick = ()=>{
      const f = document.getElementById('teamsFile').files[0]; importTeams(f);
    };
    
    // Connect the new resume button to its function
    document.getElementById('resumeBtn').onclick = ()=>{
      const f = document.getElementById('resumeFile').files[0]; resumeFromCSV(f);
    };

    document.getElementById('saveSettings').onclick = ()=>{
      state.settings.timerSeconds = Math.max(5, Number(document.getElementById('settingTimer').value)||15);
      state.settings.step50 = Math.max(1, Number(document.getElementById('settingStep50').value)||1);
      state.settings.step100 = Math.max(10, Number(document.getElementById('settingStep100').value)||10);
      closeModal('settingsModal');
      renderAuction();
    };

    window.addEventListener('keydown', (e)=>{
      if(e.key==='Escape'){ closeModal('importModal'); closeModal('settingsModal'); }
      if(e.key==='Enter' && document.activeElement && document.activeElement.closest('#playerBody')){ nominateSelected(); }
      if(e.key==='ArrowRight'){ placeBid(state.settings.step50); }
    });

    seedDemo();
});
