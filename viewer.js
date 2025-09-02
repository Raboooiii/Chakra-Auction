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
  
  firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // --- State and Rendering ---
    const state = { teams: [], players: [], settings: {} };
    let localTimerInterval = null;
  
  function renderAll(){ renderTeams(); renderPlayers(); renderAuction(); renderTeamFilter(); }
  
  function renderTeams(){
    const wrap = document.getElementById('teams');
    wrap.innerHTML = '';
    (state.teams || []).forEach(t=>{
      const used = t.initialBudget - t.remainingBudget;
      const budgetPct = Math.min(100, (used / t.initialBudget) * 100 || 0);
      const el = document.createElement('div');
      el.className = 'team';
      el.innerHTML = `<div class="name">${escapeHtml(t.name)}</div><div class="stat"><span>Remaining</span><b>$${fmt(t.remainingBudget)}M</b></div><div class="bar" aria-label="Budget used"><span style="width:${budgetPct}%"></span></div><div class="stat"><span>Male Slots</span><b>${t.maleSlots}</b></div><div class="stat"><span>Female Slots</span><b>${t.femaleSlots}</b></div>`;
      wrap.appendChild(el);
    });
  }
  
  function renderTeamFilter() {
      const select = document.getElementById('filterTeam');
      const currentValue = select.value;
      select.innerHTML = '<option value="">All Teams</option>';
      (state.teams || []).forEach(team => {
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
      tr.innerHTML = `<td>${escapeHtml(p.name)}</td><td>${p.course}</td><td>${p.year}</td><td>${p.gender}</td><td>${p.sports}</td><td>${renderStatus(p)}</td>`;
      body.appendChild(tr);
    });
    function filteredPlayers(){
      const q = document.getElementById('search').value.trim().toLowerCase();
      const teamFilter = document.getElementById('filterTeam').value;
      const status = document.getElementById('filterStatus').value;
      return (state.players || []).filter(p=>{
        if(q && !p.name.toLowerCase().includes(q)) return false;
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
  
  function renderAuction(){
    const ap = getActivePlayer();
    if(ap){
      document.getElementById('activePlayerLabel').textContent = `${ap.name} — ${ap.course}-${ap.year}`;
      document.getElementById('activePlayerSports').textContent = ap.sports || '—';
      document.getElementById('activePlayerAchievements').textContent = ap.achievements || '—';
    } else {
      document.getElementById('activePlayerLabel').textContent = 'No player nominated';
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
    const secLeft = Math.max(0, Math.ceil(((state.timer || {}).endAt - Date.now())/1000));
    document.getElementById('timeLeft').textContent = ap ? secLeft : '--';
    const total = (state.settings || {}).timerSeconds || 1;
    const pct = ap ? Math.max(0, Math.min(1, (secLeft/total))) : 0;
    document.getElementById('timer').style.background = `conic-gradient(var(--accent) ${pct*360}deg, #1e2a47 0deg)`;
    if((!ap || secLeft <= 0) && localTimerInterval) {
        clearInterval(localTimerInterval);
        localTimerInterval = null;
    }
  }
  
  function startLocalTimer() {
      if (localTimerInterval) clearInterval(localTimerInterval);
      if (!state.activePlayerId || !state.timer || !state.timer.endAt) return;
      localTimerInterval = setInterval(() => {
          renderAuction();
      }, 200);
  }
  
  function getTeam(id){ return (state.teams || []).find(t=>t.id===id); }
  function getPlayer(id){ return (state.players || []).find(p=>p.id===id); }
  function getActivePlayer(){ return (state.players || []).find(p=>p.id===state.activePlayerId); }
  function fmt(n){ return (n||0).toLocaleString('en-IN'); }
  function escapeHtml(str){ return (String(str)).replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
  
  function returnToConnectionScreen(message) {
      if (activeSessionRef) {
          activeSessionRef.off();
          activeSessionRef = null;
      }
      const connectionScreen = document.getElementById('connection-screen');
      const mainContent = document.getElementById('main-content');
      const errorDisplay = document.getElementById('error-display');
      const connectBtn = document.getElementById('connect-btn');
      const codeInput = document.getElementById('session-code-input');
      const changeSessionBtn = document.getElementById('change-session-btn');
  
      mainContent.style.display = 'none';
      changeSessionBtn.style.display = 'none';
      connectionScreen.style.display = 'flex';
      
      errorDisplay.textContent = message || '';
      connectBtn.textContent = 'Connect';
      connectBtn.disabled = false;
      codeInput.value = '';
  }
  
  function connectToFirebase(sessionID) {
      const connectionScreen = document.getElementById('connection-screen');
      const mainContent = document.getElementById('main-content');
      const errorDisplay = document.getElementById('error-display');
      const connectBtn = document.getElementById('connect-btn');
      const changeSessionBtn = document.getElementById('change-session-btn');
      
      errorDisplay.textContent = '';
      connectBtn.textContent = 'Connecting...';
      connectBtn.disabled = true;
  
      activeSessionRef = db.ref('auctions/' + sessionID);
  
      activeSessionRef.once('value', (snapshot) => {
          if (snapshot.exists()) {
              connectionScreen.style.display = 'none';
              mainContent.style.display = 'block';
              changeSessionBtn.style.display = 'block';
  
              activeSessionRef.on('value', (liveSnapshot) => {
                  if (liveSnapshot.exists()) {
                      const receivedState = liveSnapshot.val();
                      Object.assign(state, receivedState);
                      renderAll();
                      startLocalTimer();
                  } else {
                      returnToConnectionScreen('The auction session has ended. Enter a new code to connect.');
                  }
              });
          } else {
              returnToConnectionScreen('Session code not found. Please check the code and try again.');
          }
      });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const sessionFromUrl = params.get('session');
      const connectBtn = document.getElementById('connect-btn');
      const codeInput = document.getElementById('session-code-input');
      const changeSessionBtn = document.getElementById('change-session-btn');
  
      if (sessionFromUrl) {
          connectToFirebase(sessionFromUrl.toUpperCase());
      } 
  
      connectBtn.onclick = () => {
          const sessionFromInput = codeInput.value.trim().toUpperCase();
          if (sessionFromInput) {
              connectToFirebase(sessionFromInput);
          } else {
              document.getElementById('error-display').textContent = 'Please enter a session code.';
          }
      };
  
      codeInput.onkeyup = (e) => {
          if (e.key === 'Enter') {
              connectBtn.click();
          }
      };
      
      changeSessionBtn.onclick = () => {
          returnToConnectionScreen('');
      };
  
      ['search', 'filterTeam', 'filterStatus'].forEach(id=>{
          const element = document.getElementById(id);
          if (element) {
              element.addEventListener('input', renderPlayers);
              element.addEventListener('change', renderPlayers);
          }
      });
  });
