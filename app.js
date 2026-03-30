// app.js — all application logic extracted from index.html
// Imports workouts data from workouts.js (ES module).
// Firebase SDK is imported via CDN script tags in index.html,
// so the firebase globals (initializeApp, getAuth, etc.) are
// available on the window when this module runs.

import { workouts } from './workouts.js';

import { initializeApp }                        from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup,
         signInWithEmailAndPassword, createUserWithEmailAndPassword,
         signOut, onAuthStateChanged, signInAnonymously,
         signInWithCustomToken }                from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
import { getAnalytics }                         from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js';

// ─── Firebase setup ───────────────────────────────────────────────────────────
const firebaseConfig = {
    apiKey: "AIzaSyAdWYZmp9zfQ7Rbvi91WBUSHPmgOWypAfM",
    authDomain: "training-assistant-44a28.firebaseapp.com",
    projectId: "training-assistant-44a28",
    storageBucket: "training-assistant-44a28.firebasestorage.app",
    messagingSenderId: "385371344810",
    appId: "1:385371344810:web:ee262a94683b54ad58e5d3",
    measurementId: "G-PBPMKQLKT8"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
// ⚠️ Changing this ID orphans all existing users' Firestore data.
const appId = 'training-pro-v3';

try { getAnalytics(app); } catch (e) {}

// ─── State ────────────────────────────────────────────────────────────────────
const normalizeName = (name) => (name || "").replace(/['"]/g, "").trim();

const exerciseMap = {};
Object.keys(workouts).forEach(cat => {
    workouts[cat].forEach(slot => {
        slot.options.forEach(opt => {
            exerciseMap[normalizeName(opt.name)] = cat.toUpperCase();
        });
    });
});

let trainingLogs     = [];
let chartInstance    = null;
let currentUser      = null;
let currentSystem    = localStorage.getItem('trainingSystem') || 'PPL';
let selectedExercises = JSON.parse(localStorage.getItem('selectedExercises') || '{}');
const saveSelectedExercises = () => localStorage.setItem('selectedExercises', JSON.stringify(selectedExercises));

// ─── Theme ────────────────────────────────────────────────────────────────────
const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeUI(isDark);
};

const updateThemeUI = (isDark) => {
    const icon     = document.getElementById('theme-icon');
    if (icon) icon.textContent = isDark ? 'Jasny' : 'Ciemny';
    const authIcon = document.getElementById('auth-theme-toggle');
    if (authIcon) authIcon.textContent = isDark ? 'Jasny' : 'Ciemny';
};

updateThemeUI(document.documentElement.classList.contains('dark'));
document.getElementById('auth-theme-toggle').onclick = toggleTheme;
document.getElementById('theme-toggle').onclick       = toggleTheme;

// ─── Auth UI helpers ──────────────────────────────────────────────────────────
const showError = (msg) => {
    document.getElementById('auth-error-container').classList.remove('hidden');
    document.getElementById('auth-error').textContent = msg;
};
const hideError = () => {
    document.getElementById('auth-error-container').classList.add('hidden');
};

const loginWithGoogle = async () => {
    hideError();
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (e) {
        showError(`Błąd autoryzacji Google: ${e.message}`);
    }
};

const loginWithEmail = async () => {
    hideError();
    const e = document.getElementById('auth-email').value;
    const p = document.getElementById('auth-password').value;
    if (!e || !p) return showError("Wprowadź dane.");
    try { await signInWithEmailAndPassword(auth, e, p); } catch (err) { showError(err.message); }
};

const registerWithEmail = async () => {
    hideError();
    const e = document.getElementById('auth-email').value;
    const p = document.getElementById('auth-password').value;
    if (!e || !p) return showError("Wprowadź dane.");
    try { await createUserWithEmailAndPassword(auth, e, p); } catch (err) { showError(err.message); }
};

document.getElementById('google-login').onclick   = loginWithGoogle;
document.getElementById('email-login').onclick    = loginWithEmail;
document.getElementById('email-register').onclick = registerWithEmail;
document.getElementById('logout-btn').onclick     = () => signOut(auth);

// ─── Auth state ───────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        document.getElementById('auth-overlay').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        document.getElementById('app-nav').classList.remove('hidden');
        document.getElementById('user-id-display').textContent = user.isAnonymous ? "Gość" : user.email;
        syncLogs(user.uid);
        updateSystemUI();
    } else {
        document.getElementById('auth-overlay').classList.remove('hidden');
        document.getElementById('app-content').classList.add('hidden');
        document.getElementById('app-nav').classList.add('hidden');
    }
});

const initAuth = async () => {
    if (auth.currentUser) return;
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
            await signInWithCustomToken(auth, __initial_auth_token);
        } catch (e) {
            await signInAnonymously(auth);
        }
    } else {
        try { await signInAnonymously(auth); } catch (e) {}
    }
};
initAuth();

// ─── Firestore sync ───────────────────────────────────────────────────────────
const syncLogs = (uid) => {
    if (!currentUser) return;
    onSnapshot(doc(db, 'artifacts', appId, 'users', uid, 'data', 'logs'), (snap) => {
        trainingLogs = snap.exists() ? (snap.data().entries || []) : [];
        renderAll();
    }, (err) => {
        console.error("Błąd synchronizacji:", err);
    });
};

const saveToCloud = async (entries) => {
    if (!currentUser) return;
    try {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'data', 'logs'), { entries });
        showToast("Zsynchronizowano");
    } catch (e) {
        showToast("Błąd zapisu — sprawdź połączenie");
        console.error("saveToCloud:", e);
    }
};

// ─── Stats ────────────────────────────────────────────────────────────────────
const getStats = (name) => {
    const filtered = trainingLogs.filter(l => normalizeName(l.exercise) === normalizeName(name));
    if (!filtered.length) return null;
    return { pb: Math.max(...filtered.map(l => l.weight)), last: filtered[filtered.length - 1].weight };
};

// ─── Render ───────────────────────────────────────────────────────────────────
const renderAll = () => {
    Object.keys(workouts).forEach(type => {
        const container = document.getElementById(`${type}-cards`);
        if (!container) return;
        container.innerHTML = workouts[type].map((slot, i) => {
            const selIdx    = selectedExercises[`${type}-${i}`] || 0;
            const selOption = slot.options[selIdx] || slot.options[0];
            const stats     = getStats(selOption.name);
            return `
                <div class="card bg-white/60 dark:bg-gray-800/60 p-5 rounded-3xl border border-white/20 shadow-sm">
                    <select class="ex-select w-full bg-transparent font-bold text-xs outline-none mb-2 text-gray-900 dark:text-white" data-type="${type}" data-idx="${i}">
                        ${slot.options.map((o, oi) => `<option value="${o.name}"${oi === selIdx ? ' selected' : ''}>${o.name}</option>`).join('')}
                    </select>
                    <div class="stats-box text-[9px] font-bold text-blue-500 dark:text-blue-400 mb-4 px-1 flex gap-4">
                        ${stats ? `<span>🏆 MAX: ${stats.pb}KG</span><span>⏮ OST: ${stats.last}KG</span>` : ''}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="sets-display text-[9px] font-mono opacity-50 uppercase font-bold">${selOption.sets}</span>
                        <div class="flex items-center gap-2">
                            <input type="number" step="0.5" min="0" max="500" class="weight-input w-16 p-1 bg-slate-100 dark:bg-gray-700 rounded-lg text-center font-bold text-xs text-gray-900 dark:text-white" placeholder="0">
                            <span class="text-[9px] font-bold uppercase opacity-50">kg</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    });
    updateHistoryUI();
};

// ─── System switcher ──────────────────────────────────────────────────────────
const updateSystemUI = () => {
    const pplBtns  = document.querySelectorAll('.ppl-btn');
    const fbwBtns  = document.querySelectorAll('.fbw-btn');
    const pplSelect = document.getElementById('select-ppl');
    const fbwSelect = document.getElementById('select-fbw');

    if (currentSystem === 'PPL') {
        pplBtns.forEach(b  => b.classList.remove('hidden'));
        fbwBtns.forEach(b  => b.classList.add('hidden'));
        pplSelect.classList.replace('bg-gray-200', 'bg-blue-600');
        pplSelect.classList.add('text-white');
        fbwSelect.classList.replace('bg-blue-600', 'bg-gray-200');
        fbwSelect.classList.remove('text-white');
    } else {
        pplBtns.forEach(b  => b.classList.add('hidden'));
        fbwBtns.forEach(b  => b.classList.remove('hidden'));
        fbwSelect.classList.replace('bg-gray-200', 'bg-blue-600');
        fbwSelect.classList.add('text-white');
        pplSelect.classList.replace('bg-blue-600', 'bg-gray-200');
        pplSelect.classList.remove('text-white');
    }
    updateHistoryUI();
};

document.getElementById('select-ppl').onclick = () => {
    currentSystem = 'PPL';
    localStorage.setItem('trainingSystem', 'PPL');
    updateSystemUI();
    navigate('harmonogram');
};
document.getElementById('select-fbw').onclick = () => {
    currentSystem = 'FBW';
    localStorage.setItem('trainingSystem', 'FBW');
    updateSystemUI();
    navigate('harmonogram');
};

// ─── Exercise select change ───────────────────────────────────────────────────
document.body.addEventListener('change', (e) => {
    if (e.target.classList.contains('ex-select')) {
        const card     = e.target.closest('.card');
        const selected = workouts[e.target.dataset.type][e.target.dataset.idx].options[e.target.selectedIndex];
        card.querySelector('.sets-display').textContent = selected.sets;
        const stats = getStats(selected.name);
        card.querySelector('.stats-box').innerHTML = stats
            ? `<span>🏆 MAX: ${stats.pb}KG</span><span>⏮ OST: ${stats.last}KG</span>`
            : '';
        selectedExercises[`${e.target.dataset.type}-${e.target.dataset.idx}`] = e.target.selectedIndex;
        saveSelectedExercises();
    }
});

// ─── Save buttons ─────────────────────────────────────────────────────────────
document.querySelectorAll('.save-btn').forEach(btn => {
    btn.onclick = () => {
        const category  = btn.dataset.workout.toUpperCase();
        const container = document.getElementById(`${btn.dataset.workout}-cards`);
        const entries   = [];
        const now       = new Date().toISOString().split('T')[0];
        container.querySelectorAll('.card').forEach(card => {
            const weight = parseFloat(card.querySelector('.weight-input').value);
            if (!isNaN(weight) && weight > 0) {
                entries.push({
                    date:     now,
                    system:   currentSystem,
                    category,
                    exercise: card.querySelector('.ex-select').value,
                    sets:     card.querySelector('.sets-display').textContent,
                    weight
                });
                card.querySelector('.weight-input').value = '';
            }
        });
        if (entries.length) saveToCloud([...trainingLogs, ...entries]);
    };
});

// ─── History & chart ──────────────────────────────────────────────────────────
const updateHistoryUI = () => {
    const filteredLogs = trainingLogs.filter(l => (l.system || 'PPL') === currentSystem);

    document.getElementById('csv-output').value = "Data,Kategoria,Cwiczenie,Serie x Powt.,Ciezar\n" + filteredLogs.map(l => {
        const cat = l.category || exerciseMap[normalizeName(l.exercise)] || 'INNE';
        return `${l.date},${cat},${l.exercise},${l.sets || ''},${l.weight}`;
    }).join('\n');

    const accordion = document.getElementById('progress-accordion');
    accordion.innerHTML = '';

    const exerciseSet = [...new Set(filteredLogs.map(l => l.exercise))].sort();
    if (exerciseSet.length === 0) {
        accordion.innerHTML = '<p class="text-center opacity-50 text-[10px] uppercase font-bold">Brak danych dla tego systemu</p>';
        return;
    }

    exerciseSet.forEach(ex => {
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-4 mb-2 bg-white/40 dark:bg-gray-800/40 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-gray-800 dark:text-white hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors';
        btn.textContent = ex;
        btn.onclick = () => showChart(ex);
        accordion.appendChild(btn);
    });
};

const showChart = (name) => {
    document.getElementById('chart-container').classList.remove('hidden');
    const ctx = document.getElementById('progress-chart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    const data = trainingLogs
        .filter(l => normalizeName(l.exercise) === normalizeName(name))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(l => l.date),
            datasets: [{ data: data.map(l => l.weight), borderColor: '#2563eb', tension: 0.4, fill: false }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: false } }
        }
    });
    document.getElementById('chart-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ─── Navigation ───────────────────────────────────────────────────────────────
const navigate = (id) => {
    const currentPane = document.querySelector('.page-pane:not(.hidden)');
    const newPane     = document.getElementById(id);
    if (currentPane === newPane) return;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === id));

    if (currentPane) currentPane.classList.add('hidden');
    if (newPane)     newPane.classList.remove('hidden');

    if (id === 'postepy') updateHistoryUI();
};

document.querySelectorAll('.nav-btn').forEach(b => b.onclick = () => navigate(b.dataset.tab));

// ─── Toast ────────────────────────────────────────────────────────────────────
const showToast = (m) => {
    const t       = document.getElementById('toast');
    t.textContent = m;
    t.style.opacity = '1';
    setTimeout(() => t.style.opacity = '0', 2000);
};

// ─── Clear log ────────────────────────────────────────────────────────────────
const clearBtn = document.getElementById('clear-log');
clearBtn.onclick = async () => {
    if (clearBtn.dataset.confirm !== 'true') {
        clearBtn.textContent     = 'Potwierdź — nieodwracalne!';
        clearBtn.dataset.confirm = 'true';
        setTimeout(() => { clearBtn.textContent = 'Wyczyść historię'; delete clearBtn.dataset.confirm; }, 3000);
        return;
    }
    if (!currentUser) return;
    try {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'data', 'logs'), { entries: [] });
        clearBtn.textContent = 'Wyczyść historię';
        delete clearBtn.dataset.confirm;
    } catch (e) {
        showToast("Błąd — sprawdź połączenie");
        console.error("clear-log:", e);
    }
};

// ─── Copy CSV ─────────────────────────────────────────────────────────────────
document.getElementById('copy-log').onclick = () => {
    const text = document.getElementById('csv-output').value;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => showToast('Skopiowano!')).catch(() => showToast('Błąd kopiowania'));
    } else {
        document.getElementById('csv-output').select();
        document.execCommand('copy');
        showToast('Skopiowano!');
    }
};

// ─── Import CSV ───────────────────────────────────────────────────────────────
document.getElementById('import-pasted-csv').onclick = async () => {
    if (!currentUser) return;
    const text = document.getElementById('csv-output').value.trim();
    if (!text) return;

    const lines             = text.split('\n');
    const newSystemEntries  = [];
    let skipped             = 0;

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 5) {
            const date   = parts[0].trim();
            const weight = parseFloat(parts[4]);
            if (!date.match(/^\d{4}-\d{2}-\d{2}$/) || isNaN(weight) || weight <= 0) {
                skipped++;
                continue;
            }
            newSystemEntries.push({
                date,
                system:   currentSystem,
                category: parts[1].trim(),
                exercise: parts[2].trim().replace(/^"|"$/g, ''),
                sets:     parts[3].trim(),
                weight
            });
        }
    }

    if (newSystemEntries.length === 0 && lines.length > 1) {
        showToast('Błędny format CSV');
        return;
    }

    const otherSystemEntries = trainingLogs.filter(l => (l.system || 'PPL') !== currentSystem);
    const updatedLogs        = [...otherSystemEntries, ...newSystemEntries];

    try {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'data', 'logs'), { entries: updatedLogs });
        showToast(skipped > 0 ? `Zsynchronizowano (pominięto: ${skipped})` : 'Zsynchronizowano z chmurą');
    } catch (e) {
        showToast("Błąd zapisu — sprawdź połączenie");
        console.error("import-csv:", e);
    }
};

// ─── Schedule toggle ──────────────────────────────────────────────────────────
const scheduleToggle = document.getElementById('scheduleToggle');
const applyScheduleToggle = () => {
    document.getElementById('schedule-display').textContent = scheduleToggle.checked
        ? "PUSH, PULL, LEGS, PUSH (itd.)"
        : "Pon: PUSH | Śr: PULL | Pt: LEGS";
    document.querySelector('.dot').style.transform = scheduleToggle.checked
        ? 'translateX(1.25rem)'
        : 'translateX(0)';
};
scheduleToggle.checked  = localStorage.getItem('scheduleToggle') === 'true';
applyScheduleToggle();
scheduleToggle.onchange = () => {
    localStorage.setItem('scheduleToggle', scheduleToggle.checked);
    applyScheduleToggle();
};

// ─── Boot ─────────────────────────────────────────────────────────────────────
renderAll();
