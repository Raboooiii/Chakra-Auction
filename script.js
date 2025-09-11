const firebaseConfig = { 
  apiKey: "AIzaSyBv8UclAhCAHKG4uPShbUPCWE0Sui0xaoY", 
  authDomain: "dcs-auction.firebaseapp.com", 
  databaseURL: "https://dcs-auction-default-rtdb.firebaseio.com", 
  projectId: "dcs-auction", 
  storageBucket: "dcs-auction.firebasestorage.app", 
  messagingSenderId: "1051910041075", 
  appId: "1:1051910041075:web:f290abda2e969f17bf7686", 
  measurementId: "G-BENECH35KC" 
 }; 

 // Initialize Firebase 
 firebase.initializeApp(firebaseConfig); 
 const db = firebase.database(); 

 let sessionID = null; 
 let isBroadcasting = false; 
 let nextPlayerCountdownInterval = null;

 const state = { 
  settings: { timerSeconds: 30 }, 
  teams: [], 
  players: [], 
  selectedTeamId: null, 
  selectedPlayerId: null, 
  activePlayerId: null, 
  currentBid: 0, 
  leadingTeamId: null, 
  timer: { interval: null, endAt: 0 }, 
  history: [] 
 }; 

 // =================== Live Broadcast Functions =================== 
 function updateAndBroadcastState() { 
    renderAll(); 
    if (isBroadcasting && sessionID) { 
        const stateToBroadcast = { ...state, timer: { ...state.timer, interval: null } }; 
        db.ref('auctions/' + sessionID).set(stateToBroadcast); 
    } 
 } 

 function startBroadcast() { 
    if (isBroadcasting) { 
        const viewerUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}viewer.html?session=${sessionID}`; 
        prompt("Live session is active! Share this link or the code:", viewerUrl); 
        return; 
    } 
    
    let customCode = prompt("Please enter a custom code for your live session (e.g., DCS2025):"); 

    if (!customCode || customCode.trim() === '') { 
        alert("Broadcast cancelled. You must enter a code to start a session."); 
        return; 
    } 
    
    sessionID = customCode.trim().toUpperCase().replace(/\s+/g, ''); 

    isBroadcasting = true; 
    
    const broadcastButton = document.getElementById('btnBroadcast'); 
    broadcastButton.textContent = '● Live'; 
    broadcastButton.style.color = '#ff6b6b'; 

    const codeDisplay = document.getElementById('live-code-display'); 
    codeDisplay.innerHTML = `Live Code: <span>${sessionID}</span>`; 

    const viewerUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}viewer.html?session=${sessionID}`; 
    prompt("Live session started! Share this link or the code:", viewerUrl); 
    updateAndBroadcastState(); 
 } 

 function endBroadcast() { 
    if (!isBroadcasting || !sessionID) return; 
    
    db.ref('auctions/' + sessionID).remove(); 

    isBroadcasting = false; 
    sessionID = null; 

    const broadcastButton = document.getElementById('btnBroadcast'); 
    broadcastButton.textContent = 'Broadcast Live'; 
    broadcastButton.style.color = ''; 

    document.getElementById('live-code-display').innerHTML = ''; 
 } 

 function seedDemo(){ 
  state.teams = [ 
    mkTeam('ELITES', 500, 12, 5), 
    mkTeam('TITANS', 500, 12, 5), 
    mkTeam('FIGHTERS', 500, 12, 5), 
    mkTeam('SPARTANS', 500, 12, 5) 
  ]; 
  state.players = [ 
    mkPlayer('Nazal', 'IMSc', '4', 'Male', 'Football, Basket Ball, Volleyball, Kho-Kho, Handball, Athletics', '.', 50),
    mkPlayer('Rabeah Basheer', 'IMSc', '3', 'Male', 'Football, Badminton, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Athletics', 'None', 50),
    mkPlayer('Prajul P', 'IMSc', '2', 'Male', 'Football, Badminton, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Cricket, Athletics, Special games??', 'Njn pandeee scnn ahn ninkk onnum ariyathe aal ahn????????', 50),
    mkPlayer('Amjad K P', 'IMSc', '4', 'Male', 'Football, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Cricket, Athletics', '..', 50),
    mkPlayer('MINHAJ ALI', 'IMSc', '2', 'Male', 'Football, Badminton, Chess, Kho-Kho, Handball, Table Tennis, Cricket, Athletics', 'Rabeah Memorial ??', 20),
    mkPlayer('Ajay S', 'IMSc', '2', 'Male', 'Football, Chess, Table Tennis', 'Nil', 20),
    mkPlayer('Ziyana Ahammed S A P', 'IMSc', '2', 'Female', 'Football, Badminton, Basket Ball, Volleyball, Handball, Table Tennis, Athletics', 'Nil', 20),
    mkPlayer('Keerthana K S', 'IMSc', '2', 'Female', 'Badminton, Kho-Kho, Athletics', '100 m ,kho-kho school level acheivements', 20),
    mkPlayer('Thejus s', 'IMSc', '3', 'Male', 'Football, Badminton, Basket Ball, Kho-Kho, Handball, Cricket, Athletics', 'Speed-99 Ball control-99 Possession-98 Finishing-99', 20),
    mkPlayer('SNEHAL', 'IMSc', '3', 'Male', 'Football, Badminton, Volleyball, Kho-Kho, Table Tennis, Cricket, Athletics', 'NJN KORACH ADHIGAM SCN AAHN.. IPRAVSHYAM ONNUDE MOOD AAVM ??', 20),
    mkPlayer('Aswin', 'IMSc', '3', 'Male', 'Football, Kho-Kho, Cricket, Athletics', 'None', 20),
    mkPlayer('Amal Mehabin P', 'IMSc', '3', 'Male', 'Football, Chess, Volleyball', 'Njammal koodiya ellaththilum jayichchukkinu', 20),
    mkPlayer('Anujith p p', 'IMSc', '3', 'Male', 'Volleyball, Kho-Kho, Handball, Cricket, Athletics', '?', 20),
    mkPlayer('Nabeel Nazeer', 'IMSc', '4', 'Male', 'Volleyball, Kho-Kho, Athletics', 'Participated in athletics last year', 20),
    mkPlayer('ABHIN S KRISHNA', 'MTech', '1', 'Male', 'Football, Badminton, Chess, Volleyball, Table Tennis, Athletics', 'Volleyball', 20),
    mkPlayer('Ashfaq Hussain M S', 'IMSc', '4', 'Male', 'Football, Badminton, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Cricket, Athletics', 'NIL??', 20),
    mkPlayer('Ganga Kailas', 'IMSc', '4', 'Female', 'Basket Ball', 'Have won in within department basketball competition.', 10),
    mkPlayer('Finson', 'IMSc', '4', 'Female', 'Football, Badminton, Chess, Basket Ball, Cricket', 'Nothing', 20),
    mkPlayer('Dinil kk', 'IMSc', '4', 'Female', 'Basket Ball, Volleyball, Handball', 'Onn poyedaa', 20),
    mkPlayer('Akshay K S', 'IMSc', '5', 'Male', 'Football, Badminton, Chess, Basket Ball, Volleyball, Kho-Kho, Handball, Table Tennis, Cricket, Athletics', 'Only available after 6pm on working days. Sat & sun full free', 20),
    mkPlayer('Ganesh', 'IMSc', '4', 'Male', 'Badminton, Volleyball, Kho-Kho, Table Tennis', '.....', 20),
    mkPlayer('Basil', 'IMSc', '2', 'Male', 'Basket Ball, Volleyball, Kho-Kho', 'State player (martial art)', 10),
    mkPlayer('Ashiq Ali N K', 'IMSc', '2', 'Male', 'Football, Badminton, Basket Ball, Volleyball, Kho-Kho, Handball, Cricket, Athletics, Aalu illathe ethu sportsinum vilicho', 'Mini-Marathon second in highschool.', 10),
    mkPlayer('Joseph Varghese', 'IMSc', '3', 'Male', 'Football, Volleyball, Athletics', 'So much is there to mention', 10),
    mkPlayer('Shiyas', 'IMSc', '4', 'Male', 'Football, Badminton, Volleyball, Kho-Kho, Table Tennis, Cricket', '........', 10),
    mkPlayer('Adithyan M P', 'IMSc', '4', 'Male', 'Badminton, Volleyball, Cricket', 'Nothing', 10),
    mkPlayer('Aadithya Sankar', 'MTech', '2', 'Male', 'Football', '.', 10),
    mkPlayer('Sivakanth J', 'IMSc', '1', 'Male', 'Football, Badminton, Basket Ball, Cricket', 'Football : school team Cricket : sub district team x2', 5),
    mkPlayer('Nitin Joseph Edward', 'IMSc', '1', 'Male', 'Football', 'Salesia interschool competition', 5),
    mkPlayer('Muhammed Afshan E A', 'IMSc', '1', 'Male', 'Football, Badminton, Athletics', 'I used to play football in school team, Badminton in local', 5),
    mkPlayer('Midhun Madhav PM', 'IMSc', '1', 'Male', 'Football, Badminton, Cricket', 'Played school team', 5),
    mkPlayer('Gokul G', 'IMSc', '1', 'Male', 'Football, Badminton, Cricket', 'Got gold medal in school tournament', 5),
    mkPlayer('Fahad Abdulla', 'IMSc', '1', 'Male', 'Football', 'District sohadaya Runner up', 5),
    mkPlayer('Deva Nandanan R', 'IMSc', '1', 'Male', 'Football, Badminton, Basket Ball, Volleyball, Kho-Kho, Cricket', 'Don\'t have an achievement but I am ready to try my best...', 5),
    mkPlayer('Abhijith Shaji', 'IMSc', '1', 'Male', 'Football, Badminton, Chess, Volleyball, Kho-Kho, Cricket, Athletics', 'Nothing specific, just have won a few team matches and some iconic individual performances and trials.', 5),
    mkPlayer('Sreenanda Sunil', 'IMSc', '1', 'Female', 'Badminton, Chess, Kho-Kho', 'Nil', 5),
    mkPlayer('Maleeha Fathima', 'IMSc', '1', 'Female', 'Badminton, Athletics', 'Has won prizes in athletics in school and also were part of a badminton coaching.', 5),
    mkPlayer('Hena Fathima', 'IMSc', '1', 'Female', 'Kho-Kho, Athletics', 'I’ve participated in district level athletics', 5),
    mkPlayer('Gouri M R', 'IMSc', '1', 'Female', 'Kho-Kho', 'nil', 5),
    mkPlayer('ANKITHA T', 'IMSc', '1', 'Female', 'Badminton', 'Nil', 5),
    mkPlayer('Pranav M P', 'IMSc', '2', 'Male', 'Badminton', 'Nothing', 5),
    mkPlayer('Feona Varghese', 'IMSc', '2', 'Male', 'Kho-Kho', 'Nil', 5),
    mkPlayer('Fadil Rahman', 'IMSc', '2', 'Male', 'Badminton, Athletics', 'Nah', 5),
    mkPlayer('Devipriya P.R', 'IMSc', '2', 'Male', 'Football, Badminton, Volleyball, Kho-Kho, Table Tennis', 'Nothing', 5),
    mkPlayer('Athulkrishna K', 'IMSc', '2', 'Male', 'Badminton, Kho-Kho, Table Tennis, Athletics', 'Nothing', 5),
    mkPlayer('Anaswara', 'IMSc', '2', 'Male', 'Badminton', '.', 5),
    mkPlayer('Ahmed Sultan', 'IMSc', '2', 'Male', 'Football, Basket Ball, Cricket', 'Namma THALA', 5),
    mkPlayer('Theja R', 'IMSc', '2', 'Female', 'Basket Ball, Kho-Kho, Table Tennis', 'Nil', 5),
    mkPlayer('Nandana', 'IMSc', '2', 'Female', 'Badminton, Volleyball', 'Nil', 5),
    mkPlayer('Hannath C Shabeer', 'IMSc', '2', 'Female', 'Basket Ball, Volleyball, Kho-Kho, Handball, Athletics', 'Nil', 5),
    mkPlayer('Fathima Rida P S', 'IMSc', '2', 'Female', 'Kho-Kho, Table Tennis', 'onnoolya', 5),
    mkPlayer('Nidal Naaz Luckman', 'IMSc', '3', 'Male', 'Volleyball, None', 'Volleyball, winner', 5),
    mkPlayer('Salman Faris', 'IMSc', '4', 'Male', 'Badminton, Handball, Cricket', 'None', 5),
    mkPlayer('Vishnu B L', 'MTech', '1', 'Male', 'Badminton, Volleyball, Cricket', 'Participated in college levels', 5),
    mkPlayer('Tony George', 'MTech', '1', 'Male', 'Football', 'NIL', 5),
    mkPlayer('Saahil sl', 'MTech', '1', 'Male', 'Football, Badminton, Volleyball', 'Nathing??', 5),
    mkPlayer('Manu M J', 'MTech', '1', 'Male', 'Badminton', 'No much achievements. I just play.', 5),
    mkPlayer('Feby Mathew Joseph', 'MTech', '1', 'Male', 'Football, Badminton', 'Inter college football tournament winner', 5),
    mkPlayer('Fayaz Azeem', 'MTech', '1', 'Male', 'Table Tennis', 'N/A', 5),
    mkPlayer('Bilal Ahamed PT', 'MTech', '1', 'Male', 'Badminton', 'Badminton third prize - btech dept', 5),
    mkPlayer('Sugithra C S', 'MTech', '1', 'Female', 'Badminton, Chess', 'I have participated international chess competition in 2018 conducted in St Alberts college Ernakulam', 5),
    mkPlayer('LAKSHMI G BABU', 'MTech', '1', 'Female', 'Chess', 'Nil', 5),
    mkPlayer('Shreyas R', 'MTech', '2', 'Male', 'Football', '.', 5),
    mkPlayer('Daniel Suresh', 'MTech', '2', 'Male', 'Football', 'Participated in Sahodya, KTU B.Tech District Level Competitions', 5),
  ]; 
  updateAndBroadcastState(); 
 } 

 function mkTeam(name, initialBudget, maleSlots, femaleSlots){ 
  return { id: cid(), name, initialBudget, remainingBudget: initialBudget, maleSlots, femaleSlots }; 
 } 
 function mkPlayer(name, course, year, gender, sports, achievements, baseValue){ 
  return { id: cid(), name, course, year, gender, sports, achievements, baseValue, status: 'Available', soldPrice: 0, soldTo: null }; 
 } 
 const cid = (()=>{ let i=1; return ()=>"id"+(i++); })(); 

 function renderAll(){ renderTeams(); renderPlayers(); renderAuction(); renderTeamFilter(); } 

 function renderTeams(){ 
  const wrap = document.getElementById('teams'); 
  wrap.innerHTML = ''; 
  state.teams.forEach(t=>{ 
    const used = t.initialBudget - t.remainingBudget; 
    const budgetPct = Math.min(100, (used / t.initialBudget) * 100 || 0); 
    const el = document.createElement('div'); 
    el.className = 'team' + (state.selectedTeamId===t.id ? ' active' : ''); 
    el.innerHTML = `<div class="name">${escapeHtml(t.name)}</div><div class="stat"><span>Remaining</span><b>$${fmt(t.remainingBudget)}M</b></div><div class="bar" aria-label="Budget used"><span style="width:${budgetPct}%"></span></div><div class="stat"><span>Male Slots</span><b>${t.maleSlots}</b></div><div class="stat"><span>Female Slots</span><b>${t.femaleSlots}</b></div>`; 
    el.onclick = ()=>{ 
      state.selectedTeamId = t.id; 
      renderTeams(); 
    }; 
    wrap.appendChild(el); 
  }); 
 } 

 function renderTeamFilter() { 
    const select = document.getElementById('filterTeam'); 
    const currentValue = select.value; 
    select.innerHTML = '<option value="">All Teams</option>'; 
    state.teams.forEach(team => { 
        const option = document.createElement('option'); 
        option.value = team.name; 
        option.textContent = team.name; 
        select.appendChild(option); 
    }); 
    select.value = currentValue; 
 } 

 function renderPlayers(){ 
  const body = document.getElementById('playerBody'); 
  body.innerHTML = ''; 
  filteredPlayers().forEach(p=>{ 
    const tr = document.createElement('tr'); 
    tr.className = (state.activePlayerId===p.id)?'active-player':''; 
    tr.tabIndex = 0; 
    tr.onclick = ()=>{ 
        state.selectedPlayerId = p.id; 
        highlightSelection(tr); 
        updatePlayerActionButtons();
    }; 
    tr.innerHTML = `<td>${escapeHtml(p.name)}</td><td>${p.course}</td><td>${p.year}</td><td>${p.gender}</td><td>${p.sports}</td><td>${p.achievements}</td><td>$${fmt(p.baseValue)}</td><td>${renderStatus(p)}</td>`; 
    body.appendChild(tr); 
  }); 
  function filteredPlayers(){ 
    const q = document.getElementById('search').value.trim().toLowerCase(); 
    const course = document.getElementById('filterCourse').value; 
    const year = document.getElementById('filterYear').value; 
    const gender = document.getElementById('filterGender').value; 
    const teamFilter = document.getElementById('filterTeam').value; 
    const status = document.getElementById('filterStatus').value; 
    return state.players.filter(p=>{ 
      if(q && !p.name.toLowerCase().includes(q)) return false; 
      if(course && p.course !== course) return false; 
      if(year && p.year !== year) return false; 
      if(gender && p.gender !== gender) return false; 
      if (teamFilter) { 
          if (p.status !== 'Sold') return false; 
          const team = getTeam(p.soldTo); 
          if (!team || team.name !== teamFilter) return false; 
      } 
      if(status){ 
        if(status==='Sold' && p.status!=='Sold') return false; 
        if(status==='Available' && p.status!=='Available') return false; 
      } 
      return true; 
    }); 
  } 
 } 

 function renderStatus(p){ 
  if(p.status==='Sold'){ 
    return `<span class="chip">Sold: ${escapeHtml(getTeam(p.soldTo)?.name||'')}</span> <span class="chip">$${fmt(p.soldPrice)}M</span>`; 
  } 
  return `<span class="chip">${p.status}</span>`; 
 } 

 function highlightSelection(tr){ 
  document.querySelectorAll('#playerBody tr').forEach(x=>x.style.outline='none'); 
  tr.style.outline = '2px solid rgba(90,194,255,.8)'; 
 } 

 function renderAuction(){ 
  const ap = state.players.find(p => p.id === state.activePlayerId); 
  if(ap){ 
    document.getElementById('activePlayerLabel').textContent = `${ap.name} — ${ap.course}-${ap.year}`; 
    document.getElementById('activePlayerSports').textContent = ap.sports || '—'; 
    document.getElementById('activePlayerAchievements').textContent = ap.achievements || '—'; 
  } else { 
    if (!nextPlayerCountdownInterval) {
         document.getElementById('activePlayerLabel').textContent = 'No player nominated';
    }
    document.getElementById('activePlayerSports').textContent = ''; 
    document.getElementById('activePlayerAchievements').textContent = ''; 
  } 
  document.getElementById('currentBid').textContent = '$' + fmt(state.currentBid || 0) + 'M'; 
  const leadWrap = document.getElementById('leadingTeam'); 
  leadWrap.innerHTML = ''; 
  if(state.leadingTeamId){ 
    const t = getTeam(state.leadingTeamId); 
    const chip = document.createElement('div'); 
    chip.className = 'chip'; 
    chip.textContent = `Leading: ${t.name}`; 
    leadWrap.appendChild(chip); 
  } 
  const secLeft = Math.max(0, Math.ceil((state.timer.endAt - Date.now())/1000));
  if (!nextPlayerCountdownInterval) {
     document.getElementById('timeLeft').textContent = ap ? secLeft : '--'; 
  }
  const total = state.settings.timerSeconds || 1; 
  const pct = ap ? Math.max(0, Math.min(1, (secLeft/total))) : 0;
   if (!nextPlayerCountdownInterval) {
     document.getElementById('timer').style.background = `conic-gradient(var(--accent) ${pct*360}deg, #1e2a47 0deg)`;
   }
 } 

 function nominateSelected(){ 
  if (nextPlayerCountdownInterval) {
      clearInterval(nextPlayerCountdownInterval);
      nextPlayerCountdownInterval = null;
      document.getElementById('timer').style.background = '';
  }

  const pid = state.selectedPlayerId; 
  if(!pid) return alert('Select a player row first.'); 
  const p = state.players.find(p=>p.id===pid); 
  if(!p || p.status!=='Available') return alert('Player must be Available.'); 
  state.activePlayerId = pid; 
  p.status = 'Nominated'; 
  state.currentBid = p.baseValue; 
  state.leadingTeamId = null; 
  startTimer(); 
  updateAndBroadcastState(); 
 } 

 function nominateNext() {
    let currentIndex = -1;
    if (state.activePlayerId) {
        currentIndex = state.players.findIndex(p => p.id === state.activePlayerId);
    } else if (state.selectedPlayerId) {
        currentIndex = state.players.findIndex(p => p.id === state.selectedPlayerId);
    }

    for (let i = 1; i <= state.players.length; i++) {
        const nextIndex = (currentIndex + i) % state.players.length;
        const nextPlayer = state.players[nextIndex];
        if (nextPlayer.status === 'Available') {
            state.selectedPlayerId = nextPlayer.id;
            nominateSelected();
            const activeRow = document.querySelector('tr.active-player');
            if (activeRow) {
                activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
    }
    alert('No more available players found.');
}

function placeBid() {
    const p = getActivePlayer();
    if (!p) return alert('Nominate a player first.');
    if (!state.selectedTeamId) return alert('Select a team to bid.');

    const bidInput = document.getElementById('directBidInput');
    const newBid = Number(bidInput.value);

    if (isNaN(newBid) || newBid < 0) {
        flash('Please enter a valid bid amount.');
        return;
    }

    if (newBid <= state.currentBid) {
        flash(`Bid must be greater than $${fmt(state.currentBid)}M.`);
        return;
    }

    const team = getTeam(state.selectedTeamId);
    if (newBid > team.remainingBudget) {
        flash('Team over budget!');
        return;
    }
    if (p.gender === 'Male' && team.maleSlots <= 0) {
        flash('No male slots left!');
        return;
    }
    if (p.gender === 'Female' && team.femaleSlots <= 0) {
        flash('No female slots left!');
        return;
    }

    state.currentBid = newBid;
    state.leadingTeamId = team.id;
    bidInput.value = ''; 
    restartTimer();
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
  updateAndBroadcastState(); 
  startNextPlayerCountdown();
 } 
 
 function undoLast(){ 
  if (nextPlayerCountdownInterval) {
      clearInterval(nextPlayerCountdownInterval);
      nextPlayerCountdownInterval = null;
      document.getElementById('timer').style.background = '';
  }

  const last = state.history.pop(); 
  if(!last) return alert('Nothing to undo.'); 
  if(last.type==='sale'){ 
    const p = getPlayer(last.playerId); const t = getTeam(last.teamId); 
    if(!p||!t) return; 
    t.remainingBudget += last.price; 
    const gender = p.gender==='Male' ? 'maleSlots':'femaleSlots'; 
    t[gender] += 1; 
    p.status = 'Available'; p.soldPrice=0; p.soldTo=null; 
    updateAndBroadcastState(); 
  } 
 } 

 function returnPlayerToAuction() {
    if (!state.selectedPlayerId) return;
    const player = getPlayer(state.selectedPlayerId);
    if (!player || player.status !== 'Sold') {
        alert('Please select a sold player to return to the auction.');
        return;
    }
    if (!confirm(`Are you sure you want to return ${player.name} to the auction? This action cannot be undone.`)) {
        return;
    }
    const team = getTeam(player.soldTo);
    const price = player.soldPrice;
    if (!team) {
        alert(`Error: Could not find the team (${player.soldTo}) that bought this player.`);
    } else {
        team.remainingBudget += price;
        if (player.gender === 'Male') {
            team.maleSlots++;
        } else {
            team.femaleSlots++;
        }
    }
    const oldTeamId = player.soldTo;
    state.history = state.history.filter(item => 
        !(item.type === 'sale' && item.playerId === player.id && item.teamId === oldTeamId)
    );
    player.status = 'Available';
    player.soldPrice = 0;
    player.soldTo = null;
    flash(`${player.name} is now available again. $${fmt(price)}M refunded.`);
    updatePlayerActionButtons();
    updateAndBroadcastState();
}

 function resetBid(){ 
  const p = getActivePlayer(); if(!p) return; 
  state.currentBid = p.baseValue; state.leadingTeamId = null; 
  restartTimer(); 
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
    } else { 
      renderAuction(); 
    } 
  }, 200); 
 } 

 function restartTimer(){ 
  state.timer.endAt = Date.now() + state.settings.timerSeconds * 1000; 
  updateAndBroadcastState(); 
 } 

 function stopTimer(){ if(state.timer.interval){ clearInterval(state.timer.interval); state.timer.interval=null; } } 

 function clearNomination(){ 
  const p = getActivePlayer(); if(p){ p.status='Available'; } 
  state.activePlayerId=null; state.currentBid=0; state.leadingTeamId=null; 
  updateAndBroadcastState(); 
 } 

function startNextPlayerCountdown() {
    if (nextPlayerCountdownInterval) {
        clearInterval(nextPlayerCountdownInterval);
    }

    let secondsRemaining = 30;
    const timeLeftEl = document.getElementById('timeLeft');
    const timerEl = document.getElementById('timer');
    const activePlayerLabelEl = document.getElementById('activePlayerLabel');

    activePlayerLabelEl.textContent = `Next player in ${secondsRemaining}s...`;

    nextPlayerCountdownInterval = setInterval(() => {
        secondsRemaining--;
        activePlayerLabelEl.textContent = `Next player in ${secondsRemaining}s...`;
        
        timeLeftEl.textContent = secondsRemaining;
        const pct = (secondsRemaining / 10);
        timerEl.style.background = `conic-gradient(var(--warning) ${pct * 360}deg, #1e2a47 0deg)`;

        if (secondsRemaining <= 0) {
            clearInterval(nextPlayerCountdownInterval);
            nextPlayerCountdownInterval = null;
            timeLeftEl.textContent = '--';
            timerEl.style.background = '';
            flash('Nominating next player...');
            nominateRandom();
        }
    }, 1000);
}


 function updatePlayerActionButtons() {
    const nominateBtn = document.getElementById('nominateBtn');
    const returnBtn = document.getElementById('returnBtn');
    const selectedPlayer = getPlayer(state.selectedPlayerId);
    nominateBtn.style.display = 'inline-block';
    returnBtn.style.display = 'none';
    if (selectedPlayer) {
        if (selectedPlayer.status === 'Sold') {
            nominateBtn.style.display = 'none';
            returnBtn.style.display = 'inline-block';
        } else if (selectedPlayer.status === 'Available') {
            nominateBtn.style.display = 'inline-block';
            returnBtn.style.display = 'none';
        }
    }
}

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
    imported = parseCSV(text).map(r=> mkPlayer(r.Name, r.Course, r.Year, r.Gender, r.Sports, r.Achievements, Number(r.BaseValue)||0)); 
  } 
  state.players = imported.filter(Boolean); 
  state.activePlayerId=null; state.currentBid=0; state.leadingTeamId=null; 
  updateAndBroadcastState(); 
  flash('Players imported.'); 
 } 

 async function importTeams(file) { 
    if (!file) return alert('Choose a file.'); 
    if (!file.name.endsWith('.csv')) return alert('Please upload a CSV file for teams.'); 
    try { 
        const text = await file.text(); 
        const lines = text.trim().split(/\r?\n/); 
        if (lines.length < 2) throw new Error('CSV file must have a header and at least one data row.'); 
        const headers = lines[0].split(',').map(h => h.trim()); 
        const requiredHeaders = ['Name', 'InitialBudget', 'MaleSlots', 'FemaleSlots']; 
        for (const h of requiredHeaders) { 
            if (!headers.includes(h)) throw new Error(`CSV is missing required header: ${h}`); 
        } 
        const nameIndex = headers.indexOf('Name'); 
        const budgetIndex = headers.indexOf('InitialBudget'); 
        const maleIndex = headers.indexOf('MaleSlots'); 
        const femaleIndex = headers.indexOf('FemaleSlots'); 
        const importedTeams = lines.slice(1).map(line => { 
            const values = line.split(','); 
            const name = values[nameIndex]?.trim(); 
            const initialBudget = Number(values[budgetIndex]?.trim()); 
            const maleSlots = Number(values[maleIndex]?.trim()); 
            const femaleSlots = Number(values[femaleIndex]?.trim()); 
            if (!name || isNaN(initialBudget) || isNaN(maleSlots) || isNaN(femaleSlots)) { return null; } 
            return mkTeam(name, initialBudget, maleSlots, femaleSlots); 
        }).filter(Boolean); 
        if (importedTeams.length === 0) { throw new Error('No valid team data found in the file.'); } 
        state.teams = importedTeams; 
        updateAndBroadcastState(); 
        flash(`${importedTeams.length} teams imported successfully.`); 
        closeModal('importModal'); 
    } catch (error) { 
        alert(`Error importing teams: ${error.message}`); 
    } 
 } 

 function exportCSV() { 
  const soldPlayers = state.players.filter(p => p.status === 'Sold'); 
  if (soldPlayers.length === 0) { alert('No players have been sold yet.'); return; } 
  const headers = ['Player Name', 'Team Name', 'Sold Price (M)', 'Course', 'Year', 'Gender', 'Interested Sports']; 
  const sanitizeField = (field) => { 
    const str = String(field); 
    return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str; 
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

 function resetAuctionState() { 
    state.teams.forEach(t => { 
        t.remainingBudget = t.initialBudget; 
        const malePlayers = state.players.filter(p => p.soldTo === t.id && p.gender === 'Male').length; 
        const femalePlayers = state.players.filter(p => p.soldTo === t.id && p.gender === 'Female').length; 
        t.maleSlots += malePlayers; 
        t.femaleSlots += femalePlayers; 
    }); 
    state.players.forEach(p => { 
        p.status = 'Available'; p.soldPrice = 0; p.soldTo = null; 
    }); 
    state.history = []; state.activePlayerId = null; state.currentBid = 0; state.leadingTeamId = null; 
    stopTimer(); 
 } 

 async function resumeFromCSV(file) { 
    if (!file) return alert('Please select a file to resume from.'); 
    if (state.players.length === 0) { alert('You must load a master player list first.'); return; } 
    const text = await file.text(); 
    const lines = text.trim().split(/\r?\n/).slice(1); 
    resetAuctionState(); 
    lines.forEach(line => { 
        const parts = line.split(',');  
        const playerName = parts[0].trim(); 
        const teamName = parts[1].trim(); 
        const soldPrice = parseFloat(parts[2]); 
        const player = state.players.find(p => p.name === playerName); 
        const team = state.teams.find(t => t.name === teamName); 
        if (player && team && player.status === 'Available' && team.remainingBudget >= soldPrice) { 
            player.status = 'Sold'; player.soldPrice = soldPrice; player.soldTo = team.id; 
            team.remainingBudget -= soldPrice; 
            if (player.gender === 'Male' && team.maleSlots > 0) team.maleSlots--; 
            else if (player.gender === 'Female' && team.femaleSlots > 0) team.femaleSlots--; 
            state.history.push({type:'sale', playerId:player.id, teamId:team.id, price:soldPrice}); 
        } 
    }); 
    updateAndBroadcastState(); 
    closeModal('importModal'); 
    flash('Auction progress has been restored.'); 
 } 

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
 function escapeHtml(str){ return (String(str)).replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); } 
 function flash(msg){ 
  const b = document.createElement('div'); 
  b.textContent = msg; b.style.position='fixed'; b.style.bottom='16px'; b.style.left='50%'; b.style.transform='translateX(-50%)'; 
  b.style.background='rgba(0,0,0,.75)'; b.style.color='white'; b.style.padding='10px 14px'; b.style.borderRadius='10px'; b.style.zIndex='9999'; 
  document.body.appendChild(b); setTimeout(()=>{ b.style.transition='opacity .4s'; b.style.opacity='0'; setTimeout(()=>b.remove(),500); }, 2000); 
 } 

 document.addEventListener('DOMContentLoaded', () => { 
    document.getElementById('btnBroadcast').onclick = () => { 
        if (isBroadcasting) { endBroadcast(); } else { startBroadcast(); } 
    }; 
    window.addEventListener('beforeunload', () => { 
        if (isBroadcasting) { endBroadcast(); } 
    }); 
    
    document.getElementById('nominateBtn').onclick = nominateSelected;
    document.getElementById('nominateNextBtn').onclick = nominateNext;
    document.getElementById('returnBtn').onclick = returnPlayerToAuction;
    document.getElementById('randomNominateBtn').onclick = nominateRandom; 
    document.getElementById('sellBtn').onclick = sellToLeading; 
    document.getElementById('resetBid').onclick = resetBid; 
    document.getElementById('btnUndo').onclick = undoLast; 
    
    document.getElementById('placeBidBtn').onclick = placeBid;
    document.getElementById('directBidInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            placeBid();
        }
    });

    ['search','filterCourse','filterYear','filterGender', 'filterTeam', 'filterStatus'].forEach(id=>{ 
      const el = document.getElementById(id); 
      el.addEventListener('input', renderPlayers); 
      el.addEventListener('change', renderPlayers); 
    }); 

    document.getElementById('btnImport').onclick = ()=> openModal('importModal'); 
    document.getElementById('btnExport').onclick = exportCSV;  
    document.getElementById('btnSettings').onclick = ()=> openModal('settingsModal'); 
    document.getElementById('importPlayersBtn').onclick = ()=>{ const f = document.getElementById('playersFile').files[0]; importPlayers(f); }; 
    document.getElementById('importTeamsBtn').onclick = ()=>{ const f = document.getElementById('teamsFile').files[0]; importTeams(f); }; 
    document.getElementById('resumeBtn').onclick = ()=>{ const f = document.getElementById('resumeFile').files[0]; resumeFromCSV(f); }; 
    
    document.getElementById('saveSettings').onclick = ()=>{ 
      state.settings.timerSeconds = Math.max(5, Number(document.getElementById('settingTimer').value)||30); 
      closeModal('settingsModal'); 
      updateAndBroadcastState(); 
    }; 

    window.addEventListener('keydown', (e)=>{ 
      if(e.key==='Escape'){ closeModal('importModal'); closeModal('settingsModal'); } 
      if(e.key==='Enter' && document.activeElement && document.activeElement.closest('#playerBody')){ nominateSelected(); } 
    }); 
    
    seedDemo(); 
 });
