/* =========================================================
   ULTRON // IRIS NEURAL INTERFACE — script.js
   Vanilla JS. Works standalone in "demo mode" (simulated
   data) and upgrades to live data automatically when a
   backend REST URL / WebSocket is configured in Settings.
========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     ICONS — minimal inline line-icon set, injected into any
     element with [data-icon="name"]
  --------------------------------------------------------- */
  const ICONS = {
    home:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>',
    chat:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    mic:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><line x1="12" y1="19" x2="12" y2="22"/></svg>',
    activity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 12 7 12 10 20 14 4 17 12 22 12"/></svg>',
    check:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 12 9 18 21 6"/></svg>',
    bell:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>',
    grid:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    chrome: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v7"/><path d="M4.2 7.5l6 3.5"/><path d="M13.8 13l6 3.5"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="3"/><polygon points="10 9 16 12 10 15" fill="currentColor" stroke="none"/></svg>',
    mail:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6.5 9-6.5"/></svg>',
    chat2:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.9 8.9 0 0 1-3.9-.9L3 20l1.1-4A8.4 8.4 0 1 1 21 11.5z"/></svg>',
    calc:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="8" y2="11"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/><line x1="8" y1="19" x2="8" y2="19"/><line x1="12" y1="19" x2="12" y2="19"/><line x1="16" y1="19" x2="16" y2="19"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    cloud:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.3A6 6 0 1 0 6 15.5H18a4 4 0 0 0 0-8z"/></svg>',
    file:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="13 2 13 8 19 8"/></svg>'
  };
  document.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = ICONS[el.dataset.icon] || '';
  });

  /* ---------------------------------------------------------
     STORAGE HELPERS
  --------------------------------------------------------- */
  const LS = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    }
  };

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  const DEFAULTS = window.IRIS_CONFIG || {};
  const state = {
    backendUrl: LS.get('iris_backend_url', DEFAULTS.backendUrl || ''),
    wsUrl: LS.get('iris_backend_ws', DEFAULTS.wsUrl || ''),
    ws: null,
    live: false,
    stats: { cpu: 28, ram: 44, batt: 82, net: 55 },
    history: LS.get('iris_history', []),
    tasks: LS.get('iris_tasks', []),
    reminders: LS.get('iris_reminders', []),
    chat: LS.get('iris_chat', []),
    voice: LS.get('iris_voice', true)
  };

  /* ---------------------------------------------------------
     ELEMENT REFS
  --------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    hamburger: $('hamburger'), sidebar: $('sidebar'), scrim: $('sidebar-scrim'),
    navList: $('nav-list'), connPill: $('conn-pill'),
    hudCpu: $('hud-cpu'), hudRam: $('hud-ram'), hudBatt: $('hud-batt'),
    hudNet: $('hud-net'), hudNetDot: $('hud-net-dot'), hudTime: $('hud-time'), hudDate: $('hud-date'),
    irisCore: $('iris-core'), coreParticles: $('core-particles'), coreState: $('core-state'),
    coreWaveform: $('core-waveform'), bootLog: $('boot-log'),
    historyList: $('history-list'), clearHistory: $('clear-history'),
    chatMessages: $('chat-messages'), chatStatus: $('chat-status'), clearChat: $('clear-chat'),
    micOrb: $('mic-orb'), micLabel: $('mic-label'), micWaveform: $('mic-waveform'), transcript: $('transcript'),
    gaugeCpu: $('gauge-cpu'), gaugeRam: $('gauge-ram'), gaugeBatt: $('gauge-batt'), gaugeNet: $('gauge-net'),
    valCpu: $('val-cpu'), valRam: $('val-ram'), valBatt: $('val-batt'), valNet: $('val-net'),
    diagLines: $('diag-lines'),
    taskForm: $('task-form'), taskInput: $('task-input'), taskList: $('task-list'),
    reminderForm: $('reminder-form'), reminderInput: $('reminder-input'), reminderList: $('reminder-list'),
    translateForm: $('translate-form'), translateInput: $('translate-input'),
    translateLang: $('translate-lang'), translateResult: $('translate-result'),
    weatherForm: $('weather-form'), weatherInput: $('weather-input'), weatherResult: $('weather-result'),
    calcDisplay: $('calc-display'), calcGrid: $('calc-grid'),
    screenshotBtn: $('screenshot-btn'), screenshotResult: $('screenshot-result'),
    backendUrlInput: $('backend-url'), backendSave: $('backend-save'),
    backendWsInput: $('backend-ws'), wsConnect: $('ws-connect'), settingsStatus: $('settings-status'),
    micBtnInline: $('mic-btn-inline'), commandInput: $('command-input'), sendBtn: $('send-btn')
  };

  /* ---------------------------------------------------------
     NAVIGATION
  --------------------------------------------------------- */
  function switchView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = $('view-' + name);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(li => {
      li.classList.toggle('active', li.dataset.view === name);
    });
    closeSidebar();
  }
  els.navList.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item');
    if (item) switchView(item.dataset.view);
  });
  function openSidebar() { els.sidebar.classList.add('open'); els.scrim.classList.add('show'); }
  function closeSidebar() { els.sidebar.classList.remove('open'); els.scrim.classList.remove('show'); }
  els.hamburger.addEventListener('click', () => {
    els.sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  els.scrim.addEventListener('click', closeSidebar);

  /* ---------------------------------------------------------
     CLOCK
  --------------------------------------------------------- */
  function tickClock() {
    const now = new Date();
    els.hudTime.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
    els.hudDate.textContent = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------------------------------------------------------
     SYSTEM STATS — simulated by default, live if backend
     pushes { type:'stats', cpu, ram, batt, net } over WS
  --------------------------------------------------------- */
  function randomWalk(v, min, max, step) {
    v += (Math.random() - 0.5) * step;
    return Math.max(min, Math.min(max, v));
  }
  const GAUGE_CIRC = 327;
  function applyStats(s) {
    state.stats = s;
    els.hudCpu.textContent = Math.round(s.cpu) + '%';
    els.hudRam.textContent = Math.round(s.ram) + '%';
    els.hudBatt.textContent = Math.round(s.batt) + '%';
    els.hudNet.textContent = s.net > 5 ? 'LINK' : 'WEAK';
    els.hudNetDot.style.background = s.net > 5 ? 'var(--cyan)' : 'var(--crimson)';
    els.valCpu.textContent = Math.round(s.cpu) + '%';
    els.valRam.textContent = Math.round(s.ram) + '%';
    els.valBatt.textContent = Math.round(s.batt) + '%';
    els.valNet.textContent = Math.round(s.net) + '%';
    setGauge(els.gaugeCpu, s.cpu);
    setGauge(els.gaugeRam, s.ram);
    setGauge(els.gaugeBatt, s.batt);
    setGauge(els.gaugeNet, s.net);
  }
  function setGauge(el, pct) {
    if (!el) return;
    const offset = GAUGE_CIRC - (GAUGE_CIRC * Math.max(0, Math.min(100, pct))) / 100;
    el.style.strokeDashoffset = offset;
  }
  function simulateStatsTick() {
    if (state.ws && state.ws.readyState === 1) return;
    const s = state.stats;
    applyStats({
      cpu: randomWalk(s.cpu, 8, 92, 14),
      ram: randomWalk(s.ram, 20, 88, 8),
      batt: Math.max(1, s.batt - 0.02),
      net: randomWalk(s.net, 30, 98, 20)
    });
  }
  applyStats(state.stats);
  setInterval(simulateStatsTick, 2200);

  function pushDiag(line) {
    const p = document.createElement('div');
    p.textContent = `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}] ${line}`;
    els.diagLines.prepend(p);
    while (els.diagLines.children.length > 40) els.diagLines.lastChild.remove();
  }
  setInterval(() => {
    const s = state.stats;
    pushDiag(`CPU ${Math.round(s.cpu)}% · RAM ${Math.round(s.ram)}% · BATT ${Math.round(s.batt)}% · NET ${Math.round(s.net)}%`);
  }, 6000);

  /* ---------------------------------------------------------
     CORE STATE MACHINE + BOOT LOG + PARTICLES
  --------------------------------------------------------- */
  const CORE_STATES = ['idle', 'listening', 'processing', 'executing', 'completed'];
  function setCoreState(name, label) {
    CORE_STATES.forEach(s => els.irisCore.classList.remove(s));
    if (name !== 'idle') els.irisCore.classList.add(name);
    els.coreState.textContent = label || {
      idle: 'SYSTEM IDLE', listening: 'LISTENING…', processing: 'PROCESSING…',
      executing: 'EXECUTING…', completed: 'TASK COMPLETE'
    }[name];
  }

  const BOOT_LINES = [
    'INITIALIZING NEURAL CORE…', 'LOADING IRIS PROTOCOLS…',
    'CALIBRATING HOLOGRAPHIC PROJECTION…', 'LINKING COMMAND MODULES…',
    'SYSTEM READY.'
  ];
  function runBootSequence() {
    let i = 0;
    setCoreState('processing', 'BOOTING…');
    const step = () => {
      if (i >= BOOT_LINES.length) {
        setTimeout(() => { els.bootLog.textContent = ''; setCoreState('idle'); }, 1400);
        return;
      }
      els.bootLog.textContent = BOOT_LINES[i];
      i++;
      setTimeout(step, 480);
    };
    step();
  }
  runBootSequence();

  function spawnParticle() {
    const span = document.createElement('span');
    const left = 20 + Math.random() * 60;
    span.style.left = left + '%';
    span.style.bottom = '30%';
    span.style.animationDuration = (2 + Math.random() * 2.2) + 's';
    els.coreParticles.appendChild(span);
    setTimeout(() => span.remove(), 4400);
  }
  setInterval(spawnParticle, 260);

  /* ---------------------------------------------------------
     COMMAND HISTORY
  --------------------------------------------------------- */
  function renderHistory() {
    els.historyList.innerHTML = '';
    if (!state.history.length) {
      els.historyList.innerHTML = '<li class="empty-note">No commands issued yet.</li>';
      return;
    }
    state.history.slice(0, 50).forEach(h => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="h-flag ${h.ok ? 'ok' : 'fail'}"></span>
        <span class="h-time">${h.time}</span><span class="h-cmd">${escapeHtml(h.cmd)}</span>`;
      els.historyList.appendChild(li);
    });
  }
  function addHistory(cmd, ok = true) {
    state.history.unshift({ cmd, ok, time: new Date().toLocaleTimeString('en-GB', { hour12: false }) });
    state.history = state.history.slice(0, 50);
    LS.set('iris_history', state.history);
    renderHistory();
  }
  renderHistory();
  els.clearHistory.addEventListener('click', () => {
    state.history = [];
    LS.set('iris_history', state.history);
    renderHistory();
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ---------------------------------------------------------
     CHAT
  --------------------------------------------------------- */
  /* ---------------------------------------------------------
     VOICE OUTPUT — browser text-to-speech (speechSynthesis)
     IRIS speaks its replies aloud; toggle in Settings.
  --------------------------------------------------------- */
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices() || [];
    const en = voices.filter(v => /^en/i.test(v.lang));
    return en.find(v => /zira|female|samantha|google uk english female/i.test(v.name)) || en[0] || null;
  }
  const _utterances = []; // keep references so the browser doesn't garbage-collect them mid-speech
  function speak(text, force, verbose) {
    if (!('speechSynthesis' in window)) return;
    if (!state.voice && !force) return;
    const clean = String(text).replace(/[*_`#>~]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume();
    // Small delay after cancel(): speaking in the same tick is silently dropped in some Chrome versions.
    setTimeout(() => {
      const voice = pickVoice();
      const count = (synth.getVoices() || []).length;
      if (verbose) els.settingsStatus.textContent = `Voices found: ${count}. Using: ${voice ? voice.name : 'browser default'}.`;
      _utterances.length = 0;
      (clean.match(/[^.!?]+[.!?]*/g) || [clean]).slice(0, 12).forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part.trim());
        if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = 'en-US'; }
        u.volume = 1;
        if (verbose && i === 0) u.onstart = () => { els.settingsStatus.textContent += ' Speaking now — if you hear nothing, check tab mute, volume and output device.'; };
        u.onerror = (e) => {
          if (e.error === 'interrupted' || e.error === 'canceled') return;
          els.settingsStatus.textContent = 'Speech error: ' + (e.error || 'unknown');
        };
        _utterances.push(u);
        synth.speak(u);
      });
    }, 80);
  }
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = () => {};

  function appendChat(role, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'user' : 'iris');
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    div.innerHTML = `${escapeHtml(text)}<span class="msg-time">${time}</span>`;
    els.chatMessages.appendChild(div);
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    state.chat.push({ role, text, time });
    state.chat = state.chat.slice(-200);
    LS.set('iris_chat', state.chat);
    if (role !== 'user') speak(text);
  }
  function loadChat() {
    els.chatMessages.innerHTML = '';
    state.chat.forEach(m => {
      const div = document.createElement('div');
      div.className = 'msg ' + (m.role === 'user' ? 'user' : 'iris');
      div.innerHTML = `${escapeHtml(m.text)}<span class="msg-time">${m.time}</span>`;
      els.chatMessages.appendChild(div);
    });
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
  }
  loadChat();
  els.clearChat.addEventListener('click', () => {
    state.chat = [];
    LS.set('iris_chat', state.chat);
    loadChat();
  });

  const DEMO_REPLIES = [
    'Acknowledged, Commander. Standing by for further instructions.',
    'Analysis complete. All systems nominal.',
    'Running in demo mode — connect a backend in Settings for full autonomy.',
    'Command logged. Simulated response returned.',
    'IRIS online. How else can I assist?'
  ];
  function demoReply(text) {
    const t = text.toLowerCase();
    if (/\bhello|hi\b/.test(t)) return 'Greetings. IRIS neural core is active and listening.';
    if (/how are you/.test(t)) return 'All subsystems nominal. Ready for tasking.';
    if (/who are you|what are you/.test(t)) return "I am IRIS — Intelligent Response & Interface System, running on the ULTRON core.";
    return DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
  }

  /* ---------------------------------------------------------
     COMMAND ROUTER — the core brain of the command bar
  --------------------------------------------------------- */
  const APP_URLS = {
    youtube: 'https://youtube.com',
    gmail: 'https://mail.google.com',
    whatsapp: 'https://web.whatsapp.com',
    instagram: 'https://instagram.com'
  };
  const NATIVE_ONLY = ['chrome', 'notepad'];

  async function processCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    const t = cmd.toLowerCase();
    setCoreState('processing');
    els.chatStatus.textContent = 'IRIS IS PROCESSING…';

    try {
      // ---- Local command interpreter (runs in the browser) ----
      let handled = true;

      if (/^open (\w+)/.test(t)) {
        const app = t.match(/^open (\w+)/)[1];
        if (app === 'calculator') { switchView('calculator'); }
        else if (APP_URLS[app]) { window.open(APP_URLS[app], '_blank'); }
        else if (NATIVE_ONLY.includes(app)) {
          switchView('chat');
          appendChat('iris', `A website can't launch desktop apps like "${app}" — that only works in the IRIS desktop version.`);
        } else {
          switchView('chat');
          appendChat('iris', `I don't recognize the application "${app}" yet.`);
        }
      } else if (/^calculate\s+/.test(t) || /^\d/.test(t.replace('calculate', '').trim())) {
        const expr = naturalToMath(t.replace(/^calculate\s+/, ''));
        const result = safeEval(expr);
        switchView('calculator');
        els.calcDisplay.value = (result === null ? 'ERROR' : String(result));
        calcState.acc = (result === null ? '0' : String(result));
      } else if (/screenshot/.test(t)) {
        switchView('screenshot');
        captureScreenshot();
      } else if (/system status|diagnostics/.test(t)) {
        switchView('system');
      } else if (/^weather/.test(t)) {
        const city = t.replace(/^weather\s*/, '').trim();
        switchView('weather');
        if (city) { els.weatherInput.value = city; fetchWeather(city); }
      } else if (/^(remind me|reminder)/.test(t)) {
        const text = cmd.replace(/^(remind me( to)?|reminder)/i, '').trim();
        if (text) { addReminder(text); switchView('reminders'); }
      } else if (/^(task|add task|todo)/.test(t)) {
        const text = cmd.replace(/^(add task|task|todo)/i, '').trim();
        if (text) { addTask(text); switchView('tasks'); }
      } else {
        handled = false;
      }

      addHistory(cmd, true);

      if (!handled) {
        const history = state.chat.slice(-10).map(m => ({ role: m.role, text: m.text }));
        switchView('chat');
        appendChat('user', cmd);
        setCoreState('executing');
        els.chatStatus.textContent = 'IRIS IS THINKING…';
        appendChat('iris', await askAI(cmd, history));
      }

      els.chatStatus.textContent = '';
      setCoreState('completed');
      setTimeout(() => setCoreState('idle'), 1000);
    } catch (err) {
      addHistory(cmd, false);
      els.chatStatus.textContent = '';
      setCoreState('idle');
      switchView('chat');
      appendChat('iris', `Error executing command: ${err.message}`);
    }
  }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ---------------------------------------------------------
     AI — asks the Ollama-powered backend; falls back to demo
     replies if the backend is unreachable.
  --------------------------------------------------------- */
  async function askAI(cmd, history) {
    if (!state.live || !state.backendUrl) { await wait(400); return demoReply(cmd); }
    try {
      const res = await fetch(state.backendUrl.replace(/\/$/, '') + '/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: cmd, history, now: new Date().toString() })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.reply) return data.reply;
      return data.error || 'The AI service returned an error.';
    } catch {
      return 'I could not reach the AI service. ' + demoReply(cmd);
    }
  }

  function naturalToMath(str) {
    return str
      .replace(/times|multiplied by|x/gi, '*')
      .replace(/plus|added to/gi, '+')
      .replace(/minus|subtract/gi, '-')
      .replace(/divided by|over/gi, '/')
      .replace(/[^0-9+\-*/.() ]/g, '')
      .trim();
  }
  function safeEval(expr) {
    if (!/^[0-9+\-*/.() \s]+$/.test(expr) || !expr.trim()) return null;
    try {
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${expr})`)();
      return typeof val === 'number' && isFinite(val) ? Math.round(val * 1e8) / 1e8 : null;
    } catch { return null; }
  }

  /* ---------------------------------------------------------
     COMMAND BAR (footer, global input)
  --------------------------------------------------------- */
  function submitCommand() {
    const val = els.commandInput.value;
    if (!val.trim()) return;
    els.commandInput.value = '';
    processCommand(val);
  }
  els.sendBtn.addEventListener('click', submitCommand);
  els.commandInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitCommand(); });

  /* ---------------------------------------------------------
     QUICK CARDS (home + applications views)
  --------------------------------------------------------- */
  document.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      if (/screenshot/i.test(cmd)) { switchView('screenshot'); captureScreenshot(); addHistory(cmd, true); return; }
      processCommand(cmd);
    });
  });

  /* ---------------------------------------------------------
     VOICE — Web Speech API where available, graceful fallback
  --------------------------------------------------------- */
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizer = null;
  let listening = false;
  let waveformTimer = null;

  function buildWaveformBars(container, count) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.style.height = '6px';
      container.appendChild(span);
    }
  }
  buildWaveformBars(els.micWaveform, 28);

  function animateWaveform(container) {
    clearInterval(waveformTimer);
    waveformTimer = setInterval(() => {
      container.querySelectorAll('span').forEach(s => {
        s.style.height = listening ? (4 + Math.random() * 26) + 'px' : '4px';
      });
    }, 110);
  }

  function startListening() {
    listening = true;
    els.micOrb.classList.add('active');
    els.micLabel.textContent = 'LISTENING…';
    setCoreState('listening');
    animateWaveform(els.micWaveform);

    if (SpeechRecognition) {
      recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';
      recognizer.onresult = (e) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
        els.transcript.textContent = text;
      };
      recognizer.onerror = () => stopListening(true);
      recognizer.onend = () => stopListening(true);
      try { recognizer.start(); } catch { stopListening(false); }
    } else {
      els.transcript.textContent = 'Voice recognition is not supported in this browser. Type your command below instead.';
      setTimeout(() => stopListening(false), 1800);
    }
  }
  function stopListening(submit) {
    listening = false;
    els.micOrb.classList.remove('active');
    els.micLabel.textContent = 'PRESS TO SPEAK';
    clearInterval(waveformTimer);
    buildWaveformBars(els.micWaveform, 28);
    setCoreState('idle');
    if (recognizer) { try { recognizer.stop(); } catch {} recognizer = null; }
    const text = els.transcript.textContent.trim();
    if (submit && text && !/not supported/i.test(text)) {
      processCommand(text);
    }
  }
  els.micOrb.addEventListener('click', () => {
    listening ? stopListening(true) : (els.transcript.textContent = '', startListening());
  });
  els.micBtnInline.addEventListener('click', () => {
    if (!SpeechRecognition) { switchView('voice'); return; }
    switchView('voice');
    listening ? stopListening(true) : (els.transcript.textContent = '', startListening());
  });

  /* ---------------------------------------------------------
     TASKS
  --------------------------------------------------------- */
  function renderTasks() {
    els.taskList.innerHTML = '';
    if (!state.tasks.length) { els.taskList.innerHTML = '<li class="empty-note">No tasks yet.</li>'; return; }
    state.tasks.forEach((task, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${escapeHtml(task)}</span><button aria-label="Remove">✕</button>`;
      li.querySelector('button').addEventListener('click', () => {
        state.tasks.splice(i, 1); LS.set('iris_tasks', state.tasks); renderTasks();
      });
      els.taskList.appendChild(li);
    });
  }
  function addTask(text) { state.tasks.push(text); LS.set('iris_tasks', state.tasks); renderTasks(); }
  renderTasks();
  els.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = els.taskInput.value.trim();
    if (v) { addTask(v); addHistory('add task: ' + v, true); els.taskInput.value = ''; }
  });

  /* ---------------------------------------------------------
     REMINDERS
  --------------------------------------------------------- */
  function renderReminders() {
    els.reminderList.innerHTML = '';
    if (!state.reminders.length) { els.reminderList.innerHTML = '<li class="empty-note">No reminders yet.</li>'; return; }
    state.reminders.forEach((r, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${escapeHtml(r)}</span><button aria-label="Remove">✕</button>`;
      li.querySelector('button').addEventListener('click', () => {
        state.reminders.splice(i, 1); LS.set('iris_reminders', state.reminders); renderReminders();
      });
      els.reminderList.appendChild(li);
    });
  }
  function addReminder(text) { state.reminders.push(text); LS.set('iris_reminders', state.reminders); renderReminders(); }
  renderReminders();
  els.reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = els.reminderInput.value.trim();
    if (v) { addReminder(v); addHistory('reminder: ' + v, true); els.reminderInput.value = ''; }
  });

  /* ---------------------------------------------------------
     TRANSLATOR — uses free public MyMemory API (no key needed)
     if there is network access; falls back to a clear notice.
  --------------------------------------------------------- */
  els.translateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = els.translateInput.value.trim();
    const lang = (els.translateLang.value.trim() || 'en').toLowerCase();
    if (!text) return;
    els.translateResult.textContent = 'Translating…';
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${encodeURIComponent(lang)}`;
      const res = await fetch(url);
      const data = await res.json();
      els.translateResult.textContent = data?.responseData?.translatedText || 'No translation returned.';
      addHistory(`translate: "${text}" → ${lang}`, true);
    } catch {
      els.translateResult.textContent = 'Translation unavailable (the public translation service is unreachable).';
      addHistory(`translate: "${text}"`, false);
    }
  });

  /* ---------------------------------------------------------
     WEATHER — Open-Meteo (free, no key) geocode + forecast
  --------------------------------------------------------- */
  const WEATHER_CODES = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Drizzle',
    55: 'Dense drizzle', 61: 'Slight rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Snow', 75: 'Heavy snow', 80: 'Rain showers',
    81: 'Rain showers', 82: 'Violent rain showers', 95: 'Thunderstorm',
    96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
  };
  async function fetchWeather(city) {
    els.weatherResult.textContent = 'Fetching…';
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
      const geo = await geoRes.json();
      if (!geo.results || !geo.results.length) {
        els.weatherResult.textContent = `Could not find a location named "${city}".`;
        addHistory('weather: ' + city, false);
        return;
      }
      const { latitude, longitude, name, country } = geo.results[0];
      const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      const w = await wRes.json();
      const cw = w.current_weather;
      const desc = WEATHER_CODES[cw.weathercode] || 'Unknown conditions';
      els.weatherResult.textContent = `${name}, ${country} — ${cw.temperature}°C, ${desc}. Wind ${cw.windspeed} km/h.`;
      addHistory('weather: ' + city, true);
    } catch {
      els.weatherResult.textContent = 'Weather data unavailable — please try again in a moment.';
      addHistory('weather: ' + city, false);
    }
  }
  els.weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = els.weatherInput.value.trim();
    if (city) fetchWeather(city);
  });

  /* ---------------------------------------------------------
     CALCULATOR
  --------------------------------------------------------- */
  const calcState = { acc: '0' };
  const CALC_KEYS = [
    'C', '⌫', '(', ')',
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];
  CALC_KEYS.forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = key;
    if ('/*-+'.includes(key)) btn.classList.add('op');
    if (key === '=') btn.classList.add('eq');
    btn.addEventListener('click', () => calcPress(key));
    els.calcGrid.appendChild(btn);
  });
  function calcPress(key) {
    if (key === 'C') { calcState.acc = '0'; }
    else if (key === '⌫') { calcState.acc = calcState.acc.length > 1 ? calcState.acc.slice(0, -1) : '0'; }
    else if (key === '=') {
      const result = safeEval(calcState.acc);
      calcState.acc = result === null ? 'ERROR' : String(result);
    } else {
      calcState.acc = calcState.acc === '0' || calcState.acc === 'ERROR' ? key : calcState.acc + key;
    }
    els.calcDisplay.value = calcState.acc;
  }
  els.calcDisplay.value = calcState.acc;

  /* ---------------------------------------------------------
     SCREENSHOT — backend if connected, else browser
     getDisplayMedia (requires a direct user gesture)
  --------------------------------------------------------- */
  async function captureScreenshot() {
    els.screenshotResult.innerHTML = 'Capturing…';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      els.screenshotResult.textContent = 'Screen capture is not supported in this browser (try desktop Chrome, Edge or Firefox).';
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      await wait(250);
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      stream.getTracks().forEach(t => t.stop());
      const dataUrl = canvas.toDataURL('image/png');
      els.screenshotResult.innerHTML = `
        <img src="${dataUrl}" style="max-width:100%;border-radius:4px;border:1px solid var(--line);margin-bottom:10px" alt="Screenshot">
        <a class="primary-btn" style="display:inline-block;text-decoration:none" href="${dataUrl}" download="iris-screenshot.png">DOWNLOAD</a>`;
    } catch (err) {
      els.screenshotResult.textContent = 'Screen capture was cancelled or denied.';
    }
  }
  els.screenshotBtn.addEventListener('click', captureScreenshot);

  /* ---------------------------------------------------------
     SETTINGS — backend REST + WebSocket connection
  --------------------------------------------------------- */
  els.backendUrlInput.value = state.backendUrl;
  els.backendWsInput.value = state.wsUrl;

  function setConnState(live) {
    state.live = live;
    els.connPill.textContent = live ? 'AI ONLINE' : 'DEMO MODE';
    els.connPill.classList.toggle('live', live);
  }

  els.backendSave.addEventListener('click', async () => {
    const url = els.backendUrlInput.value.trim();
    state.backendUrl = url;
    LS.set('iris_backend_url', url);
    if (!url) {
      setConnState(false);
      els.settingsStatus.textContent = 'Not connected — running in demo mode with simulated data.';
      return;
    }
    els.settingsStatus.textContent = 'Checking backend…';
    try {
      const res = await fetch(url.replace(/\/$/, '') + '/api/ping', { method: 'GET' });
      if (res.ok) {
        setConnState(true);
        els.settingsStatus.textContent = `Connected to IRIS backend at ${url}.`;
      } else {
        throw new Error('bad response');
      }
    } catch {
      setConnState(false);
      els.settingsStatus.textContent = `Could not reach ${url}. Running in demo mode with simulated data.`;
    }
  });

  els.wsConnect.addEventListener('click', () => {
    const url = els.backendWsInput.value.trim();
    if (!url) return;
    state.wsUrl = url;
    LS.set('iris_backend_ws', url);
    if (state.ws) { try { state.ws.close(); } catch {} }
    els.settingsStatus.textContent = 'Connecting to WebSocket…';
    try {
      const ws = new WebSocket(url);
      state.ws = ws;
      ws.onopen = () => {
        setConnState(true);
        els.settingsStatus.textContent = `Live socket connected: ${url}`;
      };
      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'stats') applyStats({ cpu: msg.cpu, ram: msg.ram, batt: msg.batt, net: msg.net });
          if (msg.type === 'chat') { switchView('chat'); appendChat('iris', msg.text); }
          if (msg.type === 'log') pushDiag(msg.text);
        } catch {}
      };
      ws.onclose = () => { setConnState(false); els.settingsStatus.textContent = 'WebSocket disconnected — demo mode resumed.'; };
      ws.onerror = () => { setConnState(false); els.settingsStatus.textContent = 'WebSocket connection failed — demo mode resumed.'; };
    } catch {
      els.settingsStatus.textContent = 'Invalid WebSocket URL.';
    }
  });

  // Auto-attempt a saved/default connection on load (silent, no error noise if absent).
  if (state.backendUrl) {
    fetch(state.backendUrl.replace(/\/$/, '') + '/api/ping').then(res => {
      if (res.ok) {
        setConnState(true);
        els.settingsStatus.textContent = `Connected to IRIS backend at ${state.backendUrl}.`;
      }
    }).catch(() => {});
  }
  if (state.wsUrl) {
    els.backendWsInput.value = state.wsUrl;
    els.wsConnect.click();
  }

  /* Voice controls in Settings (added from script so the page markup stays unchanged) */
  (function addVoiceSettings() {
    const panel = document.querySelector('#view-settings .panel');
    if (!panel) return;
    const row = document.createElement('div');
    row.innerHTML = '<label class="field-label">Voice replies (IRIS speaks answers aloud)</label>' +
      '<div class="line-form"><button id="voice-toggle" type="button"></button>' +
      '<button id="voice-test" type="button">TEST VOICE</button></div>';
    panel.appendChild(row);
    const toggle = row.querySelector('#voice-toggle');
    const render = () => { toggle.textContent = state.voice ? 'VOICE: ON' : 'VOICE: OFF'; };
    render();
    toggle.addEventListener('click', () => {
      state.voice = !state.voice; LS.set('iris_voice', state.voice); render();
      if (!state.voice && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    });
    row.querySelector('#voice-test').addEventListener('click', () => {
      if (!('speechSynthesis' in window)) { els.settingsStatus.textContent = 'This browser does not support speech output.'; return; }
      speak('IRIS voice systems online.', true, true);
    });
  })();

})();
