document.addEventListener('DOMContentLoaded', function () {
    
     const workouts = {
        push: [
            { options: [{ name: "Wyciskanie sztangi na ławce płaskiej", sets: "4x6-8" }, { name: "Wyciskanie hantli (płasko)", sets: "4x6-8" }] },
            { options: [{ name: "wyciskanie hantli (skośna)", sets: "3x8-12" }, { name: "Wyciskanie sztangi na ławce skośnej", sets: "3x8-12" }] },
            { options: [{ name: "Pompki na poręczach (z obciążeniem)", sets: "3x8-12" }, { name: "Wyciskanie hantli nad głowę (siedząc)", sets: "3x8-12" }] },
            { options: [{ name: "Wznosy hantli bokiem", sets: "4x10-15" }, { name: "Wznosy linek wyciągu w bok", sets: "4x10-15" }] },
            { options: [{ name: "Rozpiętki z hantlami", sets: "3x6-8"}, { name: "Rozpiętki z linkami wyciągu (brama)", sets: "3x12-15" }, { name: "Rozpiętki na maszynie 'Butterfly'", sets: "3x12-15" }] }, 
            { options: [{ name: "Prostowanie ramion (linka wyciągu) z dropsetem", sets: "3x10-15" }, { name: "Wyciskanie francuskie", sets: "3x10-12" }] }
        ],
        pull: [
            { options: [{ name: "Podciąganie na drążku (nachwyt)", sets: "4xMAX" }, { name: "Ściąganie drążka wyciągu", sets: "4x8-12" }] },
            { options: [{ name: "Wiosłowanie sztangą (opad tułowia)", sets: "4x6-8" }, { name: "Wiosłowanie hantlem", sets: "4x6-8" }] },
            { options: [{ name: "Przyciąganie uchwytu V (siedząc)", sets: "4x6-8" }, { name: "Wiosłowanie na maszynie siedząc", sets: "3x10-12" }] },
            { options: [{ name: "Ściąganie drążka (proste ramiona)", sets: "3x12-15" }, { name: "Face pulls (linka)", sets: "3x15-20" }] },
            { options: [{ name: "Uginanie ramion ze sztangą", sets: "4x8-10" }, { name: "Uginanie z hantlami (supinacja)", sets: "4x8-10" }] },
            { options: [{ name: "Uginanie ramion z hantlami na ławce skośnej", sets: "3x10-15" }, { name: "Uginanie ramion na modlitewniku", sets: "3x10-15" }] }
        ],
        legs: [
            { options: [{ name: "Przysiady ze sztangą na plecach", sets: "4x6-8" }, { name: "Wypychanie ciężaru na suwnicy", sets: "4x8-10" }] },
            { options: [{ name: "Martwy ciąg na prostych nogach (RDL)", sets: "3x8-12" }, { name: "Uginanie nóg na maszynie leżąc", sets: "3x10-12" }] },
            { options: [{ name: "Przysiady bułgarskie", sets: "3x8-12 (na nogę)" }, { name: "Wykroki z hantlami", sets: "3x10-12 (na nogę)" }] },
            { options: [{ name: "Prostowanie nóg na maszynie siedząc", sets: "3x12-15" }, { name: "Przysiad Goblet", sets: "3x12-15" }] },
            { options: [{ name: "Hip Thrust ze sztangą", sets: "4x8-12" }, { name: "'Żuraw' (Glute Ham Raise)", sets: "3xMAX" }] },
            { options: [{ name: "Wspięcia na palce (stojąc)", sets: "4x12-20" }, { name: "Wspięcia na palce na suwnicy", sets: "4x15-25" }] }
        ],
        brzuch: [
            { options: [{ name: "'Allahy' (linka wyciągu)", sets: "4x10-15" }, { name: "Spięcia brzucha na maszynie", sets: "4x10-15" }] },
            { options: [{ name: "Unoszenie nóg w zwisie na drążku", sets: "4xMAX" }, { name: "Unoszenie kolan do klatki piersiowej w zwisie", sets: "4xMAX" }] },
            { options: [{ name: "Plank (z obciążeniem na plecach)", sets: "4x60-90s" }, { name: "Plank boczny", sets: "3x45-60s (na str.)" }] },
            { options: [{ name: "'Wood choppers' (rąbanie drewna) z użyciem wyciągu", sets: "3x12-15 (na str.)" }, { name: "'Russian Twist' (skręty tułowia z obciążeniem)", sets: "3x15 (na stronę)" }] }
        ]
    };

    const LOG_STORAGE_KEY = 'interactiveTrainingLog';
    let progressChart = null; 

    // THEME TOGGLE LOGIC
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Show correct icon on page load
    if (document.documentElement.classList.contains('dark')) {
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', function() {
        // toggle icons
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('theme')) {
            if (localStorage.getItem('theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }
        // Update chart if it's visible
        const openAccordion = document.querySelector('#progress-accordion details[open]');
        if (openAccordion) {
            const activeExerciseButton = openAccordion.querySelector('.exercise-btn.active');
            if (activeExerciseButton) {
                renderProgressChart(activeExerciseButton.dataset.exercise);
            }
        }
    });

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast-message');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-600'
        };
        toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 text-white text-sm font-bold py-2 px-4 rounded-md opacity-0 z-50';
        toast.textContent = message;
        toast.classList.add(colors[type]);
        toast.classList.remove('opacity-0');
        toast.classList.add('toast-animation');
        
        setTimeout(() => {
            toast.classList.add('opacity-0');
            toast.classList.remove('toast-animation');
        }, 2800);
    }

    function saveLogToStorage() {
        localStorage.setItem(LOG_STORAGE_KEY, document.getElementById('csv-output').value);
    }

    function loadLogFromStorage() {
        const savedLog = localStorage.getItem(LOG_STORAGE_KEY);
        if (savedLog) {
            document.getElementById('csv-output').value = savedLog;
        }
    }

    function getPersonalBest(exerciseName) {
        const data = parseCsvData();
        const exerciseData = data.filter(entry => entry.exercise === exerciseName && entry.weight > 0);
        if (exerciseData.length === 0) {
            return null;
        }
        const maxWeight = Math.max(...exerciseData.map(entry => entry.weight));
        return maxWeight;
    }

    function updateAllPersonalBests(workoutType) {
        const container = document.getElementById(`${workoutType}-cards`);
        if (!container) return;
        const cards = container.querySelectorAll('.exercise-card');

        cards.forEach(card => {
            const selectEl = card.querySelector('.exercise-select');
            const exerciseName = selectEl.value;
            const personalBest = getPersonalBest(exerciseName);
            const pbElement = card.querySelector('.personal-best');

            if (pbElement) {
                 pbElement.innerHTML = personalBest > 0 ? `🏆 Rekord: ${personalBest} kg` : '';
            }
        });
    }

    function populateWorkoutCards() {
        for (const workoutType in workouts) {
            const container = document.getElementById(`${workoutType}-cards`);
            if (container) {
                container.innerHTML = ''; 
                workouts[workoutType].forEach((exerciseSlot, index) => {
                    const card = document.createElement('div');
                    card.className = 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-sm exercise-card';
                    card.dataset.index = index;
                    
                    const optionsHtml = exerciseSlot.options
                        .map(opt => `<option value="${opt.name}">${opt.name}</option>`).join('');
                    const initialSets = exerciseSlot.options[0].sets;
                    const defaultExerciseName = exerciseSlot.options[0].name;
                    const personalBest = getPersonalBest(defaultExerciseName);
                    const pbHtml = personalBest > 0 ? `🏆 Rekord: ${personalBest} kg` : '';

                    card.innerHTML = `
                        <div class="mb-2">
                            <select class="w-full p-3 border border-gray-200/80 dark:border-gray-600/80 rounded-lg text-base exercise-select bg-gray-50/50 dark:bg-gray-700/50">
                                ${optionsHtml}
                            </select>
                        </div>
                        <div class="personal-best text-xs text-center h-4 mb-2 text-blue-500 dark:text-blue-400 font-semibold">${pbHtml}</div>
                        <div class="flex items-center justify-between">
                            <span class="font-mono text-gray-600 dark:text-gray-400 sets-cell text-sm">${initialSets}</span>
                            <div class="flex items-center gap-2">
                                <input type="number" step="0.5" min="0" class="w-24 p-3 border border-gray-200/80 dark:border-gray-600/80 rounded-lg text-center text-base bg-gray-50/50 dark:bg-gray-700/50 weight-input" placeholder="0">
                                <span class="text-gray-500 dark:text-gray-400">kg</span>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            }
        }
    }

    function saveWorkout(workoutType) {
        const container = document.getElementById(`${workoutType}-cards`);
        const cards = container.querySelectorAll('.exercise-card');
        const csvOutput = document.getElementById('csv-output');
        const today = new Date().toISOString().slice(0, 10);
        let workoutData = "";

        cards.forEach(card => {
            const exerciseSelect = card.querySelector('.exercise-select');
            const weightInput = card.querySelector('.weight-input');
            const weight = parseFloat(weightInput.value);

            if (weight > 0) {
                const exerciseName = exerciseSelect.value;
                const setsInfo = card.querySelector('.sets-cell').textContent;
                workoutData += `${today},${workoutType.toUpperCase()},"${exerciseName}",${setsInfo},${weight}\n`;
            }
        });

        if(workoutData) {
            if (csvOutput.value.trim() === "") {
                csvOutput.value = "Data,Trening,Ćwiczenie,Serie x Powt.,Ciężar (kg)\n";
            }
            csvOutput.value += workoutData;
            saveLogToStorage();
            showToast(`Trening ${workoutType.toUpperCase()} zapisany!`, 'info');
            updateAllPersonalBests(workoutType);
        } else {
            showToast('Wprowadź ciężar, aby zapisać.', 'error');
        }
    }

    function parseCsvData() {
        const log = localStorage.getItem(LOG_STORAGE_KEY);
        if (!log || log.trim() === '' || log.split('\n').length < 2) return [];
        const rows = log.trim().split('\n');
        rows.shift(); 
        return rows.map(row => {
            const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
             if (values.length < 5) return null;
            return {
                date: values[0],
                workout: values[1],
                exercise: values[2] ? values[2].replace(/"/g, '') : '',
                sets: values[3],
                weight: parseFloat(values[4])
            };
        }).filter(Boolean);
    }

     function updateProgressTab() {
        const data = parseCsvData();
        const noDataMessage = document.getElementById('no-data-message');
        const accordionContainer = document.getElementById('progress-accordion');
        accordionContainer.innerHTML = '';
        
        if (data.length === 0) {
            noDataMessage.classList.remove('hidden');
            return;
        }

        noDataMessage.classList.add('hidden');

        const exercises = {
            PUSH: { list: [...new Set(data.filter(d => d.workout === 'PUSH').map(item => item.exercise))].sort(), emoji: '💪' },
            PULL: { list: [...new Set(data.filter(d => d.workout === 'PULL').map(item => item.exercise))].sort(), emoji: '🏋️' },
            LEGS: { list: [...new Set(data.filter(d => d.workout === 'LEGS').map(item => item.exercise))].sort(), emoji: '🦵' },
            BRZUCH: { list: [...new Set(data.filter(d => d.workout === 'BRZUCH').map(item => item.exercise))].sort(), emoji: '🔥' }
        };

        Object.keys(exercises).forEach(type => {
            const { list, emoji } = exercises[type];
            if (list.length > 0) {
                const details = document.createElement('details');
                details.className = 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-sm';
                details.innerHTML = `
                    <summary class="font-semibold text-lg cursor-pointer text-gray-800 dark:text-gray-200 p-4">
                        ${emoji} Postępy ${type}
                    </summary>
                    <div class="px-4 pb-4 border-t border-gray-200/80 dark:border-gray-700/80">
                        <ul class="pt-2 space-y-1">
                            ${list.map(ex => `<li><button class="exercise-btn w-full text-left p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" data-exercise="${ex}">${ex}</button></li>`).join('')}
                        </ul>
                    </div>
                `;
                accordionContainer.appendChild(details);
            }
        });
        
        document.querySelectorAll('#progress-accordion details').forEach(detail => {
            detail.addEventListener('toggle', (event) => {
                if(event.target.open) {
                    document.querySelectorAll('#progress-accordion details').forEach(otherDetail => {
                        if(otherDetail !== event.target) {
                            otherDetail.open = false;
                        }
                    });
                     // Clear active state and hide chart when opening a new accordion
                    const activeBtn = event.target.querySelector('.exercise-btn.active');
                    if (activeBtn) {
                        activeBtn.classList.remove('active', 'bg-blue-100', 'dark:bg-blue-900/50');
                    }
                    renderProgressChart(null);
                }
            });
        });
        
        document.querySelectorAll('.exercise-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                 document.querySelectorAll('.exercise-btn').forEach(btn => btn.classList.remove('active', 'bg-blue-100', 'dark:bg-blue-900/50'));
                 e.target.classList.add('active', 'bg-blue-100', 'dark:bg-blue-900/50');
                 renderProgressChart(e.target.dataset.exercise);
            });
        });
    }
    
    function renderProgressChart(selectedExercise) {
        const chartContainer = document.getElementById('progress-chart-container');
        if (!selectedExercise) {
            chartContainer.classList.add('hidden');
            return;
        }
        
        chartContainer.classList.remove('hidden');
        const isDarkMode = document.documentElement.classList.contains('dark');
        const data = parseCsvData();
        
        const groupedData = data
            .filter(item => item.exercise === selectedExercise)
            .reduce((acc, current) => {
                if (!acc[current.date] || current.weight > acc[current.date]) {
                    acc[current.date] = current.weight;
                }
                return acc;
            }, {});

        const chartData = Object.keys(groupedData)
            .map(date => ({ date: date, weight: groupedData[date] }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = chartData.map(d => d.date);
        const weights = chartData.map(d => d.weight);

        const canvas = document.getElementById('progress-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        if (progressChart) {
            progressChart.destroy();
        }

        progressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Progresja ciężaru (kg)`,
                    data: weights,
                    borderColor: isDarkMode ? '#60a5fa' : '#2563eb',
                    backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: isDarkMode ? '#93c5fd' : '#1d4ed8',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: selectedExercise, 
                        font: { size: 14, family: 'Poppins' },
                        color: isDarkMode ? '#d1d5db' : '#374151'
                    },
                     legend: { display: false }
                },
                scales: {
                    y: { 
                        title: { display: true, text: 'Ciężar (kg)', color: isDarkMode ? '#9ca3af' : '#4b5563' },
                        ticks: { color: isDarkMode ? '#9ca3af' : '#4b5563' },
                        grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    },
                    x: { 
                        title: { display: false },
                        ticks: { color: isDarkMode ? '#9ca3af' : '#4b5563' },
                        grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
                    }
                }
            }
        });
    }
    
    document.querySelectorAll('.save-button-top, .save-button-bottom').forEach(button => {
        button.addEventListener('click', (e) => {
            const workoutType = e.target.dataset.workout;
            if(workoutType) {
                saveWorkout(workoutType);
            }
        });
    });

    document.getElementById('save-brzuch').addEventListener('click', () => saveWorkout('brzuch'));
    document.getElementById('save-brzuch-bottom').addEventListener('click', () => saveWorkout('brzuch'));


    document.getElementById('save-log-changes').addEventListener('click', () => {
        saveLogToStorage();
        showToast('Zmiany w dzienniku zapisane!', 'success');
        updateProgressTab();
        renderProgressChart(''); 
    });

    document.getElementById('copy-log').addEventListener('click', () => {
        const csvOutput = document.getElementById('csv-output');
         if(!csvOutput.value) return;
        navigator.clipboard.writeText(csvOutput.value).then(() => {
            showToast('Skopiowano do schowka!', 'success');
        });
    });
    
    const clearLogBtn = document.getElementById('clear-log');
    clearLogBtn.addEventListener('click', () => {
        if (clearLogBtn.dataset.confirm === 'true') {
            document.getElementById('csv-output').value = '';
            localStorage.removeItem(LOG_STORAGE_KEY);
            showToast('Dziennik wyczyszczony!', 'error');
            updateProgressTab(); 
            if (progressChart) progressChart.destroy();
            document.getElementById('progress-chart-container').classList.add('hidden');
            
            clearLogBtn.textContent = 'Wyczyść';
            clearLogBtn.dataset.confirm = 'false';
            clearLogBtn.classList.remove('bg-yellow-500');
        } else {
            clearLogBtn.textContent = 'Potwierdź';
            clearLogBtn.dataset.confirm = 'true';
            clearLogBtn.classList.add('bg-yellow-500');
            setTimeout(() => {
                if (clearLogBtn.dataset.confirm === 'true') {
                     clearLogBtn.textContent = 'Wyczyść';
                     clearLogBtn.dataset.confirm = 'false';
                     clearLogBtn.classList.remove('bg-yellow-500');
                }
            }, 3000);
        }
    });

    const mainContent = document.getElementById('main-content');
    const navBtns = document.querySelectorAll('.nav-btn');
    const panes = document.querySelectorAll('.page-pane');
    const tabOrder = ['harmonogram', 'push', 'pull', 'legs', 'brzuch', 'postepy', 'dziennik'];
    let isAnimating = false;
    let touchStartX = 0, touchStartY = 0;
    let touchEndX = 0, touchEndY = 0;

    function showPage(newPageId, fromSwipe = false) {
        if (isAnimating) return;

        const currentPane = document.querySelector('.page-pane:not(.hidden)');
        if (currentPane && currentPane.id === newPageId) return;

        isAnimating = true;

        const newPane = document.getElementById(newPageId);
        const currentIndex = currentPane ? tabOrder.indexOf(currentPane.id) : -1;
        const newIndex = tabOrder.indexOf(newPageId);

        // Update nav button active state
        navBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.nav-btn[data-tab="${newPageId}"]`).classList.add('active');

        if (currentPane && fromSwipe) {
            const direction = newIndex > currentIndex ? 'left' : 'right';

            if (direction === 'left') {
                currentPane.classList.add('animate-slide-out-to-left');
                newPane.classList.add('animate-slide-in-from-right');
            } else {
                currentPane.classList.add('animate-slide-out-to-right');
                newPane.classList.add('animate-slide-in-from-left');
            }
        }
        
        newPane.classList.remove('hidden');

        setTimeout(() => {
            if (currentPane) {
                if(!fromSwipe){
                    panes.forEach(p => p.classList.add('hidden'));
                    newPane.classList.remove('hidden');
                } else {
                    currentPane.classList.add('hidden');
                }
                currentPane.className = 'page-pane hidden'; 
            }
            newPane.className = 'page-pane'; 
            isAnimating = false;
        }, 300);


        if (newPageId === 'postepy') {
            updateProgressTab();
            renderProgressChart('');
        }
        window.scrollTo(0, 0);
    }
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            showPage(target, false);
        });
    });

    mainContent.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mainContent.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only swipe if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) { // Increased threshold
            const currentPane = document.querySelector('.page-pane:not(.hidden)');
            const currentIndex = tabOrder.indexOf(currentPane.id);

            if (deltaX < 0) { // Swipe Left
                const nextIndex = (currentIndex + 1) % tabOrder.length;
                showPage(tabOrder[nextIndex], true);
            } else { // Swipe Right
                const prevIndex = (currentIndex - 1 + tabOrder.length) % tabOrder.length;
                showPage(tabOrder[prevIndex], true);
            }
        }
    }
    
    const scheduleToggle = document.getElementById('scheduleToggle');
    scheduleToggle.addEventListener('change', () => {
        const scheduleDisplay = document.getElementById('schedule-display');
        const toggleDot = scheduleToggle.parentElement.querySelector('.dot');
        const toggleBlock = scheduleToggle.parentElement.querySelector('.block');
        if (scheduleToggle.checked) {
            scheduleDisplay.innerHTML = `<h4 class="font-semibold mb-1">Przykładowy plan (4 dni):</h4><p>Tydzień 1: PUSH, PULL, LEGS, PUSH<br>Tydzień 2: PULL, LEGS, PUSH, PULL</p>`;
            toggleDot.style.transform = 'translateX(100%)';
            toggleBlock.classList.replace('bg-gray-200', 'bg-blue-500');
            toggleBlock.classList.replace('dark:bg-gray-600', 'dark:bg-blue-600');
        } else {
            scheduleDisplay.innerHTML = `<h4 class="font-semibold mb-1">Przykładowy plan (3 dni):</h4><p>Poniedziałek - PUSH, Środa - PULL, Piątek - LEGS</p>`;
            toggleDot.style.transform = 'translateX(0)';
            toggleBlock.classList.replace('bg-blue-500', 'bg-gray-200');
            toggleBlock.classList.replace('dark:bg-blue-600', 'dark:bg-gray-600');
        }
    });
    
    function onCardSelectChange(e) {
        if (e.target.classList.contains('exercise-select')) {
            const selectEl = e.target;
            const card = selectEl.closest('.exercise-card');
            const workoutType = card.parentElement.id.replace('-cards', '');
            const rowIndex = parseInt(card.dataset.index, 10);
            const selectedIndex = selectEl.selectedIndex;

            const newSets = workouts[workoutType][rowIndex].options[selectedIndex].sets;
            card.querySelector('.sets-cell').textContent = newSets;

            const newExerciseName = selectEl.value;
            const personalBest = getPersonalBest(newExerciseName);
            const pbElement = card.querySelector('.personal-best');
            if (pbElement) {
                pbElement.innerHTML = personalBest > 0 ? `🏆 Rekord: ${personalBest} kg` : '';
            }
        }
    }
    
    document.querySelectorAll('.workout-cards-container').forEach(container => {
        container.addEventListener('change', onCardSelectChange);
    });

    window.addEventListener('scroll', () => {
        const scrollOffset = window.scrollY / -15;
        document.body.style.setProperty('--scroll-y', `${scrollOffset}px`);
    });

    populateWorkoutCards();
    loadLogFromStorage();
    
    // Initial page load without animation
    const initialPane = document.getElementById('harmonogram');
    panes.forEach(p => p.classList.add('hidden'));
    initialPane.classList.remove('hidden');
    document.querySelector('.nav-btn[data-tab="harmonogram"]').classList.add('active');
});

